import React from "react";
export default function SkillBadge({ children, variant = "default" }) {
  return <span className={`skill-badge ${variant}`}>{children}</span>;
}