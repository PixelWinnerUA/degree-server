import { Body, Controller, Patch, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../../guards/jwt-guard";
import { UpdateUserDto } from "./dto";
import { Request } from "../../common/interfaces/common.interfaces";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { ResponseMessages } from "../../common/constants/messages.constants";

@ApiTags("Users")
@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ description: "User name update" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_USER_NAME_UPDATE })
    @UseGuards(JwtAuthGuard)
    @Patch("update")
    async update(
        @Body() dto: UpdateUserDto,
        @Req() request: Request
    ): Promise<typeof ResponseMessages.SUCCESS_USER_NAME_UPDATE> {
        return await this.usersService.updateUserName(dto, request.user.id);
    }
}
