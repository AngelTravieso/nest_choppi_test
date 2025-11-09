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
import {
  AddProductToStoreDto,
  GetStoreProductsQueryDto,
  UpdateStoreProductDto,
} from './dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { StoreProductService } from './store-product.service';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface';

@ApiTags('Store Inventory')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('stores/:storeId/products')
export class StoreProductController {
  constructor(private readonly storeProductService: StoreProductService) {}

  /**
   * POST /stores/:storeId/products
   * Añade un producto al inventario de una tienda.
   */
  @Post()
  @ApiOperation({ summary: 'Añadir un producto al inventario de la tienda' })
  @ApiResponse({ status: 201, description: 'Producto añadido al inventario.' })
  @ApiResponse({ status: 404, description: 'Tienda o Producto no encontrado.' })
  @ApiResponse({
    status: 400,
    description: 'El producto ya está en la tienda.',
  })
  addProductToStore(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Request() req,
    @Body() dto: AddProductToStoreDto,
  ) {
    const userId = (req.user as UserPayload).userId;
    return this.storeProductService.addProductToStore(storeId, userId, dto);
  }

  /**
   * GET /stores/:storeId/products
   * Obtiene los productos del inventario de una tienda (paginado, filtrado).
   */
  @Get()
  @ApiOperation({ summary: 'Listar productos del inventario de la tienda' })
  @ApiResponse({ status: 200, description: 'Inventario de la tienda.' })
  @ApiResponse({ status: 404, description: 'Tienda no encontrada.' })
  getStoreProducts(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Request() req,
    @Query() query: GetStoreProductsQueryDto,
  ) {
    const userId = (req.user as UserPayload).userId;
    return this.storeProductService.getStoreProducts(storeId, userId, query);
  }

  /**
   * PUT /stores/:storeId/products/:storeProductId
   * Actualiza precio/stock de un item del inventario.
   */
  @Put(':storeProductId')
  @ApiOperation({ summary: 'Actualizar un item del inventario (precio/stock)' })
  @ApiResponse({ status: 200, description: 'Item actualizado.' })
  @ApiResponse({ status: 404, description: 'Tienda o Item no encontrado.' })
  updateStoreProduct(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('storeProductId', ParseIntPipe) storeProductId: number,
    @Request() req,
    @Body() dto: UpdateStoreProductDto,
  ) {
    const userId = (req.user as UserPayload).userId;
    return this.storeProductService.updateStoreProduct(
      storeProductId,
      storeId,
      userId,
      dto,
    );
  }

  /**
   * DELETE /stores/:storeId/products/:storeProductId
   * Elimina un item del inventario.
   */
  @Delete(':storeProductId')
  @ApiOperation({ summary: 'Eliminar un item del inventario' })
  @ApiResponse({ status: 200, description: 'Item eliminado.' })
  @ApiResponse({ status: 404, description: 'Tienda o Item no encontrado.' })
  removeStoreProduct(
    @Param('storeId', ParseIntPipe) storeId: number,
    @Param('storeProductId', ParseIntPipe) storeProductId: number,
    @Request() req,
  ) {
    const userId = (req.user as UserPayload).userId;
    return this.storeProductService.removeStoreProduct(
      storeProductId,
      storeId,
      userId,
    );
  }
}
