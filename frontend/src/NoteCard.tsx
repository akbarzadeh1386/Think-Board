import { useEffect, useRef, useState } from "react";
import type { Note } from "./notesApi";
import { deleteNote } from "./notesApi";

type Props = { note: Note; onDeleted?: (id: string) => void };

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 3h6m-8 4h10m-9 0 1 16h6l1-16M10 11v8m4-8v8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NoteCard({ note, onDeleted }: Props) {
  const [openMenu, setOpenMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const hasDescription = (note.description ?? "").trim().length > 0;

  useEffect(() => {
    function onDocDown(e: MouseEvent) {
      if (!openMenu) return;
      const el = wrapRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) setOpenMenu(false);
    }
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [openMenu]);

  async function handleDelete() {
    if (deleting) return;

    const ok = window.confirm("Delete this note?");
    if (!ok) return;

    try {
      setDeleting(true);

      await Promise.all([
        deleteNote(note._id),
        new Promise((r) => setTimeout(r, 350)),
      ]);

      setOpenMenu(false);
      onDeleted?.(note._id);
    } catch {
      alert("Failed to delete note. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="tb-noteCard">
      <div className="tb-noteHead">
        <h3 className="tb-noteTitle">{note.title}</h3>

        <div className="tb-noteMenuWrap" ref={wrapRef}>
          <button
            className="tb-noteMenuBtn"
            onClick={() => setOpenMenu((v) => !v)}
            aria-label="Note actions"
            type="button"
            disabled={deleting}
          >
            ⋮
          </button>

          {openMenu && (
            <div className="tb-noteMenu" role="menu">
              <button
                onClick={handleDelete}
                className="tb-noteMenuItem tb-noteMenuItem--danger"
                type="button"
                disabled={deleting}
              >
                <span className="tb-noteMenuIcon">
                  {deleting ? <span className="tb-miniSpinner" /> : <TrashIcon />}
                </span>
                <span>{deleting ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {hasDescription ? (
        <p className="tb-noteDesc">{note.description}</p>
      ) : (
        <p className="tb-noteEmpty">No description provided.</p>
      )}

      {note.createdAt && (
        <p className="tb-noteDate">{new Date(note.createdAt).toLocaleString()}</p>
      )}
    </div>
  );
}
