import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateProductDto {

    @IsString()
    name: string;

    @IsString()
    description: string;
    
    @IsNumber()
    price: number;

    @IsString()
    sku: string;

    @IsNumber()
    @IsOptional()
    stockQuantity: number;

    reorderThreshold: number;

    isActive: boolean;

    @IsOptional()
    category_id?: number;

}