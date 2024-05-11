import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { TokenModule } from "../token/token.module";
import { JwtStrategy } from "../../strategy";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
    imports: [UsersModule, TokenModule, MailerModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
