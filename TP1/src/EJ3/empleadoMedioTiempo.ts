import { Empleado } from "./empleado.abstract";

export class EmpleadoMedioTiempo extends Empleado {
  private static porcentajeMedioTiempo: number = 0.5;
  constructor(nombre: string, salarioBase: number) {
    super(nombre, salarioBase);
  }

  calcularSalario(): number {
    return this.salarioBase * EmpleadoMedioTiempo.porcentajeMedioTiempo;
  }
}
