import { GetUser } from '@/_common/decorators/get-user.decorator';
import { PaginatedModel } from '@/_common/decorators/pagination.decorator';
import { IdDto } from '@/_common/dtos/id.dto';
import { PaginationDto } from '@/_common/dtos/response.dto';
import { ApiTagsEnum } from '@/_common/enums/api-tags.enum';
import { RoleGuard } from '@/auth/guards/role.guard';
import { IUser, User } from '@/user/schemas/user.schema';
import { UserService } from '@/user/user.service';
import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  PickType,
} from '@nestjs/swagger';

@Controller('user')
@ApiTags(ApiTagsEnum.user)
@ApiBearerAuth()
@UseGuards(RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @PaginatedModel(User)
  async getUsers(@Query() query: PaginationDto, @GetUser() user: IUser) {
    return this.userService.paginate(query, user);
  }

  @Patch('/block/:id')
  @ApiOkResponse({
    type: PickType(User, ['blocked']),
  })
  async blockUser(@Param() { id }: IdDto, @GetUser() user: IUser) {
    return this.userService.blockUser(id, user);
  }

  @Patch('/unblock/:id')
  @ApiOkResponse({
    type: PickType(User, ['blocked']),
  })
  async unblockUser(@Param() { id }: IdDto, @GetUser() user: IUser) {
    return this.userService.unblockUser(id, user);
  }
}
