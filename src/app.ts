import express from "express";

const app = express();
const port = 3001;

app.get("/health", (req, res) => {
  res.send("OK");
});

app.listen(port, () => {
  console.log(`Listening on port:${port}`);
});
