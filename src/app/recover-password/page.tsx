"use client";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { storageUserGet } from "@/storage/storageUser";
import { Navbar } from "@/components/Navbar";
import Logo from '../../../public/logo_genezys_sem_fundo.png'
import Image from "next/image";
import TextInput from "@/components/Inputs/TextInput";
import Button from "@/components/Button";
import { useEffect } from "react";

interface FormData {
  email: string;
}

export default function Home() {
  const router = useRouter();

  const userStorage = storageUserGet();


  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required("O e-mail é obrigatório")
      .email("Digite um e-mail válido"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const handleRecoverPassword = async ({ email }: FormData) => {
    try {

    } catch (error) {
      console.error(error)

    }
  }

  useEffect(() => {
    if (userStorage && typeof window !== undefined) {
      router.push("/users");
    }
  }, [])

  return (
    <>
      <>
        <div className="min-h-screen flex flex-col bg-gray-900 overflow-y-auto">
          <Navbar routesList={['Login', 'Register', 'Recover Password']} />
          <div className="flex rounded-md flex-col items-center justify-center flex-grow md:flex-row">
            <div className="flex flex-col gap-2 items-center justify-center p-8 md:w-96 bg-black rounded-md border-gray-800">
              <Image alt="Genezys logo" src={Logo} className="w-12 h-12 bg-transparent" />
              <p className="text-xl text-gray-200 font-bold">Recuperar senha</p>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <TextInput
                    type="email"
                    placeholder="Email"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm font-bold self-start mt-[-12px]">
                  {errors.email.message}
                </p>
              )}
              <Button
                label="Recuperar senha"
                onClick={handleSubmit(handleRecoverPassword)}
                size="medium"
              />
            </div>
          </div>
        </div>

      </>
    </>
  );
}
