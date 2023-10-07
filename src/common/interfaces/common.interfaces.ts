import { Request as ExpressRequest } from "express";

export interface Request extends ExpressRequest {
    user: { id: number };
}

export interface ProductProperties {
    [key: string]: string;
}
