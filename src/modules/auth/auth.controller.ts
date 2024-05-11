import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../users/dto";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RecoverPasswordDto, ResetPasswordDto, UserLoginDto } from "./dto";
import { AuthUserResponse } from "./response";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @ApiOperation({ description: "Register" })
    @ApiResponse({ status: 200, type: AuthUserResponse })
    @Post("register")
    register(@Body() dto: CreateUserDto): Promise<AuthUserResponse> {
        return this.authService.registerUser(dto);
    }

    @ApiOperation({ description: "Login" })
    @ApiResponse({ status: 200, type: AuthUserResponse })
    @Post("login")
    login(@Body() dto: UserLoginDto): Promise<AuthUserResponse> {
        return this.authService.loginUser(dto);
    }

    @ApiOperation({ description: "Send recovery code" })
    @ApiResponse({ status: 200, description: ResponseMessages.RECOVERY_CODE_SEND })
    @Post("recovery")
    sendRecoveryCode(@Body() dto: RecoverPasswordDto): Promise<SuccessMessageResponse> {
        return this.authService.sendRecoveryCode(dto);
    }
    @ApiOperation({ description: "Reset password" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_ARCHIVE })
    @Post("reset")
    resetPassword(@Body() dto: ResetPasswordDto): Promise<SuccessMessageResponse> {
        return this.authService.resetPassword(dto);
    }
}
