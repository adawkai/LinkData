export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  isPrivate: boolean;
  isActive: boolean;
  postCount: number;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  updatedAt: string;
  profile?: {
    id?: string;
    createdAt?: string;
    updatedAt?: string;
    title?: string;
    company?: string;
    bio?: string;
    gender?: string;
    website?: string;
    birthDate?: string;
    location?: string;
    avatarUrl?: string;
    contact?: string;
  };
};

export type SearchResponse = {
  items: User[];
  nextCursor: string | null;
};

export type UpdatePrivacyDto = {
  isPrivate: boolean;
};

export type UpdateProfileDto = {
  name?: string;
  title?: string;
  company?: string;
  bio?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  website?: string;
  birthDate?: string;
  location?: string;
  avatarUrl?: string;
  contact?: string;
};
