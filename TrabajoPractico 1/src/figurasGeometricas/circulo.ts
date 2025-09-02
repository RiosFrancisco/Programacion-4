import {Figura} from "./figura.abstract.js";
export class Circulo extends Figura {
  private radio: number;

  constructor(radio: number) {
    super(); //se pone el constructor de la clase padre
    this.radio = radio;
  }

  superficie(): number {
    return Math.PI * this.radio * this.radio;
  }
}
