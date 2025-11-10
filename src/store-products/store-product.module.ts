import { Module } from '@nestjs/common';
import { ProductModule } from 'src/product/product.module';
import { Store } from 'src/store/entities/store.entity';
import { StoreProduct } from './entities/store-product.entity';
import { StoreProductController } from './store-product.controller';
import { StoreProductService } from './store-product.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StoreProduct, Store]), ProductModule],
  providers: [StoreProductService],
  controllers: [StoreProductController],
  exports: [StoreProductService],
})
export class StoreProductModule {}
