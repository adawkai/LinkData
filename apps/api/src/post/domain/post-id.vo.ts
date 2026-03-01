import { randomUUID } from 'crypto';

export class PostId {
  private constructor(private readonly value: string) {
    Object.freeze(this);
  }

  static create(): PostId {
    return new PostId(`post_${randomUUID()}`);
  }

  static from(value: string): PostId {
    if (!this.isValid(value)) {
      throw new Error('Invalid PostId');
    }
    return new PostId(value);
  }

  static isValid(value: string): boolean {
    return /^post_[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    );
  }

  toString(): string {
    return this.value;
  }

  equals(other: PostId): boolean {
    return this.value === other.value;
  }
}
