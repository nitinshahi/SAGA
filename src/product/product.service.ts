import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm/repository/Repository';
import { Category } from 'src/category/entities/category.entity';

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
        category = await this.categoryRepository.findOne({ where: { id: Number(product.category_id) } });
        if (!category) {
          throw new NotFoundException(`Category with ID ${product.category_id} not found`);
        }
      } catch (error) {
        throw new NotFoundException(`Category with ID ${product.category_id} not found`);
      }
    }
    const savedProduct = await this.productRepository.save(product);
    return savedProduct;
  }

  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return this.productRepository.findOneBy( { id });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }
}
