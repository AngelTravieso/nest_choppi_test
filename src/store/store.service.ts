import { CreateStoreDto } from 'src/common/dto/create-store.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Store } from './entities/store.entity';
import { UpdateStoreDto } from 'src/common/dto/update-store.dto';

/**
 * Servicio que encapsula la lógica de negocio para las Tiendas (Stores).
 * Se asegura de que todas las operaciones estén aisladas
 * al usuario que las solicita (usando userId).
 */
@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  /**
   * Crea una nueva tienda y la asocia con el ID del usuario.
   * @param createStoreDto DTO con los datos de la tienda (nombre, dirección).
   * @param userId ID del usuario autenticado.
   * @returns La entidad de la tienda creada.
   */
  async create(createStoreDto: CreateStoreDto, userId: number): Promise<Store> {
    const newStore = this.storeRepository.create({
      ...createStoreDto,
      user: { id: userId }, // Asocia por ID
    });
    return this.storeRepository.save(newStore);
  }
  /**
   * Busca todas las tiendas (paginadas) que pertenecen a un usuario.
   * Permite filtrar por un término de búsqueda 'q'.
   * @param userId ID del usuario autenticado.
   * @param paginationQuery DTO de paginación (page, limit, q).
   * @returns Un objeto de paginación con { data, total, page, ... }.
   */
  async findAll(userId: number, paginationQuery: PaginationQueryDto) {
    const { limit = 10, page = 1, q } = paginationQuery;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<Store> | FindOptionsWhere<Store>[] = {
      user: { id: userId },
      ...(q && { name: Like(`%${q}%`) }),
    };

    const [data, total] = await this.storeRepository.findAndCount({
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
   * Busca una tienda específica por ID, verificando que pertenezca al usuario.
   * Este es un método clave de seguridad para todos los demás métodos (update, remove).
   * @param id El ID de la tienda a buscar.
   * @param userId El ID del usuario autenticado.
   * @returns La entidad de la tienda.
   * @throws {NotFoundException} Si la tienda no existe o no pertenece al usuario.
   */
  async findOne(id: number, userId: number): Promise<Store> {
    const store = await this.storeRepository.findOne({
      where: {
        id: id,
        user: { id: userId },
      },
    });

    if (!store) {
      throw new NotFoundException(
        `Store with ID #${id} not found or doesn't belong to you`,
      );
    }
    return store;
  }

  /**
   * Actualiza una tienda, verificando primero la propiedad (ownership).
   * @param id El ID de la tienda a actualizar.
   * @param updateStoreDto DTO con los datos a actualizar.
   * @param userId El ID del usuario autenticado.
   * @returns La entidad de la tienda actualizada.
   */
  async update(id: number, updateStoreDto: UpdateStoreDto, userId: number) {
    await this.findOne(id, userId);

    const result = await this.storeRepository.update(id, updateStoreDto);

    if (result.affected === 0) {
      throw new NotFoundException(`Store with ID #${id} not found`);
    }

    return this.findOne(id, userId);
  }

  /**
   * Realiza un Soft-Delete de una tienda, verificando primero la propiedad.
   * @param id El ID de la tienda a eliminar.
   * @param userId El ID del usuario autenticado.
   * @returns Un mensaje de confirmación.
   */
  async remove(id: number, userId: number) {
    await this.findOne(id, userId);

    const result = await this.storeRepository.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Store with ID #${id} not found`);
    }

    return { message: `Store with ID #${id} successfully soft-deleted` };
  }
}
