import { Animal } from "./animal.abstract";
import { Volador } from "./volador.interface";

export class Pajaro extends Animal implements Volador {
  constructor(nombre: string, private especie: string) {
    super(nombre);
  }

  volar(): void {
    console.log(`${this.nombre} el ${this.especie} empieza a volar.`);
  }

  hacerSonido(): void {
    console.log(`${this.nombre} el ${this.especie} hace sonido de pájaro.`);
  }
}
