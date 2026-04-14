import { createApp } from "@src/app";

async function start() {
  try {
    const app = await createApp();
    await app.listen({ port: 3333, host: "0.0.0.0" });
    app.log.info("Server is running on port 3333");
    app.log.info("Documentation is available at /docs");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
