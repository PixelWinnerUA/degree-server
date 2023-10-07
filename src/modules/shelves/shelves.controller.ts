import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ShelvesService } from "./shelves.service";
import { JwtAuthGuard } from "../../guards/jwt-guard";
import { CreateProductDto } from "../products/dto";
import { ResponseMessages } from "../../common/constants/messages.constants";

@Controller("shelves")
export class ShelvesController {
    constructor(private readonly shelvesService: ShelvesService) {}

    //TODO SWAGGER DESCRIPTION
    @UseGuards(JwtAuthGuard)
    @Post()
    async addProduct(@Body() dto: CreateProductDto): Promise<typeof ResponseMessages.SUCCESS_PRODUCT_CREATE> {
        return await this.shelvesService.addProduct(dto);
    }
}
