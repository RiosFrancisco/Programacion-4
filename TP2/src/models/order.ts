export enum OrderSize {
  S = "S",
  M = "M",
  L = "L",
}
export enum OrderStatus {
  DELIVERED = "delivered",
  PREPARING = "preparing",
  CANCELLED = "cancelled",
}

export class Order {
  protected id: number;
  protected size: OrderSize;
  protected price: number;
  protected toppings: string[];
  protected address: string;
  protected status: OrderStatus;

  constructor(
    id: number,
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

  public getId(): number {
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
