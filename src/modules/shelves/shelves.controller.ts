import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { ShelvesService } from "./shelves.service";

import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { CreateShelfDto, DeleteShelfDto, UpdateShelfDto } from "./dto";
import { Shelf } from "./models/shelves.model";
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { ShelvesGuard } from "../../guards/shelves.guard";

@ApiBearerAuth()
@ApiTags("Shelves")
@Controller("shelves")
@UseGuards(JwtAuthGuard)
export class ShelvesController {
    constructor(private readonly shelvesService: ShelvesService) {}

    @ApiOperation({ description: "Get all shelves by storage id" })
    @ApiResponse({ status: 200, type: [Shelf] })
    @UseGuards(ShelvesGuard)
    @Get(":storageId")
    async getAll(@Param("storageId", ParseIntPipe) id: number): Promise<Shelf[]> {
        return await this.shelvesService.getAll(id);
    }

    @ApiOperation({ description: "Add shelf" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_SHELF_CREATE })
    @UseGuards(ShelvesGuard)
    @Post()
    async create(@Body() dto: CreateShelfDto): Promise<SuccessMessageResponse> {
        return await this.shelvesService.create(dto);
    }

    @ApiOperation({ description: "Update shelf name" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_SHELF_UPDATE })
    @UseGuards(ShelvesGuard)
    @Patch()
    async update(@Body() dto: UpdateShelfDto): Promise<SuccessMessageResponse> {
        return await this.shelvesService.update(dto);
    }

    @ApiOperation({ description: "Delete shelf" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_SHELF_DELETE })
    @UseGuards(ShelvesGuard)
    @Delete()
    async delete(@Body() dto: DeleteShelfDto): Promise<SuccessMessageResponse> {
        return await this.shelvesService.delete(dto);
    }
}
