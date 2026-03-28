import type { CardOptions } from "../types";

interface Props {
  options: CardOptions;
  onChange: (options: CardOptions) => void;
}

const sectionDefs: { key: keyof CardOptions; label: string }[] = [
  { key: "showAdmissions", label: "Admissions Details" },
  { key: "showGender", label: "Gender Breakdown" },
  { key: "showEthnicity", label: "Ethnicity Breakdown" },
  { key: "showFinancialAid", label: "Financial Aid" },
  { key: "showNetPriceByIncome", label: "Net Price by Income" },
];

export default function CardOptionsPanel({ options, onChange }: Props) {
  function toggle(key: keyof CardOptions) {
    onChange({ ...options, [key]: !options[key] });
  }

  return (
    <section className="card-options-panel">
      <h2>Card Info Sections</h2>
      <p className="card-options-hint">Choose extra data to show on cards</p>
      <div className="card-options-list">
        <label className="card-options-item card-options-item--highlight">
          <input
            type="checkbox"
            checked={options.hideEmptyStudentData}
            onChange={() => toggle("hideEmptyStudentData")}
          />
          Hide metrics without student data
        </label>
        <hr className="card-options-divider" />
        {sectionDefs.map((opt) => (
          <label key={opt.key} className="card-options-item">
            <input
              type="checkbox"
              checked={options[opt.key]}
              onChange={() => toggle(opt.key)}
            />
            {opt.label}
          </label>
        ))}
      </div>
    </section>
  );
}
