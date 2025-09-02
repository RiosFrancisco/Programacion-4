
export class Animal {
  protected nombre: string;

  constructor(nombre: string) {
    this.nombre = nombre;
  }

  public hacerSonido(): void {
    console.log(`${this.nombre} hace un sonido.`);
  }
}
