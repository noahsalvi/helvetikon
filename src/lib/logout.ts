import api from "./api";
import { warnNextVisit } from "./components/Toaster/toast";

export function logout() {
  api.post("/api/auth/logout", null).then(() => {
    warnNextVisit("Du hast dich abgemeldet 🏃‍♂️");
    location.reload();
  });
}
