import { StoreProduct } from 'src/store-products/entities/store-product.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidad que representa un Producto en el catálogo general.
 * Este producto es la plantilla base (nombre, precio sugerido, descripción)
 * y es creado por un usuario (creator).
 */
@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  /**
   * Relación: El usuario que creó este producto en el catálogo.
   */
  @ManyToOne(() => User, (user) => user.createdProducts, {
    nullable: false, // Un producto siempre debe tener un creador
    onDelete: 'SET NULL', // Si se borra el creador, el producto no se borra
  })
  creator: User;

  /**
   * Relación: Las entradas de inventario donde este producto está listado.
   */
  @OneToMany(() => StoreProduct, (storeProduct) => storeProduct.product)
  storeProducts: StoreProduct[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
