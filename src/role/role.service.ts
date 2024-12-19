import { CreateRoleDto } from '@/role/dtos/create-role.dto';
import { UpdateRoleDto } from '@/role/dtos/update-role.dto';
import { IRole, Role, RoleDocument } from '@/role/schemas/role.schema';
import { IUser } from '@/user/schemas/user.schema';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ApiRouteDto } from '@/role/dtos/api-route.dto';
import { AssignRoleDto } from '@/role/dtos/assign-role.dto';
import { ApiRoute } from '@/role/schemas/api-route.schema';
import { UserService } from '@/user/user.service';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { ErrorMessages } from '@/_common/constants/error-messages.constant';
import { paginateAndSort } from '@/_common/helpers/filter.helper';
import { PaginationDto } from '@/_common/dtos/response.dto';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);
  constructor(
    @InjectModel(Role.name)
    private readonly model: Model<Role>,
    @InjectModel(ApiRoute.name)
    private readonly apiRouteModel: Model<ApiRoute>,
    private readonly userService: UserService,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async setApiRoutes(availableRoutes: Array<ApiRouteDto>) {
    const session = await this.connection.startSession();

    try {
      session.startTransaction();

      await this.apiRouteModel.deleteMany({}, { session });

      const inserted = await this.apiRouteModel.insertMany(availableRoutes, {
        session,
      });

      const apiRoutes = inserted.map(this.mapApiRoutes());

      await this.syncApiRoutes(apiRoutes, session);

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();

      this.logger.error(error);
    } finally {
      await session.endSession();
    }
  }

  async apiRoutes() {
    const routes = await this.apiRouteModel.find().lean().exec();

    return routes.map(this.mapApiRoutes());
  }

  async syncApiRoutes(apiRoutes: ApiRouteDto[], session: ClientSession = null) {
    const roles = (await this.model.find({}, null, {
      lean: false,
      session,
    })) as Array<RoleDocument>;

    if (!apiRoutes.length || !roles.length) {
      this.logger.log('No API routes or roles found');
      return [];
    }

    const rolesPromise$: Array<Promise<RoleDocument>> = [];

    for (const role of roles) {
      const isValidRoutes = role.apiRoutes.every((apiRoute) => {
        return apiRoutes.some(
          (route) =>
            route.method === apiRoute.method && route.path === apiRoute.path,
        );
      });

      if (isValidRoutes) {
        continue;
      }

      role.apiRoutes = role.apiRoutes.filter((apiRoute) => {
        return apiRoutes.some(
          (route) =>
            route.method === apiRoute.method && route.path === apiRoute.path,
        );
      });

      rolesPromise$.push(
        role.save({
          session,
        }),
      );
    }

    if (!rolesPromise$.length) {
      this.logger.log('All roles are in sync');
      return [];
    }

    const saved = await Promise.all(rolesPromise$);

    this.logger.log('These roles were updated:', saved);
  }

  async createRole(body: CreateRoleDto, user: IUser) {
    await this.validateRoutes(body.apiRoutes);

    const role = await this.findRoleByName(body.name);

    if (role) {
      throw new BadRequestException(
        ErrorMessages.alreadyExist(Role.name, 'name', body.name),
      );
    }

    return this.model.create({
      ...body,
      createdBy: user.id,
    });
  }

  async update(id: string, body: UpdateRoleDto, user: IUser) {
    const existingRole = await this.validateUpdateRole(id, body);

    Object.assign(existingRole, {
      ...body,
      updatedBy: user?.id || existingRole?.updatedBy,
    });

    return existingRole.save();
  }

  async getById(id: string) {
    const role = await this.model.findById(id);

    if (!role) {
      return null;
    }

    const roleObject = role.toObject();

    return {
      ...roleObject,
      apiRoutes: roleObject.apiRoutes.map(this.mapApiRoutes()),
    };
  }

  async paginate(query: PaginationDto) {
    const { data, meta } = await paginateAndSort<IRole>({
      model: this.model,
      filters: {
        name: new RegExp(query.search, 'i'),
      },
      page: query?.page,
      limit: query?.limit,
      options: {
        lean: true,
      },
    });

    return {
      data: data.map((role) => {
        return {
          ...role,
          apiRoutes: role.apiRoutes.map(this.mapApiRoutes()),
        };
      }),
      meta,
    };
  }

  async assignRoles(id: string, body: AssignRoleDto, user: IUser) {
    for (const role of body.roles) {
      await this.getById(role);
    }

    return this.userService.assignRoles(id, body.roles, user);
  }

  async removeRoles(id: string, body: AssignRoleDto, user: IUser) {
    for (const role of body.roles) {
      await this.getById(role);
    }

    return this.userService.removeRoles(id, body.roles, user);
  }

  private async validateUpdateRole(id: string, body: UpdateRoleDto) {
    if (body?.apiRoutes?.length > 0) {
      await this.validateRoutes(body.apiRoutes);
    }

    const existingRole = await this.model.findById(id, null, {
      lean: false,
    });

    if (!existingRole) {
      throw new BadRequestException('Role not found');
    }

    if (
      body?.name &&
      body?.name?.toLowerCase() !== existingRole?.name?.toLowerCase()
    ) {
      const role = await this.findRoleByName(body.name);

      if (role) {
        throw new BadRequestException(
          ErrorMessages.alreadyExist(Role.name, 'name', body.name),
        );
      }
    }

    return existingRole;
  }

  private async validateRoutes(apiRoutes: Array<ApiRoute>) {
    for (const apiRoute of apiRoutes) {
      const availableRoutes = await this.apiRoutes();

      const index = availableRoutes.findIndex(
        (route) =>
          route.method === apiRoute.method && route.path === apiRoute.path,
      );

      if (index === -1) {
        throw new BadRequestException(
          ErrorMessages.routeDoesNotExist(apiRoute),
        );
      }
    }
  }

  private async findRoleByName(name: string) {
    return this.model.findOne({
      name: new RegExp(`^${name}$`, 'i'), //case insensitive full match
    });
  }

  private mapApiRoutes(): (value: ApiRoute) => {
    path: string;
    method: string;
  } {
    return ({ path, method }) => ({ path, method });
  }
}
