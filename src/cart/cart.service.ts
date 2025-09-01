import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { Product } from 'src/product/entities/product.entity';
import { AddCartItemDto } from './dto/add-cart-item.dto';

@Injectable()
export class CartService {

  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private itemRepository: Repository<CartItem>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
  ) {}

  async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['items', 'items.product'],
    });
    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId }, items: [] });
      await this.cartRepository.save(cart);
    }
    return cart;
  }
  
  async addItem(userId: number, dto: AddCartItemDto){
    const cart = await this.getOrCreateCart(userId);
    const product = await this.productRepository.findOne({ where: { id: dto.productId } });
    const productId = product?.id;

    const existingItem = cart.items.find(i => i.product.id === dto.productId);
    if(existingItem){
      existingItem.quantity += dto.quantity;
      await this.itemRepository.save(existingItem);
    }else{
      const item = this.itemRepository.create({
        cart: { id: cart.id },
        product: { id: productId },
        quantity: dto.quantity,
      });
      await this.itemRepository.save(item);
    }
    return this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items', 'items.product'],
    });
  }

  async getCart(userId:number){
    return this.getOrCreateCart(userId);
  }

  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);
    await this.itemRepository.delete({ cart: { id: cart.id } });
    return this.cartRepository.findOne({
      where: { id: cart.id },
      relations: ['items', 'items.product'],
    });
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.getOrCreateCart(userId);
    const item = await this.itemRepository.findOne({where: {id: itemId },relations: ['cart']});
    if(!item || item.cart.id !== cart.id){
      throw new ForbiddenException('Item not found in cart');
    }
    await this.itemRepository.remove(item);
    return "Item removed from cart";
  }
}
