import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductService } from './product.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productsService: ProductService) {} /**
   * Crea un nuevo producto en el catálogo general.
   * Requiere autenticación.
   */

  @ApiOperation({ summary: 'Crear un nuevo producto en el catálogo' })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto, @Request() req) {
    // Obtenemos el userId del payload del token JWT
    const userId = (req.user as UserPayload).userId;
    return this.productsService.create(createProductDto, userId);
  }

  /**
   * Obtiene una lista paginada de todos los productos del catálogo.
   * Es un endpoint público.
   */
  @ApiOperation({ summary: 'Listar todos los productos (público, paginado)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({
    name: 'q',
    required: false,
    type: String,
    description: 'Término de búsqueda por nombre',
  })
  @ApiResponse({ status: 200, description: 'Lista de productos.' })
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.productsService.findAll(paginationQuery);
  } /**
   * Obtiene un producto específico por ID.
   * Es un endpoint público.
   */

  @ApiOperation({ summary: 'Obtener un producto por ID (público)' })
  @ApiResponse({ status: 200, description: 'Detalles del producto.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  /**
   * Actualiza un producto.
   * Solo el usuario que creó el producto puede actualizarlo.
   */
  @ApiOperation({ summary: 'Actualizar un producto (Solo creador)' })
  @ApiResponse({ status: 200, description: 'Producto actualizado.' })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado o no pertenece al usuario.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
  ) {
    const userId = (req.user as UserPayload).userId;
    return this.productsService.update(id, updateProductDto, userId);
  }

  /**
   * Elimina (Soft-Delete) un producto.
   * Solo el usuario que creó el producto puede eliminarlo.
   */
  @ApiOperation({ summary: 'Eliminar un producto (Solo creador)' })
  @ApiResponse({
    status: 200,
    description: 'Producto eliminado (soft-delete).',
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado o no pertenece al usuario.',
  })
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    const userId = (req.user as UserPayload).userId;
    return this.productsService.remove(id, userId);
  }
}
