import { z } from 'zod';

/**
 * Match status constants in lowercase
 */
export const MATCH_STATUS = Object.freeze({
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
});

/**
 * Helper to check if a string is a valid ISO date string
 */
const isValidIsoDate = (val) => !isNaN(Date.parse(val));

/**
 * Schema for listing matches query parameters
 * Validates optional limit as a coerced positive integer with max 100
 */
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

/**
 * Schema for match ID route parameter
 * Validates required id as a coerced positive integer
 */
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Schema for creating a match
 * - sport, homeTeam, awayTeam: non-empty strings
 * - startTime, endTime: strings refined to verify valid ISO date strings
 * - homeScore, awayScore: optional coerced non-negative integers
 * - superRefine check: ensures endTime is chronologically after startTime
 */
export const createMatchSchema = z
  .object({
    sport: z.string().min(1, 'Sport is required'),
    homeTeam: z.string().min(1, 'Home team is required'),
    awayTeam: z.string().min(1, 'Away team is required'),
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    const startTimeMs = new Date(data.startTime).getTime();
    const endTimeMs = new Date(data.endTime).getTime();

    if (!isNaN(startTimeMs) && !isNaN(endTimeMs) && endTimeMs <= startTimeMs) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'endTime must be chronologically after startTime',
        path: ['endTime'],
      });
    }
  });

/**
 * Schema for updating match scores
 * Requires homeScore and awayScore as coerced non-negative integers
 */
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
