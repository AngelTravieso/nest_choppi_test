import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { StoreModule } from './store/store.module';
import { CommonModule } from './common/common.module';
import { ProductModule } from './product/product.module';
import { StoreProductModule } from './store-products/store-product.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [User],
        synchronize: true, // ¡Solo para desarrollo!
      }),
    }),
    AuthModule,
    UserModule,
    StoreModule,
    CommonModule,
    ProductModule,
    StoreProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
