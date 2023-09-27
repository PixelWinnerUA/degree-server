import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as process from "process";

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    async generateJwt(id: number) {
        return this.jwtService.sign(
            { id },
            {
                secret: process.env.JWT_SECERT,
                expiresIn: process.env.JWT_EXPIRE
            }
        );
    }
}
