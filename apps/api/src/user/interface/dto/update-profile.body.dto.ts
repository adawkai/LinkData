export type UpdateProfileBodyDTO = {
  name?: string;
  avatarUrl?: string;
  title?: string;
  company?: string;
  bio?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  website?: string;
  birthDate?: string | Date;
  location?: string;
  contact?: string;
  isPrivate?: boolean;
};
