import { Order } from "src/order/entities/order.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
   ADMIN = 'admin',
   CUSTOMER = 'customer',
   MANAGER = 'manager', //optional
}

@Entity({ name: "users" })
export class User {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({ type: 'varchar', length: 100, unique: true })
   email: string;

   @Column({ type: 'varchar', length: 100 })
   password: string;

   @Column({
      type: 'enum', 
      enum: UserRole,
      default: UserRole.CUSTOMER
   })
   role: UserRole;

   @Column({nullable: true})
   firstName: string;
   
   @Column({nullable: true})
   lastName: string;
   
   @Column({nullable: true})
   phoneNumber: string;

   @Column({ type: 'boolean', default: true })
   isActive: boolean;

   @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
   createdAt: Date;

   @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
   updatedAt: Date;

   @OneToMany(() => Order, order => order.user)
   orders: Order[];
}
