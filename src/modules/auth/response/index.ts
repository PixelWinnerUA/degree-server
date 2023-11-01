import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { ValidationError } from "../../../common/constants/errors.constants";

export class AuthUserResponse {
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5..." })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    token: string;
}
