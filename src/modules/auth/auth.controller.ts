import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { UserLoginDto } from "./dto";
import { AuthUserResponse } from "./response";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({ description: "Register" })
    @ApiResponse({ status: 200, type: AuthUserResponse })
    @Post("register")
    async register(@Body() dto: CreateUserDto): Promise<AuthUserResponse> {
        return await this.authService.registerUser(dto);
    }

    @ApiOperation({ description: "Login" })
    @ApiResponse({ status: 200, type: AuthUserResponse })
    @Post("login")
    async login(@Body() dto: UserLoginDto): Promise<AuthUserResponse> {
        return await this.authService.loginUser(dto);
    }
}
