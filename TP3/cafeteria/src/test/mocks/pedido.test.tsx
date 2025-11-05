import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import { Menu } from "../../Components";

describe("Cafeteria component", () => {
  test("envía el pedido y muestra 'Pedido confirmado' tras éxito", async () => {
    render(<Menu />);
    const productos = screen.getAllByRole("listitem");
    const cafeBtn = within(productos[0]).getByText(/Agregar/i);
    const latteBtn = within(productos[1]).getByText(/Agregar/i);

    fireEvent.click(cafeBtn);
    fireEvent.click(latteBtn);
    expect(screen.getAllByText(/Café Americano/i).length).toBeGreaterThan(1);
    expect(screen.getAllByText(/Latte/i).length).toBeGreaterThan(1);
    const enviarBtn = screen.getByText(/Enviar pedido/i);
    fireEvent.click(enviarBtn);
    await waitFor(() => {
    expect(screen.getByText(/Pedido confirmado/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/El carrito está vacío/i)).toBeInTheDocument();
  });
});
