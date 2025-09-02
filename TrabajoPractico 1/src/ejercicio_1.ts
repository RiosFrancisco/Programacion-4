  export interface Animal {
    hacerSonido(): void;
    mover(): void;
}
  class Perro implements Animal {
    hacerSonido(): void {
        console.log("El perro hace Guau");
    }
    mover(): void {
        console.log("El perro corre");
    }
}
export function ejecutarEjercicio_1(): void {
const miPerro = new Perro();
miPerro.hacerSonido();
miPerro.mover();
}