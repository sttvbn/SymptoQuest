import { env } from '$env/dynamic/private';
//check for keywords
const medicalKeywords = ['symptoms', "fever"]

//function to check if a question is medical-related

function isMedicalRelated(question){
    const questionLower = question.toLowerCase();
    return medicalKeywords.some(keyword => questionLower.includes(keyword));
}

export const actions = {
    default: async ({request}) => {
        const form = await request.formData();
        const prompt = form.get("prompt");
        const openai_key = env.OPENAI_KEY;
        console.log(prompt);
        console.log(openai_key);
        //prepare request
        const body = {
            model: "gpt-3.5-turbo",
            message: [{role: "user", content: prompt}],
        };
        //send request to OPENAI api
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                "Authorization": 'Bearer ${openai_key}',
            },
            body: JSON.stringify(body), 
        });
        const data = await response.json();
        const message = data["choices"][0]['message']["content"]
        return message;
        console.log();
    }
}
