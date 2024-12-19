import { ErrorMessages } from '@/_common/constants/error-messages.constant';
import { SuccessMessages } from '@/_common/constants/success-messages.constant';
import { PaginationDto } from '@/_common/dtos/response.dto';
import { paginateAndSort } from '@/_common/helpers/filter.helper';
import { responder } from '@/_common/helpers/responder.helper';
import { generateRandomStrings } from '@/_common/helpers/string.helper';
import { ChangePasswordDto } from '@/auth/dtos/change-password.dto';
import { SetPasswordDto } from '@/auth/dtos/set-password.dto';
import { UpdatePasswordDto } from '@/auth/dtos/update-password.dto';
import { TokenService } from '@/auth/services/token.service';
import { MailService } from '@/mail/mail.service';
import { OtpTypeEnum, OtpChannelEnum } from '@/otp/otp.enum';
import { OtpService } from '@/otp/otp.service';
import { CreateUserDto } from '@/user/dtos/create-user.dto';
import { UpdateUserDto } from '@/user/dtos/update-user.dto';
import { IUser, User, UserDocument } from '@/user/schemas/user.schema';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { compare } from 'bcryptjs';
import { ClientSession, Connection, Model } from 'mongoose';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  constructor(
    @InjectModel(User.name) public model: Model<IUser>,
    @InjectConnection() private readonly connection: Connection,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
    private readonly tokenService: TokenService,
  ) {}

  async findByEmail(
    email: string,
    session: ClientSession = null,
  ): Promise<IUser> {
    return this.model.findOne<IUser>(
      {
        email: new RegExp(email, 'i'),
        password: {
          $exists: true,
        },
      },
      null,
      {
        lean: true,
        session,
      },
    );
  }

  async findByMobileNumber(
    mobileNumber: string,
    session: ClientSession = null,
  ) {
    return this.model.findOne(
      {
        mobileNumber,
        password: {
          $exists: true,
        },
      },
      null,
      { lean: true, session },
    );
  }

  async findByReferralCode(
    referralCode: string,
    session: ClientSession = null,
  ) {
    return this.model.findOne(
      {
        referralCode: new RegExp(referralCode, 'i'),
        password: {
          $exists: true,
        },
      },
      null,
      { lean: true, session },
    );
  }

  async validateUser(email: string, password: string) {
    try {
      const user = await this.model.findOne(
        {
          email: new RegExp(email, 'i'),
          password: {
            $exists: true,
          },
        },
        ['+password', '+deleted'],
        {
          populate: {
            path: 'roles',
            select: 'operations',
          },
        },
      );

      if (!user) {
        throw new Error();
      }

      if (user?.blocked) {
        throw new Error();
      }

      const passwordMatch = await compare(password, user.password);

      if (!passwordMatch) {
        throw new Error();
      }

      return user;
    } catch (error) {
      throw new BadRequestException(ErrorMessages.INVALID_CREDENTIALS);
    }
  }

  async createUser(
    body: CreateUserDto & {
      emailVerified?: boolean;
      photo?: string;
    },
    userAgent: string,
    session: ClientSession = null,
  ): Promise<IUser> {
    const payload = await this.validateCreateUser(body, session);

    const referrer = payload?.referrer;
    let user = payload?.user;

    const referredBy = referrer?.id || user?.referredBy;

    if (!user) {
      const referralCode = await this.generateReferralCode(session);

      const payload = {
        ...body,
        referralCode,
        ...(referredBy && { referredBy }),
      };

      const users = await this.model.create([payload], { session });
      user = users[0];
    } else {
      Object.assign(user, {
        ...body,
        ...(referredBy && { referredBy }),
      });

      user = await user.save({ session });
    }

    this.logger.log(`User created: ${user.email}`);

    if (!user?.emailVerified) {
      await this.otpService.sendOtp(
        {
          value: user.email,
          type: OtpTypeEnum.REGISTRATION,
          channel: OtpChannelEnum.EMAIL,
        },
        userAgent,
        session,
      );
    }

    return user.toObject();
  }

  async setPassword(
    body: SetPasswordDto,
    session: ClientSession = null,
  ): Promise<IUser> {
    const user = await this.model.findOne(
      {
        email: body.email,
        password: {
          $exists: false,
        },
      },
      null,
      { session },
    );

    if (!user) {
      throw new BadRequestException('Please start the registration process');
    }

    // before you call set password, you must have verified email via otp
    if (!user.emailVerified) {
      await this.otpService.validateIfOtpIsVerified(
        {
          value: user.email,
          type: OtpTypeEnum.REGISTRATION,
          channel: OtpChannelEnum.EMAIL,
        },
        session,
      );
      user.emailVerified = true;
    }

    user.password = body.password;

    await user.save({ session });

    const userObject = user.toObject();

    await this.onSetPasswordSuccess(user, session);

    this.logger.log(`Password set for: ${userObject.email}`);

    return userObject;
  }

  private async onSetPasswordSuccess(
    user: IUser,
    session: ClientSession = null,
  ) {
    try {
      const promises = [];

      promises.push(
        this.mailService.sendWelcomeEmail(user.email, user.firstName),

        this.otpService.deleteUsedOtp(
          {
            value: user.email,
            type: OtpTypeEnum.REGISTRATION,
            channel: OtpChannelEnum.EMAIL,
          },
          session,
        ),
      );

      await Promise.all(promises);
    } catch (error) {
      this.logger.error(error);
    }
  }

  async getById(id: string): Promise<IUser> {
    const user = (await this.model.findById(id, ['+deleted'], {
      populate: {
        path: 'roles',
        select: 'operations',
      },
    })) as UserDocument;

    if (!user) {
      throw new NotFoundException(ErrorMessages.USER_NOT_FOUND);
    }

    const userObject = user.toObject<IUser>();

    if (userObject?.blocked) {
      throw new UnauthorizedException(
        'Your account is blocked, please contact administrator',
      );
    }

    this.stripSensitiveProps(userObject);

    return userObject;
  }

  async updateProfile(
    body: UpdateUserDto,
    user: IUser,
    session: ClientSession = null,
  ): Promise<IUser> {
    const existingUser = await this.validateUpdateProfile(body, user, session);

    if (existingUser.onboarded) {
      delete body.onboarded;
    }

    existingUser.set(body);

    const updatedUser = await existingUser.save({
      session,
    });

    Promise.all([
      this.otpService.deleteUsedOtp(
        {
          value: updatedUser.email,
          type: OtpTypeEnum.UPDATE_PROFILE,
          channel: OtpChannelEnum.EMAIL,
        },
        session,
      ),

      this.otpService.deleteUsedOtp(
        {
          value: updatedUser.mobileNumber,
          type: OtpTypeEnum.UPDATE_PROFILE,
          channel: OtpChannelEnum.SMS,
        },
        session,
      ),
    ]);

    return updatedUser.toObject<IUser>();
  }

  async changePassword(body: ChangePasswordDto) {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      await this.otpService.validateIfOtpIsVerified(
        {
          value: body.email,
          type: OtpTypeEnum.CHANGE_PASSWORD,
          channel: OtpChannelEnum.EMAIL,
        },
        session,
      );

      const existingUser = (await this.model.findOne(
        {
          email: new RegExp(body.email, 'i'),
          password: {
            $exists: true,
          },
        },
        null,
        { lean: false, session },
      )) as UserDocument;

      if (!existingUser) {
        throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
      }

      Object.assign(existingUser, { password: body.password });

      const updatedUser = await existingUser.save({ session });

      const userObject = updatedUser.toObject<IUser>();

      this.stripSensitiveProps(userObject);

      this.otpService.deleteUsedOtp(
        {
          value: userObject.email,
          type: OtpTypeEnum.CHANGE_PASSWORD,
          channel: OtpChannelEnum.EMAIL,
        },
        session,
      );

      this.tokenService.deleteRefreshTokenByUserId(userObject.id, session);

      await session.commitTransaction();

      return responder.success(SuccessMessages.PASSWORD_CHANGED);
    } catch (error) {
      await session.abortTransaction();
      throw new BadRequestException((error as Error)?.message);
    } finally {
      await session.endSession();
    }
  }

  async updatePassword(body: UpdatePasswordDto, user: IUser): Promise<IUser> {
    try {
      await this.otpService.validateIfOtpIsVerified({
        value: user.email,
        type: OtpTypeEnum.UPDATE_PASSWORD,
        channel: OtpChannelEnum.EMAIL,
      });

      const existingUser = await this.validateUser(
        user.email,
        body.oldPassword,
      );

      existingUser.password = body.password;

      const updatedUser = await existingUser.save();

      const userObject = updatedUser.toObject<IUser>();

      this.stripSensitiveProps(userObject);

      this.otpService.deleteUsedOtp({
        value: userObject.email,
        type: OtpTypeEnum.UPDATE_PASSWORD,
        channel: OtpChannelEnum.EMAIL,
      });

      return userObject;
    } catch (error) {
      throw new BadRequestException(
        (error as Error)?.message || 'Failed to update password',
      );
    }
  }

  public stripSensitiveProps(userObject: IUser) {
    delete userObject.password;

    return userObject;
  }

  async assignRoles(id: string, roles: Array<string>, user: IUser) {
    const existingUser = (await this.model.findById(id, null, {
      lean: false,
    })) as UserDocument | null;

    if (existingUser?.id === user.id) {
      throw new BadRequestException('You cannot update yourself');
    }

    if (!existingUser) {
      throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
    }

    const existingRoles = existingUser?.roles || [];

    const newRoles = roles.filter((item) => !existingRoles.includes(item));

    existingUser.roles = [...existingRoles, ...newRoles];
    existingUser.updatedBy = user.id;

    const updatedUser = await existingUser.save();

    return updatedUser.toObject<IUser>();
  }

  async removeRoles(id: string, roles: string[], user: IUser) {
    const existingUser = (await this.model.findById(id, null, {
      lean: false,
    })) as UserDocument | null;

    if (existingUser?.id === user.id) {
      throw new BadRequestException('You cannot update yourself');
    }

    if (!existingUser) {
      throw new BadRequestException(ErrorMessages.USER_NOT_FOUND);
    }

    const existingRoles = existingUser?.roles || [];

    const newRoles = existingRoles.filter(
      (item) => !roles.includes(item.toString()),
    );

    existingUser.roles = [...newRoles];
    existingUser.updatedBy = user.id;

    const updatedUser = await existingUser.save();

    return updatedUser.toObject<IUser>();
  }

  async paginate(query: PaginationDto, user: IUser) {
    // add filter, if super admin, can fetch admin and user, if admin can only fetch user, cannot fetch self
    return paginateAndSort({
      model: this.model,
      filters: {
        id: { $ne: user.id },
        blocked: { $ne: true },
        $or: [
          { fullName: new RegExp(query.search, 'i') },
          { email: new RegExp(query.search, 'i') },
          { mobileNumber: new RegExp(query.search, 'i') },
        ],
      },
      page: query?.page,
      limit: query?.limit,
      projection: '-createdAt -updatedAt',
      options: { lean: true },
    });
  }

  async blockUser(id: string, user: IUser) {
    const existingUser = (await this.model.findOne({
      _id: { $ne: user.id, $eq: id },
    })) as UserDocument;

    existingUser.blocked = true;
    existingUser.updatedBy = user.id;

    await existingUser.save();

    return { blocked: true };
  }

  async unblockUser(id: string, user: IUser) {
    const existingUser = (await this.model.findOne({
      $and: [
        {
          _id: { $ne: user.id, $eq: id },
        },
        {
          $or: [{ deleted: { $ne: true } }, { blocked: { $ne: false } }],
        },
      ],
    })) as UserDocument;

    existingUser.blocked = false;
    existingUser.updatedBy = user.id;

    await existingUser.save();

    return { blocked: false };
  }

  async deleteProfile(user: IUser) {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      await this.otpService.validateIfOtpIsVerified(
        {
          value: user.email,
          type: OtpTypeEnum.DELETE_ACCOUNT,
          channel: OtpChannelEnum.EMAIL,
        },
        session,
      );

      const existingUser = await this.model.findOne(
        {
          _id: user.id,
          $or: [{ deleted: { $ne: true } }, { blocked: { $ne: true } }],
        },
        ['+deleted'],
        {
          session,
        },
      );

      if (!existingUser) {
        throw new UnauthorizedException(ErrorMessages.USER_NOT_FOUND);
      }

      await this.otpService.deleteAllForUser(user, session);

      await this.tokenService.deleteRefreshTokenByUserId(user.id, session);

      await existingUser.deleteOne().session(session);

      await session.commitTransaction();

      return true;
    } catch (error) {
      await session.abortTransaction();

      throw new BadRequestException((error as Error)?.message);
    } finally {
      await session.endSession();
    }
  }

  private async validateCreateUser(
    body: CreateUserDto,
    session: ClientSession = null,
  ) {
    const user = await this.model.findOne(
      {
        $or: [
          { email: new RegExp(body.email, 'i') },
          { mobileNumber: body.mobileNumber },
        ],
        password: { $eq: null },
      },
      null,
      { session },
    );

    let referrer = null;

    await this.validateExistingUserByEmail(user, body, session);

    await this.validateExistingUserByMobile(user, body, session);

    if (body?.referredBy && body?.referredBy !== user?.referralCode) {
      referrer = await this.findByReferralCode(body.referredBy, session);

      if (!referrer) {
        throw new BadRequestException('Referral not found');
      }
    }

    return { user, referrer };
  }

  private async validateExistingUserByMobile(
    user: UserDocument,
    body: CreateUserDto,
    session: ClientSession = null,
  ) {
    if (user?.mobileNumber !== body.mobileNumber) {
      const user = await this.model.findOne(
        {
          mobileNumber: body.mobileNumber,
          password: { $ne: null },
        },
        null,
        { session },
      );

      if (user) {
        throw new BadRequestException(
          ErrorMessages.userAlreadyExist(body.mobileNumber),
        );
      }
    }
  }

  private async validateExistingUserByEmail(
    user: UserDocument,
    body: CreateUserDto,
    session: ClientSession = null,
  ) {
    if (user?.email !== body.email) {
      const user = await this.model.findOne(
        {
          email: new RegExp(body.email, 'i'),
          password: { $ne: null },
        },
        null,
        { session },
      );

      if (user) {
        throw new BadRequestException(
          ErrorMessages.userAlreadyExist(body.email),
        );
      }
    }
  }

  private async validateUpdateProfile(
    body: UpdateUserDto,
    user: IUser,
    session: ClientSession = null,
  ) {
    const existingUser = await this.model.findById(user.id, null, {
      lean: false,
      session,
    });

    if (!!body?.email && body.email !== existingUser.email) {
      await this.otpService.validateIfOtpIsVerified(
        {
          type: OtpTypeEnum.UPDATE_PROFILE,
          channel: OtpChannelEnum.EMAIL,
          value: body.email,
        },
        session,
      );

      const userExist = await this.findByEmail(body.email, session);

      if (userExist) {
        throw new BadRequestException(
          ErrorMessages.userAlreadyExist(body.email),
        );
      }
    }

    if (
      !!body?.mobileNumber &&
      body.mobileNumber !== existingUser.mobileNumber
    ) {
      await this.otpService.validateIfOtpIsVerified(
        {
          type: OtpTypeEnum.UPDATE_PROFILE,
          channel: OtpChannelEnum.SMS,
          value: body.mobileNumber,
        },
        session,
      );

      const userExist = await this.findByMobileNumber(
        body.mobileNumber,
        session,
      );

      if (userExist) {
        throw new BadRequestException(
          ErrorMessages.userAlreadyExist(body.mobileNumber),
        );
      }

      existingUser.mobileVerified = true;
    }

    return existingUser as UserDocument;
  }

  private async generateReferralCode(session: ClientSession = null) {
    const referralCode = generateRandomStrings(8);

    const user = await this.findByReferralCode(referralCode, session);

    if (!user) {
      return referralCode;
    }

    return this.generateReferralCode();
  }
}
