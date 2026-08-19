import React from "react";
import { ArrowUpRight, CheckCircle2, CircleAlert } from "lucide-react";
import SkillBadge from "./SkillBadge";

export default function ProjectCard({ item, onOpen }) {
  const {
    project,
    matchedSkills,
    missingSkills,
    matchedCount,
    requiredCount
  } = item;

  const percentage = requiredCount
    ? Math.round((matchedCount / requiredCount) * 100)
    : 0;

  return (
    <article className="project-card">
      <div className="project-top">
        <div>
          <span className="eyebrow">{project.difficulty}</span>
          <h3>{project.name}</h3>
        </div>

        <button
          className="project-arrow"
          type="button"
          onClick={() => onOpen(item)}
          aria-label={`View ${project.name}`}
        >
          <ArrowUpRight size={20} />
        </button>
      </div>

      <p>{project.description}</p>

      <div className="match-row">
        <div>
          <span className="match-number">{percentage}%</span>
          <span className="muted"> skill match</span>
        </div>

        <span className="muted">
          {matchedCount}/{requiredCount} matched
        </span>
      </div>

      <div className="progress">
        <span style={{ width: `${percentage}%` }} />
      </div>

      <div className="skill-section">
        <div className="section-label">
          <CheckCircle2 size={16} />
          Matched
        </div>

        <div className="skill-list">
          {matchedSkills.map(skill => (
            <SkillBadge key={skill.id} variant="success">
              {skill.name}
            </SkillBadge>
          ))}
        </div>
      </div>

      <div className="skill-section">
        <div className="section-label">
          <CircleAlert size={16} />
          Missing
        </div>

        <div className="skill-list">
          {missingSkills.length ? (
            missingSkills.map(skill => (
              <SkillBadge key={skill.id} variant="warning">
                {skill.name}
              </SkillBadge>
            ))
          ) : (
            <span className="muted">No missing skills</span>
          )}
        </div>
      </div>
    </article>
  );
}
