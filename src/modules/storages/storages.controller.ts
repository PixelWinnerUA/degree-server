import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { StoragesService } from "./storages.service";

import { AddUserToStorageDto, CreateStorageDto, DeleteStorageDto, DeleteUserFromStorageDto, UpdateStorageDto } from "./dto";
import { Request, SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetStorageInfoResponse, GetStorageShelfListResponse } from "./response";
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { StoragesGuard } from "../../guards/storages.guard";
import { Storage } from "./models/storages.model";

@ApiBearerAuth()
@ApiTags("Storages")
@Controller("storages")
@UseGuards(JwtAuthGuard)
export class StoragesController {
    constructor(private readonly storagesService: StoragesService) {}

    @ApiOperation({ description: "Create storage" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_STORAGE_CREATE })
    @Post()
    create(@Body() dto: CreateStorageDto, @Req() request: Request): Promise<SuccessMessageResponse> {
        return this.storagesService.create(dto, request.user.id);
    }

    @ApiOperation({ description: "Get storages" })
    @ApiResponse({ status: 200, type: [Storage] })
    @Get()
    getAll(@Req() request: Request): Promise<Storage[]> {
        return this.storagesService.getStoragesByUserId(request.user.id);
    }

    @ApiOperation({ description: "Get storages and shelf list for table" })
    @ApiResponse({ status: 200, type: [GetStorageShelfListResponse] })
    @Get("list")
    getStorageShelfList(@Req() request: Request): Promise<GetStorageShelfListResponse[]> {
        return this.storagesService.getStorageShelfList(request.user.id);
    }

    @ApiOperation({ description: "Storage name update" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_STORAGE_NAME_UPDATE })
    @UseGuards(StoragesGuard)
    @Patch()
    update(@Body() dto: UpdateStorageDto): Promise<SuccessMessageResponse> {
        return this.storagesService.update(dto);
    }

    @ApiOperation({ description: "Delete storage" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_STORAGE_DELETE })
    @UseGuards(StoragesGuard)
    @Delete()
    delete(@Body() dto: DeleteStorageDto): Promise<SuccessMessageResponse> {
        return this.storagesService.delete(dto);
    }

    @ApiOperation({ description: "Get storage info by Id" })
    @ApiResponse({ status: 200, type: GetStorageInfoResponse })
    @UseGuards(StoragesGuard)
    @Get(":id")
    getStorageInfo(@Param("id", ParseIntPipe) id: number): Promise<GetStorageInfoResponse> {
        return this.storagesService.getStorageInfo(id);
    }

    @ApiOperation({ description: "Delete a user from the storage" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_USER_DELETE_FROM_STORAGE })
    @UseGuards(StoragesGuard)
    @Delete("deleteUser")
    deleteUserFromStorage(@Body() dto: DeleteUserFromStorageDto, @Req() request: Request): Promise<SuccessMessageResponse> {
        return this.storagesService.deleteUserFromStorage(dto, request.user.id);
    }

    @ApiOperation({ description: "Add new user to the storage" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_USER_ADD })
    @UseGuards(StoragesGuard)
    @Post("addUser")
    addUserToStorage(@Body() dto: AddUserToStorageDto, @Req() request: Request): Promise<SuccessMessageResponse> {
        return this.storagesService.addUserToStorage(dto, request.user.id);
    }
}
