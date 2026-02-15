import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Note } from "../api/notesApi";
import { deleteNote } from "../api/notesApi";

type Props = {
  note: Note;
  onDeleted?: (id: string) => void;
};

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M12 20h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NoteCard({ note, onDeleted }: Props) {
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const [openMenu, setOpenMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const hasDescription = (note.description ?? "").trim().length > 0;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!openMenu) return;
      if (!wrapRef.current) return;
      if (e.target instanceof Node && !wrapRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  function handleEdit() {
    setOpenMenu(false);
    navigate(`/edit/${note._id}`, { state: { note } });
  }

  async function handleDelete() {
    if (deleting) return;

    const ok = window.confirm("Delete this note?");
    if (!ok) return;

    try {
      setDeleting(true);
      await deleteNote(note._id);
      onDeleted?.(note._id);
    } catch {
      alert("Failed to delete note.");
    } finally {
      setDeleting(false);
      setOpenMenu(false);
    }
  }

  return (
    <div className={`tb-noteCard ${openMenu ? "tb-noteCard--menuOpen" : ""}`}>
      <div className="tb-noteHead">
        <h3 className="tb-noteTitle">{note.title}</h3>

        <div className="tb-noteMenuWrap" ref={wrapRef}>
          <button
            className="tb-noteMenuBtn"
            onClick={() => setOpenMenu((v) => !v)}
            disabled={deleting}
            type="button"
          >
            ⋮
          </button>

          {openMenu && (
            <div className="tb-noteMenu">
              <button
                onClick={handleEdit}
                className="tb-noteMenuItem"
                type="button"
                disabled={deleting}
              >
                <span className="tb-noteMenuIcon">
                  <EditIcon />
                </span>
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="tb-noteMenuItem tb-noteMenuItem--danger"
                type="button"
                disabled={deleting}
              >
                <span className="tb-noteMenuIcon">
                  {deleting ? <span className="tb-miniSpinner" /> : <TrashIcon />}
                </span>
                {deleting ? "Deleting..." : "Delete"}
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
        <p className="tb-noteDate">
          {new Date(note.createdAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
