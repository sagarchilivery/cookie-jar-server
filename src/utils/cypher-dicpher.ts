import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

function Cypher(password: string): string {
  return bcrypt.hashSync(password, salt);
}

function Decypher({
  password,
  hash,
}: {
  password: string;
  hash: string;
}): boolean {
  return bcrypt.compareSync(password, hash);
}

export { Cypher, Decypher };
