import axios from "axios";
import { toast } from "react-toastify";

interface Address {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: string;
}

const fetchAddressByCep = async (
  cep: string
): Promise<Address | null | undefined> => {
  try {
    const response = await axios.get<Address>(`${process.env.NEXT_PUBLIC_VIACEP_URL}/ws/${cep}/json/`);
    console.log(response.data);
    if (response.data?.erro === "true") {
      toast.error("Erro ao buscar endereço pelo cep.", {
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
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar endereço:", error);
    toast.error("Erro ao buscar endereço pelo cep", {
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
    return null;
  }
};

export default fetchAddressByCep;
