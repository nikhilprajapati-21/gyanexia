import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`API server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start API server:", error.message);
    process.exit(1);
  }
};

startServer();