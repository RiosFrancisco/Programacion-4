import { Figura } from "./figura.abstract";

export class Cuadrado extends Figura {
  private lado: number;

  constructor(lado: number) {
    super("Cuadrado"); 
    this.lado = lado;
  }

 
  calcularArea(): number {
    return this.lado * this.lado;
  }
}
