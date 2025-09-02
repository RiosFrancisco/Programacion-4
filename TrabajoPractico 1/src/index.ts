/*ejercicio 1*/
import { ejecutarEjercicio_1 } from "./ejercicio_1";

console.log("=== Ejecutando Ejercicio 1 ===");
ejecutarEjercicio_1();


/*ejercicio 2*/
import { Figura } from "./figurasGeometricas/figura.abstract";

const cuadrado = new Cuadrado(2,5);
console.log(cuadrado.mostrarArea()); 



const triangulo: Figura = new Triangulo(2,5);
console.log(triangulo.superficie());
import { Triangulo } from "./figurasGeometricas/triangulo";

const circulo: Figura = new Circulo(3);
console.log(circulo.superficie());
import { Circulo } from "./figurasGeometricas/circulo";


//ejercicio 3 
import { Empleado } from "./abstractEmpleado";
import { EmpleadoTiempoCompleto } from "./empleadoTiempoCompleto";
import { EmpleadoMedioTiempo } from "./empleadoMedioTiempo";


const empleados: Empleado[] = [
  new EmpleadoTiempoCompleto("Analia", 80000),
  new EmpleadoMedioTiempo("Marcos", 60000),
  new EmpleadoTiempoCompleto("Mariana", 90000),
  new EmpleadoMedioTiempo("Sebastian", 50000),
];


empleados.forEach((empleado) => {
  console.log(empleado.mostrarInfo());
});

//EJERCICIO 4
import { Zorro } from "./UML/zorro";
import { Pajaro } from "./UML/pajaro";


const zorro = new Zorro("Foxy", "Zorro Rojo");
zorro.hacerSonido(); 


const pajaro = new Pajaro("Pio pio", "Canario");
pajaro.hacerSonido(); 
console.log(`Puede volar? ${pajaro.volar}`); 
