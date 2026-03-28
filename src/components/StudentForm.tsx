import type { Student } from "../types";

interface Props {
  student: Student;
  onChange: (student: Student) => void;
}

function numVal(e: React.ChangeEvent<HTMLInputElement>): number | null {
  const v = e.target.value;
  if (v === "") return null;
  return parseFloat(v);
}

export default function StudentForm({ student, onChange }: Props) {
  function set(field: keyof Student, value: string | number | null) {
    onChange({ ...student, [field]: value });
  }

  return (
    <section className="student-form">
      <h2>Student Information</h2>
      <div className="form-grid">
        <label>
          Name
          <input
            type="text"
            value={student.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Student name"
          />
        </label>

        <label>
          GPA (0–5.0)
          <input
            type="number"
            step="0.01"
            min="0"
            max="5"
            value={student.gpa ?? ""}
            onChange={(e) => set("gpa", numVal(e))}
            placeholder="e.g. 3.8"
          />
        </label>

        <label>
          SAT Total
          <input
            type="number"
            min="400"
            max="1600"
            value={student.satTotal ?? ""}
            onChange={(e) => set("satTotal", numVal(e))}
            placeholder="400–1600"
          />
        </label>

        <label>
          SAT Reading
          <input
            type="number"
            min="200"
            max="800"
            value={student.satReading ?? ""}
            onChange={(e) => set("satReading", numVal(e))}
            placeholder="200–800"
          />
        </label>

        <label>
          SAT Math
          <input
            type="number"
            min="200"
            max="800"
            value={student.satMath ?? ""}
            onChange={(e) => set("satMath", numVal(e))}
            placeholder="200–800"
          />
        </label>

        <label>
          ACT Composite
          <input
            type="number"
            min="1"
            max="36"
            value={student.actComposite ?? ""}
            onChange={(e) => set("actComposite", numVal(e))}
            placeholder="1–36"
          />
        </label>

        <label>
          ACT English
          <input
            type="number"
            min="1"
            max="36"
            value={student.actEnglish ?? ""}
            onChange={(e) => set("actEnglish", numVal(e))}
            placeholder="1–36"
          />
        </label>

        <label>
          ACT Reading
          <input
            type="number"
            min="1"
            max="36"
            value={student.actReading ?? ""}
            onChange={(e) => set("actReading", numVal(e))}
            placeholder="1–36"
          />
        </label>

        <label>
          ACT Math
          <input
            type="number"
            min="1"
            max="36"
            value={student.actMath ?? ""}
            onChange={(e) => set("actMath", numVal(e))}
            placeholder="1–36"
          />
        </label>

        <label>
          ACT Science
          <input
            type="number"
            min="1"
            max="36"
            value={student.actScience ?? ""}
            onChange={(e) => set("actScience", numVal(e))}
            placeholder="1–36"
          />
        </label>
      </div>
    </section>
  );
}
