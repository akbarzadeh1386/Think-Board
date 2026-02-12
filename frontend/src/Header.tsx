import { useNavigate } from "react-router-dom";

type HeaderProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function Header({ search, onSearchChange }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="tb-header">
      <div className="tb-header__inner">
        {/* LEFT - LOGO */}
        <div className="tb-header__logo" onClick={() => navigate("/")}>
          <div className="tb-header__logoIcon">🧠</div>
          <span className="tb-header__logoText">Think Board</span>
        </div>

        {/* CENTER - SEARCH */}
        <div className="tb-header__search">
          <span className="tb-header__searchIcon">⌕</span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="tb-header__searchInput"
            placeholder="Search between notes..."
          />
        </div>

        {/* RIGHT - CREATE BUTTON */}
        <button className="tb-header__btn" onClick={() => navigate("/create")}>
          New Note +
        </button>
      </div>
    </header>
  );
}
