import { pdfjs } from "react-pdf";

// Ensure PDF.js worker is properly configured
if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

/**
 * Standard Sample JSON matching the exact ResumeKit Mobile App schema
 */
export const SAMPLE_EXPO_RESUME = {
  personalInfo: {
    fullName: "Rahul Sharma",
    jobTitle: "Senior Accountant & GST Specialist",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    linkedin: "https://linkedin.com/in/rahulsharma",
    github: "",
    website: "",
  },
  summary:
    "Dedicated Accountant with 3+ years of hands-on experience handling Tally Prime, GST filing (GSTR-1, 3B), TDS returns, bank reconciliations, and vendor invoice processing.",
  experience: [
    {
      id: "exp_1",
      jobTitle: "Accountant Executive",
      company: "Apex Logistics & Supply Chain Pvt Ltd",
      location: "Mumbai, Maharashtra",
      startDate: "Aug 2023",
      endDate: "Present",
      currentlyWorking: true,
      description:
        "• Processed over 250+ monthly vendor invoices and purchase vouchers in Tally Prime.\n• Prepared monthly GST reconciliation between books and GSTR-2B with zero variance.\n• Successfully filed quarterly TDS (24Q & 26Q) and coordinated annual financial audits.",
    },
    {
      id: "exp_2",
      jobTitle: "Junior Accounts Associate",
      company: "Kothari & Associates (CA Firm)",
      location: "Navi Mumbai",
      startDate: "Jun 2021",
      endDate: "Jul 2023",
      currentlyWorking: false,
      description:
        "• Managed daily daybook entries, petty cash handling, and bank deposit reconciliations.\n• Assisted senior auditors in drafting Balance Sheets and Profit & Loss accounts for 15+ SME clients.",
    },
  ],
  education: [
    {
      id: "edu_1",
      degree: "Bachelor of Commerce (B.Com) - Financial Accounting",
      institution: "Mumbai University",
      location: "Mumbai, Maharashtra",
      startDate: "2018",
      endDate: "2021",
      description:
        "First Class with Distinction. Core coursework in Taxation, Auditing, and Corporate Finance.",
    },
  ],
  skills: [
    "Tally Prime & ERP 9",
    "GST Filing (GSTR-1, 3B)",
    "TDS & TCS Returns",
    "Advanced MS Excel (VLOOKUP, Pivot)",
    "Bank Reconciliation (BRS)",
    "Balance Sheet Preparation",
    "Vendor Billing",
  ],
  projects: [
    {
      id: "prj_1",
      name: "Automated GST Reco Tool",
      description:
        "Created an Excel macro-enabled sheet to cross-verify GSTR-2B with internal purchase register.",
      technologies: ["Advanced Excel", "VBA"],
      projectUrl: "",
      githubUrl: "",
    },
  ],
  certifications: [
    {
      id: "cert_1",
      name: "Certified Tally Professional (TallyPrime 4.0)",
      issuingOrganization: "Tally Education Pvt Ltd",
      issueDate: "2022",
      credentialUrl: "",
    },
  ],
  languages: [
    {
      id: "lng_1",
      name: "English",
      proficiency: "Professional",
    },
    {
      id: "lng_2",
      name: "Hindi",
      proficiency: "Native",
    },
  ],
};

/**
 * Dynamically loads Tesseract.js from CDN if not already loaded
 */
export async function loadTesseractFromCdn() {
  if (typeof window === "undefined") return null;
  if (window.Tesseract) return window.Tesseract;

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("tesseract-cdn-script");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.Tesseract));
      return;
    }

    const script = document.createElement("script");
    script.id = "tesseract-cdn-script";
    script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
    script.async = true;
    script.onload = () => {
      if (window.Tesseract) {
        resolve(window.Tesseract);
      } else {
        reject(new Error("Tesseract failed to initialize"));
      }
    };
    script.onerror = () => reject(new Error("Failed to load Tesseract.js script from CDN"));
    document.body.appendChild(script);
  });
}

/**
 * Extract full text from a PDF file using PDF.js
 */
export async function extractTextFromPdf(file, onProgress) {
  if (onProgress) onProgress({ status: "loading", progress: 0.1, message: "Reading PDF file..." });

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const totalPages = pdf.numPages;
  let fullText = "";

  for (let i = 1; i <= totalPages; i++) {
    if (onProgress) {
      onProgress({
        status: "extracting",
        progress: 0.1 + (i / totalPages) * 0.8,
        message: `Reading page ${i} of ${totalPages}...`,
      });
    }

    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();

    // Group text items by line based on vertical position (transform[5])
    let lastY = null;
    let pageText = "";

    for (const item of textContent.items) {
      const currentY = item.transform ? Math.round(item.transform[5]) : null;
      if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
        pageText += "\n";
      } else if (pageText && !pageText.endsWith(" ") && !pageText.endsWith("\n")) {
        pageText += " ";
      }
      pageText += item.str;
      lastY = currentY;
    }

    fullText += pageText + "\n\n";
  }

  if (onProgress) onProgress({ status: "complete", progress: 1.0, message: "PDF text extracted successfully!" });
  return fullText.trim();
}

/**
 * Extract text from an Image file using Tesseract.js OCR
 */
export async function extractTextFromImage(file, onProgress) {
  if (onProgress) onProgress({ status: "loading_ocr", progress: 0.1, message: "Initializing OCR Engine..." });

  const Tesseract = await loadTesseractFromCdn();
  if (!Tesseract) throw new Error("Could not load OCR library.");

  const worker = await Tesseract.createWorker("eng", 1, {
    logger: (m) => {
      if (m.status === "recognizing text" && onProgress) {
        const p = 0.2 + (m.progress || 0) * 0.75;
        onProgress({
          status: "recognizing",
          progress: Math.min(0.95, p),
          message: `Scanning text from image: ${Math.round((m.progress || 0) * 100)}%`,
        });
      }
    },
  });

  // Convert File to Object URL or ImageBitmap
  const imageUrl = URL.createObjectURL(file);

  try {
    const ret = await worker.recognize(imageUrl);
    await worker.terminate();
    URL.revokeObjectURL(imageUrl);

    if (onProgress) onProgress({ status: "complete", progress: 1.0, message: "OCR Scan completed!" });
    return ret.data.text.trim();
  } catch (err) {
    URL.revokeObjectURL(imageUrl);
    await worker.terminate();
    throw err;
  }
}

/**
 * Direct multimodal extraction using Google Gemini API (if user provides key)
 */
export async function extractWithGemini(apiKey, { file, rawText, mimeType }) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const systemPrompt = `You are an expert resume parser for ResumeKit Mobile App.
Extract all resume details and format them into this EXACT JSON structure without any additional markdown formatting or explanation:
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
      "description": "Grade / Major / Achievements"
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
}
Return ONLY pure JSON.`;

  let parts = [{ text: systemPrompt }];

  if (file) {
    const base64Data = await fileToBase64(file);
    parts.push({
      inlineData: {
        mimeType: mimeType || file.type || "application/pdf",
        data: base64Data.split(",")[1] || base64Data,
      },
    });
    parts.push({
      text: "Please extract all candidate information from this attached document/image into the exact ResumeKit JSON format specified.",
    });
  } else if (rawText) {
    parts.push({
      text: `Resume Text:\n\n${rawText}\n\nPlease parse this resume text into the exact ResumeKit JSON format specified.`,
    });
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textResponse) throw new Error("No response returned from Gemini API");

  return cleanAndParseJson(textResponse);
}

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

/**
 * Extraction using xAI Grok API (grok-2-vision-1212 or grok-beta)
 */
export async function extractWithGrok(apiKey, { file, rawText, mimeType }) {
  const endpoint = "https://api.x.ai/v1/chat/completions";
  let messages = [];
  let model = "grok-beta";

  if (file && (file.type?.startsWith("image/") || mimeType?.startsWith("image/"))) {
    model = "grok-2-vision-1212";
    const base64Data = await fileToBase64(file);
    messages = [
      {
        role: "user",
        content: [
          { type: "text", text: RESUME_SCHEMA_PROMPT },
          {
            type: "image_url",
            image_url: {
              url: base64Data,
              detail: "high",
            },
          },
        ],
      },
    ];
  } else {
    // For text or PDF text
    messages = [
      {
        role: "system",
        content: RESUME_SCHEMA_PROMPT,
      },
      {
        role: "user",
        content: `Resume text:\n\n${rawText || "Please parse the provided candidate information."}`,
      },
    ];
  }

  const response = await fetch(endpoint, {
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
    throw new Error(errObj.error?.message || `Grok API error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("Empty response from Grok API");

  return cleanAndParseJson(content);
}

/**
 * Extraction using Groq API (High-speed free tier: qwen/qwen3.8-27b & openai/gpt-oss-120b)
 */
export async function extractWithGroq(apiKey, { file, rawText, mimeType }) {
  const endpoint = "https://api.groq.com/openai/v1/chat/completions";
  const isImage = file && (file.type?.startsWith("image/") || mimeType?.startsWith("image/"));
  
  const candidateModels = isImage
    ? ["qwen/qwen3.8-27b"]
    : ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "openai/gpt-oss-20b"];

  let lastError = null;

  for (const model of candidateModels) {
    try {
      let messages = [];
      if (isImage) {
        const base64Data = await fileToBase64(file);
        messages = [
          {
            role: "user",
            content: [
              { type: "text", text: RESUME_SCHEMA_PROMPT },
              {
                type: "image_url",
                image_url: {
                  url: base64Data,
                },
              },
            ],
          },
        ];
      } else {
        messages = [
          {
            role: "system",
            content: RESUME_SCHEMA_PROMPT,
          },
          {
            role: "user",
            content: `Resume text:\n\n${rawText || "Please parse the candidate information."}`,
          },
        ];
      }

      const response = await fetch(endpoint, {
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
        const msg = errObj.error?.message || response.statusText;
        lastError = new Error(`Groq (${model}): ${msg}`);
        // If model not found (404), try next model
        if (response.status === 404 || msg.includes("does not exist")) {
          continue;
        }
        throw lastError;
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Empty response from Groq API");
      }

      return cleanAndParseJson(content);
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error("Failed to extract with Groq");
}

/**
 * Try Vercel Serverless Backend API first (keeps GROK_API_KEY 100% hidden and private on server)
 */
export async function tryServerApiExtraction({ file, rawText, mimeType, provider }) {
  try {
    let fileBase64 = null;
    if (file) {
      fileBase64 = await fileToBase64(file);
    }
    const res = await fetch("/api/parse-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileBase64,
        rawText,
        mimeType: mimeType || file?.type,
        provider,
      }),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        return json.data;
      }
    }
  } catch (err) {
    // If running in development without serverless function or static host, silently fall back
    console.log("Server API not available, using client fallback:", err);
  }
  return null;
}

/**
 * Universal AI extractor based on configured provider
 */
export async function extractWithSelectedAi({ provider = "grok", apiKey, file, rawText, mimeType }) {
  // 1. Try Vercel server-side endpoint first (secure, no client exposure)
  const serverResult = await tryServerApiExtraction({ file, rawText, mimeType, provider });
  if (serverResult) return serverResult;

  // 2. Fall back to client-side direct call if user entered key in UI
  if (!apiKey || !apiKey.trim()) return null;

  if (provider === "grok") {
    return extractWithGrok(apiKey.trim(), { file, rawText, mimeType });
  } else if (provider === "groq") {
    return extractWithGroq(apiKey.trim(), { file, rawText, mimeType });
  } else if (provider === "gemini") {
    return extractWithGemini(apiKey.trim(), { file, rawText, mimeType });
  }

  return null;
}

/**
 * Convert file to base64 data URL
 */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Intelligent deterministic In-Browser Heuristic Parser
 * Parses raw text extracted from PDF, OCR, or pasted text into ResumeKit JSON schema.
 */
export function parseResumeTextHeuristic(rawText) {
  if (!rawText || !rawText.trim()) {
    return SAMPLE_EXPO_RESUME;
  }

  const text = rawText.replace(/\r\n/g, "\n");
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. Extract Contact & Personal Info
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0].trim() : "";

  // Phone regex (Indian +91, 10-digit, or international formats)
  const phoneRegex = /(?:(?:\+|0{0,2})91[\s-]?)?[6789]\d{9}|(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
  const phoneMatch = text.match(phoneRegex);
  const phone = phoneMatch ? phoneMatch[0].trim() : "";

  // LinkedIn
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[A-Za-z0-9_.-]+/i;
  const linkedinMatch = text.match(linkedinRegex);
  let linkedin = linkedinMatch ? linkedinMatch[0] : "";
  if (linkedin && !linkedin.startsWith("http")) linkedin = `https://${linkedin}`;

  // GitHub
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[A-Za-z0-9_.-]+/i;
  const githubMatch = text.match(githubRegex);
  let github = githubMatch ? githubMatch[0] : "";
  if (github && !github.startsWith("http")) github = `https://${github}`;

  // Website / Portfolio
  const urlRegex = /https?:\/\/(?!www\.linkedin\.com|linkedin\.com|github\.com)[A-Za-z0-9_.-]+\.[A-Za-z]{2,}(?:\/[^\s]*)?/i;
  const urlMatch = text.match(urlRegex);
  const website = urlMatch ? urlMatch[0] : "";

  // Location detection
  const locationRegex = /\b(Mumbai|Delhi|Bangalore|Bengaluru|Hyderabad|Chennai|Kolkata|Pune|Ahmedabad|Jaipur|Lucknow|Noida|Gurgaon|Gurugram|Chandigarh|Indore|Nagpur|Bhopal|Patna|Vadodara|Surat|Kerala|Goa|India|San Francisco|New York|London|Dubai|Singapore|Remote|USA|UK)\b/i;
  const locationMatch = text.match(locationRegex);
  let location = locationMatch ? locationMatch[0] : "";

  // Detect Full Name (Usually first 1-3 lines, excluding title / email / phone)
  let fullName = "";
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const l = lines[i];
    if (
      !l.includes("@") &&
      !l.includes("http") &&
      !l.includes("www.") &&
      !/\d{5,}/.test(l) &&
      !/curriculum|resume|biodata|page|profile|contact/i.test(l) &&
      l.length > 2 &&
      l.length < 40 &&
      !fullName
    ) {
      fullName = l;
      break;
    }
  }
  if (!fullName) fullName = "Candidate";

  // Job Title detection near the top
  let jobTitle = "";
  const roleKeywords = [
    "Software Engineer", "Full Stack Developer", "Frontend Developer", "Backend Developer",
    "React Native Developer", "Web Developer", "Data Scientist", "UI/UX Designer",
    "Product Manager", "Accountant", "GST Specialist", "Executive", "Architect", "Analyst",
    "DevOps Engineer", "Cloud Engineer", "Mobile App Developer", "Intern"
  ];
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const l = lines[i];
    if (l === fullName) continue;
    for (const rk of roleKeywords) {
      if (new RegExp(rk, "i").test(l)) {
        jobTitle = l;
        break;
      }
    }
    if (jobTitle) break;
  }
  if (!jobTitle) jobTitle = "Professional";

  // 2. Identify Sections by Header Patterns
  const sectionHeaders = [
    { key: "summary", regex: /^(?:professional\s+)?(?:summary|profile|about\s+me|objective|career\s+objective)\b/i },
    { key: "experience", regex: /^(?:work\s+)?(?:experience|employment|work\s+history|professional\s+experience)\b/i },
    { key: "education", regex: /^(?:education|academics|academic\s+background|qualifications)\b/i },
    { key: "skills", regex: /^(?:technical\s+)?(?:skills|core\s+competencies|technologies|tools\s+&\s+technologies|skills\s+&\s+tools)\b/i },
    { key: "projects", regex: /^(?:projects|key\s+projects|personal\s+projects|academic\s+projects)\b/i },
    { key: "certifications", regex: /^(?:certifications|certificates|licenses|achievements)\b/i },
    { key: "languages", regex: /^(?:languages|languages\s+known)\b/i },
  ];

  // Map each line to section
  const sectionBlocks = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    misc: [],
  };

  let currentSection = "misc";

  for (const line of lines) {
    let matchedHeader = null;
    for (const sh of sectionHeaders) {
      // Check if line is short and matches section header
      if (line.length < 50 && sh.regex.test(line.replace(/[^a-zA-Z\s]/g, "").trim())) {
        matchedHeader = sh.key;
        break;
      }
    }

    if (matchedHeader) {
      currentSection = matchedHeader;
    } else {
      sectionBlocks[currentSection].push(line);
    }
  }

  // 3. Process Summary
  let summary = sectionBlocks.summary.join(" ").trim();
  if (!summary && sectionBlocks.misc.length > 2) {
    // If no explicit summary header, check if lines 2-5 form a paragraph
    const potentialSummary = sectionBlocks.misc.slice(1, 4).join(" ");
    if (potentialSummary.length > 40 && !potentialSummary.includes("@")) {
      summary = potentialSummary;
    }
  }

  // 4. Process Skills
  let skills = [];
  const skillsText = sectionBlocks.skills.join(", ");
  if (skillsText) {
    skills = skillsText
      .split(/[,•|•\n\t]+/)
      .map((s) => s.replace(/^[-•*]\s*/, "").trim())
      .filter((s) => s.length > 1 && s.length < 40 && !/^(skills|technologies|tools|languages)$/i.test(s));
    // Remove duplicates
    skills = [...new Set(skills)].slice(0, 25);
  }

  // If no skills extracted, look for common tech keywords in the entire text
  if (skills.length === 0) {
    const commonTech = [
      "JavaScript", "TypeScript", "React", "React Native", "Node.js", "Express",
      "Python", "HTML5", "CSS3", "MongoDB", "PostgreSQL", "SQL", "Git", "GitHub",
      "Docker", "AWS", "Firebase", "Redux", "Zustand", "Tailwind CSS", "Bootstrap",
      "REST API", "GraphQL", "Tally Prime", "MS Excel", "GST Filing", "Figma"
    ];
    for (const tech of commonTech) {
      if (new RegExp(`\\b${tech.replace("+", "\\+")}\\b`, "i").test(text)) {
        skills.push(tech);
      }
    }
  }

  // 5. Process Experience
  const experience = [];
  const expLines = sectionBlocks.experience;
  let currentExp = null;
  const dateRegex = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s.]*)?(?:19|20)\d{2}\s*(?:-|–|to)\s*(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s.]*(?:19|20)\d{2}|Present|Current|Till Date)/i;

  for (let i = 0; i < expLines.length; i++) {
    const line = expLines[i];
    const hasDate = dateRegex.test(line);

    if (hasDate || (!currentExp && line.length < 60)) {
      if (currentExp && (currentExp.company || currentExp.jobTitle)) {
        currentExp.description = currentExp.bullets.join("\n").trim();
        experience.push(currentExp);
      }

      const dateMatch = line.match(dateRegex);
      const dateStr = dateMatch ? dateMatch[0] : "";
      const dates = dateStr.split(/(?:-|–|to)/i).map((d) => d.trim());

      const isCurrentlyWorking = /present|current/i.test(dateStr);

      // Clean line without date
      const textWithoutDate = line.replace(dateRegex, "").trim();

      currentExp = {
        id: `exp_${experience.length + 1}`,
        jobTitle: textWithoutDate || "Team Member",
        company: "Company",
        location: location || "",
        startDate: dates[0] || "",
        endDate: dates[1] || (isCurrentlyWorking ? "Present" : ""),
        currentlyWorking: isCurrentlyWorking,
        bullets: [],
      };
    } else if (currentExp) {
      if (/^[•\-*]/.test(line)) {
        currentExp.bullets.push(`• ${line.replace(/^[•\-*]\s*/, "").trim()}`);
      } else if (!currentExp.company || currentExp.company === "Company") {
        currentExp.company = line;
      } else {
        currentExp.bullets.push(`• ${line}`);
      }
    }
  }

  if (currentExp && (currentExp.company || currentExp.jobTitle)) {
    currentExp.description = currentExp.bullets.join("\n").trim();
    experience.push(currentExp);
  }

  // 6. Process Education
  const education = [];
  const eduLines = sectionBlocks.education;
  const degreeRegex = /\b(B\.Tech|B\.E|BCA|MCA|M\.Tech|B\.Com|M\.Com|B\.Sc|M\.Sc|BBA|MBA|Bachelor|Master|Diploma|High School|Class XII|Class X|CBSE|ICSE)\b/i;

  for (let i = 0; i < eduLines.length; i++) {
    const line = eduLines[i];
    if (degreeRegex.test(line) || (!education.length && line.length < 70)) {
      const yearMatch = line.match(/(?:19|20)\d{2}(?:\s*(?:-|–|to)\s*(?:19|20)\d{2})?/);
      const nextLine = eduLines[i + 1] || "";

      education.push({
        id: `edu_${education.length + 1}`,
        degree: line.replace(/(?:19|20)\d{2}.*/, "").trim() || "Degree",
        institution: nextLine && !degreeRegex.test(nextLine) ? nextLine : "University",
        location: location || "",
        startDate: yearMatch ? yearMatch[0].split("-")[0]?.trim() || "" : "",
        endDate: yearMatch ? yearMatch[0].split("-")[1]?.trim() || "" : "",
        description: "",
      });
    }
  }

  // 7. Process Projects
  const projects = [];
  const projLines = sectionBlocks.projects;
  let currentProj = null;

  for (const line of projLines) {
    if (line.length < 50 && !line.startsWith("•") && !line.startsWith("-")) {
      if (currentProj) projects.push(currentProj);
      currentProj = {
        id: `prj_${projects.length + 1}`,
        name: line.replace(/[:|-].*$/, "").trim(),
        description: "",
        technologies: [],
        projectUrl: "",
        githubUrl: "",
      };
    } else if (currentProj) {
      if (/tech(?:nologies| stack)?:/i.test(line)) {
        const techs = line.replace(/.*tech(?:nologies| stack)?:\s*/i, "").split(/[,|]/).map((t) => t.trim()).filter(Boolean);
        currentProj.technologies = techs;
      } else {
        currentProj.description += (currentProj.description ? " " : "") + line.replace(/^[•\-*]\s*/, "");
      }
    }
  }
  if (currentProj) projects.push(currentProj);

  // 8. Process Certifications
  const certifications = [];
  for (const line of sectionBlocks.certifications) {
    if (line.length > 5 && line.length < 80) {
      certifications.push({
        id: `cert_${certifications.length + 1}`,
        name: line.replace(/^[•\-*]\s*/, "").trim(),
        issuingOrganization: "",
        issueDate: "",
        credentialUrl: "",
      });
    }
  }

  // 9. Process Languages
  const languages = [];
  const knownLangs = ["English", "Hindi", "Bengali", "Marathi", "Telugu", "Tamil", "Gujarati", "Urdu", "Kannada", "Spanish", "French", "German"];
  for (const lang of knownLangs) {
    if (new RegExp(`\\b${lang}\\b`, "i").test(text)) {
      languages.push({
        id: `lng_${languages.length + 1}`,
        name: lang,
        proficiency: lang === "Hindi" || lang === "English" ? "Professional" : "Intermediate",
      });
    }
  }

  return {
    personalInfo: {
      fullName,
      jobTitle,
      email,
      phone,
      location,
      linkedin,
      github,
      website,
    },
    summary,
    experience: experience.length ? experience : SAMPLE_EXPO_RESUME.experience,
    education: education.length ? education : SAMPLE_EXPO_RESUME.education,
    skills: skills.length ? skills : SAMPLE_EXPO_RESUME.skills,
    projects: projects.length ? projects : SAMPLE_EXPO_RESUME.projects,
    certifications: certifications.length ? certifications : SAMPLE_EXPO_RESUME.certifications,
    languages: languages.length ? languages : SAMPLE_EXPO_RESUME.languages,
  };
}

/**
 * Strips code markdown fences and cleans JSON
 */
export function cleanAndParseJson(input) {
  if (!input) return null;
  let str = input.trim();

  // Strip ```json ... ``` fences
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

/**
 * Validates whether the given JSON conforms to ResumeKit's validator
 */
export function validateForResumeKit(data) {
  if (!data || typeof data !== "object") {
    return { valid: false, error: "Data is not a valid JSON object." };
  }

  const root = data.data || data.resume || data;
  const p = root.personalInfo || {};

  const hasContent =
    (p.fullName && p.fullName.trim().length > 0) ||
    (p.jobTitle && p.jobTitle.trim().length > 0) ||
    (root.summary && root.summary.trim().length > 0) ||
    (Array.isArray(root.experience) && root.experience.length > 0) ||
    (Array.isArray(root.skills) && root.skills.length > 0) ||
    (Array.isArray(root.education) && root.education.length > 0);

  if (!hasContent) {
    return {
      valid: false,
      error: "JSON has missing candidate name, experience, or skills. Please verify fields.",
    };
  }

  return {
    valid: true,
    stats: {
      candidateName: p.fullName || "Candidate",
      jobTitle: p.jobTitle || "Professional",
      skillsCount: Array.isArray(root.skills) ? root.skills.length : 0,
      expCount: Array.isArray(root.experience) ? root.experience.length : 0,
      eduCount: Array.isArray(root.education) ? root.education.length : 0,
      projCount: Array.isArray(root.projects) ? root.projects.length : 0,
    },
  };
}
