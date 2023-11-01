import { Body, Controller, Get, Patch, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";

import { UpdateUserDto } from "./dto";
import { Request, SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { ResponseMessages } from "../../common/constants/messages.constants";
import { GetPublicUserResponse } from "./response";
import { JwtAuthGuard } from "../../guards/jwt.guard";

@ApiBearerAuth()
@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ description: "User name update" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_USER_NAME_UPDATE })
    @Patch()
    async update(@Body() dto: UpdateUserDto, @Req() request: Request): Promise<SuccessMessageResponse> {
        return await this.usersService.updateUserName(dto, request.user.id);
    }

    @ApiOperation({ description: "Get user data" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_USER_NAME_UPDATE })
    @Get()
    async get(@Req() request: Request): Promise<GetPublicUserResponse> {
        return await this.usersService.getPublicUser(request.user.id);
    }
}
