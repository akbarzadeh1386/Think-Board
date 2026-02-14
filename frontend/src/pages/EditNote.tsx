import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getNotes, type Note, updateNote } from "../api/notesApi";

type Props = { onSaved: () => void };

export default function EditNote({ onSaved }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const stateNote = (location.state as any)?.note as Note | undefined;

  const [title, setTitle] = useState(stateNote?.title ?? "");
  const [description, setDescription] = useState(stateNote?.description ?? "");

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(!stateNote);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    let alive = true;

    async function load() {
      if (stateNote || !id) return;

      try {
        setPageLoading(true);
        const list = await getNotes();
        const found = list.find((n) => n._id === id);
        if (!found) {
          setError("Note not found.");
          return;
        }
        if (!alive) return;
        setTitle(found.title ?? "");
        setDescription(found.description ?? "");
      } catch {
        setError("Failed to load note.");
      } finally {
        if (alive) setPageLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [id, stateNote]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const t = title.trim();
    const d = description.trim();

    if (!t || !d) {
      setError("Please fill in both Title and Description.");
      return;
    }
    if (!id) {
      setError("Invalid note id.");
      return;
    }

    try {
      setLoading(true);

      await Promise.all([
        updateNote(id, { title: t, description: d }),
        new Promise((r) => setTimeout(r, 450)),
      ]);

      onSaved();
      window.setTimeout(() => navigate("/"), 200);
    } catch {
      setError("Failed to update note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="tb-page">
        <h2 className="tb-title">Edit Note</h2>
        <div className="tb-card">
          <span className="tb-btnInline">
            <span className="tb-spinner" />
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="tb-page">
      <div className="tb-pageHead">
        <h2 className="tb-title">Edit Note</h2>
        <button className="tb-secondaryBtn" type="button" onClick={() => navigate("/")}>
          Back
        </button>
      </div>

      <p className="tb-subtitle">Update title or description, then save.</p>

      <div className="tb-formWrap">
        <form className="tb-card" onSubmit={submit}>
          <label className="tb-label">
            Title
            <input
              className="tb-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Meeting summary"
              disabled={loading}
            />
          </label>

          <label className="tb-label">
            Description
            <textarea
              className="tb-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your note..."
              rows={6}
              disabled={loading}
            />
          </label>

          {error && <div className="tb-inlineError">{error}</div>}

          <button className="tb-primaryBtn" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        {loading && (
          <div className="tb-overlay" aria-label="Saving note">
            <div className="tb-loaderCard">
              <div className="tb-spinner" />
              <div className="tb-loaderText">Saving your changes...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
