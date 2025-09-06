import { Auto } from "./auto";
import { Moto } from "./moto";

export function ejercicio5(): void {
  console.log("\n----Ejercicio 5----\n");
  console.log("----Auto----");
  const auto = new Auto("Toyota", "Corolla", 2020, 4);
  auto.acelerar();
  auto.encender();
  auto.apagar();
  auto.descripcion();

  console.log("\n----Moto----");
  const moto = new Moto("Honda", "CBR600RR", 2019, 250);
  moto.acelerar();
  moto.encender();
  moto.apagar();
  moto.descripcion();
}
