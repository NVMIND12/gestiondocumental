import { getStore } from "@netlify/blobs";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

export default async (request) => {
  const store = getStore({ name: "sgd-decrees", consistency: "strong" });

  if (request.method === "GET") {
    const { blobs } = await store.list();
    const records = await Promise.all(
      blobs.map(({ key }) => store.get(key, { type: "json" })),
    );
    return json(records.filter(Boolean).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  }

  if (request.method === "POST") {
    const decree = await request.json();
    if (!decree.id || !decree.number || !decree.date || !decree.description) {
      return json({ error: "Faltan campos obligatorios" }, 400);
    }
    await store.setJSON(decree.id, decree);
    return json(decree, 201);
  }

  return json({ error: "Método no permitido" }, 405);
};
