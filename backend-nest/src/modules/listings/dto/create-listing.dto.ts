import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateListingDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  images?: string[];

  @IsOptional()
  @IsString()
  contactName?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;
}
