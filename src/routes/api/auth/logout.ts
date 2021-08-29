import DELETE_ACCESS_TOKEN_COOKIE from "$lib/utils/delete-access-token-cookie";

export function post({ locals }) {
  delete locals.user;

  return {
    headers: {
      "set-cookie": [DELETE_ACCESS_TOKEN_COOKIE],
    },
    body: {
      ok: true,
    },
  };
}
