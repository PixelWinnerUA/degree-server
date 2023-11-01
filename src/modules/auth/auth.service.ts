import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto";
import { UserLoginDto } from "./dto";
import { compare } from "bcrypt";
import { TokenService } from "../token/token.service";
import { AppError } from "../../common/constants/errors.constants";
import { AuthUserResponse } from "./response";

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

        return { token };
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

        const token = await this.tokenService.generateJwt(existUser.id);

        return { token };
    }
}
