export abstract class Empleado {
  protected nombre: string;
  salarioBase: number;

  constructor(nombre: string, salarioBase: number) {
    this.nombre = nombre;
    this.salarioBase = salarioBase;
  }

  abstract calcularSalario(): number;

}


