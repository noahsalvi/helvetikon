import type { User } from "@prisma/client";
import jwt from "jsonwebtoken";

const expiresIn = "10min";
namespace PasswordResetToken {
  export function create(user: User) {
    const userSafe = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const secret = import.meta.env.VITE_PASSWORD_RESET_SECRET as string;
    const token = jwt.sign(userSafe, secret, { expiresIn });

    return token;
  }
}

export default PasswordResetToken;
