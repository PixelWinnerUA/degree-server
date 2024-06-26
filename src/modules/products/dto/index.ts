import { IsArray, IsDate, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import { ValidationError } from "../../../common/constants/errors.constants";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { CreateSupplierDto } from "../../suppliers/dto";

export class DynamicField {
    @ApiProperty({ example: "Label" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    label: string;

    @ApiProperty({ example: "Value" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    value: string;
}

export class ArchiveRecord {
    @ApiProperty({ example: "Reason" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    reason: string;

    @ApiProperty({ example: 100 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    amount: number;

    @ApiProperty({ example: new Date() })
    @Type(() => Date)
    @IsDate({ message: ValidationError.MUST_BE_DATE })
    date: Date;
}

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

    @ApiProperty({ example: [{ label: "Label", value: "Value" }] })
    @IsArray({ message: ValidationError.MUST_BE_ARRAY })
    @ValidateNested({ each: true })
    @Type(() => DynamicField)
    properties: DynamicField[];

    @ApiProperty({ type: CreateSupplierDto })
    @IsObject({ message: ValidationError.MUST_BE_OBJECT })
    @Type(() => CreateSupplierDto)
    supplier: CreateSupplierDto;
}

export class UpdateProductDto {
    @ApiProperty({ example: 1 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;

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
    @IsArray({ message: ValidationError.MUST_BE_ARRAY })
    @ValidateNested({ each: true })
    @Type(() => DynamicField)
    properties: DynamicField[];
}

export class DeleteProductDto {
    @ApiProperty({ example: 1 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;
}

export class GetAllProductsDto {
    @ApiProperty({ example: 1 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    @Type(() => Number)
    shelfId: number;

    @ApiProperty({ example: 2 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    @Type(() => Number)
    page: number;

    @ApiProperty({ example: 3 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    @Type(() => Number)
    limit: number;

    @ApiProperty({ example: "Sample Product", required: false })
    @IsOptional()
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @Type(() => String)
    name?: string;
}

export class SearchProductsDto {
    @ApiProperty({ example: "Product" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @Type(() => String)
    name: string;
}

export class AddArchiveRecordDto extends ArchiveRecord {
    @ApiProperty({ example: 1 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    productId: number;
}

export class GetArchivedProductsDto {
    @ApiProperty({ example: 2 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    @Type(() => Number)
    page: number;

    @ApiProperty({ example: 3 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    @Type(() => Number)
    limit: number;

    @ApiProperty({ example: "Sample Product", required: false })
    @IsOptional()
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @Type(() => String)
    name?: string;
}

export class DeleteArchivedRecordDto extends ArchiveRecord {
    @ApiProperty({ example: 1 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    productId: number;
}
