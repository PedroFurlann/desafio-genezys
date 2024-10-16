"use client";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { storageUserGet } from "@/storage/storageUser";
import { toast } from "react-toastify";
import { Navbar } from "@/components/Navbar";
import Logo from '../../public/logo_genezys_sem_fundo.png'
import Image from "next/image";
import TextInput from "@/components/Inputs/TextInput";
import PasswordInput from "@/components/Inputs/PasswordInput";
import Button from "@/components/Button";

interface FormData {
  email: string;
  password: string;
}

export default function Home() {
  const { signIn, isLoadingUserStorageData, user } = useAuth();

  const router = useRouter();

  const userStorage = storageUserGet();

  // if (user2 && typeof window !== "undefined") {
  //   router.push("/transactions");
  // }

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .required("O e-mail é obrigatório")
      .email("Digite um e-mail válido"),
    password: yup
      .string()
      .required("A senha é obrigatória")
      .min(6, "A senha deve conter no mínimo 6 caracteres"),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema),
  });

  async function handleSignIn({ email, password }: FormData) {
    try {
      await signIn(email, password);
      // router.push("/transactions");

      toast.success("Login realizado com sucesso!", {
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
    } catch (error) {
      const title = "Não foi possível realizar o login. Tente novamente mais tarde.";

      toast.error(title, {
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
    }
  }

  // useEffect(() => {
  //   if (user2 && typeof window !== undefined) {
  //     router.push("transactions");
  //   }
  // }, [])

  return (
    <>
      <>
        <div className="min-h-screen flex flex-col bg-gray-900 overflow-y-auto">
          <Navbar routesList={['Login', 'Register']} />
          <div className="flex rounded-md flex-col items-center justify-center flex-grow md:flex-row">
            <div className="flex flex-col gap-2 items-center justify-center p-8 md:w-96 md:h-96 bg-black rounded-md border-gray-800">
              <Image alt="Genezys logo" src={Logo} className="w-12 h-12 bg-transparent" />
              <p className="text-xl text-gray-200 font-bold">Realizar Login</p>
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
                <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                  {errors.email.message}
                </p>
              )}
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <PasswordInput
                    placeholder="Senha"
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-sm font-bold self-start mt-[-12px] mb-[-12px]">
                  {errors.password.message}
                </p>
              )}

              <Button
                label="Login"
                onClick={() => { }}
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
