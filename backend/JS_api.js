class LangflowClient {
    constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
    }

    async post(endpoint, body, headers = {"Content-Type": "application/json"}) {
        headers["Authorization"] = `Bearer ${this.applicationToken}`;
        headers["Content-Type"] = "application/json";
        const url = `${this.baseURL}${endpoint}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(body)
            });

            const responseMessage = await response.json();
            if (!response.ok) {
                throw new Error(`${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`);
            }
            return responseMessage;
        } catch (error) {
            console.error('Request Error:', error.message);
            throw error;
        }
    }

    async initiateSession(flowId, langflowId, inputValue, inputType = 'chat', outputType = 'chat', stream = false, tweaks = {}) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        return this.post(endpoint, { input_value: inputValue, input_type: inputType, output_type: outputType, tweaks: tweaks });
    }

    handleStream(streamUrl, onUpdate, onClose, onError) {
        const eventSource = new EventSource(streamUrl);

        eventSource.onmessage = event => {
            const data = JSON.parse(event.data);
            onUpdate(data);
        };

        eventSource.onerror = event => {
            console.error('Stream Error:', event);
            onError(event);
            eventSource.close();
        };

        eventSource.addEventListener("close", () => {
            onClose('Stream closed');
            eventSource.close();
        });

        return eventSource;
    }

    async runFlow(flowIdOrName, langflowId, inputValue, inputType = 'chat', outputType = 'chat', tweaks = {}, stream = false, onUpdate, onClose, onError) {
        try {
            const initResponse = await this.initiateSession(flowIdOrName, langflowId, inputValue, inputType, outputType, stream, tweaks);
            console.log('Init Response:', initResponse);
            if (stream && initResponse && initResponse.outputs && initResponse.outputs[0].outputs[0].artifacts.stream_url) {
                const streamUrl = initResponse.outputs[0].outputs[0].artifacts.stream_url;
                console.log(`Streaming from: ${streamUrl}`);
                this.handleStream(streamUrl, onUpdate, onClose, onError);
            }
            return initResponse;
        } catch (error) {
            console.error('Error running flow:', error);
            onError('Error initiating session');
        }
    }
}

module.exports = async function runMain(inputValue, inputType = 'chat', outputType = 'chat', stream = false) {
    const flowIdOrName = '41198578-e513-4efd-8ffe-0c89a355a926';
    const langflowId = '92a41258-0190-40c1-a368-3dc33445d371';
    const applicationToken = 'AstraCS:JdnEdDMrkdBGIaigtYXzgBTX:726772603207c56df589437e839c7c6b7eaa6d1cda426701435a36114f22b90d';
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
                "sender": "User",
                "sender_name": "User",
                "session_id": "",
                "should_store_message": true,
                "text_color": ""
            }
        };

        const response = await langflowClient.runFlow(
            flowIdOrName,
            langflowId,
            inputValue,
            inputType,
            outputType,
            tweaks,
            stream,
            (data) => console.log("Received:", data.chunk),
            (message) => console.log("Stream Closed:", message),
            (error) => console.log("Stream Error:", error)
        );

        if (!stream && response && response.outputs) {
            const flowOutputs = response.outputs[0];
            const firstComponentOutputs = flowOutputs.outputs[0];
            const output = firstComponentOutputs.outputs.message;

            console.log("Final Output:", output.message.text);
            return output.message.text;
        }
    } catch (error) {
        console.error('Main Error', error.message);
    }
}