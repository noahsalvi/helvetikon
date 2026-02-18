export default function authorize(locals: App.Locals) {
  if (!locals.user) {
    throw {
      status: 401,
      body: "Authorization failed",
    };
  }

  return locals.user;
}
