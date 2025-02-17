import { Elysia, t } from "elysia";
import { AuraService } from "../service";
import { pagination } from "../../util";

export default new Elysia({
  name: "Aura.Route",
  prefix: "/aura",
  tags: ["Aura"],
})
  .post("/create", ({ body }) => AuraService.createService(body), {
    body: t.Object({
      name: t.String(),
      headers: t.Record(t.String(), t.String()),
      //Minimal implementation. More validations and sub validations can be added such for checking for file mime types, etc.
      input: t.Record(t.String(), t.String()),
      hiddenInput: t.Record(t.String(), t.String()),
      endpoint: t.String({
        format: "uri",
      }),
      requestType: t.Union([t.Literal("GET"), t.Literal("POST")]),
      payment: t.Optional(t.Number()),
    }),
  })
  .get("/services", ({ query }) => AuraService.getServices(pagination(query)), {
    query: t.Object({
      page: t.Optional(t.Number()),
      limit: t.Optional(t.Number()),
    }),
  })
  .delete(
    "/service/:id",
    ({ params }) => AuraService.deleteService(params.id),
    {
      params: t.Object({
        id: t.String({
          format: "uuid",
        }),
      }),
    },
  )
  .post(
    "/service/:id",
    async ({ params, body }) =>
      AuraService.useService({
        id: params.id,
        body,
      }),
    {
      params: t.Object({
        id: t.String({
          format: "uuid",
        }),
      }),
      body: t.Record(t.String(), t.Any()),
    },
  );
