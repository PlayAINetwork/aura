import { Elysia, t } from "elysia";
import { AgentService } from "../service";

export default new Elysia({
  name: "Agent.Route",
  prefix: "/agent",
  tags: ["Agent"],
}).post("/koala", ({ body }) => AgentService.generateKoalaImage(body.prompt), {
  body: t.Object({
    prompt: t.String(),
  }),
});
