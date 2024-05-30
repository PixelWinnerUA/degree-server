import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNumber, IsPhoneNumber, IsString, Min, ValidateNested } from "class-validator";
import { ValidationError } from "../../../common/constants/errors.constants";
import { Type } from "class-transformer";

class ProductShipmentDto {
    @ApiProperty({ example: 1 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    @Min(1)
    productId: number;

    @ApiProperty({ example: 10 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    @Min(1)
    amount: number;
}

export class CreateShipmentDto {
    @ApiProperty({ example: "Name" })
    @IsString()
    name: string;

    @ApiProperty({ example: "Surname" })
    @IsString()
    surname: string;

    @ApiProperty({ example: "Patronymic" })
    @IsString()
    patronymic: string;

    @ApiProperty({ example: "Address 1" })
    @IsString()
    address: string;

    @ApiProperty({ example: "email@example.com" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @IsEmail({}, { message: ValidationError.INVALID_EMAIL })
    email: string;

    @ApiProperty({ example: "Phone number" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @IsPhoneNumber("UA")
    phoneNumber: string;

    @ApiProperty({ type: [ProductShipmentDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductShipmentDto)
    products: ProductShipmentDto[];
}

export class DeleteShipmentDto {
    @ApiProperty({ example: 1 })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;
}

export class GetShipmentsDto {
    @ApiProperty({ example: "String Date" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    startDate: string;

    @ApiProperty({ example: "String Date" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    endDate: string;
}
