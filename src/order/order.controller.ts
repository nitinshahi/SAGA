import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { UserRole } from 'src/auth/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
  
  @Roles(UserRole.CUSTOMER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('checkout')
  checkout(@Req() req){
    return this.orderService.checkout(req.user.userId);
  }

  @Get()
  getOrders(@Req() req){
    return this.orderService.getOrders(req.user.id);
  }

  @Get(':id')
  getOrder(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.orderService.getOrder(req.user.id, id);
  }

}
