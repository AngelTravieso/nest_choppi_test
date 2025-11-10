import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { UserModule } from 'src/user/user.module';
import { User } from 'src/user/entities/user.entity';
import { StoreProduct } from 'src/store-products/entities/store-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Product,
    User,
    StoreProduct
  ]),
  UserModule
],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule { }
