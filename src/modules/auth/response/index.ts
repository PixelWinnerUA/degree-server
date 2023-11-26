import { ApiProperty } from "@nestjs/swagger";

export class AuthUserResponse {
    @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5..." })
    token: string;
}
