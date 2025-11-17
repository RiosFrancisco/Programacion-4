# TP2 - Sistema de Gestión de Pedidos de Pizza

## Repositorio

[GitHub - Programacion-4](https://github.com/RiosFrancisco/Programacion-4)

## Instalación y Ejecución

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/RiosFrancisco/Programacion-4.git
cd Programacion-4/TP2
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Ejecutar en modo desarrollo**

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests con coverage
npm run test:coverage
```

**Framework utilizado: Vitest**

Los archivos de test se encuentran en `/src/tests/`

## Ejemplos cURL

### 1. Obtener todos los pedidos

```bash
curl -X GET http://localhost:3000/orders
```

### 2. Obtener pedido por ID

```bash
curl -X GET http://localhost:3000/orders/1
```

### 3. Crear nuevo pedido

```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "id": "3",
    "size": "L",
    "toppings": ["pepperoni", "mushrooms"],
    "address": "123 Pizza Street",
    "status": "preparing"
  }'
```

### 4. Obtener pedidos por estado

```bash
curl -X GET "http://localhost:3000/orders?status=preparing"
```

### 5. Cancelar pedido

```bash
curl -X PUT http://localhost:3000/orders/1/cancel
```

---

### Descripción del proceso TDD

#### Test rojo:

- Comenzamos creando los tests principales en `orderCrud.test.ts` sin tener
  implementación:
  - `addOrder()` - Test para agregar órdenes
  - `getOrderById()` - Test para obtener orden por ID
  - `cancelOrder()` - Test para cancelar órdenes
  - `getOrders()` - Test para obtener todas las órdenes
  - `getOrdersByStatus()` - Test para filtrar por estado

#### Test verde

- Creamos la clase `Order` con propiedades básicas
- Implementamos `MockOrder` que implementa `OrderCrud`
- Agregamos métodos mínimos para que los tests pasen:

#### Refactor

- Refactoring del método `cancelOrder` para lanzar excepciones en lugar de
  retornar strings

```typescript
// Antes (retornaba string)
test("cancelOrder is delivered", () => {
  const result = crud.cancelOrder("2");
  expect(result).toBe("El pedido ya fue entregado");
});

// Después (lanza excepción)
test("cancelOrder is delivered", () => {
  expect(() => crud.cancelOrder("2")).toThrowError(
    "El pedido ya fue entregado",
  );
});
```

---

# Matriz de Casos de Prueba – OrderServices

| ID   | Caso / Descripción                    | Precondición (estado/mocks)                                   | Input (query/body/params)                                                                                        | Acción (HTTP)                | Resultado esperado                                       | Test (archivo - nombre)                          |
| ---- | ------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------- | ------------------------------------------------ |
| CA1  | Crear una nueva orden                 | Existen order1 (id=1) y order2 (id=2) creadas en `beforeEach` | `{"id": 3,"size": "S","toppings": [    "cheese",    "mushrooms"],"address": "789 Oak St","status": "preparing"}` | `POST /orders`               | La lista de órdenes pasa de 2 a 3 elementos              | OrderServices.test.ts - addOrder                 |
| CA2  | Obtener orden por ID existente        | Existen order1 y order2                                       | `id = 1`                                                                                                         | `GET /orders/:id`            | Retorna la orden con `id = 1`                            | OrderServices.test.ts - getOrderById             |
| CA3  | Cancelar orden con estado “preparing” | order1.status = "preparing"                                   | `id = 1`                                                                                                         | `POST /orders/:id/cancel`    | Retorna `"Pedido cancelado"`                             | OrderServices.test.ts - cancelOrder              |
| CA4  | Obtener todas las órdenes             | Existen 2 órdenes iniciales                                   | ------                                                                                                           | `GET /orders`                | Retorna array con length > 1                             | OrderServices.test.ts - getOrders                |
| CA5  | Obtener órdenes filtradas por estado  | order1="preparing", order2="delivered"                        | `status=preparing`                                                                                               | `GET /orders?status=pending` | Todas las órdenes retornadas tienen estado `"preparing"` | OrderServices.test.ts - getOrdersByStatus        |
| ERR1 | Cancelar orden ya entregada           | order2.status = "delivered"                                   | `id = 2`                                                                                                         | `POST /orders/:id/cancel`    | Lanza error `"El pedido ya fue entregado"`               | OrderServices.test.ts - cancelOrder is delivered |

---
