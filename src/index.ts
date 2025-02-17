import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { HttpException } from "../util";
import { AuraRouter } from "./route";

const app = new Elysia();

app.use(cors());

app.use(
  swagger({
    path: "/docs",
    documentation: {
      info: {
        title: "Aura MVP API",
        version: "0.0.1",
      },
    },
  }),
);

app.onError(({ error }) => {
  if (error instanceof HttpException) {
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message,
        code: error.code,
      }),
      {
        status: error.code,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});

app.use(AuraRouter);

app.listen(3000, (s) => console.log(`Server started at ${s.url}`));
