import md5 from "md5";
import path from "path";
import { v7 as uuidv7 } from 'uuid';
import HttpErrors from "http-errors";
import { mkdir, access, writeFile, readFile } from "fs/promises";


const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "users.json");

const { USER_SECRET } = process.env;

export async function readUsers() {
  try {
    const data = await readFile(dataFile, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

async function writeUsers(users) {
  await writeFile(dataFile, JSON.stringify(users, null, 2));
}

/// -----------------------------------

export async function initializeDataFile() {
  try {
    await mkdir(dataDir, { recursive: true });
    await access(dataFile);
  } catch {
    await writeFile(dataFile, "[]");
  }
}

//// ----------------------------------

export async function findUserByID(id) {
  const users = await readUsers();
  return users.find((u) => u.id === id);
}

export async function findUserByEmail(email) {
  const users = await readUsers();
  return users.find((u) => u.email === email);
}

export async function createUser({ username, email, password, address }) {
  const users = await readUsers();

  if (await findUserByEmail(email)) {
    throw HttpErrors(404, "User already exists!");
  }

  const newUser = {
    id: uuidv7(),
    username,
    email,
    password: md5(md5(password) + USER_SECRET),
    address,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  users.push(newUser);

  await writeUsers(users);

  return newUser;
}

export function checkPassword(password, password2) {
  return password === md5(md5(password2) + USER_SECRET)
}


export function sanitizeUser(user) {
  if (!user) return null;

  const { password, ...safeUser } = user;
  return safeUser;
}

