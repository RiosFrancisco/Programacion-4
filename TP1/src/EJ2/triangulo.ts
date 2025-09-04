import { FiguraGeometrica } from "./figuraGeometrica.abstract";

export class Triangulo extends FiguraGeometrica {
  constructor(private base: number, private altura: number) {
    super("Triangulo");
  }

  calcularArea(): void {
    const area = (this.base * this.altura) / 2;
    console.log(`El area del triangulo es: ${area}`);
  }
}
