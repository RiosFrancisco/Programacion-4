import { Animal } from "./animal.interface";

export class Perro implements Animal {
  hacerSonido(): void {
    console.log("Guau!");
  }
  moverse(): void {
    console.log("El perro corre");
  }
}
