import { titleCase } from '@/_common/helpers/string.helper';
import { AuthModule } from '@/auth/auth.module';
import { MailModule } from '@/mail/mail.module';
import { OtpModule } from '@/otp/otp.module';
import { User, UserSchema } from '@/user/schemas/user.schema';
import { UserController } from '@/user/user.controller';
import { UserService } from '@/user/user.service';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { genSalt, hashSync } from 'bcryptjs';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: async () => {
          const schema = UserSchema;

          schema.pre('save', async function () {
            if (this.isModified('firstName') || this.isModified('lastName')) {
              const fullName = [this.firstName, this.lastName].join(' ').trim();
              this.fullName = titleCase(fullName);
              this.firstName = titleCase(this.firstName);
              this.lastName = titleCase(this.lastName);
            }

            if (this.isModified('password')) {
              const salt = await genSalt(10);
              const hash = await hashSync(this.password, salt);
              this.password = hash;
              this.passwordSet = !!this.password;
            }
          });

          return schema;
        },
      },
    ]),
    MailModule,
    forwardRef(() => OtpModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
