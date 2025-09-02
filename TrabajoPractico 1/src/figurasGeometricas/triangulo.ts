import { Figura } from "./figura.abstract";

export class Triangulo extends Figura {
  private base: number;
  private altura: number;

  constructor(base: number, altura: number) {
   super();//se pone el constructor de la clase padre
    this.base = base;
    this.altura = altura;
  }


  calcularArea(): number {
    return (this.base * this.altura) / 2;
  }
}
  