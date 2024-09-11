import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Paginate, PaginateQuery, PaginatedSwaggerDocs } from 'nestjs-paginate';
import { MemberService } from '../services/member.service';
import { MemberReadDTO } from '../services/dtos/member-read.dto';
import { PaginateResult } from '@common/base';
import { MemberCreateDTO } from '../services/dtos/member-create.dto';
import { MemberUpdateDTO } from '../services/dtos/member-update.dto';

@Controller('member')
@ApiBearerAuth()
@ApiTags('Web - Member API')
export class MemberController {
  constructor(private readonly member: MemberService) {}

  @Get()
  @ApiOperation({ summary: 'Get all data members' })
  @PaginatedSwaggerDocs(MemberReadDTO, {
    sortableColumns: ['name', 'code', 'isPenalized'],
    searchableColumns: ['name', 'code', 'isPenalized'],
    maxLimit: 9999999,
  })
  async getAllMembers(
    @Paginate() query: PaginateQuery,
  ): Promise<PaginateResult> {
    return await this.member.findAllMembers(query);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Get member by id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully get all data members',
    type: MemberReadDTO,
  })
  async findMemberById(@Param('id') id: string) {
    return await this.member.findById(id);
  }

  @Get('code/:code')
  @ApiOperation({ summary: 'Get member by code' })
  @ApiResponse({
    status: 200,
    description: 'Successfully get all data members',
    type: MemberReadDTO,
  })
  async findMemberByCode(@Param('code') code: string) {
    return await this.member.findByCode(code);
  }

  @Post('add')
  @ApiOperation({ summary: 'Create new data member' })
  @ApiBody({ type: MemberCreateDTO })
  @ApiResponse({
    status: 201,
    description: 'New data member has been created',
    type: MemberReadDTO,
  })
  async addNewMember(@Body() memberCreateDTO: MemberCreateDTO) {
    return await this.member.addNewMember(memberCreateDTO);
  }

  @Patch('update/:id')
  @ApiOperation({ summary: 'Update data member' })
  @ApiBody({ type: MemberUpdateDTO })
  @ApiResponse({
    status: 200,
    description: 'Data member has been updated',
    type: MemberReadDTO,
  })
  async updateMember(
    @Param('id') id: string,
    @Body() memberUpdateDTO: MemberUpdateDTO,
  ) {
    return await this.member.updateMember(id, memberUpdateDTO);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete data member' })
  @ApiResponse({
    status: 200,
    description: 'Data member has been deleted',
  })
  async deleteMember(@Param('id') id: string) {
    return await this.member.deleteMember(id);
  }
}
