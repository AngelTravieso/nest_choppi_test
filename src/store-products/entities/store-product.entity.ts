import { Product } from 'src/product/entities/product.entity';
import { Store } from 'src/store/entities/store.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

/**
 * Entidad 'StoreProduct' (Inventario).
 * Esta es una "tabla de unión con metadatos". Representa la relación
 * Muchos-a-Muchos entre Tiendas (Store) y Productos (Product).
 *
 * Almacena información única de esa relación, como el 'precio'
 * y el 'stock' de un producto específico en una tienda específica.
 */
@Entity()
@Unique(['store', 'product']) // Previene duplicados (mismo producto en misma tienda)
export class StoreProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  /**
   * Relación: La tienda a la que pertenece este item de inventario.
   */
  @ManyToOne(() => Store, (store) => store.storeProducts, {
    nullable: false,
    onDelete: 'CASCADE', // Si se borra la tienda, se borra su inventario.
  })
  store: Store;

  /**
   * Relación: El producto del catálogo al que hace referencia este item.
   */
  @ManyToOne(() => Product, (product) => product.storeProducts, {
    nullable: false,
    onDelete: 'CASCADE', // Si se borra el producto, se borran sus entradas de inventario.
  })
  product: Product;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
