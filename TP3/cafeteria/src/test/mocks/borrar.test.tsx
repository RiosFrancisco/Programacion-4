import { render, screen, fireEvent, within } from "@testing-library/react";
import { Menu } from "../../Components";

describe("Cafeteria component", () => {
  test("verifica que el clic en 'Eliminar' remueve solo ese producto del carrito", () => {
    render(<Menu />);

    const productos = screen.getAllByRole("listitem");

    const cafeBtn = within(productos[0]).getByText(/Agregar/i);
    const latteBtn = within(productos[1]).getByText(/Agregar/i);
    const medialunaBtn = within(productos[2]).getByText(/Agregar/i);

    fireEvent.click(cafeBtn);
    fireEvent.click(latteBtn);
    fireEvent.click(medialunaBtn);

    expect(screen.getAllByText(/Café Americano/i).length).toBeGreaterThan(1);
    expect(screen.getAllByText(/Latte/i).length).toBeGreaterThan(1);
    expect(screen.getAllByText(/Medialuna/i).length).toBeGreaterThan(1);

    const cafeCarrito = screen.getAllByText(/Café Americano/i)[1].closest("li")!;
    const botonEliminar = within(cafeCarrito).getByText(/Borrar/i);

    fireEvent.click(botonEliminar);

    expect(screen.queryAllByText(/Café Americano/i).length).toBe(1); 

    expect(screen.getAllByText(/Latte/i).length).toBeGreaterThan(1);
    expect(screen.getAllByText(/Medialuna/i).length).toBeGreaterThan(1);

    expect(screen.getByText(/total: \$\d+/i)).toBeInTheDocument();
  });
});
