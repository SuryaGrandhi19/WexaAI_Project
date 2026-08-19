import React from "react";
export default function Loading({ label = "Loading graph data..." }) {
  return <div className="state-card"><div className="spinner" /><span>{label}</span></div>;
}