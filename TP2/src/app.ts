import express from "express";
import cors from "cors";

class Server {
  public app: express.Application;
  public port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json({ limit: " 150mb" }));
  }

  routes() {
    this.app.use("/orders", () => {
      console.log("Orders route");
    });
  }

  start(callback: () => void) {
    this.app.listen(this.port, callback);
  }
}

export default Server;
