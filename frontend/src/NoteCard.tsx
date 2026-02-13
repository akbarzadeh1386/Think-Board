import type { Note } from "./notesApi";
import { deleteNote } from "./notesApi";

import { useState } from "react";
type Props = { note: Note };

export default function NoteCard({ note }: Props) {
  const [openMenu, setOpenMenu] = useState(false);

  const hasDescription = note.description?.trim().length > 0;

  async function handleDelete() {
    const ok = window.confirm("celete this note?");
    if (!ok) return;
    await deleteNote(note._id);
    window.location.reload();
  }

  return (
    <div className="tb-noteCard">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3 className="tb-noteTitle">{note.title}</h3>

        <div style={{ position: "relative" }}>
          <button
            style={{
              background: "rgba(212, 201, 190, 0.55)",
              border: "none",
            }}
            onClick={() => setOpenMenu(!openMenu)}
          >
            ⋮
          </button>

          {openMenu && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "25px",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "6px",
                padding: "8px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              {/* <button onClick={handleEdit}>Edit</button> */}
              <br />
              <button onClick={handleDelete} style={{ color: "red" }}>
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <h3 className="tb-noteTitle">{note.title}</h3>

      {hasDescription ? (
        <p className="tb-noteDesc">{note.description}</p>
      ) : (
        <p className="tb-noteEmpty">No description provided.</p>
      )}
      {note.createdAt && (
        <p className="tb-noteDate">
          {new Date(note.createdAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
