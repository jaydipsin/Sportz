import { Router } from "express";

export const matchRouter = Router();

matchRouter.get('/', async (req, res) => {
    const parsed = listMatchesQuerySchema.safeParse(req.query);

    if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.errors })
    }

    const limit = Math.min(parsed.data.limit || 25, 100);
    try {
        const matches = await db.select().from(matches).orderBy(matches.createdAt, 'desc').limit(limit);
        res.json({ success: true, matches });
    } catch (error) {
        res.status(500).json({ success: false, error: 'internal server error' });
    }

})

matchRouter.post('/', async (req, res) => {
    const parsed = createMatchSchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.errors })
    }

    try {
        const [event] = await db.insert(matches).values({
            ...parsed.data,
            startTime: new Date(parsed.data.startTime),
            endTime: new Date(parsed.data.endTime),
            homeScore: parsed.data.homeScore ?? 0,
            awayScore: parsed.data.awayScore ?? 0,
            status: getMatchStatus(parsed.data.startTime, parsed.data.endTime, new Date()),
        }).returning()

        return res.status(201).json({ success: true, match: event })

    } catch (e) {
        console.error(e)
        res.status(500).json({ success: false, error: 'internal server error' })
    }

})