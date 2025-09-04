import { Empleado } from "./empleado.abstract";

export class EmpleadoTiempoCompleto extends Empleado {
  private bonoFijo = 20000;

  constructor(nombre: string, salarioBase: number) {
    super(nombre, salarioBase);
  }

  calcularSalario(): number {
    return this.salarioBase + this.bonoFijo;
  }
}
