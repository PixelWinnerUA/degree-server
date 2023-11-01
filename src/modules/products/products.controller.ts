import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CreateProductDto } from "./dto";
import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { JwtAuthGuard } from "../../guards/jwt.guard";

@ApiBearerAuth()
@ApiTags("Products")
@Controller("products")
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @UseGuards(JwtAuthGuard)
    @Get(":shelfId")
    async getAll(@Param("shelfId", ParseIntPipe) id: number) {
        return await this.productsService.getAll(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async addProduct(@Body() dto: CreateProductDto): Promise<SuccessMessageResponse> {
        return await this.productsService.create(dto);
    }
}
