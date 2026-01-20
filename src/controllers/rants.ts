import { Request, Response } from "express";
import { drizzle } from "drizzle-orm/postgres-js";
import { rantsTable } from "../drizzle/schema";
import { desc } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export const getRants = async (req: Request, res: Response) => {
  const limit = Math.min(Number(req.query.limit) || 10, 50); // max 50
  const page = Math.max(Number(req.query.page) || 1, 1);

  const offset = (page - 1) * limit;

  const rants = await db
    .select()
    .from(rantsTable)
    .orderBy(desc(rantsTable.created_at))
    .limit(limit)
    .offset(offset);

  res.status(200).json({
    data: rants,
    pagination: {
      page,
      limit,
      count: rants.length,
      hasNextPage: rants.length === limit,
    },
    success: true,
  });
};

export const addRant = async (req: Request, res: Response) => {
  const requiredFields = ["title", "content"];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  const { title, content } = req.body || {};

  try {
    await db.insert(rantsTable).values({
      created_at: new Date(),
      title,
      content,
    });

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong on the server" });
  }
};
