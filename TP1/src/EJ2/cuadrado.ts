import { FiguraGeometrica } from "./figuraGeometrica.abstract";

export class Cuadrado extends FiguraGeometrica {
  constructor(private lado: number) {
    super("Cuadrado");
  }

  calcularArea(): void {
    const area = this.lado * this.lado;
    console.log(`El area del cuadrado es: ${area}`);
  }
}
