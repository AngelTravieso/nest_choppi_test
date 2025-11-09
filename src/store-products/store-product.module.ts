import { Module } from '@nestjs/common';
import { StoreProductService } from './store-product.service';
import { StoreProductController } from './store-product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreProduct } from './entities/store-product.entity';
import { Store } from 'src/store/entities/store.entity';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [TypeOrmModule.forFeature([StoreProduct, Store]), ProductModule],
  providers: [StoreProductService],
  controllers: [StoreProductController],
  exports: [StoreProductService],
})
export class StoreProductModule {}
