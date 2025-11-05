import { useState } from "react";

function Cafeteria() {
  const [productos] = useState([
    { id: 1, nombre: "Café Americano", precio: 1200 },
    { id: 2, nombre: "Latte", precio: 1500 },
    { id: 3, nombre: "Medialuna", precio: 800 },
  ]);

  const [carrito, setCarrito] = useState<{ id: number; cantidad: number }[]>([]);
  const [mensaje, setMensaje] = useState("");
  const agregarAlCarrito = (id: number) => {
    const productoEnCarrito = carrito.find((item) => item.id === id);

    if (productoEnCarrito) {
      setCarrito(
        carrito.map((item) =>
          item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else {
      setCarrito([...carrito, { id, cantidad: 1 }]);
    }
  };
  const borrarDelCarrito = (id: number, e: React.MouseEvent) => {
  e.stopPropagation(); 

  setCarrito((prevCarrito) => {
    const productoEnCarrito = prevCarrito.find((item) => item.id === id);

    if (!productoEnCarrito) return prevCarrito;

    if (productoEnCarrito.cantidad > 1) {
      return prevCarrito.map((item) =>
        item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
      );
    } else {
      return prevCarrito.filter((item) => item.id !== id);
    }
  });
};

  const enviarPedido = async () => {
  if (carrito.length === 0) return;

  try {
    const respuesta = await fetch("http://localhost/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productos: carrito }),
    });

    const data = await respuesta.json();
    setCarrito([]);
    console.log(carrito)
    setMensaje(data.message || "Pedido confirmado");
    console.log(data)
    setTimeout(() => setMensaje(""), 3000); 
  } catch (error) {
    console.error("Error al enviar pedido:", error);
  }
};

  const total = carrito.reduce((acc, item) => {
    const prod = productos.find((p) => p.id === item.id);
    return prod ? acc + prod.precio * item.cantidad : acc;
  }, 0);

  return (
    <div>
      <h2>Menú de la Cafetería</h2>
       {productos.length === 0 ? (
        <p>No hay productos disponibles </p>):(
      <ul>
        {productos.map((producto) => (
          
          <li key={producto.id}>
            {producto.nombre} - ${producto.precio}
            <button onClick={() => agregarAlCarrito(producto.id)}>Agregar</button>
          </li>
        ))}
      </ul>
    )}

      <h3>Carrito</h3>
      {carrito.length === 0 ? (
        <p>El carrito está vacío </p>
      ) : (
        <>
          <ul>
            {carrito.map((item) => {
              const prod = productos.find((p) => p.id === item.id);
              return (
                <li key={item.id}>
                  {prod?.nombre} - ${prod?.precio} × {item.cantidad} = $
                  {prod && prod.precio * item.cantidad}

                  <button  onClick={(e) => borrarDelCarrito(item.id, e)}>Borrar</button>
                </li>
              );
            })}
          </ul>
          <button onClick={enviarPedido}>Enviar pedido</button>
          <h4>Total: ${total}</h4>
        </>
      )}
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
}

export default Cafeteria;
