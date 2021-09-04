import { writable } from "svelte/store";

export const registrationState = writable({
  username: "",
  email: "",
  password: "",
  passwordRepeat: "",
  dialect: "",
});
