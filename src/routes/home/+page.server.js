import { env } from "$env/dynamic/private";
import { text } from "@sveltejs/kit";
import fs from 'fs';
import path from 'path';

// Load diseases.json
//const diseasesPath = path.resolve('src/routes/home/DiseasesOutput.json');

//try {
    //const data = fs.readFileSync(diseasesPath, 'utf-8');
    //diseases = JSON.parse(data);
//} catch (error) {
    //console.error('Error reading diseases file', error);
//}

let convohistory = [
    {
        role: "system", 
        content: "You are a medical assistant. Only respond to queries related to human health and symptoms. Ignore any non-medical topics but if the queries is medical related but for animals, be nice and say sorry but the queries should be for humans not animals."
    }
];

//const isMedicalPrompt = (prompt, diseases) => {
    //const lowerPrompt = prompt.toLowerCase(); 
    //return diseases.some(disease => lowerPrompt.includes(disease.name.toLowerCase()) || disease.alias.some(alias => lowerPrompt.includes(alias.toLowerCase())));
//};

export const actions = {
    default: async ({ request }) => {
        const form = await request.formData();
        const prompt = form.get("prompt");
        const openai_key = env.OPENAI_KEY;

        //if(!isMedicalPrompt(prompt, diseases)) {
            //return text("Please ask a medical-related question.");
        //}


        // Add user's message to conversation history
        convohistory.push({ role: "user", content: prompt });

        // Send request to OpenAI
        const body = {
            model: "gpt-3.5-turbo",
            messages: convohistory
        };

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openai_key}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        const message = data["choices"][0]["message"]["content"];

        // Add assistant's message to conversation history
        convohistory.push({ role: "assistant", content: message });
        console.log(message);
        return message;
    }
};
