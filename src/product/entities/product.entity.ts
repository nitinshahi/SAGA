import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
// import { Category } from './category.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  sku: string;

  @Column({ default: 0 })
  stockQuantity: number;

  @Column({ default: 5 })
  reorderThreshold: number;

  @Column({ default: true })
  isActive: boolean;

  // @ManyToOne(() => Category, (category) => category.products)
  // @JoinColumn({ name: 'categoryId' })
  // category: Category;

  @Column({ nullable: true })
  categoryId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}