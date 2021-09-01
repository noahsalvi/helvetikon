import type { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import { PASSWORD_RESET_SECRET } from "../secrets";

const expiresIn = "10min";
namespace PasswordResetToken {
  export function create(user: User) {
    const userSafe = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const token = jwt.sign(userSafe, PASSWORD_RESET_SECRET, { expiresIn });

    return token;
  }
}

export default PasswordResetToken;
