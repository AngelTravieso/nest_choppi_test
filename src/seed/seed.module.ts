import { Module } from '@nestjs/common';
import { Product } from 'src/product/entities/product.entity';
import { ProductModule } from 'src/product/product.module';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { Store } from 'src/store/entities/store.entity';
import { StoreModule } from 'src/store/store.module';
import { StoreProduct } from 'src/store-products/entities/store-product.entity';
import { StoreProductModule } from 'src/store-products/store-product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';


@Module({
    imports: [
        UserModule,
        ProductModule,
        StoreModule,
        StoreProductModule,
        TypeOrmModule.forFeature([
            User,
            Product,
            Store,
            StoreProduct
        ]),
    ],
    controllers: [SeedController],
    providers: [SeedService],
})
export class SeedModule { }