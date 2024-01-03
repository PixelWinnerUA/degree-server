import { Body, Controller, Delete, Get, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateProductDto, DeleteProductDto, GetAllProductsDto, SearchProductsDto, UpdateProductDto } from "./dto";
import { SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
import { JwtAuthGuard } from "../../guards/jwt.guard";
import { ExtendedSearchProduct, GetAllProductsResponse } from "./response";
import { ResponseMessages } from "../../common/constants/messages.constants";
import { ProductsGuard } from "../../guards/products.guard";

@ApiBearerAuth()
@ApiTags("Products")
@Controller("products")
@UseGuards(JwtAuthGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @ApiOperation({ description: "Get all products" })
    @ApiResponse({ status: 200, type: GetAllProductsResponse })
    @Get()
    async getAll(@Query() query: GetAllProductsDto): Promise<GetAllProductsResponse> {
        return await this.productsService.getAll(query);
    }

    @ApiOperation({ description: "Add product" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_PRODUCT_CREATE })
    @Post()
    async create(@Body() dto: CreateProductDto): Promise<SuccessMessageResponse> {
        return await this.productsService.create(dto);
    }

    @UseGuards(ProductsGuard)
    @ApiOperation({ description: "Update product" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_PRODUCT_UPDATE })
    @Put()
    async update(@Body() dto: UpdateProductDto): Promise<SuccessMessageResponse> {
        return await this.productsService.update(dto);
    }

    @UseGuards(ProductsGuard)
    @ApiOperation({ description: "Delete product" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_PRODUCT_DELETE })
    @Delete()
    async delete(@Body() dto: DeleteProductDto): Promise<SuccessMessageResponse> {
        return await this.productsService.delete(dto);
    }

    @ApiOperation({ description: "Search product" })
    @ApiResponse({ status: 200, type: [ExtendedSearchProduct] })
    @Get("search")
    async searchByName(@Query() query: SearchProductsDto): Promise<ExtendedSearchProduct[]> {
        return await this.productsService.searchByName(query.name);
    }
}
