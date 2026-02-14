import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import AppRouter from "./router/AppRouter";

export default function App() {
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const bump = () => setRefreshKey((k) => k + 1);

  return (
    <BrowserRouter>
      <Header search={search} onSearchChange={setSearch} />

      <main className="tb-main">
        <AppRouter
          search={search}
          refreshKey={refreshKey}
          onCreated={() => {
            setSearch("");
            bump();
          }}
          onSaved={bump}
        />
      </main>
    </BrowserRouter>
  );
}
