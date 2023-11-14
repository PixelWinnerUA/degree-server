import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Length } from "class-validator";
import { ValidationError } from "../../../common/constants/errors.constants";

export class CreateShelfDto {
    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    storageId: number;

    @ApiProperty({ example: "Shelf 1" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @Length(1, 32, { message: ValidationError.INVALID_NAME_LENGTH })
    name: string;

    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    length: number;

    @ApiProperty({ example: "2" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    width: number;

    @ApiProperty({ example: "3" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    height: number;

    @ApiProperty({ example: "4" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    maxWeight: number;
}

export class UpdateShelfDto {
    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;

    @ApiProperty({ example: "Shelf 1" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @Length(1, 32, { message: ValidationError.INVALID_NAME_LENGTH })
    name: string;
}

export class DeleteShelfDto {
    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;
}
