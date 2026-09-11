import { buildApp } from "./app.js";

const PORT = Number(process.env.PORT ?? 4000);

buildApp()
  .then((app) => app.listen({ port: PORT, host: "0.0.0.0" }))
  .catch((error) => {
    console.error("Failed to start API server", error);
    process.exit(1);
  });
