import { BelongsTo, BelongsToMany, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "../../users/models/users.model";
import { Storage } from "./storages.model";

interface UserStorageCreationAttrs {
    userId: number;
    storageId: number;
}

@Table({ tableName: "user_storage" })
@BelongsToMany(() => User, () => UserStorage)
@BelongsToMany(() => Storage, () => UserStorage)
export class UserStorage extends Model<UserStorage, UserStorageCreationAttrs> {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    id: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Storage)
    @Column
    storageId: number;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Storage)
    storage: Storage;
}
