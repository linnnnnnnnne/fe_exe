import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import { ChatbotProvider } from "./contexts/ChatbotContext";
import ChatbotWidget from "./components/chatbot/ChatbotWidget";

function App() {
  return (
    <BrowserRouter>
      <ChatbotProvider>
        <AppRouter />
        <ChatbotWidget />
      </ChatbotProvider>
    </BrowserRouter>
  );
}

export default App;
