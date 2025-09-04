import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {

    @IsString()
    name: string;

    @IsString()
    description: string;
    
    @IsNumber()
    @IsOptional()
    price: number;

    @IsString()
    sku: string;

    @IsNumber()
    @IsOptional()
    stockQuantity: number;

    @IsOptional()
    @IsArray()
    images: string[];

    @IsNumber()
    @IsOptional()
    reorderThreshold: number;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;

    @IsOptional()
    category_id?: number;

}