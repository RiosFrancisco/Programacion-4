1) EXPLICACION CICLO ROJO - VERDE - REFACTOR
El ciclo ROJO - VERDE - REFACTOR es una practica para realizar pruebas de test.

Que arranca con el ciclo ROJO, en el cual se escribe una prueba que falla porque no esta la funcionalidad creada.
El objetivo es definir que va a hacer el codigo, este fallo confirma que la prueba esta bien escrita.

Despues tenemos el ciclo VERDE, en el cual se escribe el codigo necesario para que la prueba pase(lo mas importante es que pase, no importa el codigo), Esto valida que el sistema puede cumplir el requisito.

Y por ultimo el ciclo REFACTORIZADOR, Es para mejorar el cidog sin cambiar su comportamiento. Las pruebas sirven para asegurarte que no rompiste nada durante el proceso


El tamaño de los pasos es importante porque evita errores dificiles de rastrear ya que si haces cambios grandes entre pasos es mas dificil saber que rompio el sistema esto facilita el diagnostico porque cuando una prueba falla , ya sabes que lo ultimo que hiciste es lo que lo causo.


2) DIFERENCIA ENTRE TEST UNITARIOS , DE INTEGRACION Y E2E.
Los test unitarios verifican la funcionalidad de un componente aislado,son los primeros test que se hacen, esto es rapido y facil de ejecutar.
Los test de integracion verifican que multiples componentes trabajen bien jutos(bases de datos, servicios externos o capas intermedias) son los segundos test que se hacen, esto detecta errores en la conexion entre modulos, validan configuraciones reales (ORM, rutas, middlewares) y se acemejan a escenarios mas reales.
Los test E2E(End-to-End), simulan el flujo completo de uso desde el punto de vista del usuario, son los ultimos test que se hacen, esto validan la experiencia real del usuario, detectan errores en toda la cadena y son utiles para detectar regresion.

3) QUE ES UN DOBLE DE PRUEBA.
Un doble de prueba es una simulacion de comportamientos de dependencias reales, esto facilita el testeo de codigo permitiendo aislar el componente bajo prueba y controlar su entorno.
Un STUB devuelve respuestas predefinidas a llamadas especificas , sin su logica interna. Este doble de prueba se utiliza cuando uno quiere hacer un test sin importar como se comporta la dependencia. por ejemplo al simular una base de datos sin conectarse a ella en realidad.
Un MOCK simula una dependencia y verifica que se haya usado correctamente. Este doble de prueba se utiliza cuando quieres validar la interaccion entre componentes , como por ejemplo si queres asegurarte de que un controlador llama al servicio de autenticacion con el token correcto.
Un SPY es como un mock , pero observa el comportamiento real del objeto, puede contabilizar llamadas y resultado, pero este ejecuta la logica original. Este doble de prueba es utilizaco cuando queres ver como se comporta una funcion real sin modificarla, como por ejemplo para observar cómo se registran logs o métricas sin alterar el sistema

4) PORQUE ES UTIL SEPARAR APP DE SERVER.
Separar app de server permite testear la app sin levantar el servidor real esto acelera las pruebas, tambien facilita la reutilizacion de la app en distintos entornos, mejora la integracion con herramientas de testing y evita conflictos de puertos.

EJEMPLO MAKEAPP
//app.js
const express = require('express');
function makeApp() {
  const app = express();
  app.get('/hola', (req, res) => res.send('que tal?'));
  return app;
}
module.exports = makeApp;
//levantamos el servidor , server.js
const makeApp = require('./app');
const app = makeApp();
app.listen(3000, () => console.log('Server running'));

//el teste de integracion en app.test.js
const request = require('supertest');
const makeApp = require('./app');

test('GET /hola returns que tal?', async () => {
  const app = makeApp();
  const res = await request(app).get('/hola');
  expect(res.text).toBe('que tal?');
});

5) DIFERENCIA ENTRE PARSE() Y SAFE PARSE().
Parse y safeParse son dos formas de validar datos pero tienen diferencas clave en como manejar errores.
parse lanza errores con exepcion si falla en cambio parse no lanza errores. safeparse devuelve resultado estructurado, encambio parse no, solo devuelve el dato valido.

safeParse() se utiliza en rutas de express para evitar que el servidor se caiga por datos invalidos(validar req.body, req.query, req.params y devuelve error 400 si la validacion falla).

parse() se utiliza par contextos controlados, porque lanza una excepcion si los datos no cumplen con el esquema. se utiliza en scripts, test o funcones que queres que el error detenga la ejecucion, por ejemplo en una funcion donde necesites el dni, si esta es incorrecta frena la ejecucion

6) DOS EJEMPLOS DE REGLAS DE DOMINIO.
1) Una transferencia no puede superar el saldo disponible en mi cuenta del banco. los test unitarios recomendado serian,
saldo $1000, intento transferr $500 me deja, intento transferir $500 , me tiene que dejar de nuevo , intento una vez mas , deberia fallar.
2) Un paciente no puede reservar dos turnos con el mismo medico en el mismo dia. los test unitarios recomendados serian, Reservar turno con el Dr. Coredoba el 6 de octubre de 2025, debe pasar, intentar sacar turno con el Dr. Cordoba el 6 de octubre de 2025, en este intento deberia fallar.

7) los malos olores que pueden haber en un suite de test son
naming: no dice que se esta probando o que comportamiento espera.
test('funciona bien', () => { ... });
esta mal porque no dice que funciona bien.
test('GET /usuarios devuelve lista ordenada por fecha', () => { ... });

assertions: son las verificaciones que hacés al final del test para confirmar que el resultado es correcto
test('respuesta contiene datos del usuario', () => {
  const res = obtenerUsuario();
  expect(res.nombre).toBe('Ana');
  expect(res.edad).toBe(30);
  expect(res.rol).toBe('admin');
});

test('respuesta contiene datos del usuario en otro contexto', () => {
  const res = obtenerUsuario();
  expect(res.nombre).toBe('Ana');
  expect(res.edad).toBe(30);
  expect(res.rol).toBe('admin');
});
esto esta mal porque las verificaciones se repiten

function assertUsuario(res) {
  expect(res.nombre).toBe('Ana');
  expect(res.edad).toBe(30);
  expect(res.rol).toBe('admin');
}

test('respuesta contiene datos del usuario', () => {
  const res = obtenerUsuario();
  assertUsuario(res);
});

test('respuesta contiene datos del usuario en otro contexto', () => {
  const res = obtenerUsuario();
  assertUsuario(res);
});

estos tambien pueden ser debiles, como por ej
expect(res).toBeTruthy();
no verifica que parte del resultado es correcto, esto pasa el test aunque el contenido este mal

expect(res.status).toBe(200);
expect(res.body.nombre).toBe('Ana');

8) 
CA1:
 - Caso/Descripción: Obtener orden por id
 - Precondición: Servicio con: [{id: 1, producto: "pizza", status="pending"}, {id: 2, producto: "empanadas", status="canceled"}]
 - Input: id = 1
 - Acción: GET /orders/1
 - Resutado esperado: 200 body [{id: 1, producto: "pizza", status="pending"}]
 - Test: tests/getOrderById "filtra por id"

CA2:
 - Caso/Descripción: Obtener todas las ordenes por estado "pending"
 - Precondición: Servicio con: [{id: 1, producto: "pizza", status="pending"}, {id: 2, producto: "empanadas", status="canceled"}]
 - Input: status="pending"
 - Acción: GET /orders?status="pending"
 - Resutado: 200 body: [{id: 1, producto: "pizza", status="pending"}]
 - Test: tests/getOrdersByStatus "filtra por estado"

 CA3: 
 - Caso/Descripción: Cancelar perdido valido.
 - Precondición: Servicio con [{id: 1, producto: "pizza", status: "pending"}, {id: 2, producto: "empandas", status: "canceled"}]
 - Input: id= 1
 - Accion: POST /orders/1/cancel
 - Resultado: 200 ok; body {id:1, producto: "pizza", status: "canceled"}
 - Test: tests/cancelOrder "cambia estado cenceled"
ERR1:
- Caso/Descripcion: Intentas cancelar una orden ya entregada
- Precondicion: Servicio con [{id: 1, producto: "pizza", status: "delivered"}]
- Input: id= 1
- Accion: POST /orders/1/cancel
- Resultado: 409 Conflict; body {error: "cannot cancel delivered order"
- Test: tests/canelOrder "no permite cancelar delivered"  

9) No es una buena practica buscar la cobertura de codigo al 100% porque eso puede generar falsa sensacion de seguridad, donde tener la cobertura alta no significa que los tests sean buenos.
podes hacer test inutiles donde no aporten un valor real.
tambien perdes tiempo y esfuerzo, donde buscar la cobertura total puede deviar recursos de pruebas mas importantes.
En lugar de perseguir el 100% de la cobertura , se deberia apuntar a cubrir funciones importantes, priorizar test que validen reglas de dominios , flujos reales y errores esperables. 


10) Builder para tests sirve para facilitar la creacion de objetos, asignamos en el constructor valores por defecto y con el metodo build creamos el objeto, si necesitamos cambiar alguna de las propiedades solo añadimos metodos a nuestro builder para darle valor especifico a los campos que queremos modificar

const newOrder = new OrderBuilder().setId("3").build();

El OrderBuilder esta en la carpeta utils/OrderBuilder.ts
```ts
export class OrderBuilder {
  private id: string = "1";
  private size: "S" | "M" | "L" = "M";
  private toppings: string[] = ["cheese", "tomato"];
  private address: string = "Default Address";
  private status: "delivered" | "preparing" | "cancelled" = "preparing";

  public setId(id: string): OrderBuilder {
    this.id = id;
    return this;
  }

  public setSize(size: "S" | "M" | "L"): OrderBuilder {
    this.size = size;
    return this;
  }

  public setToppings(toppings: string[]): OrderBuilder {
    this.toppings = toppings;
    return this;
  }

  public setAddress(address: string): OrderBuilder {
    this.address = address;
    return this;
  }

  public setStatus(
    status: "delivered" | "preparing" | "cancelled"
  ): OrderBuilder {
    this.status = status;
    return this;
  }

  public build(): Order {
    return new Order(
      this.id,
      this.size,
      this.toppings,
      this.address,
      this.status
    );
  }
}```
