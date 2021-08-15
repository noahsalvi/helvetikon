async function send({ method, path, data }) {
  const opts = { method, headers: {}, body: null };

  if (data) {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(data);
  }

  return fetch(path, opts)
    .then((r) => {
      if (!r.ok) {
        throw r;
      }

      return r.text();
    })
    .then((json) => {
      try {
        return JSON.parse(json);
      } catch (err) {
        return json;
      }
    });
}

function get(path: string) {
  return send({ method: "GET", path, data: null });
}

function del(path: string) {
  return send({ method: "DELETE", path, data: null });
}

function post(path: string, data) {
  return send({ method: "POST", path, data });
}

function put(path: string, data) {
  return send({ method: "PUT", path, data });
}

export default { get, del, post, put };
