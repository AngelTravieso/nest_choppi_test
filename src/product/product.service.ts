import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Crea un nuevo producto (asociado al usuario creador)
   */
  async create(
    createProductDto: CreateProductDto,
    user: User,
  ): Promise<Product> {
    const newProduct = this.productRepository.create({
      ...createProductDto,
      creator: user, // Asocia al usuario que lo crea
    });
    return this.productRepository.save(newProduct);
  }

  /**
   * Busca un producto por ID (público)
   */
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with ID #${id} not found`);
    }
    return product;
  }
}
