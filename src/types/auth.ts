export interface Register {
   
    email: string;
    password: string;
    name: string;
   
  }
  export interface Login {
    email: string;
    password: string;
  }

  export interface loginResponse {
    token: string
  }

  export interface User {
    id?: string;
    name?: string;
    email?: string;
  }