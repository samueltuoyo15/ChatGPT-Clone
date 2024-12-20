import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {Auth0Provider} from '@auth0/auth0-react'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Auth0Provider
    domain={import.meta.env.VITE_AUTH_DOMAIN}
    clientId={import.meta.env.VITE_CLIENT_ID}
    authorizationParams={{
       redirect_uri: window.location.origin,
    }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
)
