import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { Express } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { multerOptions } from 'src/multer.config';
import { UpdateProductImagesDto } from './dto/update-product-images.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `img-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
  ) {
    const imagePaths = files?.images?.map((file) => `/uploads/${file.filename}`) || [];
    return this.productService.create(createProductDto, imagePaths);
  }

  @Post(':id/images')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 5 }], multerOptions))
  async uploadImages(
    @Param('id', new ParseIntPipe()) productId: number,
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @Body() updateDto: UpdateProductImagesDto,
  ) {
    if(!files || files?.images?.length === 0) {
      throw new BadRequestException({ message: 'No images uploaded' });
    }
    const imagePaths = files?.images?.map((file) => `/uploads/${file.filename}`) || [];
    return this.productService.updateProductImages(productId, updateDto, imagePaths);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.productService.remove(+id);
  }
}
