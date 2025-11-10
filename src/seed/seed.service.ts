import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ProductService } from 'src/product/product.service';
import { StoreService } from 'src/store/store.service';
import { StoreProductService } from 'src/store-products/store-product.service';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { Store } from 'src/store/entities/store.entity';
import { StoreProduct } from 'src/store-products/entities/store-product.entity';
import { CreateProductDto } from 'src/product/dto';
import { CreateStoreDto } from 'src/common/dto/create-store.dto';
import { AddProductToStoreDto } from 'src/store-products/dto';


@Injectable()
export class SeedService {
    constructor(
        private readonly userService: UserService,
        private readonly productService: ProductService,
        private readonly storeService: StoreService,
        private readonly spService: StoreProductService,

        @InjectRepository(User) private readonly userRepo: Repository<User>,
        @InjectRepository(Product) private readonly productRepo: Repository<Product>,
        @InjectRepository(Store) private readonly storeRepo: Repository<Store>,
        @InjectRepository(StoreProduct) private readonly spRepo: Repository<StoreProduct>,
    ) { }

    /**
     * Método principal que orquesta todo el "seeding".
     */
    async executeSeed() {
        if (process.env.NODE_ENV === 'production') {
            throw new BadRequestException('La ejecución del Seed está deshabilitada en producción.');
        }

        await this.cleanDatabase();

        const user = await this.userService.create({
            email: 'test@user.com',
            password: 'password123',
        });
        const userId = user.id;

        const store1 = await this.storeService.create(
            { name: 'Bodega Central' } as CreateStoreDto,
            userId,
        );
        const store2 = await this.storeService.create(
            { name: 'Sucursal Norte' } as CreateStoreDto,
            userId,
        );
        const store3 = await this.storeService.create(
            { name: 'Mini Market Express', address: 'Calle Falsa 123' } as CreateStoreDto,
            userId,
        );

        const createdProducts = await this.createProducts(userId);


        for (const product of createdProducts) {
            const dto: AddProductToStoreDto = {
                productId: product.id,
                price: product.price * 1.15,
                stock: Math.floor(Math.random() * 100),
            };
            await this.spService.addProductToStore(store1.id, userId, dto);
        }

        for (const product of createdProducts.slice(0, 5)) {
            const dto: AddProductToStoreDto = {
                productId: product.id,
                price: product.price * 1.20,
                stock: Math.floor(Math.random() * 50),
            };
            await this.spService.addProductToStore(store2.id, userId, dto);
        }

        return { message: 'Seed ejecutado exitosamente.' };
    }

    /**
     * Método privado para limpiar la BD
     */
    private async cleanDatabase() {
        // TRUNCATE ... CASCADE para limpiar todo y reiniciar los contadores ID.
        await this.spRepo.query('TRUNCATE "user", "store", "product", "store_product" RESTART IDENTITY CASCADE');
    }

    /**
     * Método privado para crear el catálogo de productos
     */
    private async createProducts(userId: number): Promise<Product[]> {
        const productsData = [
            { name: 'Laptop Pro', price: 1500.00 },
            { name: 'Mouse Inalámbrico', price: 45.50 },
            { name: 'Teclado Mecánico', price: 120.00 },
            { name: 'Monitor 4K', price: 450.00 },
            { name: 'Auriculares Bluetooth', price: 80.00 },
            { name: 'Cargador USB-C', price: 25.00 },
            { name: 'Disco Duro SSD 1TB', price: 90.00 },
            { name: 'Memoria RAM 16GB', price: 75.00 },
            { name: 'Webcam HD', price: 60.00 },
            { name: 'Silla Ergonómica', price: 220.00 },
            { name: 'Mochila para Laptop', price: 50.00 },
            { name: 'Adaptador HDMI', price: 15.00 },
            { name: 'Parlante Inteligente', price: 99.00 },
            { name: 'Smartwatch', price: 199.00 },
            { name: 'Router WiFi 6', price: 130.00 },
        ];

        const createdProducts: Product[] = [];

        for (const p of productsData) {
            const productDto: CreateProductDto = {
                name: p.name,
                price: p.price,
                description: `Una descripción de ${p.name}`
            };
            const newProduct = await this.productService.create(productDto, userId);
            createdProducts.push(newProduct);
        }
        return createdProducts;
    }
}