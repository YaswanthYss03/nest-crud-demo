const BASE = 'http://localhost:3000';

async function req(method, path, body) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const bookService = {
  getAll:   ()         => req('GET',    '/books'),
  getById:  (id)       => req('GET',    `/books/${id}`),
  create:   (data)     => req('POST',   '/books', data),
  update:   (id, data) => req('PUT',    `/books/${id}`, data),
  remove:   (id)       => req('DELETE', `/books/${id}`),
};
