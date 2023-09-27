import { IsEmail, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ValidationError } from "../../../common/constants/errors.constants";

export class AuthUserResponse {
    @ApiProperty({ example: "Alex" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    name: string;

    @ApiProperty({ example: "email@example.com" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    @IsEmail({}, { message: ValidationError.INVALID_EMAIL })
    email: string;

    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5..." })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    token: string;
}
