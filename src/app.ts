import express from "express";
import cors from "cors";
import "dotenv/config";
import { rantsRoutes } from "./routes";

const app = express();
const port = 3001;

app.use(
  cors({
    origin: ["https://rantboard.xyz", "http://localhost:5173"],
  }),
);
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Healthy",
  });
});

app.use("/api/rants", rantsRoutes);

app.listen(port, () => {
  console.log(`Listening on port:${port}`);
});
