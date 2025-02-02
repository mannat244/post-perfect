import { NextResponse } from "next/server";
const { getJson } = require("serpapi");
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function checkCORS(url) {
  try {
    const response = await fetch(url, { method: "HEAD", mode: "no-cors" });
    return response.ok; // If response is okay, CORS is allowed
  } catch (error) {
    return false; // Blocked by CORS
  }
}


export async function POST(req) {

  const body = await req.json();
  const topic = body.topic;
  const gemni = body.gemini;
  const serpapi = body.serpapi;

  const genAI = new GoogleGenerativeAI(gemni);
 // const genAI = new GoogleGenerativeAI("AIzaSyA0XvXVGfkCMFBeNI58aVKIKI3Skq_RADU");
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  let liveData = topic;

   await getJson({
    //api_key: "e4af0ebdf76190ffb35221397b50ebd3eb9eef02703f1f6940127d14524eb866",
    api_key: serpapi,
    engine: "google",
    q: topic,
    location: "India",
    google_domain: "google.co.in",
    gl: "in",
    hl: "en",
    device: "desktop"
  }, (json) => {
    liveData = JSON.stringify(json.organic_results);
  });

  const prompt = "You are a top-tier Instagram content creator. For the following topic"+ topic + "refer to following info: "+ liveData +", generate a JSON response containing: 3 things (all strings) a image (a concise image query, max 30 characters), and a (text) under 150 char, add newline characters after 50 chars to shift text first (Google Search, or Conduct brief research on the topic to ensure accuracy and relevance. Incorporate key findings or relevant information. Strive for originality and avoid generic content. Also remember that text fit into 3 lines by breaking it [about 50 characters per line] put key information, details, useful data), last caption (an engaging Instagram caption under 220 characters with relevant emojis and hashtags, encouraging audience interaction), comparable to that of our leading content creators, and ready for immediate posting on Instagram."

console.log(prompt)
const result = await model.generateContent(prompt);
const data = result.response.text();
const cleanJson = data.replace(/```json\n|\n```/g, '');
const read = JSON.parse(cleanJson);
let imageUrl = "";

await getJson({
  api_key: serpapi,
  engine: "google_images",
  google_domain: "google.co.in",
  q: read.image,
  hl: "en",
  gl: "in"
}, async(json) => {
  const ind = Math.floor(Math.random() * 3);
    imageUrl =  json.images_results[ind].original;
  
});



return NextResponse.json({"data":"Recieved", topic, read ,imageUrl})
}