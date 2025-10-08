import express from "express";
import orderRoutes from "./routes/order.routes";

export class MakeApp {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json({ limit: "150mb" }));
  }

  routes() {
    this.app.get("/", (_req, res) => res.sendStatus(200));

    this.app.use("/orders", orderRoutes);
  }
}

export const app = new MakeApp().app;

class Server {
  public port: number;
  public makeApp: MakeApp;

  constructor(port: number) {
    this.port = port;
    this.makeApp = new MakeApp();
  }

  start(callback: () => void) {
    this.makeApp.app.listen(this.port, callback);
  }
}

export default Server;