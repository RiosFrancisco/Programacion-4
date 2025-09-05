import { Animal } from "./animal.interface";
import { Perro } from "./perro";

export function ejercicio1(): void {
  console.log("\n----Ejercicio 1----\n");

  const perro: Animal = new Perro();
  perro.hacerSonido();
  perro.moverse();
}
