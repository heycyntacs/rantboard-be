import express from "express";
import cors from "cors";
import "dotenv/config";
import { rantsRoutes } from "./routes";
import { apiKeyMiddleware } from "./middleware/api-key";

const app = express();
const port = 3001;

app.use(express.json());

// CORS
app.use(
  cors({
    origin: [
      "https://rantboard.xyz",
      "https://rantboard.pages.dev",
      // "http://localhost:5173",
    ],
  }),
);

// Apply API key check to ALL routes
app.use(apiKeyMiddleware);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Healthy",
  });
});

app.use("/api/rants", rantsRoutes);

app.listen(port, () => {
  console.log(`Listening on port:${port}`);
});
