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
 * Entidad que representa una Tienda.
 * Cada tienda pertenece a un único usuario (User) y puede
 * tener múltiples productos en su inventario (StoreProduct).
 */
@Entity()
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  /**
   * Relación: El usuario que es dueño de esta tienda.
   * Muchas tiendas pueden pertenecer a un usuario.
   */
  @ManyToOne(() => User, (user) => user.stores, {
    nullable: false, // Una tienda siempre debe tener un dueño
    onDelete: 'CASCADE', // Si se borra el usuario, se borran sus tiendas
  })
  user: User;

  /**
   * Relación: La lista de productos en el inventario de esta tienda.
   * Una tienda puede tener muchas entradas de StoreProduct.
   */
  @OneToMany(() => StoreProduct, (storeProduct) => storeProduct.store)
  storeProducts: StoreProduct[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Columna para Soft-Delete (borrado lógico).
   */
  @DeleteDateColumn()
  deletedAt: Date;
}
