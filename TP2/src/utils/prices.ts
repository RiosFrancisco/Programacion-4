import { OrderSize } from "../models/order";

export const calculatePrice = (size: OrderSize, toppings: string[]): number => {
    let basePrice = 0;
    switch (size) {
        case "S":
            basePrice = 10;
            break;
        case "M":
            basePrice = 15;
            break;
        case "L":
            basePrice = 20;
            break;
        default:
            throw new Error("Tamaño de pizza no válido");
    }
    const toppingsPrice = toppings.length * 2;
    return basePrice + toppingsPrice;
}
