import axios from 'axios';

export async function callAIAPI(messageHistory) {
  const API_KEY = "AIzaSyB5QHNzoqnb4hebySr0kX3uXSgPZodcbjs";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${API_KEY}`;

  const contents = messageHistory.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const payload = { contents };

  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': API_KEY
      }
    });
    
    const botMessage = response.data.candidates[0].content.parts[0].text;
    return botMessage || "(empty response)";
  } catch (error) {
    console.error("Error calling Gemini API:", error.response ? error.response.data : error.message);
    if (error.response && error.response.data.error) {
      return `❌ API Error: ${error.response.data.error.message}`;
    }
    return `❌ An unknown API error occurred.`;
  }
}