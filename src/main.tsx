
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { setupAPIHandlers } from './businessLogic/api/apiHandlers.ts'

// Configurar las rutas de la API antes de renderizar la aplicación
setupAPIHandlers();

// Crear el elemento raíz de React y renderizar la aplicación
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
