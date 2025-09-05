import { Animal } from "./animal.abstract";
import { Pajaro } from "./pajaro";
import { Zorro } from "./zorro";

export function ejercicio4(): void {
  console.log("\n----Ejercicio 4----\n");

  // El diagrama UML representa una relacion de herencia entre Animal y las clases Zorro y Pajaro
  // Pajaro tiene una relacion de implementacion con la interfaz Volador

  const zorro: Animal = new Zorro("Don Diego de la Vega", "Zorro");
  const zorro2: Animal = new Zorro("White Fang", "Zorro artico");
  const pajaro: Animal = new Pajaro("Fawkes", "Fenix");
  const pajaro2: Animal = new Pajaro("Hugin", "Cuervo");

  const animales: Animal[] = [zorro, zorro2, pajaro, pajaro2];

  animales.forEach((animal) => {
    console.log("---");
    animal.hacerSonido();
    if (animal instanceof Pajaro) {
      animal.volar();
    }
  });
}
