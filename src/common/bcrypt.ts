import bcrypt from "bcrypt";

export async function hashed(str: string, salt: number = 10) {
  return await bcrypt.hash(str, salt);
}

export async function compared(str: string, hashedString: string) {
  return await bcrypt.compare(str, hashedString);
}