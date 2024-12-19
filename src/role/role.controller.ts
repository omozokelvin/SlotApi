import { GetUser } from '@/_common/decorators/get-user.decorator';
import { PaginatedModel } from '@/_common/decorators/pagination.decorator';
import { IdDto } from '@/_common/dtos/id.dto';
import { PaginationDto } from '@/_common/dtos/response.dto';
import { ApiTagsEnum } from '@/_common/enums/api-tags.enum';
import { RoleGuard } from '@/auth/guards/role.guard';
import { AssignRoleDto } from '@/role/dtos/assign-role.dto';
import { ApiRouteDto, CreateRoleDto } from '@/role/dtos/create-role.dto';
import { UpdateRoleDto } from '@/role/dtos/update-role.dto';
import { RoleService } from '@/role/role.service';
import { IRole } from '@/role/schemas/role.schema';
import { IUser, User } from '@/user/schemas/user.schema';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('/roles')
@ApiTags(ApiTagsEnum.role)
@ApiBearerAuth()
@UseGuards(RoleGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get('/routes')
  @ApiOkResponse({
    description: 'Routes',
    type: [ApiRouteDto],
  })
  apiRoutes() {
    return this.roleService.apiRoutes();
  }

  @Post('/')
  @ApiOkResponse({
    description: 'Role',
    type: IRole,
  })
  createRole(@Body() body: CreateRoleDto, @GetUser() user: IUser) {
    return this.roleService.createRole(body, user);
  }

  @Patch('/:id')
  @ApiOkResponse({
    description: 'Role',
    type: IRole,
  })
  updateRole(
    @Param() { id }: IdDto,
    @Body() body: UpdateRoleDto,
    @GetUser() user: IUser,
  ) {
    return this.roleService.update(id, body, user);
  }

  @Patch('/user/:id/assign')
  @ApiOkResponse({
    description: 'User',
    type: User,
  })
  assignRoles(
    @Param() { id }: IdDto,
    @Body() body: AssignRoleDto,
    @GetUser() user: IUser,
  ) {
    return this.roleService.assignRoles(id, body, user);
  }

  @Patch('/user/:id/remove')
  @ApiOkResponse({
    description: 'User',
    type: User,
  })
  removeRoles(
    @Param() { id }: IdDto,
    @Body() body: AssignRoleDto,
    @GetUser() user: IUser,
  ) {
    return this.roleService.removeRoles(id, body, user);
  }

  @Get('/')
  @PaginatedModel(IRole)
  async getAllRoles(@Query() query: PaginationDto) {
    return this.roleService.paginate(query);
  }

  @Get('/:id')
  @ApiOkResponse({
    description: 'Role',
    type: IRole,
  })
  async getRoleById(@Param() { id }: IdDto) {
    return this.roleService.getById(id);
  }
}
