import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Req, UseGuards } from "@nestjs/common";
import { StoragesService } from "./storages.service";
import { JwtAuthGuard } from "../../guards/jwt-guard";
import { CreateStorageDto, DeleteStorageDto, UpdateStorageDto } from "./dto";
import { Request } from "../../common/interfaces/common.interfaces";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetStoragesResponse } from "./response";
import { CreateShelfDto } from "../shelves/dto";
import { StoragesGuard } from "../../guards/storages-guard";

@ApiTags("Storages")
@Controller("storages")
export class StoragesController {
    constructor(private readonly storagesService: StoragesService) {}

    @ApiOperation({ description: "Create storage" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_STORAGE_CREATE })
    @UseGuards(JwtAuthGuard)
    @Post("create")
    async create(@Body() dto: CreateStorageDto, @Req() request: Request): Promise<typeof ResponseMessages.SUCCESS_STORAGE_CREATE> {
        return await this.storagesService.create(dto, request.user.id);
    }

    @ApiOperation({ description: "Get storages" })
    @ApiResponse({ status: 200, type: [GetStoragesResponse] })
    @UseGuards(JwtAuthGuard)
    @Get()
    async get(@Req() request: Request): Promise<GetStoragesResponse[]> {
        return await this.storagesService.getStoragesByUserId(request.user.id);
    }

    @ApiOperation({ description: "Storage name update" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_STORAGE_NAME_UPDATE })
    @UseGuards(JwtAuthGuard, StoragesGuard)
    @Patch("update")
    async update(@Body() dto: UpdateStorageDto): Promise<typeof ResponseMessages.SUCCESS_STORAGE_NAME_UPDATE> {
        return await this.storagesService.update(dto);
    }

    @ApiOperation({ description: "Delete storage" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_STORAGE_DELETE })
    @UseGuards(JwtAuthGuard, StoragesGuard)
    @Delete("delete")
    async delete(@Body() dto: DeleteStorageDto): Promise<typeof ResponseMessages.SUCCESS_STORAGE_DELETE> {
        return await this.storagesService.delete(dto);
    }

    @ApiOperation({ description: "Add shelf" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_SHELF_CREATE })
    @UseGuards(JwtAuthGuard, StoragesGuard)
    @Put("addShelf")
    async addShelf(@Body() dto: CreateShelfDto): Promise<typeof ResponseMessages.SUCCESS_SHELF_CREATE> {
        return await this.storagesService.addShelf(dto);
    }

    @UseGuards(JwtAuthGuard, StoragesGuard)
    @Get(":id")
    async getShelves(@Param("id", ParseIntPipe) id: number) {
        return await this.storagesService.getShelves(id);
    }
}
