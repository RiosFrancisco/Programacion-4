import Empleado from "./empleado";

export class EmpleadoTiempoCompleto extends Empleado {
  private bonofijo: number=20000;
  private salarioBase: number;


  calcularSalario(): number {
    return this.salarioBase + this.bonofijo;
  }
}


