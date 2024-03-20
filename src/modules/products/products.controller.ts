import { Body, Controller, Delete, Get, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import {
    AddArchiveRecordDto,
    CreateProductDto,
    DeleteArchivedRecordDto,
    DeleteProductDto,
    GetAllProductsDto,
    GetArchivedProductsDto,
    SearchProductsDto,
    UpdateProductDto
} from "./dto";
import { Request, SuccessMessageResponse } from "../../common/interfaces/common.interfaces";
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
    getAll(@Query() query: GetAllProductsDto): Promise<GetAllProductsResponse> {
        return this.productsService.getAll(query);
    }

    @ApiOperation({ description: "Add product" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_PRODUCT_CREATE })
    @Post()
    create(@Body() dto: CreateProductDto): Promise<SuccessMessageResponse> {
        return this.productsService.create(dto);
    }

    @UseGuards(ProductsGuard)
    @ApiOperation({ description: "Update product" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_PRODUCT_UPDATE })
    @Put()
    update(@Body() dto: UpdateProductDto): Promise<SuccessMessageResponse> {
        return this.productsService.update(dto);
    }

    @UseGuards(ProductsGuard)
    @ApiOperation({ description: "Delete product" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_PRODUCT_DELETE })
    @Delete()
    delete(@Body() dto: DeleteProductDto): Promise<SuccessMessageResponse> {
        return this.productsService.delete(dto);
    }

    @ApiOperation({ description: "Search product" })
    @ApiResponse({ status: 200, type: [ExtendedSearchProduct] })
    @Get("search")
    searchByName(@Query() query: SearchProductsDto): Promise<ExtendedSearchProduct[]> {
        return this.productsService.searchByName(query.name);
    }

    @ApiOperation({ description: "Archive product" })
    @ApiResponse({ status: 200, description: ResponseMessages.SUCCESS_ARCHIVE })
    @Post("archive")
    archive(@Body() dto: AddArchiveRecordDto): Promise<SuccessMessageResponse> {
        return this.productsService.archive(dto);
    }

    @ApiOperation({ description: "Get all archived products" })
    @ApiResponse({ status: 200, type: GetAllProductsResponse })
    @Get("archive")
    getArchived(@Query() query: GetArchivedProductsDto, @Req() request: Request): Promise<GetAllProductsResponse> {
        return this.productsService.getArchived(query, request.user.id);
    }

    @ApiOperation({ description: "Delete archive record" })
    @ApiResponse({ status: 200, type: ResponseMessages.SUCCESS_UNARCHIVE })
    @Delete("archive")
    deleteArchiveRecord(@Body() body: DeleteArchivedRecordDto): Promise<SuccessMessageResponse> {
        return this.productsService.deleteArchiveRecord(body);
    }
}
