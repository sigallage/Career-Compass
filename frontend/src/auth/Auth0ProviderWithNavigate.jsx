import { Auth0Provider } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Auth0ProviderWithNavigate = ({ children }) => {
  const navigate = useNavigate();

  // Use environment variables for Auth0 configuration
  const domain = import.meta.env.VITE_AUTH0_DOMAIN || "dev-npybc0wru5wbgsyb.us.auth0.com";
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID || "HfWrcDzjKanhcV6tILc1yYz0ibhocv9C";
  const redirectUri = import.meta.env.VITE_AUTH0_CALLBACK_URL || window.location.origin;

  // Check if required environment variables are present
  if (!domain || !clientId) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h3>Configuration Error</h3>
        <p>Auth0 environment variables are missing. Please check your .env file.</p>
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