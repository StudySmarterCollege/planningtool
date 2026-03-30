import { useEffect, useRef, useState } from "react";
import type { Student, College, CardOptions } from "./types";
import { loadColleges } from "./utils/parseData";
import StudentForm from "./components/StudentForm";
import CollegeSelector from "./components/CollegeSelector";
import ComparisonView from "./components/ComparisonView";
import ExportButton from "./components/ExportButton";
import ExportCardsButton from "./components/ExportCardsButton";

const emptyStudent: Student = {
  name: "",
  gpa: null,
  satTotal: null,
  satReading: null,
  satMath: null,
  actComposite: null,
  actEnglish: null,
  actReading: null,
  actMath: null,
  actScience: null,
};

const defaultCardOptions: CardOptions = {
  showGender: false,
  showEthnicity: false,
  showAdmissions: false,
  showFinancialAid: false,
  showNetPriceByIncome: false,
  hideEmptyStudentData: false,
};

export default function App() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student>(emptyStudent);
  const [selected, setSelected] = useState<College[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [cardOptions, setCardOptions] = useState<CardOptions>(defaultCardOptions);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    loadColleges()
      .then((data) => {
        setColleges(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(String(err));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="app loading-screen">
        <p>Loading college data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app error-screen">
        <p>Failed to load data: {error}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <img
          src={`${import.meta.env.BASE_URL}study-smarter-logo.webp`}
          alt="Study Smarter"
          className="logo"
        />
        <div style={{ flex: 1 }} />
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? "\u2715" : "\u2630"}
        </button>
      </header>

      <div className="app-layout">
        <aside className={`sidebar${sidebarOpen ? " sidebar--open" : ""}`}>
          <CollegeSelector
            colleges={colleges}
            selected={selected}
            onSelectionChange={setSelected}
            cardOptions={cardOptions}
            onCardOptionsChange={setCardOptions}
          />
        </aside>

        <main className="main-content">
          <StudentForm student={student} onChange={setStudent} />
          <div className="export-btn-row">
            <ExportButton colleges={selected} student={student} />
            <ExportCardsButton colleges={selected} student={student} cardRefs={cardRefs} />
          </div>
          <ComparisonView colleges={selected} student={student} cardOptions={cardOptions} cardRefs={cardRefs} />
        </main>
      </div>
    </div>
  );
}
