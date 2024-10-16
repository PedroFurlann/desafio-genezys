export interface UserDTO {
  id: string;
  name: string;
  email: string;
  street: string;
  addressNumber: string;
  city: string;
  cep: string;
  state: string;
  neighborHood: string;
  password?: string;
}
