import { Animal } from "./animal";
import { Volador } from "./volador";

// Clase Pajaro que hereda de Animal e implementa Volador
export class Pajaro extends Animal implements Volador {
  private especie: string;
  public volar: boolean;

  constructor(nombre: string, especie: string, volar: boolean = true) {
    super(nombre);
    this.especie = especie;
    this.volar = volar;
  }

  public hacerSonido(): void {
    console.log(`${this.nombre} (pájaro) hace pío-pío.`);
  }
}
