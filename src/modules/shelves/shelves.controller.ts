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
    getAll(@Param("storageId", ParseIntPipe) id: number): Promise<Shelf[]> {
        return this.shelvesService.getAll(id);
    }

    @ApiOperation({ description: "Add shelf" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_SHELF_CREATE })
    @UseGuards(ShelvesGuard)
    @Post()
    create(@Body() dto: CreateShelfDto): Promise<SuccessMessageResponse> {
        return this.shelvesService.create(dto);
    }

    @ApiOperation({ description: "Update shelf name" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_SHELF_UPDATE })
    @UseGuards(ShelvesGuard)
    @Patch()
    update(@Body() dto: UpdateShelfDto): Promise<SuccessMessageResponse> {
        return this.shelvesService.update(dto);
    }

    @ApiOperation({ description: "Delete shelf" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_SHELF_DELETE })
    @UseGuards(ShelvesGuard)
    @Delete()
    delete(@Body() dto: DeleteShelfDto): Promise<SuccessMessageResponse> {
        return this.shelvesService.delete(dto);
    }
}
