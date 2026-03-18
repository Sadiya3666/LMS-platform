import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/db";

const port = env.PORT || 4000;

// Test connection on startup
prisma.$connect()
  .then(() => {
    console.log('✅ DB connected');
    app.listen(port, () => {
      console.log(`🚀 Server ready at: http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error('❌ DB connection failed:', e);
    process.exit(1);
  });
