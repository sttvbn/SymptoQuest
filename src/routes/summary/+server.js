import { env } from "$env/dynamic/private";

export async function POST({ request }) {
    const { conversation } = await request.json();
    const apiKey = env.OPENAI_KEY;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {role: 'system', content: 'Summarize the following conversation: '},
                { role: 'user', content: conversation.conversation.map(msg => `${msg.prompt} ${msg.response}`).join('\n')}
            ]
        })
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error('API Request Error:', errorData);
        return new Response(
            JSON.stringify({ error: 'Error communicating with API'}),
            { status: response.status}
        );
    }

    const data = await response.json();
    //const summary = data["choices"][0]["message"]["content"]
    const summary = data.choices[0].message.content;

    return new Response(
        JSON.stringify({summary}),
        {status:200}
    );

}
