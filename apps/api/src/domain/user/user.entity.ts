export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public username: string,
    public name?: string,
    public avatarUrl?: string,
    public role: 'USER' | 'ADMIN' = 'USER',
    public isPrivate: boolean = false,
    public isActive: boolean = true,
    public followersCount: number = 0,
    public followingCount: number = 0,
  ) {}

  // Factory method
  static create(email: string, username: string, passwordHash: string) {
    return new User(crypto.randomUUID(), email, username);
  }
}
