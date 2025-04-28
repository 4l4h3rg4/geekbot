
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupAPIHandlers } from './businessLogic/api/apiHandlers.ts'

// Setup API handlers if we're in a browser environment
if (typeof window !== 'undefined') {
  setupAPIHandlers();
}

createRoot(document.getElementById("root")!).render(<App />);
