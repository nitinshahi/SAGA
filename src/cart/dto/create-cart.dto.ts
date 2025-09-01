import { IsNumber } from "class-validator";
import { IsInt } from "class-validator/types/decorator/typechecker/IsInt";

export class CreateCartDto {
    @IsNumber()
    productId: number;
}
