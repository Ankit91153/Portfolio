// Vercel Serverless Function: Secure Resume Parser
// Keeps GROK_API_KEY, GROQ_API_KEY, and GEMINI_API_KEY 100% secret on the server!

const RESUME_SCHEMA_PROMPT = `You are an expert resume parser for ResumeKit Mobile App.
Extract all candidate information from the provided resume and return ONLY pure valid JSON in this EXACT structure (no markdown fences, no extra text):
{
  "personalInfo": {
    "fullName": "Candidate Full Name",
    "jobTitle": "Target or Current Job Title",
    "email": "candidate@example.com",
    "phone": "+91 98765 43210",
    "location": "City, State/Country",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "website": ""
  },
  "summary": "2-4 sentence professional summary",
  "experience": [
    {
      "jobTitle": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "startDate": "Mon YYYY",
      "endDate": "Mon YYYY or Present",
      "currentlyWorking": false,
      "description": "• Accomplishment 1\\n• Accomplishment 2"
    }
  ],
  "education": [
    {
      "degree": "Degree / Course",
      "institution": "College / University Name",
      "location": "City",
      "startDate": "YYYY",
      "endDate": "YYYY",
      "description": "Grade / Major / Highlights"
    }
  ],
  "skills": ["Skill 1", "Skill 2", "Skill 3"],
  "projects": [
    {
      "name": "Project Title",
      "description": "Detailed project description",
      "technologies": ["Tech 1", "Tech 2"],
      "projectUrl": "",
      "githubUrl": ""
    }
  ],
  "certifications": [
    {
      "name": "Certificate Title",
      "issuingOrganization": "Issuer / Platform",
      "issueDate": "YYYY",
      "credentialUrl": ""
    }
  ],
  "languages": [
    {
      "name": "English",
      "proficiency": "Professional"
    }
  ]
}`;

function cleanAndParseJson(input) {
  if (!input) return null;
  let str = input.trim();
  if (str.startsWith("```")) {
    str = str.replace(/^```(?:json)?\s*/i, "");
    str = str.replace(/\s*```$/, "");
  }
  const firstBrace = str.indexOf("{");
  const lastBrace = str.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    str = str.substring(firstBrace, lastBrace + 1);
  }
  return JSON.parse(str);
}

module.exports = async function handler(req, res) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const { fileBase64, rawText, mimeType, provider = "groq" } = req.body || {};

    const groqKey = process.env.GROQ_API_KEY || process.env.REACT_APP_GROQ_API_KEY;
    const grokKey = process.env.GROK_API_KEY || process.env.REACT_APP_GROK_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY || process.env.REACT_APP_GEMINI_API_KEY;

    let targetProvider = provider;
    let apiKey = "";

    if (targetProvider === "groq") {
      apiKey = groqKey;
    } else if (targetProvider === "grok") {
      apiKey = grokKey;
    } else if (targetProvider === "gemini") {
      apiKey = geminiKey;
    }

    // Auto-fallback: if chosen key missing, use whatever key is present
    if (!apiKey) {
      if (groqKey) {
        apiKey = groqKey;
        targetProvider = "groq";
      } else if (grokKey) {
        apiKey = grokKey;
        targetProvider = "grok";
      } else if (geminiKey) {
        apiKey = geminiKey;
        targetProvider = "gemini";
      }
    }

    if (!apiKey) {
      return res.status(400).json({
        error: "No AI API key found on server. Please configure GROQ_API_KEY in Vercel settings.",
      });
    }

    // 1. Call xAI Grok
    if (targetProvider === "grok") {
      const isImage = fileBase64 && (mimeType?.startsWith("image/") || fileBase64.startsWith("data:image"));
      const model = isImage ? "grok-2-vision-1212" : "grok-beta";

      let messages = [];
      if (isImage) {
        messages = [
          {
            role: "user",
            content: [
              { type: "text", text: RESUME_SCHEMA_PROMPT },
              {
                type: "image_url",
                image_url: { url: fileBase64, detail: "high" },
              },
            ],
          },
        ];
      } else {
        messages = [
          { role: "system", content: RESUME_SCHEMA_PROMPT },
          { role: "user", content: `Resume text:\n\n${rawText || ""}` },
        ];
      }

      const response = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        const errObj = await response.json().catch(() => ({}));
        throw new Error(errObj.error?.message || `Grok error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      return res.status(200).json({ success: true, data: cleanAndParseJson(content) });
    }

    // 2. Call Groq
    if (targetProvider === "groq") {
      const isImage = fileBase64 && (mimeType?.startsWith("image/") || fileBase64.startsWith("data:image"));
      const model = isImage ? "llama-3.2-11b-vision-preview" : "llama-3.3-70b-versatile";

      let messages = [];
      if (isImage) {
        messages = [
          {
            role: "user",
            content: [
              { type: "text", text: RESUME_SCHEMA_PROMPT },
              { type: "image_url", image_url: { url: fileBase64 } },
            ],
          },
        ];
      } else {
        messages = [
          { role: "system", content: RESUME_SCHEMA_PROMPT },
          { role: "user", content: `Resume text:\n\n${rawText || ""}` },
        ];
      }

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.1,
          response_format: { type: "json_object" },
        }),
      });

      if (!response.ok) {
        const errObj = await response.json().catch(() => ({}));
        throw new Error(errObj.error?.message || `Groq error: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      return res.status(200).json({ success: true, data: cleanAndParseJson(content) });
    }

    // 3. Call Google Gemini
    if (targetProvider === "gemini") {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      let parts = [{ text: RESUME_SCHEMA_PROMPT }];

      if (fileBase64) {
        const cleanBase64 = fileBase64.includes(",") ? fileBase64.split(",")[1] : fileBase64;
        parts.push({
          inlineData: {
            mimeType: mimeType || "application/pdf",
            data: cleanBase64,
          },
        });
      } else if (rawText) {
        parts.push({ text: `Resume Text:\n\n${rawText}` });
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      });

      if (!response.ok) {
        const errObj = await response.json().catch(() => ({}));
        throw new Error(errObj.error?.message || `Gemini error: ${response.statusText}`);
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return res.status(200).json({ success: true, data: cleanAndParseJson(textResponse) });
    }

    return res.status(400).json({ error: "Unsupported provider" });
  } catch (error) {
    console.error("API parse error:", error);
    return res.status(500).json({ error: error.message || "Failed to parse resume" });
  }
};
