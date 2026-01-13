import { Router, type Request, type Response } from "express";
import { pool } from "../db/pool";
import { redis } from "../cache/redis";
import type { NearestAmbulanceCachedValue, NearestAmbulanceResponse } from "../types";

type Params = { id: string };

interface NearestRow {
  id: number;
  name: string;
  lat: number | string;
  lng: number | string;
  distance_meters: number | string;
}

const router: Router = Router();

router.get(
  "/:id/nearest-ambulance",
  async (
    req: Request<Params>,
    res: Response<NearestAmbulanceResponse | { error: string }>
  ) => {
    const hospitalId: number = Number(req.params.id);
    if (!Number.isInteger(hospitalId) || hospitalId <= 0) {
      return res.status(400).json({ error: "Invalid hospital id" });
    }

    const cacheKey: string = `nearest_ambulance:hospital:${hospitalId}`;

    // Cache lookup
    const cachedJson: string | null = await redis.get(cacheKey);
    if (cachedJson) {
      const cachedValue: NearestAmbulanceCachedValue = JSON.parse(cachedJson) as NearestAmbulanceCachedValue;
      return res.json({ ...cachedValue, cached: true });
    }

    // PostGIS query
    const result = await pool.query<NearestRow>(
      `
      SELECT
        a.id,
        a.name,
        ST_Y(a.location::geometry) AS lat,
        ST_X(a.location::geometry) AS lng,
        ST_Distance(h.location, a.location) AS distance_meters
      FROM hospitals h
      JOIN ambulances a ON true
      WHERE h.id = $1
      ORDER BY distance_meters
      LIMIT 1;
      `,
      [hospitalId]
    );

    const row: NearestRow | undefined = result.rows[0];
    if (!row) {
      return res.status(404).json({ error: "Hospital not found or no ambulances available" });
    }

    const lat: number = typeof row.lat === "number" ? row.lat : Number(row.lat);
    const lng: number = typeof row.lng === "number" ? row.lng : Number(row.lng);
    const distanceMeters: number =
      typeof row.distance_meters === "number" ? row.distance_meters : Number(row.distance_meters);

    const valueToCache: NearestAmbulanceCachedValue = {
      ambulance: { id: row.id, name: row.name, lat, lng },
      distanceMeters,
    };

    await redis.setEx(cacheKey, 60, JSON.stringify(valueToCache));

    return res.json({ ...valueToCache, cached: false });
  }
);

export default router;
