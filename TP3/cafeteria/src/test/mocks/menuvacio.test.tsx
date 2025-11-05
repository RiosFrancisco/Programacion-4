import { server } from "../mocks/server";
import { http, HttpResponse } from "msw";
import { render, screen, waitFor } from "@testing-library/react";
import Menu from "../../Components/Menu";

test("muestra 'No hay productos disponibles' cuando el menú está vacío", async () => {
  server.use(
    http.get("http://localhost/api/menu", () => {
      return HttpResponse.json([]);
    })
  );

  render(<Menu />);

  await waitFor(() =>
    expect(screen.getByText(/No hay productos disponibles/i)).toBeInTheDocument()
  );
});
