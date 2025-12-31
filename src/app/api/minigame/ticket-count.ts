import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

function getToken(req: NextApiRequest) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
    return authHeader.replace("Bearer ", "");
  }
  return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const backendRes = await axios.get(
      "https://pengoo-back-end.vercel.app/minigame/ticket-count",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.status(200).json(backendRes.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      res.status(err.response?.status || 500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}