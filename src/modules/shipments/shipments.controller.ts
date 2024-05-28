import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { ShipmentsService } from "./shipments.service";
import { CreateShipmentDto, GetShipmentsDto } from "./dto";
import { GetAllShipmentProductsResponse } from "./response";

@ApiBearerAuth()
@ApiTags("Shipments")
@Controller("shipments")
@UseGuards(JwtAuthGuard)
export class ShipmentsController {
    constructor(private readonly shipmentService: ShipmentsService) {
    }
//todo swagger
    @Post()
    create(@Body() dto: CreateShipmentDto): Promise<SuccessMessageResponse> {
        return this.shipmentService.create(dto);
    }

    @Get()
    getAllShipmentProducts(@Query() query: GetShipmentsDto): Promise<GetAllShipmentProductsResponse> {
        return this.shipmentService.getAllShipmentProducts(query);
    }

    @Delete("id")
    delete(@Param("id", ParseIntPipe) id: number): Promise<SuccessMessageResponse> {
        return this.shipmentService.delete(id);
    }
}