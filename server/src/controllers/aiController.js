import { GoogleGenAI } from "@google/genai";
import Competition from "../models/Competition.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const chatWithAI = async (request, response, next) => {
  try {
    const { message } = request.body;

    // ==========================================
    // VALIDATE MESSAGE
    // ==========================================

    if (!message || typeof message !== "string") {
      return response.status(400).json({
        message: "Please provide a valid message.",
      });
    }

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      return response.status(400).json({
        message: "Message cannot be empty.",
      });
    }

    if (trimmedMessage.length > 2000) {
      return response.status(400).json({
        message:
          "Message is too long. Please keep it under 2000 characters.",
      });
    }

    // ==========================================
    // LOGGED-IN STUDENT CONTEXT
    // ==========================================

    const student = request.user;

    const studentContext = {
      name: student.name,
      class: student.class,
      medium: student.medium,
    };

    // ==========================================
    // GET GYANEXIA COMPETITION DATA
    // ==========================================

    const competitions = await Competition.find({})
      .select(
        "name tagline description eligibleClasses mode examDate prizeDetails subjectsAndTopics registrationOpen status"
      )
      .lean();

    const competitionContext =
      competitions.length > 0
        ? JSON.stringify(competitions, null, 2)
        : "No competition information is currently available.";

    // ==========================================
    // SEND CONTEXT TO GEMINI
    // ==========================================

    const result = await ai.models.generateContent({
      model: "gemini-3.6-flash",

      contents: trimmedMessage,

      config: {
        systemInstruction: `
You are Gyanexia AI, the friendly AI learning assistant for Gyanexia.

Gyanexia is an educational platform focused on helping school students
learn and participate in academic competitions.

You are currently assisting a logged-in Gyanexia student.

CURRENT STUDENT INFORMATION:

Name: ${studentContext.name}
Class: ${studentContext.class}
Medium: ${studentContext.medium}

IMPORTANT PRIVACY RULE:
Only use the student's name, class, and medium when useful.

Never mention or reveal:
- Mobile number
- Password
- JWT token
- Internal database IDs
- Other students' information
- Any private database information

CURRENT GYANEXIA COMPETITION INFORMATION:

${competitionContext}

IMPORTANT COMPETITION RULES:

- Treat the competition information above as the source of truth.
- Do not invent competition dates.
- Do not invent prizes.
- Do not invent registration information.
- Do not invent eligibility requirements.
- If something says "will be announced soon", tell the student
  that it has not been announced yet.
- If no relevant competition information exists, clearly say
  that you don't currently have that information.

When answering eligibility questions:

Compare the student's class with the competition's
eligibleClasses.

For example:

If the student is Class 8 and the competition allows Classes 5-12,
the student is eligible.

If the student's class is outside the allowed classes,
tell them they are not currently eligible.

GENERAL EDUCATIONAL QUESTIONS:

For mathematics, science, English, general knowledge,
study planning, and other academic questions:

- Explain concepts simply.
- Use age-appropriate language.
- Give examples when useful.
- Encourage learning and understanding.
- Give step-by-step explanations when appropriate.

Be friendly, encouraging, and concise unless the student
asks for a detailed explanation.

Never pretend to know information that is not provided
in the available Gyanexia context.
        `,
      },
    });

    return response.status(200).json({
      reply: result.text,
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return next(error);
  }
};