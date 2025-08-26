import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm/repository/Repository';
import { Category } from 'src/category/entities/category.entity';
import { In } from 'typeorm';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>, // Assuming Category is imported correctly
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    // return createProductDto.category_id;
    let category: Category | null = null;

    if(createProductDto.category_id) {
      try {
        category = await this.categoryRepository.findOne({ where: { id: product.category_id } });
        if (!category) {
          throw new NotFoundException(`Category with ID ${product.category_id} not found`);
        }
      } catch (error) {
        throw new InternalServerErrorException('Failed to create product');
      }
    }

    const savedProduct = await this.productRepository.save(product);
    return "Product created successfully";
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
