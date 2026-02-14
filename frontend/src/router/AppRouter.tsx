import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import CreateNote from "../pages/CreateNote";
import EditNote from "../pages/EditNote";

type Props = {
  search: string;
  refreshKey: number;
  onCreated: () => void;
  onSaved: () => void;
};

export default function AppRouter({
  search,
  refreshKey,
  onCreated,
  onSaved,
}: Props) {
  return (
    <Routes>
      <Route path="/" element={<Home search={search} refreshKey={refreshKey} />} />
      <Route path="/create" element={<CreateNote onCreated={onCreated} />} />
      <Route path="/edit/:id" element={<EditNote onSaved={onSaved} />} />
    </Routes>
  );
}
