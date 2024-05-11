import { Body, Controller, Get, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";

import { UpdateUserDto } from "./dto";
import { Request, SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { ResponseMessages } from "../../common/constants/messages.constants";
import { GetPublicUserResponse } from "./response";
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { ChangePasswordDto } from "../auth/dto";

@ApiBearerAuth()
@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ description: "User name update" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_USER_NAME_UPDATE })
    @Patch()
    update(@Body() dto: UpdateUserDto, @Req() request: Request): Promise<SuccessMessageResponse> {
        return this.usersService.updateUserName(dto, request.user.id);
    }

    @ApiOperation({ description: "Get user data" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_USER_NAME_UPDATE })
    @Get()
    get(@Req() request: Request): Promise<GetPublicUserResponse> {
        return this.usersService.getPublicUser(request.user.id);
    }

    @ApiOperation({ description: "Change password" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_PASSWORD_CHANGE })
    @Post("changePassword")
    changePassword(@Body() dto: ChangePasswordDto, @Req() request: Request): Promise<SuccessMessageResponse> {
        return this.usersService.changePassword(dto, request.user.id);
    }
}
