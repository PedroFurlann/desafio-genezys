"use client"

import React, { createContext, useEffect, useState } from "react";
import { storageUserGet, storageUserRemove, storageUserSave } from "@/storage/storageUser";
import { storageTokenGet, storageTokenRemove, storageTokenSave } from "@/storage/storageToken";
import { UserDTO } from "@/DTOs/UserDTO";
import useLocalStorage from "@/hooks/useLocaStorage";
import { toast } from "react-toastify";
import { generateJWT } from "@/services/tokenService";


export interface AuthContextDataProps {
  user: UserDTO | null;
  signIn: (email: string, password: string, register: boolean, userFromRegister?: UserDTO | undefined) => Promise<void>;
  isLoadingUserStorageData: boolean;
  signOut: () => Promise<void>;
  token: string | null;
}

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [token, setToken] = useState<string | null>(null)
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

  const { getValue } = useLocalStorage();

  const usersList: UserDTO[] | null = getValue("users")

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
    setToken(token)
    setUser(userData);
  }

  async function signIn(email: string, password: string, register: boolean, userFromRegister?: UserDTO) {
    try {
      let user: UserDTO | undefined;

      if (register) {
        user = userFromRegister
        if (!user)
          return;
      } else {
        console.log("aqui")
        if (!usersList) {
          toast.error("Email ou senha inválidos!", {
            position: "top-right",
            autoClose: 3000,
            theme: "dark",
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            },
          });

          return;
        }

        user = usersList.find((user) => user.email === email && user.password === password)

        if (!user) {
          toast.error("Email ou senha inválidos!", {
            position: "top-right",
            autoClose: 3000,
            theme: "dark",
            style: {
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
            },
          });

          return;
        }
      }

      console.log(user)

      const userToken = generateJWT({ userId: user.id })

      setIsLoadingUserStorageData(true);
      storageUserSave(user);
      storageTokenSave({ token: userToken });

      await userAndTokenUpdate(user, userToken);
    } catch (error) {
      console.error(error)
      toast.error("Email ou senha inválidos!", {
        position: "top-right",
        autoClose: 3000,
        theme: "dark",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        },
      });
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);
      setUser(null);
      setToken(null)

      storageUserRemove();
      storageTokenRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = storageUserGet();
      const token = storageTokenGet();

      if (token && userLogged) {
        await userAndTokenUpdate(userLogged, token.token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signIn,
        isLoadingUserStorageData,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
