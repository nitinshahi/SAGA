import { IsArray, IsEnum, IsOptional } from "class-validator";
export enum UpdateMode {
    ADD = 'add',
    REPLACE = 'replace',
    REMOVE = 'remove',
}
export class UpdateProductImagesDto {

    @IsEnum(UpdateMode)
    mode: UpdateMode;
 
    @IsOptional()
    @IsArray()
    existingImagesToKeep?: string[];
}