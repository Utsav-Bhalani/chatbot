const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS middleware
const axios = require('axios');

// Set up the Langflow Client class
class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }

    async post(endpoint, body, headers = { "Content-Type": "application/json" }) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`;
        const url = `${this.baseURL}${endpoint}`;
        try {
            const response = await axios.post(url, body, { headers });
            return response.data;
        } catch (error) {
            console.error('Request Error:', error.message);
            throw error;
        }
    }

    async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
    }
}

const app = express();

// Enable CORS for all origins (you can restrict it further if needed)
app.use(cors());  // This allows requests from any origin, including your frontend

app.use(bodyParser.json()); // To parse incoming JSON requests

// POST route for chatbot communication
app.post('/chatbot', async (req, res) => {
    const inputValue = req.body.userInput; // Assuming userInput comes from the frontend
    const flowId = '41198578-e513-4efd-8ffe-0c89a355a926';
    const langflowId = '92a41258-0190-40c1-a368-3dc33445d371';
    const applicationToken = 'AstraCS:JdnEdDMrkdBGIaigtYXzgBTX:726772603207c56df589437e839c7c6b7eaa6d1cda426701435a36114f22b90d'; // Replace with your token

    const langflowClient = new LangflowClient('https://api.langflow.astra.datastax.com', applicationToken);

    try {
        const tweaks = {
            "APIRequest-LGyhR": {
                "body": "{}",
                "curl": "curl --request GET \\   --url \"https://cd986089-fdf9-4367-ab19-b478ea2c9d43-eu-west-1.apps.astra.datastax.com/api/rest/v2/keyspaces/raj/social_media/rows\" \\   --header \"Content-Type: application/json\" \\   --header \"X-Cassandra-Token: AstraCS:gaTdxDslWtFXXoSZpptlHfzu:a8ae64340e083029b80eaae38507c49822dcd0ede1c2509410f90356cc1f4f19\"",
                "headers": "{\"Content-Type\":\"application/json\",\"X-Cassandra-Token\":\"AstraCS:gaTdxDslWtFXXoSZpptlHfzu:a8ae64340e083029b80eaae38507c49822dcd0ede1c2509410f90356cc1f4f19\"}",
                "method": "GET",
                "timeout": 5,
                "urls": [
                    "https://cd986089-fdf9-4367-ab19-b478ea2c9d43-eu-west-1.apps.astra.datastax.com/api/rest/v2/keyspaces/raj/social_media/rows"
                ]
            },
            "ParseData-ZMDuB": {
                "sep": "\n",
                "template": "{data}"
            },
            "GroqModel-6KFWN": {
                "groq_api_base": "https://api.groq.com",
                "groq_api_key": "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",
                "input_value": "",
                "max_tokens": null,
                "model_name": "llama-3.1-8b-instant",
                "n": null,
                "stream": false,
                "system_message": "",
                "temperature": 0.1
            },
            "ChatOutput-aUUtV": {
                "background_color": "",
                "chat_icon": "",
                "data_template": "{text}",
                "input_value": "",
                "sender": "Machine",
                "sender_name": "AI",
                "session_id": "",
                "should_store_message": true,
                "text_color": ""
            },
            "Prompt-DTNJe": {
                "template": "{context}\n\nanswer from given context above in only 2 lines and must include an simple reason with numerical metrics without showing any calculations just simple return number. if question is out of context then simply return \"Sorry I can't help you with that.\"\n\nAnswer : \n",
                "context": ""
            },
            "ChatInput-KZ5l6": {
                "files": "",
                "background_color": "",
                "chat_icon": "",
                "input_value": inputValue,  // Pass user input
                "sender": "User",
                "sender_name": "User",
                "session_id": "",
                "should_store_message": true,
                "text_color": ""
            }
        };

        const response = await langflowClient.initiateSession(
            flowId,
            langflowId,
            inputValue,
            'chat', // Input type
            'chat', // Output type
            false, // No stream
            tweaks
        );

        const outputMessage = response.outputs[0].outputs[0].outputs.message;
        res.json({ response: outputMessage.text });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ response: 'Error connecting to the chatbot.' });
    }
});

// Start the server
app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
