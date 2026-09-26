import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

const AUTH_API = "http://localhost:8080/api/auth";

// Reads a useful backend error message.
async function readError(response, fallbackMessage) {
  try {
    const data = await response.json();
    return data.message || data.detail || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Checks whether the browser already has a valid login session.
  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const response = await fetch(`${AUTH_API}/me`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          setUser(await response.json());
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadCurrentUser();
  }, []);

  // Sends the email and password to the real Spring Boot backend.
  async function login(email, password) {
    const response = await fetch(`${AUTH_API}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      throw new Error(
        await readError(response, "Login failed")
      );
    }

    const authenticatedUser = await response.json();
    setUser(authenticatedUser);

    return authenticatedUser;
  }

  // Creates a new CUSTOMER account.
  async function register(registrationData) {
    const response = await fetch(`${AUTH_API}/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      throw new Error(
        await readError(response, "Registration failed")
      );
    }

    return response.json();
  }

  // Destroys the backend session and removes the frontend user.
  async function logout() {
    try {
      await fetch(`${AUTH_API}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setUser(null);
    }
  }

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return context;
}

export default AuthContext;