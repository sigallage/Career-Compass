import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  const domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL;

  // Check if required environment variables are present
  if (!domain || !clientId || !redirectUri) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h3>Configuration Error</h3>
        <p>Auth0 environment variables are missing. Please:</p>
        <ol style={{ textAlign: 'left', display: 'inline-block' }}>
          <li>Copy .env.example to .env</li>
          <li>Fill in your Auth0 credentials</li>
          <li>Restart the development server</li>
        </ol>
        <p>See SETUP_INSTRUCTIONS.md for detailed setup guide.</p>
      </div>
    );
  }

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || window.location.pathname);
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithNavigate;
