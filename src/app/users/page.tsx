"use client";

import { Navbar } from "@/components/Navbar";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocaStorage";
import { UserDTO } from "@/DTOs/UserDTO";
import { useRouter } from "next/navigation";
import { storageUserGet } from "@/storage/storageUser";
import { toast } from "react-toastify";
import { storageTokenGet } from "@/storage/storageToken";
import { verifyJWT } from "@/services/tokenService";
import { useAuth } from "@/hooks/useAuth";


export default function Users() {
  const [currentPage, setCurrentPage] = useState(1);

  const { getValue } = useLocalStorage()

  const { signOut, user } = useAuth()

  const users: UserDTO[] = getValue("users")

  const totalPages = Math.ceil(users?.length / 10);

  const currentUsers = users ? users?.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  ) : [];

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const router = useRouter();

  const userStorage = storageUserGet();

  const token = storageTokenGet()

  const tokenVerified = verifyJWT(token?.token ?? "")

  if ((!userStorage || !tokenVerified) && typeof window !== "undefined") {
    signOut()
    router.push("/");
  }

  return (
    <>
      <>
        <div className="min-h-screen flex flex-col bg-gray-900 overflow-y-auto">
          <Navbar routesList={['Users']} />

          <div className="flex md:flex-row flex-col items-center md:justify-center md:gap-12 gap-4 mb-12 mt-12">
            <p className="text-gray-200 font-bold text-lg text-center">
              Olá {user?.name}
            </p>
            <button
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              onClick={signOut}
            >
              Sair
            </button>
          </div>

          <div className="flex rounded-md flex-col items-center justify-center flex-grow md:flex-row">
            

            {!users ? (
              <p className="text-white font-bold text-3xl">Não existe nenhum usuário cadastrado!</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-black bg-transparent">
                  <thead>
                    <tr className="text-white">
                      <th className="border border-black p-2">Nome</th>
                      <th className="border border-black p-2">Email</th>
                      <th className="border border-black p-2">Endereço</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers && currentUsers.length > 0 && currentUsers.map((user, index) => (
                      <tr key={index} className="text-white">
                        <td className="border border-black p-2">{user.name}</td>
                        <td className="border border-black p-2">{user.email}</td>
                        <td className="border border-black p-2">
                          {user.city}, {user.neighborhood}, {user.street}, {user.addressNumber}, {user.state}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-center items-center mt-4 space-x-2">
                  <button
                    className={`p-2 border border-black text-white ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      className={`p-2 border border-black text-white ${currentPage === index + 1 ? 'bg-black' : ''}`}
                      onClick={() => goToPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    className={`p-2 border border-black text-white ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Próxima
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </>
    </>
  );
}
