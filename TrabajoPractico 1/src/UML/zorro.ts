import { Animal } from "./animal";


export class Zorro extends Animal {
  private especie: string;

  constructor(nombre: string, especie: string) {
    super(nombre);
    this.especie = especie;
  }

  public hacerSonido(): void {
    console.log(`${this.nombre} (zorro) hace guau-guau.`);
  }
}
