import type { IUsersProfile } from "./users";


export type ContextUserAppType = {
  user: IUsersProfile | null;
  setUser: React.Dispatch<React.SetStateAction<IUsersProfile | null>>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string,confirmPassword:string) => Promise<void>;
  logout: () => void;
  verifyToken:()=> Promise<boolean | undefined>;
  isAuthenticated: boolean;
};