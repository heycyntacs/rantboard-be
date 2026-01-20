import { Request, Response } from "express";
import { drizzle } from "drizzle-orm/postgres-js";
import { rantsTable } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

export const getRants = async (req: Request, res: Response) => {
  const { limit = 10 } = req.query;

  const rants = await db.select().from(rantsTable).limit(Number(limit));

  res.status(200).json({
    data: rants,
  });
};

export const addRant = async (req: Request, res: Response) => {
  const requiredFields = ["title", "content"]; // ✅ add more fields here dynamically

  // Find missing fields
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  console.log(req.body);

  const { title, content } = req.body || {};

  try {
    const rant = await db.insert(rantsTable).values({
      created_at: new Date(),
      title,
      content,
    });

    console.log(rant);

    res.status(200).json({
      data: rant,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong on the server" });
  }
};
