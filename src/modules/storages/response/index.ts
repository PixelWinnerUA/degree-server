import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../users/models/users.model";
import { Storage } from "../models/storages.model";

export class GetStorageInfoResponse {
    @ApiProperty({ example: "Storage info" })
    storage: Storage;

    @ApiProperty({ example: "Storage users" })
    users: User[];
}

class ShelvesListWithLimitedFields {
    @ApiProperty({ example: "1" })
    id: number;

    @ApiProperty({ example: "Shelf 1" })
    name: string;
}

export class GetStorageShelfListResponse {
    @ApiProperty({ example: "1" })
    id: number;

    @ApiProperty({ example: "Storage 1" })
    name: string;

    shelves: ShelvesListWithLimitedFields[];
}
