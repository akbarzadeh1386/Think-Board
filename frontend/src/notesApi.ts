import axios from "axios";

export type Note = {
  _id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
};

const api = axios.create({
  baseURL: "/api",
});

type RawNote = any;

function extractArray(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.notes)) return data.notes;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function normalizeNote(n: RawNote): Note {
  return {
    _id: String(n._id ?? n.id ?? n.noteId ?? ""),
    title: String(n.title ?? n.noteTitle ?? ""),
    description: String(n.description ?? n.content ?? n.body ?? n.text ?? ""),
    createdAt: n.createdAt,
    updatedAt: n.updatedAt,
  };
}

export async function getNotes(): Promise<Note[]> {
  const res = await api.get("/notes");
  const arr = extractArray(res.data);
  return arr.map(normalizeNote).filter((n) => n._id);
}

export async function createNote(payload: { title: string; description: string }) {
  const res = await api.post("/notes", {
    title: payload.title,
    description: payload.description,
    content: payload.description,
    body: payload.description,
    text: payload.description,
  });
  return res.data;
}
