import { generateToken } from "../utils/jwt.mjs";
import { userResponseDto } from "../dto/userResponse.dto.mjs";
import { jwtResponseDto } from "../dto/jwtResponse.dto.mjs";
import usersRepository from "../persistences/mongo/repositories/users.repository.mjs";
import { createHash } from "../utils/bcrypt.mjs";
import customErrors from "../errors/customErrors.mjs";

const register = async (userData) => {
  const { email, first_name, last_name, age, password } = userData;
  const existingUser = await usersRepository.getByEmail(email);
  if (existingUser) {
    throw customErrors.badRequestError("User already exists");
  }
  const newUser = {
    first_name,
    last_name,
    email,
    age,
    password: createHash(password),
  };
  await usersRepository.create(newUser);
};

const login = async (user) => {
  const token = generateToken(user);
  const userDto = userResponseDto(user);
  return { user: userDto, token };
};

const getCurrentUser = (user) => {
  if (!user) {
    throw customErrors.unauthorizedError("User not authenticated");
  }
  return jwtResponseDto(user);
};

const loginGithub = async (user) => {
  const userDto = userResponseDto(user);
  return userDto;
};

const logout = async (session) => {
  session.destroy();
};

export default {
  register,
  login,
  getCurrentUser,
  loginGithub,
  logout,
};
