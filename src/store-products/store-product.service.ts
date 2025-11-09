import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreProduct } from './entities/store-product.entity';
import {
  AddProductToStoreDto,
  GetStoreProductsQueryDto,
  UpdateStoreProductDto,
} from './dto';
import { Store } from 'src/store/entities/store.entity';
import { ProductService } from 'src/product/product.service';

/**
 * Servicio para gestionar el inventario de las tiendas.
 * Encapsula la lógica de negocio para la entidad StoreProduct.
 *
 */
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
   * Helper de seguridad: Verifica que una tienda exista Y pertenezca al usuario.
   * @param storeId El ID de la tienda a verificar.
   * @param userId El ID del usuario autenticado.
   * @returns La entidad de la Tienda si la validación es exitosa.
   * @throws {NotFoundException} Si la tienda no existe o no pertenece al usuario.
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
   * Añade un producto del catálogo general al inventario de una tienda específica.
   * Verifica la propiedad de la tienda y que el producto no esté ya añadido.
   */
  async addProductToStore(
    storeId: number,
    userId: number,
    dto: AddProductToStoreDto,
  ) {
    const store = await this.getStoreForUser(storeId, userId);
    const product = await this.productsService.findOne(dto.productId);

    const existingEntry = await this.spRepository.findOneBy({
      store: { id: storeId },
      product: { id: dto.productId },
    });
    if (existingEntry) {
      throw new BadRequestException('Product is already in this store');
    }

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
   * Verifica la propiedad de la tienda.
   */
  async getStoreProducts(
    storeId: number,
    userId: number,
    query: GetStoreProductsQueryDto,
  ) {
    await this.getStoreForUser(storeId, userId);

    const { limit = 10, page = 1, q, inStock } = query;
    const skip = (page - 1) * limit;

    const qb = this.spRepository
      .createQueryBuilder('sp')
      .innerJoinAndSelect('sp.product', 'product')
      .where('sp.storeId = :storeId', { storeId });

    if (q) {
      qb.andWhere('product.name ILIKE :q', { q: `%${q}%` });
    }

    if (inStock === 'true') {
      qb.andWhere('sp.stock > 0');
    }

    qb.take(limit).skip(skip).orderBy('product.name', 'ASC');

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
   * Actualiza el precio o stock de un item de inventario específico.
   * Verifica la propiedad de la tienda Y que el item pertenezca a esa tienda.
   */
  async updateStoreProduct(
    storeProductId: number,
    storeId: number,
    userId: number,
    dto: UpdateStoreProductDto,
  ) {
    await this.getStoreForUser(storeId, userId);

    const storeProduct = await this.spRepository.findOneBy({
      id: storeProductId,
      store: { id: storeId },
    });

    if (!storeProduct) {
      throw new NotFoundException(
        `StoreProduct with ID #${storeProductId} not found in this store`,
      );
    }

    this.spRepository.merge(storeProduct, dto);
    return this.spRepository.save(storeProduct);
  }

  /**
   * Elimina (Hard Delete) un item del inventario de una tienda.
   * Verifica la propiedad de la tienda Y que el item pertenezca a esa tienda.
   */
  async removeStoreProduct(
    storeProductId: number,
    storeId: number,
    userId: number,
  ) {
    await this.getStoreForUser(storeId, userId);
    const storeProduct = await this.spRepository.findOneBy({
      id: storeProductId,
      store: { id: storeId },
    });

    if (!storeProduct) {
      throw new NotFoundException(
        `StoreProduct with ID #${storeProductId} not found in this store`,
      );
    }

    await this.spRepository.remove(storeProduct);
    return { message: `StoreProduct #${storeProductId} removed from store` };
  }
}
