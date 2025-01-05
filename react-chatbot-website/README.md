# React Chatbot Website

This project is a simple chatbot application built with React. It allows users to interact with a chatbot that responds to their messages using an external API.

## Features

- User-friendly interface for chatting with a bot.
- API integration to fetch responses based on user input.
- Modular components for better maintainability.

## Project Structure

```
react-chatbot-website
├── public
│   ├── index.html        # Main HTML file
│   └── favicon.ico       # Favicon for the website
├── src
│   ├── components
│   │   ├── Chatbot.tsx   # Chatbot component
│   │   └── Message.tsx    # Message component
│   ├── App.tsx           # Main application component
│   ├── index.tsx         # Entry point of the application
│   └── api
│       └── chatbotApi.ts  # API integration for chatbot responses
├── package.json          # npm configuration file
├── tsconfig.json         # TypeScript configuration file
└── README.md             # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```
   git clone <repository-url>
   cd react-chatbot-website
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure your API key in `src/api/chatbotApi.ts`.

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000` to see the chatbot in action.

## Usage

- Type your message in the input box and hit enter to send it to the chatbot.
- The chatbot will respond based on the API's output.

## License

This project is licensed under the MIT License.