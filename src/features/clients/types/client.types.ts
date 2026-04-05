export interface Client {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  documentNumber?: string;
  documentType?: string;
  status?: string;
  address?: string;
  avatarUrl?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface ClientDetail extends Client {
  monthlyIncome?: number;
  occupation?: string;
  employer?: string;
}

export interface GetClientsParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateClientPayload {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  documentNumber?: string;
  documentType?: string;
  address?: string;
  file?: File | null;
}

export interface UpdateClientPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  documentNumber?: string;
  documentType?: string;
  address?: string;
  status?: string;
}