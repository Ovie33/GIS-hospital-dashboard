import { Router, type Request, type Response } from "express";
import { pool } from "../db/pool";
import { redis } from "../cache/redis";

type Params = { id: string };

interface MoveBody {
  lat: number;
  lng: number;
}

interface DbResult {
  id: number;
}

const router: Router = Router();

router.post(
  "/:id/move",
  async (
    req: Request<Params, unknown, MoveBody>,
    res: Response<{ ok: true } | { error: string }>
  ) => {
    const ambulanceId: number = Number(req.params.id);
    const { lat, lng } = req.body;

    if (!Number.isInteger(ambulanceId) || ambulanceId <= 0) {
      return res.status(400).json({ error: "Invalid ambulance id" });
    }

    if (typeof lat !== "number" || typeof lng !== "number") {
      return res.status(400).json({ error: "lat and lng must be numbers" });
    }

    // Update spatial location
    const result = await pool.query<DbResult>(
      `
      UPDATE ambulances
      SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography,
          updated_at = NOW()
      WHERE id = $3
      RETURNING id;
      `,
      [lng, lat, ambulanceId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Ambulance not found" });
    }

    // Invalidate all proximity caches
    const keys: string[] = await redis.keys("nearest_ambulance:hospital:*");
    if (keys.length > 0) {
      await redis.del(keys);
    }

    return res.json({ ok: true });
  }
);

export default router;
