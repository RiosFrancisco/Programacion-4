export abstract class Animal {
  constructor(protected nombre: string) {}
  abstract hacerSonido(): void;
}
