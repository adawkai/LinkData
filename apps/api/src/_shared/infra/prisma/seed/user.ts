import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';
import { UserEntity } from '@/user/domain/entity/user.entity';
import { Email } from '@/user/domain/value-object/email.vo';
import { Username } from '@/user/domain/value-object/username.vo';

export const seedUser = async (prisma: PrismaClient, userCount: number) => {
  console.log('Seeding users...');
  const users: UserEntity[] = [];
  for (let i = 0; i < userCount; i += 1) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const name = `${firstName} ${lastName}`;
    const email = Email.create(faker.internet.email({ firstName, lastName }));
    const raw = faker.internet
      .username({ firstName, lastName })
      .replace(/[^a-zA-Z0-9_]/g, '_')
      .slice(0, 18);
    const username = Username.create(raw);
    const passwordHash = await bcrypt.hash('password', 10);
    const role = Role.USER;
    const isPrivate = false;
    const isActive = true;
    const user = await UserEntity.create({
      name,
      email,
      username,
      passwordHash,
      role,
      isPrivate,
      isActive,
    });
    users.push(user);

    const title = faker.person.jobTitle();
    const company = faker.company.name();
    const bio = faker.lorem.sentence();
    const gender = faker.helpers.arrayElement(['MALE', 'FEMALE', 'OTHER']);
    const website = faker.internet.url();
    const birthDate = faker.date.birthdate();
    const location = faker.location.city();
    const avatarUrl = faker.image.avatar();
    const coverUrl = faker.image.urlPicsumPhotos({ width: 1200, height: 300 });
    const contact = faker.phone.number();

    await user.updateProfile({
      title,
      company,
      bio,
      gender,
      website,
      birthDate,
      location,
      avatarUrl,
      coverUrl,
      contact,
    });

    await prisma.user.create({
      data: {
        id: user.id.toString(),
        email: user.email.toString(),
        username: user.username.toString(),
        name: user.name,
        passwordHash: user.passwordHash,
        role: user.role,
        isPrivate: user.isPrivate,
        isActive: user.isActive,
        postCount: user.postCount,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });

    await prisma.profile.create({
      data: {
        id: user.profile.id.toString(),
        userId: user.id.toString(),
        title: user.profile.title,
        company: user.profile.company,
        bio: user.profile.bio,
        gender: user.profile.gender,
        website: user.profile.website,
        birthDate: user.profile.birthDate,
        location: user.profile.location,
        avatarUrl: user.profile.avatarUrl,
        coverUrl: user.profile.coverUrl,
        contact: user.profile.contact,
        createdAt: user.profile.createdAt,
        updatedAt: user.profile.updatedAt,
      },
    });
  }
  return users;
};
