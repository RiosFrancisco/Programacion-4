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
   - Comenzamos creando los tests principales en `orderCrud.test.ts` sin tener implementación:
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

  
   - Refactoring del método `cancelOrder` para lanzar excepciones en lugar de retornar strings

   ```typescript
   // Antes (retornaba string)
   test("cancelOrder is delivered", () => {
     const result = crud.cancelOrder("2");
     expect(result).toBe("El pedido ya fue entregado");
   });
   
   // Después (lanza excepción)
   test("cancelOrder is delivered", () => {
     expect(() => crud.cancelOrder("2")).toThrowError("El pedido ya fue entregado");
   });
   ```



---

