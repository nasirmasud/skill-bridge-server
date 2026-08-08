import { Prisma } from "../../../generated/prisma/client";
import { comparePassword, hashPassword } from "../../lib/bcrypt";
import {
  JwtPayload,
  signAccessToken,
  signRefreshToken,
  verifyToken,
} from "../../lib/jwt";
import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  profileImg: true,
  bio: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

type PublicUser = Prisma.UserGetPayload<{ select: typeof publicUserSelect }>;

const toPublicUser = (
  user: { password: string; isDeleted: boolean } & PublicUser
): PublicUser => {
  const { password: _password, isDeleted: _isDeleted, ...publicUser } = user;
  return publicUser;
};

const signTokens = (user: { id: string; email: string; role: string }) => {
  const payload: JwtPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
  };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  };
};

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: "CLIENT" | "FREELANCER";
  phone?: string;
  bio?: string;
  profileImg?: string;
}) => {
  const existing = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existing && !existing.isDeleted) {
    throw new ApiError(409, "User with this email already exists", [
      { path: "email", message: "Email is already registered" },
    ]);
  }

  const hashedPassword = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      phone: data.phone,
      bio: data.bio,
      profileImg: data.profileImg,
    },
    select: publicUserSelect,
  });

  return {
    user,
    ...signTokens(user),
  };
};

export const loginUser = async (data: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  if (!user || user.isDeleted) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordMatch = await comparePassword(data.password, user.password);

  if (!isPasswordMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  return {
    user: toPublicUser(user),
    ...signTokens(user),
  };
};

export const refreshAccessToken = async (refreshToken: string) => {
  let payload: JwtPayload;

  try {
    payload = verifyToken(refreshToken);
  } catch {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } });

  if (!user || user.isDeleted) {
    throw new ApiError(401, "User no longer exists");
  }

  return {
    user: toPublicUser(user),
    accessToken: signAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    }),
  };
};
