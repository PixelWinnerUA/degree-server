import { Body, Controller, Patch, Req, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../../guards/jwt-guard";
import { UpdateUserDto } from "./dto";
import { Request } from "../../common/interfaces/common.interfaces";

@Controller("users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @UseGuards(JwtAuthGuard)
    @Patch()
    async update(@Body() dto: UpdateUserDto, @Req() request: Request): Promise<string> {
        return await this.usersService.updateUserName(request.user.id, dto);
    }
}
