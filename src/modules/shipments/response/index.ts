import { ApiProperty } from "@nestjs/swagger";
import { Product } from "../../products/models/products.model";

export class GetAllShipmentProductsResponse {
    @ApiProperty({ example: 25 })
    totalProducts: number;

    @ApiProperty({ example: 5 })
    totalPages: number;

    @ApiProperty({ type: [Product] })
    products: Product[];
}