import { Module } from '@nestjs/common';
import { StoreProductService } from './store-product.service';
import { StoreProductsController } from './store-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreProduct } from './entities/store-product.entity';
import { Store } from 'src/store/entities/store.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreProduct, Store])],
  providers: [StoreProductService],
  controllers: [StoreProductsController],
  exports: [StoreProductService],
})
export class StoreProductModule {}
