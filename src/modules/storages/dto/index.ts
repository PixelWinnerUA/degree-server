import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";
import { ValidationError } from "../../../common/constants/errors.constants";

export class CreateStorageDto {
    @ApiProperty({ example: "Storage 1" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    name: string;
}

export class UpdateStorageDto {
    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;

    @ApiProperty({ example: "Storage 1" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    name: string;
}

export class DeleteStorageDto {
    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;
}