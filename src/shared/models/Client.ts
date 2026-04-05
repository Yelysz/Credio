export interface Client {
  id: string
  firstName: string
  lastName: string
  age: number
  documentType: string
  documentNumber: string
  officerId: string
  phone: string
  email: string
  homeLatitude: string
  homeLongitude: string
  imageUrl: string
  createdAt: string
  updatedAt: string
  addressDto: {
    streetNumber: string
    addressLine1: string
    addressLine2: string
    city: string
    region: string
    postalCode: string
  }
  employeeId: string
}