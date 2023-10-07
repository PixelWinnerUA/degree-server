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

    @ApiProperty({ example: { weight: "1 kg" } })
    @IsObject({ message: ValidationError.MUST_BE_OBJECT })
    properties: ProductProperties;
}
