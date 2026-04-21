export interface AddressDto {
  streetNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  region: string;
  postalCode: string;
}

export interface Client {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  name?: string;
  email?: string;
  phone?: string;
  documentType?: string;
  documentNumber?: string;
  status?: string;
}

export interface ClientDetail extends Client {
  age?: number;
  address?: AddressDto | null;
  homeLatitude?: number;
  homeLongitude?: number;
  urlImage?: string | null;
}

export interface GetClientsParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateClientPayload {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  documentType: string;
  phone: string;
  documentNumber: string;
  employeeId: string;
  homeLatitude: number;
  homeLongitude: number;
  file: File | null;
  addressDto: AddressDto;
}

export interface UpdateClientPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}