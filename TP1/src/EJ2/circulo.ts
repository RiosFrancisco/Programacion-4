import { FiguraGeometrica } from "./figuraGeometrica.abstract";

export class Circulo extends FiguraGeometrica {
  constructor(private radio: number) {
    super("Circulo");
  }

  calcularArea(): void {
    const area = Math.PI * this.radio * this.radio;
    console.log(`El area del circulo es: ${area}`);
  }
}
