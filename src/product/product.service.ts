import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { FindOptionsWhere, Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Crea un nuevo producto y lo asocia al ID del usuario creador.
   * @param createProductDto DTO con datos del producto.
   * @param userId ID del usuario autenticado (creador).
   * @returns El producto creado.
   */
  async create(
    createProductDto: CreateProductDto,
    userId: number,
  ): Promise<Product> {
    const newProduct = this.productRepository.create({
      ...createProductDto,
      creator: { id: userId },
    });
    return this.productRepository.save(newProduct);
  }

  /**
   * Busca todos los productos (paginados). Permite filtro de búsqueda 'q'.
   * @param paginationQuery DTO de paginación (page, limit, q).
   * @returns Un objeto de paginación con { data, total, page, ... }.
   */
  async findAll(paginationQuery: PaginationQueryDto) {
    const { limit = 10, page = 1, q } = paginationQuery;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Product> = {};

    if (q) {
      where.name = Like(`%${q}%`);
    }

    const [data, total] = await this.productRepository.findAndCount({
      where,
      take: limit,
      skip: skip,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Busca un producto por ID (método público).
   * @param id El ID del producto.
   * @returns La entidad del producto.
   * @throws {NotFoundException} Si el producto no existe.
   */

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with ID #${id} not found`);
    }
    return product;
  }

  /**
   * Actualiza un producto, verificando que el usuario sea el creador.
   * @param id El ID del producto a actualizar.
   * @param updateProductDto DTO con los datos a actualizar.
   * @param userId El ID del usuario que intenta actualizar.
   * @returns El producto actualizado.
   */
  async update(id: number, updateProductDto: UpdateProductDto, userId: number) {
    await this.findMyProduct(id, userId);

    const result = await this.productRepository.update(id, updateProductDto);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID #${id} not found`);
    }

    return this.findOne(id);
  }

  /**
   * Realiza un Soft-Delete de un producto, verificando que el usuario sea el creador.
   * @param id El ID del producto a eliminar.
   * @param userId El ID del usuario que intenta eliminar.
   * @returns Un mensaje de confirmación.
   */
  async remove(id: number, userId: number) {
    await this.findMyProduct(id, userId);

    const result = await this.productRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Product with ID #${id} not found`);
    }

    return { message: `Product with ID #${id} successfully soft-deleted` };
  }

  /**
   * Método de seguridad interno.
   * Busca un producto por ID SÓLO si pertenece al userId.
   * @param id El ID del producto.
   * @param userId El ID del creador.
   * @returns El producto si se encuentra y coincide.
   * @throws {NotFoundException} Si el producto no se encuentra o no pertenece al usuario.
   */
  private async findMyProduct(id: number, userId: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: {
        id: id,
        creator: { id: userId },
      },
    });

    if (!product) {
      throw new NotFoundException(
        `Product with ID #${id} not found or you are not the creator`,
      );
    }
    return product;
  }
}
