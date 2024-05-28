import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "../../products/models/products.model";
import { Shipment } from "../../shipments/models/shipments.model";

interface ShipmentProductCreationAttrs {
    productId: number;
    shipmentId: number;
    amount: number;
}

@Table({ tableName: "shipment_products" })
export class ShipmentProducts extends Model<ShipmentProducts, ShipmentProductCreationAttrs> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @ForeignKey(() => Shipment)
    @Column({ type: DataType.INTEGER, allowNull: false })
    shipmentId: number;

    @ForeignKey(() => Product)
    @Column({ type: DataType.INTEGER, allowNull: false })
    productId: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    amount: number;
}