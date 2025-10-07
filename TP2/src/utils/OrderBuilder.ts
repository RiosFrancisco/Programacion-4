import { Order, OrderSize, OrderStatus } from "../models/order";

export class OrderBuilder {
  private id: number = 1;
  private size: "S" | "M" | "L" = "M";
  private toppings: string[] = ["cheese", "tomato"];
  private address: string = "Default Address";
  private status: "delivered" | "preparing" | "cancelled" = "preparing";

  public setId(id: number): OrderBuilder {
    this.id = id;
    return this;
  }

  public setSize(size: "S" | "M" | "L"): OrderBuilder {
    this.size = size;
    return this;
  }

  public setToppings(toppings: string[]): OrderBuilder {
    this.toppings = toppings;
    return this;
  }

  public setAddress(address: string): OrderBuilder {
    this.address = address;
    return this;
  }

  public setStatus(
    status: "delivered" | "preparing" | "cancelled"
  ): OrderBuilder {
    this.status = status;
    return this;
  }

  public build(): Order {
    return new Order(
      this.id,
      this.size as OrderSize,
      this.toppings,
      this.address,
      this.status as OrderStatus
    );
  }
}
