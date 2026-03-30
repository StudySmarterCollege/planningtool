import type { College, Student, CardOptions } from "../types";
import CollegeCard from "./CollegeCard";

interface Props {
  colleges: College[];
  student: Student;
  cardOptions: CardOptions;
  cardRefs?: React.MutableRefObject<Map<string, HTMLDivElement>>;
}

export default function ComparisonView({ colleges, student, cardOptions, cardRefs }: Props) {
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
          <div
            key={c.id}
            ref={(el) => {
              if (!cardRefs) return;
              if (el) {
                cardRefs.current.set(c.id, el);
              } else {
                cardRefs.current.delete(c.id);
              }
            }}
          >
            <CollegeCard college={c} student={student} cardOptions={cardOptions} />
          </div>
        ))}
      </div>
    </section>
  );
}
