export interface UserDTO {
  id: number;
  name: string;
  email: string;
  street: string;
  addressNumber: string;
  city: string;
  cep: string;
  state: string;
  neighborhood: string;
  password?: string;
}
