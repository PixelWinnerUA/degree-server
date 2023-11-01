import { IsEmail, IsString, Length } from "class-validator";

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
