import { Animal } from "./animal.abstract";

export class Zorro extends Animal {
  constructor(nombre: string, private especie: string) {
    super(nombre);
  }

  hacerSonido(): void {
    console.log(`${this.nombre} el ${this.especie} hace un aullido.`);
  }
}
