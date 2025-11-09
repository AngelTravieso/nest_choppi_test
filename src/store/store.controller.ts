import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { StoreService } from './store.service';
import { CreateStoreDto } from 'src/common/dto/create-store.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateStoreDto } from 'src/common/dto/update-store.dto';

@UseGuards(JwtAuthGuard)
@Controller('stores')
export class StoreController {
  constructor(private readonly storesService: StoreService) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto, @Request() req) {
    return this.storesService.create(createStoreDto, req.user as User);
  }

  @Get()
  findAll(@Request() req, @Query() paginationQuery: PaginationQueryDto) {
    // Implementa paginación y búsqueda (q=)
    return this.storesService.findAll(req.user as User, paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.storesService.findOne(id, req.user as User);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoreDto: UpdateStoreDto,
    @Request() req,
  ) {
    return this.storesService.update(id, updateStoreDto, req.user as User);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.storesService.remove(id, req.user as User);
  }
}
