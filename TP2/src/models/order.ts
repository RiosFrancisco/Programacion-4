export type OrderSize = "S" | "M" | "L";
export type OrderStatus = "delivered" | "preparing" | "cancelled";

export class Order {
  protected id: string;
  protected size: OrderSize;
  protected price: number;
  protected toppings: string[];
  protected address: string;
  protected status: OrderStatus;

  constructor(
    id: string,
    size: OrderSize,
    toppings: string[],
    address: string,
    status: OrderStatus
  ) {
    this.id = id;
    this.size = size;
    this.price = 0;
    this.toppings = toppings;
    this.address = address;
    this.status = status;
  }

  public getId(): string {
    return this.id;
  }

  public getSize(): OrderSize {
    return this.size;
  }

  public getPrice(): number {
    return this.price;
  }

  public getToppings(): string[] {
    return this.toppings;
  }

  public getAddress(): string {
    return this.address;
  }

  public getStatus(): OrderStatus {
    return this.status;
  }

  public setStatus(status: OrderStatus): void {
    this.status = status;
  }

  public setPrice(price: number): void {
    this.price = price;
  }
}
