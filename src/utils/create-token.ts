import jwt from "jsonwebtoken";

const CreateTokens = (payload: {
  id: string;
  role: string;
  email: string;
}) => {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  if (!secret) {
    throw new Error("ACCESS_TOKEN SECRET is not defined");
  }
  const accessToken = jwt.sign(payload, secret, {
    expiresIn: "1y",
  });
  return { accessToken };
};

export { CreateTokens };
