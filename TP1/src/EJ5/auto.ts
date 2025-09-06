import { Vehiculo } from "./vehiculo.abstract";

export class Auto extends Vehiculo {
  constructor(
    marca: string,
    modelo: string,
    anio: number,
    private puertas: number
  ) {
    super(marca, modelo, anio);
  }

  acelerar(): void {
    console.log(`El auto ${this.marca} está acelerando.`);
  }
  encender(): void {
    console.log(`El auto ${this.marca} está encendiendo.`);
  }
  apagar(): void {
    console.log(`El auto ${this.marca} se está apagando.`);
  }
  public descripcion(): void {
    super.descripcion();
    console.log(`Puertas: ${this.puertas}`);
  }
}
