import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { ShipmentsService } from "./shipments.service";
import { CreateShipmentDto, GetShipmentsDto } from "./dto";
import { Shipment } from "./models/shipments.model";
import { ResponseMessages } from "../../common/constants/messages.constants";

@ApiBearerAuth()
@ApiTags("Shipments")
@Controller("shipments")
@UseGuards(JwtAuthGuard)
export class ShipmentsController {
    constructor(private readonly shipmentService: ShipmentsService) {
    }

    @ApiOperation({ description: "Create shipment" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_SHIPMENT_CREATE })
    @Post()
    create(@Body() dto: CreateShipmentDto): Promise<SuccessMessageResponse> {
        return this.shipmentService.create(dto);
    }

    @ApiOperation({ description: "Get all shipments" })
    @ApiResponse({ status: 200, type: [Shipment] })
    @Get()
    getAll(@Query() query: GetShipmentsDto): Promise<Shipment[]> {
        return this.shipmentService.getAll(query);
    }

    @ApiOperation({ description: "Delete shipment" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_SHIPMENT_DELETE })
    @Delete("id")
    delete(@Param("id", ParseIntPipe) id: number): Promise<SuccessMessageResponse> {
        return this.shipmentService.delete(id);
    }
}