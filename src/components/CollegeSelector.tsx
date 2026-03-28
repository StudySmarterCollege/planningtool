import { useMemo, useState } from "react";
import type { College } from "../types";

interface Props {
  colleges: College[];
  selected: College[];
  onSelectionChange: (selected: College[]) => void;
}

export default function CollegeSelector({
  colleges,
  selected,
  onSelectionChange,
}: Props) {
  const [search, setSearch] = useState("");
  const [selectedStates, setSelectedStates] = useState<Set<string>>(new Set());
  const [stateFilterOpen, setStateFilterOpen] = useState(false);
  const [collegeListOpen, setCollegeListOpen] = useState(true);

  const allStates = useMemo(() => {
    const states = new Set<string>();
    for (const c of colleges) {
      if (c.state !== "---") {
        states.add(c.state);
      }
    }
    return Array.from(states).sort();
  }, [colleges]);

  const selectedNames = new Set(selected.map((c) => c.schoolName));

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
    if (selectedNames.has(college.schoolName)) {
      onSelectionChange(
        selected.filter((c) => c.schoolName !== college.schoolName)
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
      <h2>Select Colleges</h2>
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
            <span key={c.schoolName} className="tag">
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
            <label key={c.schoolName} className="college-option">
              <input
                type="checkbox"
                checked={selectedNames.has(c.schoolName)}
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
    </section>
  );
}
