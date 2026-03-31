import { useMemo, useState } from "react";
import type { College, CardOptions } from "../types";

const sectionDefs: { key: keyof CardOptions; label: string }[] = [
  { key: "showAdmissions", label: "Admissions Details" },
  { key: "showGender", label: "Gender Breakdown" },
  { key: "showEthnicity", label: "Ethnicity Breakdown" },
  { key: "showFinancialAid", label: "Financial Aid" },
  { key: "showNetPriceByIncome", label: "Net Price by Income" },
];

interface Props {
  colleges: College[];
  selected: College[];
  onSelectionChange: (selected: College[]) => void;
  cardOptions: CardOptions;
  onCardOptionsChange: (options: CardOptions) => void;
  onClose?: () => void;
}

export default function CollegeSelector({
  colleges,
  selected,
  onSelectionChange,
  cardOptions,
  onCardOptionsChange,
  onClose,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set());
  const [stateFilterOpen, setStateFilterOpen] = useState(false);
  const [collegeListOpen, setCollegeListOpen] = useState(true);
  const [cardInfoOpen, setCardInfoOpen] = useState(false);

  function toggleCardOption(key: keyof CardOptions) {
    onCardOptionsChange({ ...cardOptions, [key]: !cardOptions[key] });
  }

  const allStates = useMemo(() => {
    const states = new Set<string>();
    for (const c of colleges) {
      if (c.state !== "---") {
        states.add(c.state);
      }
    }
    return Array.from(states).sort();
  }, [colleges]);

  const selectedIds = new Set(selected.map((c) => c.id));

  const filtered = colleges.filter((c) => {
    if (selectedStates.size > 0 && !selectedStates.has(c.state)) {
      return false;
    }
    const q = search.toLowerCase();
    return (
      c.schoolName.toLowerCase().includes(q) ||
      c.state.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  function toggle(college: College) {
    if (selectedIds.has(college.id)) {
      onSelectionChange(
        selected.filter((c) => c.id !== college.id)
      );
    } else {
      onSelectionChange([...selected, college]);
    }
  }

  function toggleState(state: string) {
    setSelectedStates((prev) => {
      const next = new Set(prev);
      if (next.has(state)) {
        next.delete(state);
      } else {
        next.add(state);
      }
      return next;
    });
  }

  function clearStates() {
    setSelectedStates(new Set());
  }

  return (
    <section className="college-selector">
      <div className="selector-header">
        {onClose && (
          <button className="sidebar-toggle" onClick={onClose} aria-label="Close sidebar">
            {"\u2715"}
          </button>
        )}
        <h2>Select Colleges</h2>
      </div>
      <input
        type="text"
        className="search-input"
        placeholder="Search by name, city, or state…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* State filter */}
      <button
        className="state-filter-toggle"
        onClick={() => setStateFilterOpen((o) => !o)}
      >
        Filter by State
        {selectedStates.size > 0 && (
          <span className="state-filter-count">{selectedStates.size}</span>
        )}
        <span
          className={`chevron${stateFilterOpen ? " chevron--open" : ""}`}
        >
          ▼
        </span>
      </button>

      {stateFilterOpen && (
        <div className="state-filter-panel">
          <div className="state-filter-grid">
            {allStates.map((st) => (
              <label key={st}>
                <input
                  type="checkbox"
                  checked={selectedStates.has(st)}
                  onChange={() => toggleState(st)}
                />
                {st}
              </label>
            ))}
          </div>
          {selectedStates.size > 0 && (
            <button className="state-filter-clear" onClick={clearStates}>
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Selected state pills */}
      {selectedStates.size > 0 && (
        <div className="selected-tags">
          {Array.from(selectedStates)
            .sort()
            .map((st) => (
              <span key={st} className="tag tag--state">
                {st}
                <button
                  className="tag-remove"
                  onClick={() => toggleState(st)}
                  aria-label={`Remove ${st} filter`}
                >
                  ×
                </button>
              </span>
            ))}
        </div>
      )}

      {selected.length > 0 && (
        <div className="selected-tags">
          {selected.map((c) => (
            <span key={c.id} className="tag">
              {c.schoolName}
              <button
                className="tag-remove"
                onClick={() => toggle(c)}
                aria-label={`Remove ${c.schoolName}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <button
        className="state-filter-toggle"
        onClick={() => setCollegeListOpen((o) => !o)}
      >
        Colleges ({filtered.length})
        <span
          className={`chevron${collegeListOpen ? " chevron--open" : ""}`}
        >
          ▼
        </span>
      </button>

      {collegeListOpen && (
        <div className="college-list">
          {filtered.map((c) => (
            <label key={c.id} className="college-option">
              <input
                type="checkbox"
                checked={selectedIds.has(c.id)}
                onChange={() => toggle(c)}
              />
              <span className="college-name">{c.schoolName}</span>
              {c.state !== "---" && (
                <span className="college-state">
                  {c.city !== "---" ? `${c.city}, ` : ""}
                  {c.state}
                </span>
              )}
            </label>
          ))}
          {filtered.length === 0 && (
            <p className="list-hint">No colleges match your search.</p>
          )}
        </div>
      )}

      {/* Card info sections */}
      <button
        className="state-filter-toggle"
        onClick={() => setCardInfoOpen((o) => !o)}
      >
        Card Info Sections
        <span
          className={`chevron${cardInfoOpen ? " chevron--open" : ""}`}
        >
          ▼
        </span>
      </button>

      {cardInfoOpen && (
        <div className="card-options-list">
          <label className="card-options-item card-options-item--highlight">
            <input
              type="checkbox"
              checked={cardOptions.hideEmptyStudentData}
              onChange={() => toggleCardOption("hideEmptyStudentData")}
            />
            Hide metrics without student data
          </label>
          <hr className="card-options-divider" />
          {sectionDefs.map((opt) => (
            <label key={opt.key} className="card-options-item">
              <input
                type="checkbox"
                checked={cardOptions[opt.key]}
                onChange={() => toggleCardOption(opt.key)}
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </section>
  );
}
