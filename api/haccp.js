// Vercel Serverless Function: Panganify HACCP Image Analysis
// Uses Gemini Vision API. Key read from SERVER-side env var (GEMINI_API_KEY).
import { handleHaccp } from "../functions/handlers/haccpHandler.js";

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  return handleHaccp(req, res);
}
