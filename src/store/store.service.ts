import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Store } from './entities/store.entity';
import { User } from 'src/user/entities/user.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CreateStoreDto } from 'src/common/dto/create-store.dto';

@Injectable()
export class StoresService {
    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
    ) { }

    /**
     * Crea una nueva tienda asociada al usuario
     */
    async create(createStoreDto: CreateStoreDto, user: User): Promise<Store> {
        const newStore = this.storeRepository.create({
            ...createStoreDto,
            user: user, // Asocia al usuario
        });
        return this.storeRepository.save(newStore);
    }

    /**
     * Busca todas las tiendas (paginadas) del usuario, con filtro de búsqueda
     */
    async findAll(user: User, paginationQuery: PaginationQueryDto) {
        const { limit = 10, page = 1, q } = paginationQuery;
        const skip = (page - 1) * limit;

        // Condición base: solo tiendas del usuario logueado
        const where: FindOptionsWhere<Store> = {
            user: { id: user.id },
        };

        // Si hay un query 'q', añade búsqueda por nombre
        if (q) {
            where.name = Like(`%${q}%`); // Like es el 'ILIKE' de SQL
        }

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
     * Busca una tienda específica por ID y que pertenezca al usuario
     */
    async findOne(id: number, user: User): Promise<Store> {
        const store = await this.storeRepository.findOne({
            where: {
                id: id,
                user: { id: user.id }, // ¡Importante! Seguridad de propietario
            },
        });

        if (!store) {
            throw new NotFoundException(`Store with ID #${id} not found or doesn't belong to you`);
        }
        return store;
    }

    /**
     * Actualiza una tienda si pertenece al usuario
     */
    async update(id: number, updateStoreDto: UpdateStoreDto, user: User) {
        // Primero, verifica que exista y pertenezca al usuario
        await this.findOne(id, user);

        // Si findOne no falló, actualiza
        const result = await this.storeRepository.update(id, updateStoreDto);

        if (result.affected === 0) {
            throw new NotFoundException(`Store with ID #${id} not found`);
        }

        return this.findOne(id, user); // Retorna la entidad actualizada
    }

    /**
     * Soft-Delete de una tienda si pertenece al usuario
     */
    async remove(id: number, user: User) {
        // Primero, verifica que exista y pertenezca al usuario
        await this.findOne(id, user);

        const result = await this.storeRepository.softDelete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Store with ID #${id} not found`);
        }

        return { message: `Store with ID #${id} successfully soft-deleted` };
    }
}