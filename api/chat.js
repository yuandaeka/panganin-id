// Vercel Serverless Function: Panganify AI Chatbot
// Reads API keys from SERVER-side env vars (DEEPSEEK_API_KEY / GEMINI_API_KEY).
import { handleChat } from "../functions/handlers/chatHandler.js";

export const config = {
  maxDuration: 60,
};

export default async function handler(req, res) {
  return handleChat(req, res);
}
