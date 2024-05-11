import { IsEmail, IsString, IsUUID, Length } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";
import { ValidationError } from "../../../common/constants/errors.constants";

export class UserLoginDto {
    @ApiProperty({ example: "email@example.com" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @IsEmail({}, { message: ValidationError.INVALID_EMAIL })
    email: string;

    @ApiProperty({ example: "password" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @Length(8, 32, { message: ValidationError.INVALID_PASSWORD_LENGTH })
    password: string;
}

export class ChangePasswordDto {
    @ApiProperty({ example: "oldPassword" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @Length(8, 32, { message: ValidationError.INVALID_PASSWORD_LENGTH })
    oldPassword: string;

    @ApiProperty({ example: "newPassword" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @Length(8, 32, { message: ValidationError.INVALID_PASSWORD_LENGTH })
    newPassword: string;
}

export class RecoverPasswordDto {
    @ApiProperty({ example: "email@example.com" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @IsEmail({}, { message: ValidationError.INVALID_EMAIL })
    email: string;
}

export class ResetPasswordDto {
    @ApiProperty({ example: "email@example.com" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @IsEmail({}, { message: ValidationError.INVALID_EMAIL })
    email: string;

    @ApiProperty({ example: "Recovery code" })
    @IsUUID(4, { message: ValidationError.INVALID_RECOVERY_CODE })
    recoveryCode: string;

    @ApiProperty({ example: "newPassword" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @Length(8, 32, { message: ValidationError.INVALID_PASSWORD_LENGTH })
    newPassword: string;
}