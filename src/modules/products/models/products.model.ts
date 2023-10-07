import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Shelf } from "../../shelves/models/shelves.model";
import { ApiProperty } from "@nestjs/swagger";
import { ProductProperties } from "../../../common/interfaces/common.interfaces";

interface ProductCreationAttrs {
    shelfId: number;
    name: string;
    properties: ProductProperties;
}

@Table({ tableName: "product" })
export class Product extends Model<Product, ProductCreationAttrs> {
    @ApiProperty({ example: 1 })
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @ApiProperty({ example: "Product №1" })
    @Column({ type: DataType.STRING, allowNull: false })
    name: string;

    @ApiProperty({ example: { weight: "1 kg" } })
    @Column({ type: DataType.JSONB, allowNull: true })
    properties: ProductProperties;

    @ApiProperty({ example: 2 })
    @ForeignKey(() => Shelf)
    @Column({ type: DataType.INTEGER, allowNull: false })
    shelfId: number;

    @BelongsTo(() => Shelf)
    shelf: Shelf;
}
