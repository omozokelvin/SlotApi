import { RoleController } from '@/role/role.controller';
import { Role, RoleSchema } from '@/role/schemas/role.schema';
import { RoleService } from '@/role/role.service';
import { UserModule } from '@/user/user.module';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApiRoute, ApiRouteSchema } from '@/role/schemas/api-route.schema';

@Global()
@Module({
  controllers: [RoleController],
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([
      { name: ApiRoute.name, schema: ApiRouteSchema },
    ]),
    UserModule,
  ],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
