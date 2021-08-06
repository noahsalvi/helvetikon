export type Session = {
  user?: {
    id: number;
    email: string;
    username: string;
    iat: number;
  };
};

export type Locals = {
  user?: {
    id: number;
    email: string;
    username: string;
    iat: number;
  };
};
