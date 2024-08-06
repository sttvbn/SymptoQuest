import { env } from "$env/dynamic/private";
import { text } from "@sveltejs/kit";
import fs from 'fs';
import path from 'path';
//import nlp from 'compromise';

//load diseases.json
const diseasesPath = path.resolve('src/routes/home/DiseasesOutput.json');
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
    "diagnosis", "infection", "cough", "surgery", "therapy", "prescription", "sick"
];

const nonmedical = [
    "dog", "cat", "animal", "pet", "vet", "veterinary", "car", "veichle", "truck", "train", "airplane"
]

//const MIN_SYMPTOM_LENGTH = 10;
//save the current conversation history for the api to remember
let convohistory = [];

export const actions = {
    default: async({request}) => {
        const form = await request.formData();
        const prompt = form.get("prompt");
        const openai_key = env.OPENAI_KEY;

        //function to check if medical related
        const isMedicalRelated = (text) => {
            const lowerCase = text.toLowerCase();
            const keywordMatch = medicalKeywords.some(keyword =>lowerCase.includes(keyword));
            //return medicalKeywords.some(keyword =>lowerCase.includes(keyword));
            //const doc = nlp(text);
            //const medicalEntities = doc.match(medicalKeywords.join(' ')).out('array');
            //additional checks can be added
            //return keywordMatch && medicalEntities.length > 0;
            return keywordMatch;
        }

        const containnonmedical = (text) => {
            const lowerCaseText = text.toLowerCase();
            return nonmedical.some(keyword => lowerCaseText.includes(keyword));
            //return nonmedical;
            //console.log(`Checking for non-medical content: ${nonmedicalmatch} (TexT: ${lowerCaseText})`);
            //return nonmedicalmatch;
        };

        const identify = (text) => {
            const lowerCaseText = text.toLowerCase();
            const symptoms = diseases.filter(disease => 
                lowerCaseText.includes(disease.text.toLowerCase())
            );
            return symptoms.length > 0 ? symptoms: null;
        };
        
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

        //const symptoms = identify(prompt);

        //if (symptoms.length > 0) {
            //const message = `Based on you input, the possible symptoms are: ${symptoms.map(symptom => symptom.text).join(', ')}.`;
            //console.log(message);
            //return { message };
        //}  
        //if (!symptoms.length > 0){
        //const followup = "Please provide more information to help identify your symptom or solution.";
       // return { message: followup};
       // }
        

        //if not medical related
        if (!isMedicalRelated(prompt) || containnonmedical(prompt)) {
            const message = "I am a medical chatbox.  Pleases send your symptoms or medical-related questions in the chatbox.";
            console.log(message);
            return { message };
        }

        //user's message to conversation history 
        convohistory.push({role: "user", content: prompt});
        //send request
        const body = {
            model: "gpt-3.5-turbo",
            //messages: [{role: "user", content: prompt}],
            messages: convohistory,
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
        //assistant message to conversation history
        convohistory.push({role: "assistant", content: message});
        console.log(message);
        return message;
        
    }
}