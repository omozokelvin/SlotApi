import { GetUser } from '@/_common/decorators/get-user.decorator';
import { PaginatedModel } from '@/_common/decorators/pagination.decorator';
import { IdDto } from '@/_common/dtos/id.dto';
import { PaginationDto } from '@/_common/dtos/response.dto';
import { ApiTagsEnum } from '@/_common/enums/api-tags.enum';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CreateLoanDto } from '@/loan/dto/create-loan.dto';
import { UpdateLoanDto } from '@/loan/dto/update-loan.dto';
import { LoanService } from '@/loan/loan.service';
import { ILoan } from '@/loan/schemas/loan.schema';
import { IUser } from '@/user/schemas/user.schema';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('loan')
@ApiTags(ApiTagsEnum.loan)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  create(
    @Body() createLoanDto: CreateLoanDto,
    @GetUser() user: IUser,
  ): Promise<ILoan> {
    return this.loanService
      .create(createLoanDto, user)
      .then((item) => item?.toObject());
  }

  @Get(':id')
  findOne(@Param() { id }: IdDto, @GetUser() user: IUser): Promise<ILoan> {
    return this.loanService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param() { id }: IdDto,
    @Body() updateLoanDto: UpdateLoanDto,
    @GetUser() user: IUser,
  ): Promise<ILoan> {
    const item = await this.loanService.update(id, updateLoanDto, user);
    return item?.toObject();
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() user: IUser) {
    return this.loanService.remove(id, user);
  }

  @Get('/')
  @PaginatedModel(ILoan)
  async getAllRoles(@Query() query: PaginationDto, @GetUser() user: IUser) {
    return this.loanService.paginate(query, user);
  }
}
