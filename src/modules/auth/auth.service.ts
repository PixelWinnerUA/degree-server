import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";

import { UsersService } from "../users/users.service";
import { CreateUserDto } from "../users/dto";
import { RecoverPasswordDto, ResetPasswordDto, UserLoginDto } from "./dto";
import { compare } from "bcrypt";
import { TokenService } from "../token/token.service";
import { AppError } from "../../common/constants/errors.constants";
import { AuthUserResponse } from "./response";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";
import { MailerService } from "@nestjs-modules/mailer";
import { v4 as uuidv4 } from "uuid";
import { getResponseMessageObject } from "../../common/helpers/getResponseMessageObject";
import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { ResponseMessages } from "../../common/constants/messages.constants";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly tokenService: TokenService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly mailerService: MailerService
    ) {
    }

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

    async sendRecoveryCode(dto: RecoverPasswordDto): Promise<SuccessMessageResponse> {
        const existUser = await this.userService.findByEmail(dto.email);

        if (!existUser) {
            throw new BadRequestException(AppError.USER_NOT_EXIST);
        }

        const recoveryCode = uuidv4();
        const key = `recovery:${dto.email}`;

        await this.cacheManager.set(key, recoveryCode);

        await this.mailerService.sendMail({
            to: dto.email,
            subject: "Відновлення паролю",
            text: `Ваш код відновлення: ${recoveryCode}`
        });

        return getResponseMessageObject(ResponseMessages.RECOVERY_CODE_SEND);
    }

    async resetPassword(dto: ResetPasswordDto): Promise<SuccessMessageResponse> {
        const existUser = await this.userService.findByEmail(dto.email);

        if (!existUser) {
            throw new BadRequestException(AppError.USER_NOT_EXIST);
        }

        const key = `recovery:${dto.email}`;
        const storedCode = await this.cacheManager.get<string>(key);

        if (!storedCode || storedCode !== dto.recoveryCode) {
            throw new BadRequestException(AppError.INVALID_RECOVERY_CODE);
        }

        existUser.password = await this.userService.hashPassword(dto.newPassword);

        await existUser.save();

        await this.cacheManager.del(key);

        return getResponseMessageObject(ResponseMessages.SUCCESS_PASSWORD_CHANGE);
    }
}
