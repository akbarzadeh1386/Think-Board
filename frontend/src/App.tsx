import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import CreateNote from "./CreateNote";

export default function App() {
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const bump = () => setRefreshKey((k) => k + 1);

  return (
    <BrowserRouter>
      <Header search={search} onSearchChange={setSearch} />

      <main className="tb-main">
        <Routes>
          <Route path="/" element={<Home search={search} refreshKey={refreshKey} />} />
          <Route
            path="/create"
            element={
              <CreateNote
                onCreated={() => {
                  setSearch("");
                  bump();
                }}
              />
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
