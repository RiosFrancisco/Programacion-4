import { Vehiculo } from "./vehiculo.abstract";

export class Moto extends Vehiculo {
  constructor(
    marca: string,
    modelo: string,
    anio: number,
    private velocidadMaxima: number
  ) {
    super(marca, modelo, anio);
  }

  acelerar(): void {
    console.log(`La moto ${this.marca} está acelerando.`);
  }
  encender(): void {
    console.log(`La moto ${this.marca} está encendiendo.`);
  }
  apagar(): void {
    console.log(`La moto ${this.marca} se está apagando.`);
  }

  public descripcion(): void {
    super.descripcion();
    console.log(`Velocidad Máxima: ${this.velocidadMaxima} km/h`);
  }
}
