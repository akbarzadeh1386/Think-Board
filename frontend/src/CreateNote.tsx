import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNote } from "./notesApi";

type Props = { onCreated: () => void };

export default function CreateNote({ onCreated }: Props) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const t = title.trim();
    const d = description.trim();

    if (!t || !d) {
      setError("Please fill in both Title and Description.");
      return;
    }

    try {
      setLoading(true);

      await Promise.all([
        createNote({ title: t, description: d }),
        new Promise((r) => setTimeout(r, 450)),
      ]);

      setTitle("");
      setDescription("");

      setSuccess(true);
      window.setTimeout(() => setSuccess(false), 1600);

      onCreated();
      window.setTimeout(() => navigate("/"), 800);
    } catch {
      setError("Failed to create note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tb-page">
      <h2 className="tb-title">Create New Note</h2>
      <p className="tb-subtitle">Add a title and description, then create it.</p>

      {success && (
        <div className="tb-successWrap">
          <div className="tb-successBanner tb-confetti">✅ Your note has been created.</div>
        </div>
      )}

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
            {loading ? "Creating..." : "Create Note"}
          </button>
        </form>

        {loading && (
          <div className="tb-overlay" aria-label="Creating note">
            <div className="tb-loaderCard">
              <div className="tb-spinner" />
              <div className="tb-loaderText">Creating your note...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
