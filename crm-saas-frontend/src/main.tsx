import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './auth/AuthProvider'

// ─── QueryClient ────────────────────────────────────────────────────────────
// Una sola instancia para toda la app. Acá viven los caches y la config
// global. staleTime: cuanto considera "fresco" al dato antes de re-fetchear.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,    // 30s: datos siguen "fresh", no refetch
      refetchOnWindowFocus: true,
      retry: 1,
    },
  },
});

// Orden: BrowserRouter -> QueryClientProvider -> AuthProvider -> App.
// QueryClient va arriba de Auth porque si manana queremos invalidar queries
// desde el AuthProvider (en logout, por ej.) ya tenemos el cliente disponible.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
