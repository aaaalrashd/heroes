// export interface LoginRequest {
//   email: string;
//   password: string;
// }
//
// export interface LoginResponse {
//   expirationTimeInMinutes;
// }
//
// export interface LoginOtpRequest {
//   email: string;
//   otp: number;
//   password: string;
// }
//
// export interface Token {
//   token: string;
// }
// export interface ResendRequest{
//   email: string;
// }
export interface Users {
  company: string;
  country: string;
  date: Date;
  email: string;
  id: number;
  name: string;
  phone: string;
  commonCountryName: string;
}

export interface DropDown {
  text: string;
  value: string;
}
