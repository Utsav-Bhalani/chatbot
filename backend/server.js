const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS middleware
const axios = require('axios');
const run = require("./JS_api.js");

class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }

    async post(endpoint, body, headers = { "Content-Type": "application/json" }) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`; // Fixed syntax error
        const url = `${this.baseURL}${endpoint}`; // Fixed syntax error
        try {
            const response = await axios.post(url, body, { headers });
            return response.data;
        } catch (error) {
            console.error('Request Error:', error.message);
            throw error;
        }
    }

    async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`; // Fixed syntax error
        return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
    }
}

const app = express();

app.use(cors());
app.use(bodyParser.json());

// POST route for chatbot communication
app.post('/chatbot', async (req, res) => {
    const inputValue = req.body.userInput; // Assuming userInput comes from the frontend
    const flowId = '41198578-e513-4efd-8ffe-0c89a355a926';
    const langflowId = '92a41258-0190-40c1-a368-3dc33445d371';
    const applicationToken = 'AstraCS:JdnEdDMrkdBGIaigtYXzgBTX:726772603207c56df589437e839c7c6b7eaa6d1cda426701435a36114f22b90d'; // Replace with your token

    const langflowClient = new LangflowClient('https://api.langflow.astra.datastax.com', applicationToken);
    console.log(inputValue);

    try {
        const outputMessage = await run(inputValue); // Assuming run() handles input processing
        res.json({ response: outputMessage });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ response: 'Error connecting to the chatbot.' });
    }
});

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
