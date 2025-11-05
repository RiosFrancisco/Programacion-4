import { render, screen, fireEvent, within } from "@testing-library/react";
import { Menu } from "../../Components";

describe("Testeo agregar al carrito", () => {
  test("agrega Café Americano al carrito correctamente", () => {
    render(<Menu />);

    const itemCafe = screen.getByText(/Café Americano/i).closest("li")!;
    const botonAgregar = within(itemCafe).getByText(/Agregar/i);
    fireEvent.click(botonAgregar);

    const listas = screen.getAllByRole("list");
    const carrito = listas[1];

    const textoCarrito = within(carrito).getByText(/Café Americano/i);
    expect(textoCarrito).toBeInTheDocument();

    expect(screen.getByText(/Carrito/i)).toBeInTheDocument();
  });
});
