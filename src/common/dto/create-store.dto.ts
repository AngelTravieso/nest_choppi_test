import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStoreDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    address?: string;
}