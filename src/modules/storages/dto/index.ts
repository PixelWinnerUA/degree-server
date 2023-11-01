import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString, Length } from "class-validator";
import { ValidationError } from "../../../common/constants/errors.constants";

export class CreateStorageDto {
    @ApiProperty({ example: "Storage 1" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @Length(1, 32, { message: ValidationError.INVALID_NAME_LENGTH })
    name: string;

    @ApiProperty({ example: "Address string" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @Length(1, 32, { message: ValidationError.INVALID_ADDRESS_LENGTH })
    address: string;
}

export class UpdateStorageDto {
    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;

    @ApiProperty({ example: "Storage 1" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @Length(1, 32, { message: ValidationError.INVALID_NAME_LENGTH })
    name: string;
}

export class DeleteStorageDto {
    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;
}

export class DeleteUserFromStorageDto {
    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    id: number;

    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    userId: number;
}

export class AddUserToStorageDto {
    @ApiProperty({ example: "1" })
    @IsNumber({}, { message: ValidationError.MUST_BE_NUMBER })
    storageId: number;

    @ApiProperty({ example: "email@example.com" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @IsEmail({}, { message: ValidationError.INVALID_EMAIL })
    email: string;
}
