import db, { schema } from "../drizzle";
import { count, eq } from "drizzle-orm";
import { HttpException } from "../util";

type CreateServicePayload = {
  name: string;
  headers: {
    [key: string]: string;
  };
  input: {
    [key: string]: string;
  };
  hiddenInput: {
    [key: string]: string;
  };
  endpoint: string;
  requestType: "GET" | "POST";
  payment?: number;
};

export async function createService(data: CreateServicePayload) {
  const isMultiPart = Object.values(data.input).some(
    (input) => input === "file",
  );

  if (isMultiPart && data.requestType === "GET")
    throw new HttpException(400, "GET request does not support file upload");

  return db
    .insert(schema.service)
    .values({
      data: data,
    })
    .returning();
}

export async function getServices({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  const dataPromise = (await db
    .select()
    .from(schema.service)
    .limit(limit)
    .offset((page - 1) * limit)) as {
    id: string;
    data: CreateServicePayload;
  }[];
  const totalPromise = db.select({ total: count() }).from(schema.service);

  const [data, [{ total }]] = await Promise.all([dataPromise, totalPromise]);

  return {
    total,
    page,
    limit,
    result: data.map((service) => ({
      id: service.id,
      name: service.data.name,
      input: service.data.input,
      payment: service.data.payment || 0,
    })),
  };
}

export async function deleteService(id: string) {
  return db.delete(schema.service).where(eq(schema.service.id, id)).returning();
}

export async function useService({
  id,
  body,
}: {
  id: string;
  body: {
    [_: string]: any;
  };
}) {
  const [service] = (await db
    .select()
    .from(schema.service)
    .where(eq(schema.service.id, id))) as {
    id: string;
    data: CreateServicePayload;
  }[];

  if (!service) throw new HttpException(404, "Service not found");

  //Minimal implementation for MVP. Should verify the signature, payment amount and receiver address.
  if (service.data.payment && !body.signature)
    throw new HttpException(
      400,
      `${service.data.payment} SOL is required to use this service`,
    );

  delete body.signature;

  const isMultiPartBody = Object.keys(body).some(
    (key) => body[key] instanceof File,
  );

  if (isMultiPartBody && service.data.requestType === "GET") {
    throw new HttpException(400, "GET request does not support file upload");
  }

  const isMultiPart = Object.values(service.data.input).some(
    (input) => input === "file",
  );

  if (isMultiPart && !isMultiPartBody) {
    throw new HttpException(400, "No file input found");
  }

  const requestBody =
    service.data.requestType === "GET"
      ? new URLSearchParams(body)
      : isMultiPart
        ? new FormData()
        : body;

  const requestHeaders = new Headers();

  if (requestBody instanceof FormData) {
    Object.entries(body).forEach(([key, value]) => {
      requestBody.append(key, value);
    });

    Object.entries(service.data.hiddenInput).forEach(([key, value]) => {
      requestBody.append(key, value);
    });

    requestHeaders.append("Content-Type", "multipart/form-data");
  } else if (service.data.requestType === "POST") {
    requestHeaders.append("Content-Type", "application/json");

    Object.entries(service.data.hiddenInput).forEach(([key, value]) => {
      (requestBody as { [key: string]: any })[key] = value;
    });
  } else {
    Object.entries(service.data.hiddenInput).forEach(([key, value]) => {
      requestBody.append(key, value);
    });
  }

  Object.entries(service.data.headers).forEach(([key, value]) => {
    requestHeaders.append(key, value);
  });

  const res =
    requestBody instanceof URLSearchParams
      ? await fetch(`${service.data.endpoint}?${requestBody.toString()}`, {
          headers: requestHeaders,
        })
      : requestBody instanceof FormData
        ? await fetch(service.data.endpoint, {
            method: "POST",
            body: requestBody,
            headers: requestHeaders,
          })
        : await fetch(service.data.endpoint, {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: requestHeaders,
          });
  return res.json();
}
