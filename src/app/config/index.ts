import dotenv from "dotenv";
dotenv.config();

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const apiKey = process.env.NEXT_PUBLIC_API_KEY;

export { apiBaseUrl, apiKey };
