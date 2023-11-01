import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { StoragesService } from "./storages.service";

import { AddUserToStorageDto, CreateStorageDto, DeleteStorageDto, DeleteUserFromStorageDto, UpdateStorageDto } from "./dto";
import { Request, SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetStorageInfoResponse, GetStorageResponse } from "./response";
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { StoragesGuard } from "../../guards/storages.guard";

@ApiBearerAuth()
@ApiTags("Storages")
@Controller("storages")
@UseGuards(JwtAuthGuard)
export class StoragesController {
    constructor(private readonly storagesService: StoragesService) {}

    @ApiOperation({ description: "Create storage" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_STORAGE_CREATE })
    @Post()
    async create(@Body() dto: CreateStorageDto, @Req() request: Request): Promise<SuccessMessageResponse> {
        return await this.storagesService.create(dto, request.user.id);
    }

    @ApiOperation({ description: "Get storages" })
    @ApiResponse({ status: 200, type: [GetStorageResponse] })
    @Get()
    async getAll(@Req() request: Request): Promise<GetStorageResponse[]> {
        return await this.storagesService.getStoragesByUserId(request.user.id);
    }

    @ApiOperation({ description: "Storage name update" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_STORAGE_NAME_UPDATE })
    @UseGuards(StoragesGuard)
    @Patch()
    async update(@Body() dto: UpdateStorageDto): Promise<SuccessMessageResponse> {
        return await this.storagesService.update(dto);
    }

    @ApiOperation({ description: "Delete storage" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_STORAGE_DELETE })
    @UseGuards(StoragesGuard)
    @Delete()
    async delete(@Body() dto: DeleteStorageDto): Promise<SuccessMessageResponse> {
        return await this.storagesService.delete(dto);
    }

    @ApiOperation({ description: "Get storage info by Id" })
    @ApiResponse({ status: 200, type: GetStorageInfoResponse })
    @UseGuards(StoragesGuard)
    @Get(":id")
    async getStorageInfo(@Param("id", ParseIntPipe) id: number): Promise<GetStorageInfoResponse> {
        return await this.storagesService.getStorageInfo(id);
    }

    @ApiOperation({ description: "Delete a user from the storage" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_USER_DELETE_FROM_STORAGE })
    @UseGuards(StoragesGuard)
    @Delete("deleteUser")
    async deleteUserFromStorage(@Body() dto: DeleteUserFromStorageDto, @Req() request: Request): Promise<SuccessMessageResponse> {
        return await this.storagesService.deleteUserFromStorage(dto, request.user.id);
    }

    @ApiOperation({ description: "Add new user to the storage" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_USER_ADD })
    @UseGuards(StoragesGuard)
    @Post("addUser")
    async addUserToStorage(@Body() dto: AddUserToStorageDto, @Req() request: Request): Promise<SuccessMessageResponse> {
        return await this.storagesService.addUserToStorage(dto, request.user.id);
    }
}
