import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsPhoneNumber, IsString, ValidateNested } from "class-validator";
import { ValidationError } from "../../../common/constants/errors.constants";
import { Product } from "../../products/models/products.model";
import { Type } from "class-transformer";

export class CreateSupplierDto {
    @ApiProperty({ example: "TIN" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    TIN: string;

    @ApiProperty({ example: "USREOU" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    USREOU: string;

    @ApiProperty({ example: "email@example.com" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @IsEmail({}, { message: ValidationError.INVALID_EMAIL })
    email: string;

    @ApiProperty({ example: "Company name" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    fullCompanyName: string;

    @ApiProperty({ example: "Legal address" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    legalAddress: string;

    @ApiProperty({ example: "Phone number" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @IsPhoneNumber("UA")
    phoneNumber: string;
}

export class CreateSupplyDto extends CreateSupplierDto {
    @ApiProperty({ type: [Product] })
    @IsArray({ message: ValidationError.MUST_BE_ARRAY })
    @ValidateNested({ each: true })
    @Type(() => Product)
    products: Product[];
}
