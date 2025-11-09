import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { StoreProduct } from './entities/store-product.entity';
import { AddProductToStoreDto } from './dto/add-product-to-store.dto';
import { GetStoreProductsQueryDto } from './dto/get-store-products-query.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { Store } from 'src/store/entities/store.entity';
import { ProductService } from 'src/product/product.service';

@Injectable()
export class StoreProductService {
  constructor(
    @InjectRepository(StoreProduct)
    private readonly spRepository: Repository<StoreProduct>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    private readonly productsService: ProductService,
  ) {}

  /**
   * Helper: Verifica que una tienda exista y pertenezca al usuario.
   */
  private async getStoreForUser(
    storeId: number,
    userId: number,
  ): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId, user: { id: userId } },
    });
    if (!store) {
      throw new NotFoundException(
        `Store with ID #${storeId} not found or doesn't belong to you`,
      );
    }
    return store;
  }

  /**
   * Añade un producto global al inventario de una tienda.
   */
  async addProductToStore(
    storeId: number,
    userId: number,
    dto: AddProductToStoreDto,
  ) {
    const store = await this.getStoreForUser(storeId, userId);

    // 1. Verificar que el producto global exista
    const product = await this.productsService.findOne(dto.productId); // Esto ya lanza NotFound si no existe

    // 2. Verificar que no exista ya en la tienda
    const existingEntry = await this.spRepository.findOneBy({
      store: { id: storeId },
      product: { id: dto.productId },
    });
    if (existingEntry) {
      throw new BadRequestException('Product is already in this store');
    }

    // 3. Crear la nueva entrada de inventario
    const newStoreProduct = this.spRepository.create({
      store: store,
      product: product,
      price: dto.price,
      stock: dto.stock,
    });

    return this.spRepository.save(newStoreProduct);
  }

  /**
   * Obtiene los productos del inventario de una tienda (paginado y filtrado).
   */
  async getStoreProducts(
    storeId: number,
    userId: number,
    query: GetStoreProductsQueryDto,
  ) {
    await this.getStoreForUser(storeId, userId); // Solo para verificar propiedad

    const { limit = 10, page = 1, q, inStock } = query;
    const skip = (page - 1) * limit;

    // Usamos QueryBuilder para hacer join y filtrar por el nombre del producto
    const qb = this.spRepository
      .createQueryBuilder('sp')
      .innerJoinAndSelect('sp.product', 'product') // Carga la info del producto
      .where('sp.storeId = :storeId', { storeId });

    if (q) {
      qb.andWhere('product.name ILIKE :q', { q: `%${q}%` });
    }

    if (inStock === 'true') {
      qb.andWhere('sp.stock > 0');
    }

    qb.take(limit).skip(skip);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Actualiza precio/stock de un producto en una tienda.
   */
  async updateStoreProduct(
    storeProductId: number,
    storeId: number,
    userId: number,
    dto: UpdateStoreProductDto,
  ) {
    await this.getStoreForUser(storeId, userId); // Verifica propiedad de la tienda

    const storeProduct = await this.spRepository.findOneBy({
      id: storeProductId,
      store: { id: storeId }, // Asegura que el item pertenezca a la tienda
    });

    if (!storeProduct) {
      throw new NotFoundException(
        `StoreProduct with ID #${storeProductId} not found in this store`,
      );
    }

    // Actualiza los campos (merge)
    this.spRepository.merge(storeProduct, dto);
    return this.spRepository.save(storeProduct);
  }

  /**
   * Elimina un producto del inventario de una tienda.
   */
  async removeStoreProduct(
    storeProductId: number,
    storeId: number,
    userId: number,
  ) {
    await this.getStoreForUser(storeId, userId); // Verifica propiedad

    const storeProduct = await this.spRepository.findOneBy({
      id: storeProductId,
      store: { id: storeId },
    });

    if (!storeProduct) {
      throw new NotFoundException(
        `StoreProduct with ID #${storeProductId} not found in this store`,
      );
    }

    await this.spRepository.remove(storeProduct); // Hard delete de la entrada de inventario
    return { message: `StoreProduct #${storeProductId} removed from store` };
  }
}
