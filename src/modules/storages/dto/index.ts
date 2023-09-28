import { ApiProperty } from "@nestjs/swagger";

import { IsString } from "class-validator";
import { ValidationError } from "../../../common/constants/errors.constants";

export class CreateStorageDto {
    @ApiProperty({ example: "Storage 1" })
    @IsString({ message: ValidationError.MUST_BE_STRING })
    name: string;
}
