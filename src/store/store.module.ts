import { Module } from '@nestjs/common';
import { Store } from './entities/store.entity';
import { StoreController } from './store.controller';
import { StoreProductModule } from 'src/store-products/store-product.module';
import { StoreService } from './store.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), StoreProductModule],
  providers: [StoreService],
  controllers: [StoreController],
  exports: [StoreService],
})
export class StoreModule { }
