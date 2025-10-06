import express from "express";
import cors from "cors";
import orderRoutes from "./routes/order.routes";

export class MakeApp {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(cors());
    this.app.use(express.json({ limit: " 150mb" }));
  }

  private routes() {
    this.app.use("/orders", () => {
      console.log("Orders route");
    });
  }
  // Rutas
  // app.use("/orders", ordersRoute);
  // app.use("/order/:id", ordersIdRoute);
  // app.use("/orders/:id/cancel", cancelRouote);
  // app.use("/orders?status", statusRoute);
}

class Server {
  public app: express.Application;
  public port: number;
  public makeApp: MakeApp;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    this.makeApp = new MakeApp();
  }

  start(callback: () => void) {
    this.app.listen(this.port, callback);
  }
}

export default Server;
