import { UserResponseDTO } from './user.response.dto';

export type UserLoginResponseDTO = {
  accessToken: string;
  user: UserResponseDTO;
};

export type UserLoginErrorResponseDTO = {
  error: {
    code: string;
    message: string;
  };
};
