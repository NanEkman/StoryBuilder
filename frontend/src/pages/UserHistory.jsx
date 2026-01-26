import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ACTION_META = {
  STORY_CREATED: { title: "Du skapade en story", icon: "✍️" },
  STORY_CONTRIBUTED: { title: "Du bidrog till en story", icon: "🧩" },
  STORY_COMPLETED: { title: "Du avslutade en story", icon: "✅" },
  INVITE_SENT: { title: "Du skickade inbjudan", icon: "📨" },
  INVITE_ACCEPTED: { title: "Du accepterade en inbjudan", icon: "🤝" },
};

function shortId(id) {
  if (!id || typeof id !== "string") return "";
  if (id.length <= 12) return id;
  return `${id.slice(0, 6)}…${id.slice(-4)}`;
}

function formatDate(dt) {
  if (!dt) return "";
  try {
    return new Date(dt).toLocaleString("sv-SE");
  } catch {
    return "";
  }
}

function formatDetails(action, details) {
  if (!details) return [];

  const lines = [];

  switch (action) {
    case "STORY_CREATED": {
      if (details.title) lines.push(`Titel: ${details.title}`);
      if (typeof details.isPublic === "boolean") {
        lines.push(`Synlighet: ${details.isPublic ? "Publik" : "Privat"}`);
      }
      break;
    }

    case "STORY_CONTRIBUTED": {
      if (details.order) lines.push(`Del: ${details.order}`);
      break;
    }

    case "STORY_COMPLETED": {
      if (details.title) lines.push(`Titel: ${details.title}`);
      break;
    }

    case "INVITE_SENT": {
      if (details.count) lines.push(`Antal inbjudna: ${details.count}`);
      break;
    }

    case "INVITE_ACCEPTED": {
      // inget extra behövs här
      break;
    }

    default: {
      // inget
    }
  }

  return lines.filter(Boolean);
}


export default function UserHistory() {
  const navigate = useNavigate();
  const [history, setHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user-history/me`,
        { headers }
      );

      setHistory(res.data.history || []);
    } catch (err) {
      setError(err.response?.data?.error || "Could not fetch user history");
      console.error("Fetch user history error:", err);
    } finally {
      setLoading(false);
    }
  };

  const goToStoryIfPossible = (h) => {
    const storyId = h?.details?.storyId;
    if (storyId) navigate(`/stories/${storyId}`);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">User History</h1>
          <p className="text-muted-foreground">Din viktiga aktivitet i appen</p>
        </div>

        <button
          className="px-4 py-2 rounded bg-primary text-primary-foreground"
          onClick={fetchHistory}
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Laddar historik...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Ingen historik ännu.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((h) => {
            const meta = ACTION_META[h.action] || { title: h.action, icon: "🔔" };
            const lines = formatDetails(h.action, h.details);
            const clickable = Boolean(h?.details?.storyId);

            return (
              <div
                key={h.id}
                role={clickable ? "button" : undefined}
                tabIndex={clickable ? 0 : -1}
                onClick={() => clickable && goToStoryIfPossible(h)}
                onKeyDown={(e) => {
                  if (!clickable) return;
                  if (e.key === "Enter" || e.key === " ") goToStoryIfPossible(h);
                }}
                className={[
                  "border rounded-lg p-4 bg-card",
                  clickable ? "cursor-pointer hover:bg-muted/40 transition" : "",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-semibold">
                      <span className="mr-2">{meta.icon}</span>
                      {meta.title}
                      {clickable && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (öppna story)
                        </span>
                      )}
                    </p>

                    {lines.length > 0 && (
                      <ul className="mt-2 text-sm text-muted-foreground space-y-1">
                        {lines.map((line, idx) => (
                          <li key={idx} className="truncate">
                            {line}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(h.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
