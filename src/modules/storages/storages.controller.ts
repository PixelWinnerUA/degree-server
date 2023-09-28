import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { StoragesService } from "./storages.service";
import { JwtAuthGuard } from "../../guards/jwt-guard";
import { CreateStorageDto } from "./dto";
import { Request } from "../../common/interfaces/common.interfaces";

@Controller("storages")
export class StoragesController {
    constructor(private readonly storagesService: StoragesService) {}

    @UseGuards(JwtAuthGuard)
    @Post("create")
    async create(@Body() dto: CreateStorageDto, @Req() request: Request) {
        return await this.storagesService.create(dto, request.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async get(@Req() request: Request) {
        return await this.storagesService.getStoragesByUserId(request.user.id);
    }
}
