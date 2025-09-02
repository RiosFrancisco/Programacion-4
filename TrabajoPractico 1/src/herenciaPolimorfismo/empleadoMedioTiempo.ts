import Empleado from "./empleado";

export class EmpleadoTiempoCompleto extends Empleado {
  calcularSalario(): number {
    return this.salarioBase * 0.5;
  }
}
