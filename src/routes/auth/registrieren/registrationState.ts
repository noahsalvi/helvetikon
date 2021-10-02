import { writable } from "svelte/store";

export const registrationState = writable({
  nickname: "",
  email: "",
  password: "",
  passwordRepeat: "",
  dialect: "",
});
