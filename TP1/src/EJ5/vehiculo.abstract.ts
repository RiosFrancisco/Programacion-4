export abstract class Vehiculo {
  constructor(
    protected marca: string,
    protected modelo: string,
    protected anio: number
  ) {}

  abstract acelerar(): void;
  abstract encender(): void;
  abstract apagar(): void;

  public descripcion(): void {
    console.log(
      `Marca: ${this.marca}, Modelo: ${this.modelo}, Año: ${this.anio}`
    );
  }
}
