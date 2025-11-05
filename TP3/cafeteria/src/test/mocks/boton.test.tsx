import { render, screen, fireEvent, within } from "@testing-library/react";
import { Menu } from "../../Components";

describe("Testeo agregar al carrito", () => {
  test("agrega Café Americano al carrito correctamente", () => {
    render(<Menu />);

    // Encuentra el producto en el menú
    const itemCafe = screen.getByText(/Café Americano/i).closest("li")!;
    const botonAgregar = within(itemCafe).getByText(/Agregar/i);
    fireEvent.click(botonAgregar);

    // Obtiene la lista del carrito (la segunda <ul>)
    const listas = screen.getAllByRole("list");
    const carrito = listas[1];

    // Verifica que el producto esté en el carrito
    const textoCarrito = within(carrito).getByText(/Café Americano/i);
    expect(textoCarrito).toBeInTheDocument();

    // Verifica que se muestre el título “Carrito”
    expect(screen.getByText(/Carrito/i)).toBeInTheDocument();
  });
});
