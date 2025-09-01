import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm/repository/Repository';
import { OrderItem } from './entities/order-item.entity';
import { Cart } from 'src/cart/entities/cart.entity';

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem) private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Cart) private readonly cartRepository: Repository<Cart>,
  ) {}

  async checkout(userId: number){
    const cart = await this.cartRepository.findOne({ 
      where: { user: { id: userId } }, 
      relations: ['items', 'items.product'] 
    });
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }
    const items = cart.items.map(item => {
      return this.orderItemRepository.create({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      });
    });
    // return items;

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    // return total;

    const order = this.orderRepository.create({
      user: {id: userId },
      items: items,
      total,
    });
    // return order;

    await this.orderRepository.save(order);

    await this.cartRepository.delete(cart.id);
    
    return order;
  }

  async getOrders(userId: number) {
    return this.orderRepository.find({ where: { user: { id: userId } }, order: { createdAt: 'DESC' }});
  }

  async getOrder(userId: number, orderId: number) { 
    const order = await this.orderRepository.findOne({ where: { id: orderId, user: { id: userId } }, relations: ['orderItems', 'orderItems.product'] });
    if (!order || order.user.id !== userId) {
      throw new Error('Order not found');
    }

    return order;
  }

  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
