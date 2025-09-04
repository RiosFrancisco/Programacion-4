export abstract class Empleado {
  constructor(protected nombre: string, protected salarioBase: number) {}

  abstract calcularSalario(): number;
  public getNombre(): string {
    return this.nombre;
  }
}
