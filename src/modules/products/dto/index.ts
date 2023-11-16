import { ProductProperties } from "../../../common/interfaces/common.interfaces";
import { IsNumber, IsObject, IsString } from "class-validator";
import { ValidationError } from "../../../common/constants/errors.constants";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDto {
    @ApiProperty({ example: 1 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    shelfId: number;

    @ApiProperty({ example: "Product №1" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    name: string;

    @ApiProperty({ example: 100 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    amount: number;

    @ApiProperty({ example: 20 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    pricePerUnit: number;

    @ApiProperty({ example: 10 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    weightPerUnit: number;

    @ApiProperty({ example: 2 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    length: number;

    @ApiProperty({ example: 2 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    width: number;

    @ApiProperty({ example: 2 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    height: number;

    @ApiProperty({ example: { weight: "1 kg" } })
    @IsObject({ message: ValidationError.MUST_BE_OBJECT })
    properties: ProductProperties;
}

export class UpdateProductDto extends CreateProductDto {
    @ApiProperty({ example: 1 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;
}

export class DeleteProductDto {
    @ApiProperty({ example: 1 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;
}
