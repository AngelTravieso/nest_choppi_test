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
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateStoreRequestDto, UpdateStoreRequestDto } from './dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { StoreProductService } from 'src/store-products/store-product.service';
import { StoreService } from './store.service';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface';

@ApiTags('Stores')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('stores')
export class StoreController {
  constructor(
    private readonly storesService: StoreService,
    private readonly storeProductService: StoreProductService,
  ) {}

  /**
   * Crea una nueva tienda para el usuario autenticado.
   */
  @ApiOperation({ summary: 'Crear una nueva tienda' })
  @ApiResponse({ status: 201, description: 'La tienda ha sido creada.' })
  @Post()
  create(@Body() createStoreDto: CreateStoreRequestDto, @Request() req) {
    const userId = (req.user as UserPayload).userId;
    return this.storesService.create(createStoreDto, userId);
  }

  /**
   * Obtiene todas las tiendas del usuario autenticado (paginado y con búsqueda).
   */
  @ApiOperation({ summary: 'Listar tiendas del usuario (paginado)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Término de búsqueda por nombre',
  })
  @ApiResponse({ status: 200, description: 'Lista de tiendas.' })
  @Get()
  findAll(@Request() req, @Query() paginationQuery: PaginationQueryDto) {
    const userId = (req.user as UserPayload).userId;
    return this.storesService.findAll(userId, paginationQuery);
  }

  /**
   * Obtiene una tienda específica por ID.
   * Solo devuelve la tienda si pertenece al usuario autenticado.
   */
  @ApiOperation({ summary: 'Obtener una tienda por ID' })
  @ApiResponse({ status: 200, description: 'Detalles de la tienda.' })
  @ApiResponse({
    status: 404,
    description: 'Tienda no encontrada o no pertenece al usuario.',
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = (req.user as UserPayload).userId;
    return this.storesService.findOne(id, userId);
  }

  /**
   * Actualiza una tienda específica por ID.
   * Solo la actualiza si pertenece al usuario autenticado.
   */
  @ApiOperation({ summary: 'Actualizar una tienda por ID' })
  @ApiResponse({ status: 200, description: 'Tienda actualizada.' })
  @ApiResponse({
    status: 404,
    description: 'Tienda no encontrada o no pertenece al usuario.',
  })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStoreDto: UpdateStoreRequestDto,
    @Request() req,
  ) {
    const userId = (req.user as UserPayload).userId;
    return this.storesService.update(id, updateStoreDto, userId);
  } /**
   * Elimina (Soft-Delete) una tienda por ID.
   * Solo la elimina si pertenece al usuario autenticado.
   */

  @ApiOperation({ summary: 'Eliminar (Soft-Delete) una tienda por ID' })
  @ApiResponse({ status: 200, description: 'Tienda eliminada (soft-delete).' })
  @ApiResponse({
    status: 404,
    description: 'Tienda no encontrada o no pertenece al usuario.',
  })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = (req.user as UserPayload).userId;
    return this.storesService.remove(id, userId);
  }
}
