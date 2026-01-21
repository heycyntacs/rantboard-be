import { Request, Response } from "express";
import { drizzle } from "drizzle-orm/postgres-js";
import { rantsTable } from "../drizzle/schema";
import { desc } from "drizzle-orm";
import { TurnstileServerValidationResponse } from "@marsidev/react-turnstile";

const SECRET_KEY = process.env.SECRET_KEY;

const db = drizzle(process.env.DATABASE_URL!);
const verifyEndpoint =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const getRants = async (req: Request, res: Response) => {
  try {
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
  } catch (err) {
    console.error("GET /rants failed:", err);
    res.status(500).json({ error: "Failed to fetch rants" });
  }
};

export const addRant = async (req: Request, res: Response) => {
  const requiredFields = ["title", "content", "token"];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(", ")}`,
    });
  }

  const { title, content, token } = req.body || {};

  if (!SECRET_KEY) {
    return res.status(500).json({ error: "Missing secret key" });
  }

  try {
    const response = await fetch(verifyEndpoint, {
      method: "POST",
      body: `secret=${encodeURIComponent(SECRET_KEY)}&response=${encodeURIComponent(token)}`,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
    });

    const data = (await response.json()) as TurnstileServerValidationResponse;

    if (!data.success) {
      return res.status(500).json({ error: "Failed to post rant" });
    }

    await db.insert(rantsTable).values({
      created_at: new Date(),
      title,
      content,
    });

    res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error("POST /rant failed:", err);
    res.status(500).json({ error: "Failed to post rant" });
  }
};
