import { render, screen, fireEvent, within } from "@testing-library/react";
import { Menu } from "../../Components";

describe("testeo de calculo total del carrito", () => {
  test("calcula correctamente el total al agregar varios productos", () => {
    render(<Menu />);

    const productos = screen.getAllByRole("listitem");

    const cafe = within(productos[0]).getByText(/Agregar/i);
    fireEvent.click(cafe);

    const latte = within(productos[1]).getByText(/Agregar/i);
    fireEvent.click(latte);

    const medialuna = within(productos[2]).getByText(/Agregar/i);
    fireEvent.click(medialuna);

    const cafeCarrito = screen.getAllByText(/Café Americano/i)[1];
    const latteCarrito = screen.getAllByText(/Latte/i)[1];
    const medialunaCarrito = screen.getAllByText(/Medialuna/i)[1];

    expect(cafeCarrito).toBeInTheDocument();
    expect(latteCarrito).toBeInTheDocument();
    expect(medialunaCarrito).toBeInTheDocument();

    expect(screen.getByText(/total: \$\d+/i)).toBeInTheDocument();

    expect(screen.getByText(/total: \$3500/i)).toBeInTheDocument();
  });
});
