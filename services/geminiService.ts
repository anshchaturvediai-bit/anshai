import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const systemInstruction = `You are an expert web developer specializing in Tailwind CSS.
Your task is to generate a complete, single HTML file based on the user's prompt.
The HTML file must include a proper HTML structure with a <head> and <body>.
The <head> must contain a <title> relevant to the user's request and the necessary <script> tag to load Tailwind CSS from its CDN: <script src="https://cdn.tailwindcss.com"></script>.
The <body> should contain the webpage content, styled exclusively and beautifully with Tailwind CSS classes.
Do not use any custom CSS, inline style attributes (style="..."), or <style> blocks.
The generated code should be responsive, modern, and visually appealing.
Use placeholder images from https://picsum.photos/ (e.g., https://picsum.photos/800/600) if images are requested.
Ensure all HTML tags are properly closed.
Your output must be ONLY the raw HTML code for the complete webpage. Do not include any explanations, comments, or markdown formatting like \`\`\`html ... \`\`\`. Just the code.`;

const updateSystemInstruction = `You are an expert web developer specializing in Tailwind CSS.
Your task is to modify an existing HTML file based on the user's request.
You will be given the current HTML code and a prompt describing the changes.
Your output must be the complete, new single HTML file with the requested modifications.
The HTML file must include a proper HTML structure with a <head> and <body>.
The <head> must contain a <title> and the <script> tag for the Tailwind CSS CDN: <script src="https://cdn.tailwindcss.com"></script>.
The <body> should be styled exclusively and beautifully with Tailwind CSS classes.
Do not use any custom CSS, inline style attributes (style="..."), or <style> blocks.
Ensure the new version is responsive and visually appealing.
Use placeholder images from https://picsum.photos/ if new images are needed.
Your output must be ONLY the raw HTML code for the complete webpage. Do not include any explanations, comments, or markdown formatting like \`\`\`html ... \`\`\`. Just the new, full HTML code.`;

function cleanResponse(text: string): string {
    let cleanedText = text.trim();
    if (cleanedText.startsWith("```html")) {
      cleanedText = cleanedText.substring(7, cleanedText.length - 3).trim();
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.substring(3, cleanedText.length - 3).trim();
    }
    return cleanedText;
}

export async function generateWebsite(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return cleanResponse(response.text);
  } catch (error) {
    console.error("Error generating website:", error);
    throw new Error("Failed to generate website. The model may be unavailable or the request was blocked.");
  }
}

export async function updateWebsite(prompt: string, previousHtml: string): Promise<string> {
    const fullPrompt = `Here is the current HTML code:\n\n\`\`\`html\n${previousHtml}\n\`\`\`\n\nBased on the code above, please apply the following change: "${prompt}". Remember to output the full, modified HTML file.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: fullPrompt,
            config: {
                systemInstruction: updateSystemInstruction,
                temperature: 0.7,
            },
        });
        
        return cleanResponse(response.text);
    } catch (error) {
        console.error("Error updating website:", error);
        throw new Error("Failed to update website. The model may be unavailable or the request was blocked.");
    }
}
