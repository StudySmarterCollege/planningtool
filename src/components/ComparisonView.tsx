import type { College, Student, CardOptions } from "../types";
import CollegeCard from "./CollegeCard";

interface Props {
  colleges: College[];
  student: Student;
  cardOptions: CardOptions;
}

export default function ComparisonView({ colleges, student, cardOptions }: Props) {
  if (colleges.length === 0) {
    return (
      <section className="comparison-view empty">
        <p>Select colleges from the sidebar to see your comparison cards.</p>
      </section>
    );
  }

  return (
    <section className="comparison-view">
      <h2>College Comparison</h2>
      <div className="card-grid">
        {colleges.map((c) => (
          <CollegeCard key={c.id} college={c} student={student} cardOptions={cardOptions} />
        ))}
      </div>
    </section>
  );
}
