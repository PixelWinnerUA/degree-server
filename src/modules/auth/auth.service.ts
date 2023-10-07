import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto";
import { UserLoginDto } from "./dto";
import { compare } from "bcrypt";
import { TokenService } from "../token/token.service";
import { AuthUserResponse } from "./response";
import { AppError } from "../../common/constants/errors.constants";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly tokenService: TokenService
    ) {}

    async registerUser(dto: CreateUserDto): Promise<AuthUserResponse> {
        const existUser = await this.userService.findByEmail(dto.email);

        if (existUser) {
            throw new BadRequestException(AppError.USER_EXIST);
        }

        const newUser = await this.userService.create(dto);

        if (!newUser) {
            throw new NotFoundException(AppError.USER_CREATION_ERROR);
        }

        const token = await this.tokenService.generateJwt(newUser.id);

        const publicUser = await this.userService.getPublicUser(dto.email);

        const userData = {
            name: publicUser.name,
            email: publicUser.email
        };

        return { ...userData, token };
    }

    async loginUser(dto: UserLoginDto): Promise<AuthUserResponse> {
        const existUser = await this.userService.findByEmail(dto.email);

        if (!existUser) {
            throw new BadRequestException(AppError.USER_NOT_EXIST);
        }

        const isValidPassword = await compare(dto.password, existUser.password);

        if (!isValidPassword) {
            throw new BadRequestException(AppError.WRONG_DATA);
        }

        const userData = {
            name: existUser.name,
            email: existUser.email
        };

        const token = await this.tokenService.generateJwt(existUser.id);

        return {
            ...userData,
            token
        };
    }
}
