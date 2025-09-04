import { Empleado } from "./empleado.abstract";
import { EmpleadoMedioTiempo } from "./empleadoMedioTiempo";
import { EmpleadoTiempoCompleto } from "./empleadoTiempoCompleto";

export function ejercicio3() {
  console.log("----Ejercicio 3----");

  const empleados: Empleado[] = [
    new EmpleadoTiempoCompleto("Analia", 80000),
    new EmpleadoMedioTiempo("Marcos", 60000),
    new EmpleadoTiempoCompleto("Mariana", 90000),
    new EmpleadoMedioTiempo("Sebastian", 50000),
  ];

  empleados.forEach((empleado) => {
    console.log(
      `El empleado ${empleado.getNombre()} tiene un salario de ${empleado.calcularSalario()}`
    );
  });
}
