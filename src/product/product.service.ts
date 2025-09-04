import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm/repository/Repository';
import { Category } from 'src/category/entities/category.entity';
import { UpdateMode, UpdateProductImagesDto } from './dto/update-product-images.dto';
import { deleteFile } from 'src/utils/file.utils';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>, // Assuming Category is imported correctly
  ) {}

  async create(createProductDto: CreateProductDto, imagePaths: string[]) {
    const product = this.productRepository.create({ ...createProductDto, imageUrls: imagePaths });
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

  async findAll() {
    try {
      const products = await this.productRepository.find();
      return products; 
    } catch (error) {
      throw new InternalServerErrorException('Error fetching products');
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOneBy({ id });
      return product;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching product');
    }
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return this.productRepository.update(id, updateProductDto);
  }

  remove(id: number) {
    return this.productRepository.delete(id);
  }

  async updateProductImages(productId: number, updateDto: UpdateProductImagesDto, newImagePaths: string[]) {
    const product = await this.productRepository.findOneBy({ id: productId });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }
    // Update product images
    if (updateDto.mode === UpdateMode.REPLACE) {
      // Delete old images from filesystem
      // const imagesToDelete = product.imageUrls;
  
      // imagesToDelete.forEach((path) => deleteFile(path));
      product.imageUrls = newImagePaths;
    } else if (updateDto.mode === UpdateMode.ADD) {
      product.imageUrls = [...product.imageUrls, ...newImagePaths];
    }
    return this.productRepository.save(product);
    }
  }
