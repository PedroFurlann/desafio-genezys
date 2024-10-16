import jwt, { JwtPayload } from "jsonwebtoken";

export const generateJWT = (payload: object): string => {
  const token = jwt.sign(payload, process.env.NEXT_PUBLIC_SECRET_KEY || "", {
    expiresIn: "12h",
  });

  return token
};

export const verifyJWT = (token: string): JwtPayload | string | null => {
  try {
    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_SECRET_KEY || "");

    if (typeof decoded === "object") {
      return decoded as JwtPayload;
    }

    return decoded;
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

