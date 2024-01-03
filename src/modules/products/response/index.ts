import { Product } from "../models/products.model";
import { ApiProperty } from "@nestjs/swagger";
import { DynamicField } from "../dto";

export class GetAllProductsResponse {
    @ApiProperty({ example: 25 })
    totalProducts: number;

    @ApiProperty({ example: 5 })
    totalPages: number;

    @ApiProperty({ type: [Product] })
    products: Product[];
}

export class ExtendedSearchProduct {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: "Product №1" })
    name: string;

    @ApiProperty({ example: "13" })
    amount: number;

    @ApiProperty({ example: "10" })
    pricePerUnit: number;

    @ApiProperty({ example: "1" })
    weightPerUnit: number;

    @ApiProperty({ example: "1.1" })
    length: number;

    @ApiProperty({ example: "1.1" })
    width: number;

    @ApiProperty({ example: "1.1" })
    height: number;

    @ApiProperty({ example: { model: "New model" } })
    properties: DynamicField[];

    @ApiProperty({ example: 2 })
    shelfId: number;

    @ApiProperty({ example: "Shelf" })
    shelfName: string;

    @ApiProperty({ example: 1 })
    storageId: number;

    @ApiProperty({ example: "Storage" })
    storageName: string;
}
