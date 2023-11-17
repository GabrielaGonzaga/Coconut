import "reflect-metadata";
import express, { Request, Response } from "express";

const app = express();

app.listen(3000, () => console.log("Server is running :)"));

app.get("/", (_req: Request, res: Response) => {
  return res.send("Express Typescript on Vercel");
});
