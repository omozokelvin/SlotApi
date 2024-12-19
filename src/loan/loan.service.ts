import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { IUser } from '@/user/schemas/user.schema';
import { paginateAndSort } from '@/_common/helpers/filter.helper';
import { InjectModel } from '@nestjs/mongoose';
import { ILoan, Loan } from '@/loan/schemas/loan.schema';
import { FilterQuery, Model } from 'mongoose';
import { PaginationDto } from '@/_common/dtos/response.dto';
import { uniqueId } from '@/_common/helpers/string.helper';

@Injectable()
export class LoanService {
  constructor(
    @InjectModel(Loan.name)
    private readonly model: Model<ILoan>,
  ) {}

  async create(body: CreateLoanDto, user: IUser) {
    const reference = await this.generateReference();

    const role = await this.model.create({
      ...body,
      reference,
      createdBy: user.id,
    });

    return role;
  }

  async paginate(query: PaginationDto, user: IUser) {
    const filters: FilterQuery<ILoan> = {
      createdBy: user.id,
    };

    if (query?.search) {
      filters.title = new RegExp(query.search, 'i');
    }

    return paginateAndSort<ILoan>({
      model: this.model,
      filters,
      page: query?.page,
      limit: query?.limit,
      options: {
        lean: true,
      },
    });
  }

  async findOne(id: string, user: IUser) {
    const loan = await this.model.findOne({
      _id: id,
      createdBy: user.id,
    });

    if (!loan) {
      throw new NotFoundException(`Loan with id ${id} not found`);
    }

    return loan;
  }

  async update(id: string, updateLoanDto: UpdateLoanDto, user: IUser) {
    const loan = await this.findOne(id, user);

    loan.$set(updateLoanDto);

    const saved = await loan.save();

    return saved;
  }

  async remove(id: string, user: IUser) {
    const loan = await this.findOne(id, user);

    await loan.deleteOne();

    return true;
  }

  private async generateReference() {
    const reference = uniqueId();

    const exist = await this.model.findOne({
      reference: new RegExp(reference, 'i'),
    });

    if (exist) {
      return this.generateReference();
    }

    return reference;
  }
}
