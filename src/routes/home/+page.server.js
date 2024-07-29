import { env } from "$env/dynamic/private";
import { text } from "@sveltejs/kit";
import fs from 'fs';
import path from 'path';

//load diseases.json
const diseasesPath = path.resolve('src/routes/home/diseases.json');
let diseases = [];

try {
    const data = fs.readFileSync(diseasesPath, 'utf-8');
    diseases = JSON.parse(data);
} catch {
    console.error('Error reading diseases file', Error);

}
// Medical-related keywords
const medicalKeywords = [
    "symptom", "disease", "medicine", "doctor", "pain", "fever", "treatment",
    "diagnosis", "infection", "cough", "surgery", "therapy", "prescription"
];

export const actions = {
    default: async({request}) => {
        const form = await request.formData();
        const prompt = form.get("prompt");
        const openai_key = env.OPENAI_KEY;

        //function to check if medical related
        const isMedicalRelated = (text) => {
            const lowerCase = text.toLowerCase();
            const keywordMatch = medicalKeywords.some(keyword =>lowerCase.includes(keyword));
            //additional checks can be added
            return keywordMatch
        }
        
        //function to check diseases in already in file
        const checkDisease = (text) => {
            const lowerCase = text.lowerCase();
            for (const disease of diseases ){
                if (disease.keyword.some(keyword => lowerCase.includes(keyword))){
                   return disease.name; 
                }
            }
            return null;
        };
        //function to append to JSON file
        const appendDisease = (diseaseName, symptoms) => {
            const newDisease = {
                name:"diseasesName",
                keywords: "symptoms"
            };
            diseases.push(newDisease);
            fs.writeFileSync(diseasesPath,JSON.stringify(diseases, null, 2), 'utf-8');
        };

        //if not medical related
        if (!isMedicalRelated(prompt)) {
            const message = "I am a medical chatbox.  Pleases send your symptoms or medical-related questions in the chatbox.";
            console.log(message);
            return { message };
        }
        
        //send request
        const body = {
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: prompt}],
        };
        //send to OPENAI
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
        console.log(message);
        return message;
        
    }
}
