export interface LoginResponse {
  access_token: string;
}

export interface IJWTPayload {
  _id: string;
  email: string;
  displayName: string;
}
