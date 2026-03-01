import { UserResponseDTO } from './user.response.dto';

export type UserRegisterResponseDTO = {
  accessToken: string;
  user: UserResponseDTO;
};

export type UserRegisterErrorResponseDTO = {
  error: {
    code: string;
    message: string;
  };
};
