"use client";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { storageUserGet } from "@/storage/storageUser";
import { toast } from "react-toastify";
import { Navbar } from "@/components/Navbar";
import Logo from '../../../public/logo_genezys_sem_fundo.png'
import Image from "next/image";
import TextInput from "@/components/Inputs/TextInput";
import PasswordInput from "@/components/Inputs/PasswordInput";
import Button from "@/components/Button";
import fetchAddressByCep from "@/services/fetchAddressByCep";
import CepInput from "@/components/Inputs/CepInput";
import NumberInput from "@/components/Inputs/NumberInput";
import { useEffect } from "react";
import useLocalStorage from "@/hooks/useLocaStorage";
import { UserDTO } from "@/DTOs/UserDTO";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirm_password?: string | undefined;
  city: string;
  cep: string;
  street: string;
  neighborhood: string;
  number: string;
  state: string;
}

export default function Home() {

  const { signIn, isLoadingUserStorageData, user } = useAuth();

  const { getValue, removeValue } = useLocalStorage()

  const setValueStorage = (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  };

  const usersList: UserDTO[] = getValue("users") ?? []

  const router = useRouter();

  const userStorage = storageUserGet();

  if (userStorage && typeof window !== "undefined") {
    router.push("/users");
  }

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .trim()
      .required("O nome é obrigatório")
      .min(6, "O nome deve conter no mímimo 6 caracteres"),
    email: yup
      .string()
      .required("O e-mail é obrigatório")
      .email("Digite um e-mail válido"),
    password: yup
      .string()
      .required("A senha é obrigatória")
      .min(6, "A senha deve conter no mínimo 6 caracteres"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password")], "As senhas devem coincidir"),
    cep: yup.string().required("O cep é obrigatório").min(9, "O cep deve possuir 9 dígitos"),
    city: yup.string().required("A cidade é obrigatória"),
    state: yup.string().required("o estado é obrigatório"),
    street: yup.string().required("A rua é obrigatória"),
    number: yup.string().required("Obrigatório."),
    neighborhood: yup.string().required("O bairro é obrigatório")
  });

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  const handleCepChange = async (originalValue: string) => {
    if (originalValue.length === 8) {
      const response = await fetchAddressByCep(originalValue);

      if (response) {
        setValue('city', response.localidade)
        setValue('state', response.uf)
        setValue('neighborhood', response.bairro)
        setValue('street', response.logradouro)
      }
    };
  }

  async function handleRegister({ name, email, cep, city, neighborhood, number, password, state, street }: FormData) {
    try {
      const newUsersList = [...usersList]

      const user = {
        id: newUsersList[newUsersList.length - 1]?.id + 1 || 1,
        addressNumber: number,
        cep,
        city,
        email,
        name,
        neighborhood,
        state,
        street,
        password,
      }

      if(newUsersList.some((user) => user.email === email)) {
        toast.error("Email já está em uso.", {
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

        return 
      }

      newUsersList.push(user)

      setValueStorage("users", JSON.stringify(newUsersList))

      await signIn(email, password, true, user)
    } catch (error) {
      console.error(error)
      toast.error("Os campos com * são obrigatórios! Obs: o endereço será preenchido automaticamente ao digitar um Cep válido", {
        position: "bottom-center",
        autoClose: 3000,
        theme: "dark",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        },
      });
    }
  }

  // useEffect(() => {
  //   if (user2 && typeof window !== undefined) {
  //     router.push("transactions");
  //   }
  // }, [])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error("Os campos com * são obrigatórios! Obs: o endereço será preenchido automaticamente ao digitar um Cep válido", {
        position: "bottom-center",
        autoClose: 3000,
        theme: "dark",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontWeight: "bold",
        },
      });
    }
  }, [errors])

  return (
    <>
      <>
        <div className="min-h-screen flex flex-col bg-gray-900 overflow-y-auto">
          <Navbar routesList={['Login', 'Register']} />
          <div className="flex rounded-md flex-col items-center justify-center flex-grow md:flex-row">
            <div className="flex flex-col gap-2 items-center justify-center p-8 md:w-96 bg-black rounded-md border-gray-800">
              <Image alt="Genezys logo" src={Logo} className="w-12 h-12 bg-transparent" />
              <p className="text-xl text-gray-200 font-bold">Registre-se</p>
              <Controller
                control={control}
                name="name"
                render={({ field }) => (
                  <TextInput
                    type="text"
                    placeholder="Nome*"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {errors.name && (
                <p className="text-red-500 text-sm font-bold self-start mt-[-12px]">
                  {errors.name.message}
                </p>
              )}

              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <TextInput
                    type="email"
                    placeholder="Email*"
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

              <Controller
                control={control}
                name="cep"
                render={({ field }) => (
                  <CepInput
                    placeholder="Cep*"
                    value={field.value}
                    onChange={(maskedValue, originalValue) => {
                      field.onChange(maskedValue)
                      handleCepChange(originalValue)
                    }}
                  />
                )}
              />
              {errors.cep && (
                <p className="text-red-500 text-sm font-bold self-start mt-[-12px]">
                  {errors.cep.message}
                </p>
              )}

              <div className="flex items-center justify-center gap-2 w-full">
                <div className="w-full">
                  <Controller
                    control={control}
                    name="city"
                    render={({ field }) => (
                      <TextInput
                        type="text"
                        disabled
                        placeholder="Cidade*"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="max-w-16">
                  <Controller
                    control={control}
                    name="state"
                    render={({ field }) => (
                      <TextInput
                        disabled
                        type="text"
                        placeholder="UF*"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              <Controller
                control={control}
                name="neighborhood"
                render={({ field }) => (
                  <TextInput
                    type="text"
                    disabled
                    placeholder="Bairro*"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              <div className="flex items-center justify-center gap-2 w-full">
                <div className="w-full">
                  <Controller
                    control={control}
                    name="street"
                    render={({ field }) => (
                      <TextInput
                        type="text"
                        disabled
                        placeholder="Logradouro*"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="max-w-16">
                  <Controller
                    control={control}
                    name="number"
                    render={({ field }) => (
                      <NumberInput
                        placeholder="Nº *"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <PasswordInput
                    placeholder="Senha*"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />

              {errors.password && (
                <p className="text-red-500 text-sm font-bold self-start mt-[-12px]">
                  {errors.password.message}
                </p>
              )}

              <Controller
                control={control}
                name="confirm_password"
                render={({ field }) => (
                  <PasswordInput
                    placeholder="Confirme sua senha*"
                    value={field.value ?? ""}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.confirm_password && (
                <p className="text-red-500 text-sm font-bold self-start mt-[-12px]">
                  {errors.confirm_password.message}
                </p>
              )}

              <Button
                label="Registrar-se"
                onClick={handleSubmit(handleRegister)}
                size="medium"
              />
              {/* <p className="font-bold text-lg text-gray-200">
                Ainda não tem conta?{" "}
                <Link
                  href="/register"
                  className="text-amber-500 text-lg font-bold hover:opacity-70 transition-all ease-in-out duration-300"
                >
                  Cadastre-se aqui
                </Link>
              </p>
              <p className="font-bold text-lg text-gray-200">
                Esqueceu sua senha?{" "}
                <Link
                  href="/forgotPassword"
                  className="text-amber-500 text-lg font-bold hover:opacity-70 transition-all ease-in-out duration-300"
                >
                  Clique aqui para recuperar.
                </Link>
              </p> */}
            </div>
          </div>
        </div>

      </>
    </>
  );
}
