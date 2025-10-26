import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  userId: string | null;
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Verificar se há um usuário logado no localStorage
    const storedUserId = localStorage.getItem("whatsapp_user_id");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      // Se não há usuário logado, gerar um ID genérico para permitir acesso ao dashboard
      const defaultUserId = `user_${Date.now()}`;
      setUserId(defaultUserId);
      localStorage.setItem("whatsapp_user_id", defaultUserId);
    }
  }, []);

  const login = (newUserId: string) => {
    setUserId(newUserId);
    localStorage.setItem("whatsapp_user_id", newUserId);
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem("whatsapp_user_id");
    // Limpar configurações do usuário
    if (userId) {
      localStorage.removeItem(`config_${userId}`);
    }
  };

  const value = {
    userId,
    isAuthenticated: !!userId,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};