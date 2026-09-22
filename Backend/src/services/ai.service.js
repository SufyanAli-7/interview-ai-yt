const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const puppeteer = require("puppeteer")

const apiKey = process.env.GOOGLE_GENAI_API_KEY
const baseUrl = process.env.BASE_URL

const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
        baseUrl: baseUrl
    }
})

const interviewReportSchema = z.object({
    matchScore: z.number(),
    technicalQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    behavioralQuestions: z.array(z.object({
        question: z.string(),
        intention: z.string(),
        answer: z.string()
    })),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum([ "low", "medium", "high" ])
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })),
    title: z.string()
})

const resumePdfSchema = z.object({
    html: z.string()
})

function extractJson(text) {
    let clean = (text || "").trim()

    if (clean.startsWith("```json")) {
        clean = clean.slice(7)
    } else if (clean.startsWith("```")) {
        clean = clean.slice(3)
    }

    if (clean.endsWith("```")) {
        clean = clean.slice(0, -3)
    }

    clean = clean.trim()

    try {
        return JSON.parse(clean)
    } catch (err) {
        const firstBrace = clean.indexOf("{")
        const lastBrace = clean.lastIndexOf("}")
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
            return JSON.parse(clean.substring(firstBrace, lastBrace + 1))
        }
        throw err
    }
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `
Generate an interview report.

Resume:
${resume || "Not provided"}

Self Description:
${selfDescription || "Not provided"}

Job Description:
${jobDescription || "Not provided"}

Return ONLY valid JSON.
No Markdown.
No code fences.
No explanation.

Use exactly this structure:

{
  "matchScore": 0,
  "technicalQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "skillGaps": [
    {
      "skill": "string",
      "severity": "low"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "string",
      "tasks": ["string"]
    }
  ],
  "title": "string"
}

matchScore must be between 0 and 100.
severity must be low, medium, or high.
technicalQuestions: MUST provide at least 5 technical questions.
behavioralQuestions: MUST provide at least 5 behavioral questions.
skillGaps: MUST provide at least 5 skill gaps.
preparationPlan: MUST provide at least 7 days in the preparation roadmap (day 1 through at least day 7).
`

    const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt
    })

    const json = extractJson(response.text)
    const result = interviewReportSchema.parse(json)

    return result
}

function sanitizeHtmlLinks(html) {
    if (!html) return html

    // Fix markdown links inside href: href="[https://url](https://url)" -> href="https://url"
    let cleaned = html.replace(/href=["']\[([^\]]+)\]\(([^)]+)\)["']/gi, (match, p1, p2) => {
        return `href="${p2 || p1}"`
    })

    // Fix any raw markdown links inside HTML text: [Text](https://url) -> <a href="https://url" target="_blank">Text</a>
    cleaned = cleaned.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/gi, '<a href="$2" target="_blank" style="color: #0284c7; text-decoration: underline; cursor: pointer;">$1</a>')

    return cleaned
}

async function generatePdfFromHtml(htmlContent) {
    const cleanedHtml = sanitizeHtmlLinks(htmlContent)
    const browser = await puppeteer.launch({
        args: [ "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage" ],
        headless: true
    })
    const page = await browser.newPage()
    await page.setContent(cleanedHtml, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "20mm",
            // bottom: "20mm",
            // left: "15mm",
            // right: "15mm"
        }
    })

    await browser.close()

    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const prompt = `
Generate a tailored resume HTML for a candidate with the following details:

Resume:
${resume || "Not provided"}

Self Description:
${selfDescription || "Not provided"}

Job Description:
${jobDescription || "Not provided"}

The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured with CSS styling inside a <style> tag, making it easy to read, professional, and ATS-friendly.

CRITICAL HYPERLINK RULES:
1. ALL links (Projects, GitHub, LinkedIn, Portfolio, Email, Phone) MUST be standard HTML anchor tags: <a href="..." target="_blank">...</a>.
2. NEVER put markdown syntax like [url](url) inside href attributes or inside HTML. The href value must be a pure, clean URL string (e.g. href="https://github.com/username").
3. For email: <a href="mailto:email@example.com">email@example.com</a>
4. For phone: <a href="tel:+1234567890">+1234567890</a>
5. For profiles: <a href="https://linkedin.com/in/username" target="_blank">LinkedIn</a>, <a href="https://github.com/username" target="_blank">GitHub</a>, <a href="https://portfolio.com" target="_blank">Portfolio</a>
6. For projects: Make project titles clickable (<a href="https://..." target="_blank">Project Name</a>) OR provide clickable links like <a href="https://..." target="_blank">Live Demo</a> | <a href="https://..." target="_blank">GitHub Repo</a>.
7. Do NOT output raw plain text URLs without wrapping them in an <a href="..."> tag.
8. In the CSS <style> tag, ensure links have clear clickable styling:
   a { color: #0284c7; text-decoration: underline; cursor: pointer; }
   a:hover { color: #0369a1; }

Do NOT use canvas, tools, or artifacts.
Return ONLY valid JSON.
No Markdown fences, no explanation.

Use exactly this structure:
{
  "html": "<!DOCTYPE html><html><head><style>...</style></head><body>...</body></html>"
}
`

    const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt
    })

    const jsonContent = extractJson(response.text)
    const validated = resumePdfSchema.parse(jsonContent)

    const pdfBuffer = await generatePdfFromHtml(validated.html)

    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }
