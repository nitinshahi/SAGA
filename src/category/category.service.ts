import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Equal } from 'typeorm';

@Injectable()
export class CategoryService {
  
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  
  async create(createCategoryDto: CreateCategoryDto){
    let { parentId, ...categoryData } = createCategoryDto;
    if(parentId){
      const parentCategory = await this.categoryRepository.findOne({ where: { id: Number(parentId) } });
      if (!parentCategory) {
        throw new NotFoundException('Parent category not found');
      }
      parentId = parentCategory.id;
    }

    const category = this.categoryRepository.create({
      ...categoryData,
      parentId,
    });

    return this.categoryRepository.save(category);
  }

  findAll() {
    return this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    return category;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryRepository.update(id, updateCategoryDto).then(result => {
      if (result.affected === 0) {
        throw new NotFoundException(`Category with id ${id} not found`);
      }
      return this.findOne(id);
    });
  }

  async remove(id: number) {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      return { message: `Category with id ${id} not found` };
    }
    return { message: `Category with id ${id} removed successfully` };
  }
}
