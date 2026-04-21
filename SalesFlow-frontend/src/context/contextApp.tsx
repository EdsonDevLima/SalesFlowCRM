import { createContext, useState, type ReactNode } from "react";
import type { IUsersProfile } from "../types/users";
import api from "../service/api";
import { toast } from "react-toastify";
import type { ContextUserAppType } from "../types/context";
import { useNavigate } from "react-router-dom";

export const ContextUserApp = createContext({} as ContextUserAppType);

export function ContextUserAppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUsersProfile | null>(null);
  const navigate = useNavigate()
  
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        navigate("/dashboard")
        toast.success("Login realizado");
      } else {
        toast.info(response.data.message);
      }
    } catch (error) {
      toast.error("Erro no sistema: " + error);
    }
  };

  const register = async (name: string, email: string, password: string,confirmPassword:string) => {
    try {
      const response = await api.post("auth/register", {
        name,
        email,
        password,
        confirmPassword
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        navigate("/dashboard")
        toast.success("Cadastro realizado com sucesso");
      } else {
        toast.info(response.data.message);
      }
    } catch (error) {
      toast.error("Erro no cadastro: " + error);
    }
  };

  const verifyToken =async ()=>{
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setUser(null);
        return false;
      }

      const response = await api.post("auth/verify-token", {
        token
      });

      if (response?.data?.user) {
        setUser(response.data.user);
      }

      return true;
    } catch (error) {
      localStorage.removeItem("token");
      setUser(null);
      return false;
    }
  }

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/")
    toast.info("Logout realizado");
  };

  return (
    <ContextUserApp.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        verifyToken,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </ContextUserApp.Provider>
  );
}
