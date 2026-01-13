import { Router } from "express";
import { pool } from "../db/pool";
import { Hospital } from "../types";

const router = Router();

router.get<{}, Hospital[]>("/", async (_req, res) => {
  const { rows } = await pool.query<Hospital>(`
    SELECT 
      id,
      name,
      ST_Y(location::geometry) AS lat,
      ST_X(location::geometry) AS lng
    FROM hospitals
  `);

  res.json(rows);
});

export default router;
