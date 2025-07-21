import { useAuth0 } from "@auth0/auth0-react";

const SignUp = () => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();

  const handleSignUp = () => {
    loginWithRedirect({
      screen_hint: "signup",
    });
  };

  return (
    <div className="signup-container">
      {!isAuthenticated ? (
        <div>
          <h2>Create Your Account</h2>
          <button onClick={handleSignUp}>Sign Up</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user.name}</h2>
        </div>
      )}
    </div>
  );
};

export default SignUp;
