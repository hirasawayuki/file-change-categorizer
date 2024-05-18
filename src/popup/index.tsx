import React from "react"
import ReactDOM from "react-dom/client"

import { App } from "@/popup/App"
import { RouterProvider,StorageProvider } from "@/providers/provider"

import "@/global.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider>
      <StorageProvider>
        <App />
      </StorageProvider>
    </RouterProvider>
  </React.StrictMode>,
)
