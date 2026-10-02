import { onRequest } from "firebase-functions/v2/https";
import { handleChat } from "./handlers/chatHandler.js";
import { handleHaccp } from "./handlers/haccpHandler.js";

export const api = onRequest(
  {
    cors: true,
    timeoutSeconds: 60,
    maxInstances: 10,
  },
  async (req, res) => {
    // Determine route from req.path or req.url
    const path = (req.path || req.url || "").toLowerCase();

    if (path.endsWith("/chat") || path.includes("/chat")) {
      return handleChat(req, res);
    }

    if (path.endsWith("/haccp") || path.includes("/haccp")) {
      return handleHaccp(req, res);
    }

    res.status(404).json({ error: "Endpoint not found" });
  }
);
