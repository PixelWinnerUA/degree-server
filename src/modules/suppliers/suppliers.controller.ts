import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { SuppliersService } from "./suppliers.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { CreateSupplyDto, GetStatisticsDto } from "./dto";
import { Request, SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { ResponseMessages } from "../../common/constants/messages.constants";

@ApiBearerAuth()
@ApiTags("Suppliers")
@Controller("suppliers")
@UseGuards(JwtAuthGuard)
export class SuppliersController {
    constructor(private readonly suppliersService: SuppliersService) {}

    @ApiOperation({ description: "Create Supply" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_SUPPLY_CREATE })
    @Post()
    createSupply(@Body() dto: CreateSupplyDto, @Req() request: Request): Promise<SuccessMessageResponse> {
        return this.suppliersService.createSupply(dto, request.user.id);
    }

    @Get("statistics")
    getStatistics(@Query() query: GetStatisticsDto) {
        return this.suppliersService.getStatistics(query);
    }
}
