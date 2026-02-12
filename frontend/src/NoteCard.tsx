import type { Note } from "./notesApi";

type Props = { note: Note };

export default function NoteCard({ note }: Props) {
  const hasDescription = note.description?.trim().length > 0;

  return (
    <div className="tb-noteCard">
      <h3 className="tb-noteTitle">{note.title}</h3>

      {hasDescription ? (
        <p className="tb-noteDesc">{note.description}</p>
      ) : (
        <p className="tb-noteEmpty">No description provided.</p>
      )}
    </div>
  );
}
