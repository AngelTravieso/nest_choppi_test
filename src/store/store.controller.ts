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
import { AddProductToStoreDto } from 'src/store-products/dto/add-product-to-store.dto';
import { GetStoreProductsQueryDto } from 'src/store-products/dto/get-store-products-query.dto';
import { UpdateStoreProductDto } from 'src/store-products/dto/update-store-product.dto';
import { StoreProductService } from 'src/store-products/store-product.service';

@UseGuards(JwtAuthGuard)
@Controller('stores')
export class StoreController {
  constructor(
    private readonly storesService: StoreService,
    private readonly storeProductService: StoreProductService,
  ) {}

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

  /**
   * POST /stores/:id/products
   * Añade un producto al inventario de una tienda
   */
  @Post(':id/products')
  addProductToStore(
    @Param('id', ParseIntPipe) storeId: number,
    @Request() req,
    @Body() dto: AddProductToStoreDto,
  ) {
    const userId = req.user.userId; // Extraído del payload del JWT
    return this.storeProductService.addProductToStore(storeId, userId, dto);
  }

  /**
   * GET /stores/:id/products
   * Obtiene los productos del inventario de una tienda (paginado, filtrado)
   */
  @Get(':id/products')
  getStoreProducts(
    @Param('id', ParseIntPipe) storeId: number,
    @Request() req,
    @Query() query: GetStoreProductsQueryDto,
  ) {
    const userId = req.user.userId;
    return this.storeProductService.getStoreProducts(storeId, userId, query);
  }

  /**
   * PUT /stores/:id/products/:storeProductId
   * Actualiza precio/stock de un item del inventario
   */
  @Put(':id/products/:storeProductId')
  updateStoreProduct(
    @Param('id', ParseIntPipe) storeId: number,
    @Param('storeProductId', ParseIntPipe) storeProductId: number,
    @Request() req,
    @Body() dto: UpdateStoreProductDto,
  ) {
    const userId = req.user.userId;
    return this.storeProductService.updateStoreProduct(
      storeProductId,
      storeId,
      userId,
      dto,
    );
  }

  /**
   * DELETE /stores/:id/products/:storeProductId
   * Elimina un item del inventario
   */
  @Delete(':id/products/:storeProductId')
  removeStoreProduct(
    @Param('id', ParseIntPipe) storeId: number,
    @Param('storeProductId', ParseIntPipe) storeProductId: number,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.storeProductService.removeStoreProduct(
      storeProductId,
      storeId,
      userId,
    );
  }
}
