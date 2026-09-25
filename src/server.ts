import app from "./app";
import { env } from "./config/env";
import { startDbKeepAlive } from "./lib/dbKeepAlive";
import { pool } from "./lib/prisma";

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
  startDbKeepAlive(pool);
});
