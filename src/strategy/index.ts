import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as process from "process";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../modules/users/users.service";
import { IJwtToken } from "../common/interfaces/common.interfaces";
import { AppError } from "../common/constants/errors.constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(payload: IJwtToken) {
        const user = await this.usersService.findById(payload.id);

        if (!user) {
            throw new UnauthorizedException(AppError.USER_NOT_EXIST);
        }

        return payload;
    }
}
