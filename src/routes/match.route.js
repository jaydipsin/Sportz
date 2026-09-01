import { Router } from "express";
import {
  listMatchesQuerySchema,
  createMatchSchema,
} from "../validation/matches.js";
import { db } from "../db.js";
import { matches } from "../schema.js";
import {getMatchStatus} from "./../utils/match-status.js"

export const matchRouter = Router();

matchRouter.get("/", async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.errors,
    });
  }

  const limit = Math.min(parsed.data.limit || 25, 100);

  try {
    const matchList = await db
      .select()
      .from(matches)
      .orderBy(matches.createdAt, "desc")
      .limit(limit);

    return res.json({
      success: true,
      matches: matchList,
    });
  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      success: false,
      error: "internal server error",
    });
  }
});

matchRouter.post("/", async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ success: false, error: parsed.error.errors });
  }

  try {
    const [event] = await db
      .insert(matches)
      .values({
        ...parsed.data,
        startTime: new Date(parsed.data.startTime),
        endTime: new Date(parsed.data.endTime),
        homeScore: parsed.data.homeScore ?? 0,
        awayScore: parsed.data.awayScore ?? 0,
        status: getMatchStatus(
          parsed.data.startTime,
          parsed.data.endTime,
          new Date(),
        ),
      })
      .returning();

    if (res.app.locals.broadcastMatchCreated) {
      res.app.locals.broadcastMatchCreated(event);
    }

    return res.status(201).json({ success: true, match: event });
  } catch (e) {
    console.log("ERROR ", e);
    res.status(500).json({
      success: false,
      error: "internal server error",
      details: parsed.error.issues,
    });
  }
});
