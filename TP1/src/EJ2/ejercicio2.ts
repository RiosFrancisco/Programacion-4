import { Circulo } from "./circulo";
import { Cuadrado } from "./cuadrado";
import { FiguraGeometrica } from "./figuraGeometrica.abstract";
import { Triangulo } from "./triangulo";

export function ejercicio2(): void {
  console.log("----Ejercicio 2----");

  const cuadrado: FiguraGeometrica = new Cuadrado(5);
  const circulo: FiguraGeometrica = new Circulo(6);
  const triangulo: FiguraGeometrica = new Triangulo(3, 5);

  cuadrado.calcularArea();
  circulo.calcularArea();
  triangulo.calcularArea();
}
