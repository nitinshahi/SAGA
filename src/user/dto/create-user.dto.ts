import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, isBoolean, IsString, Length, MinLength,} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(8)
    @IsString()
    password: string;

    @IsEnum(UserRole)
    role?: UserRole = UserRole.CUSTOMER; // Optional, default is 'customer'

    @IsString()
    firstName?: string; // Optional

    @IsString()
    lastName?: string; // Optional
    
    @IsString()
    phoneNumber?: string; // Optional
    
    @IsBoolean()
    isActive?: boolean; // Optional, default is true
}

