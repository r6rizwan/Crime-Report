const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const VALID_CATEGORIES = [
    "Theft",
    "Assault",
    "Fraud",
    "Vandalism",
    "Harassment",
    "Cybercrime",
    "Missing Person",
    "Other",
];
const VALID_PRIORITIES = ["Low", "Medium", "High", "Critical"];

const SYSTEM_PROMPT =
    'You are a complaint triage assistant for a crime reporting portal. Given a complaint description, respond ONLY with a valid JSON object with three fields: suggestedCategory (one of: Theft, Assault, Fraud, Vandalism, Harassment, Cybercrime, Missing Person, Other), suggestedPriority (one of: Low, Medium, High, Critical), and reasoning (one sentence explaining why). No markdown, no extra text.';

const isValidSuggestion = (result) => {
    if (!result || typeof result !== "object") return false;

    const { suggestedCategory, suggestedPriority, reasoning } = result;

    return (
        VALID_CATEGORIES.includes(suggestedCategory) &&
        VALID_PRIORITIES.includes(suggestedPriority) &&
        typeof reasoning === "string" &&
        reasoning.trim().length > 0
    );
};

export const getAITriage = async (description) => {
    try {
        if (!process.env.GROQ_API_KEY) {
            return null;
        }

        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: description },
                ],
                temperature: 0.2,
            }),
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const content = data?.choices?.[0]?.message?.content;

        if (!content || typeof content !== "string") {
            return null;
        }

        const parsed = JSON.parse(content);

        if (!isValidSuggestion(parsed)) {
            return null;
        }

        return {
            suggestedCategory: parsed.suggestedCategory,
            suggestedPriority: parsed.suggestedPriority,
            reasoning: parsed.reasoning.trim(),
        };
    } catch {
        return null;
    }
};
