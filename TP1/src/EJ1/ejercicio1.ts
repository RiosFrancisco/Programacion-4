import { Animal } from "./animal.interface";
import { Perro } from "./perro";

export function ejercicio1(): void {
  console.log("----Ejercicio 1----");

  const perro: Animal = new Perro();
  perro.hacerSonido();
  perro.moverse();
}
