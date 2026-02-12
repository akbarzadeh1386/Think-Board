import { useEffect, useMemo, useState } from "react";
import { getNotes, type Note } from "./notesApi";
import NoteCard from "./NoteCard";

type Props = { search: string; refreshKey: number };

function NotesSkeleton() {
  return (
    <div className="tb-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="tb-skeletonCard">
          <div className="tb-skeletonLine tb-skeletonLine--title" />
          <div className="tb-skeletonLine" />
          <div className="tb-skeletonLine" />
        </div>
      ))}
    </div>
  );
}

export default function Home({ search, refreshKey }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchNotes() {
    try {
      setError(null);
      setLoading(true);
      const data = await getNotes();
      setNotes(data);
    } catch {
      setError("Failed to load notes. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;

    return notes.filter((n) => {
      const t = (n.title ?? "").toLowerCase();
      const d = (n.description ?? "").toLowerCase();
      return t.includes(q) || d.includes(q);
    });
  }, [notes, search]);

  return (
    <div className="tb-page">
      <div className="tb-pageHead">
        <h2 className="tb-title">Notes</h2>
        <button className="tb-secondaryBtn" onClick={fetchNotes}>
          Refresh
        </button>
      </div>

      {loading && <NotesSkeleton />}

      {!loading && error && (
        <div className="tb-alert tb-alert--error">
          <div className="tb-alertTitle">Something went wrong</div>
          <div className="tb-alertText">{error}</div>
          <button className="tb-primaryBtn" onClick={fetchNotes}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="tb-card">
          <p className="tb-emptyTitle">No notes found.</p>
          <p className="tb-emptySub">Create a new note or clear the search box.</p>
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="tb-grid">
          {filtered.map((note) => (
            <NoteCard key={note._id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
