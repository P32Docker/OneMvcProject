import type { ITransportation } from "./ITransportation";

export interface ICart extends ITransportation {
    quantity: number;
}