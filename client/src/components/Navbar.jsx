import React from "react";
import { Network } from "lucide-react";

export default function Navbar() {
  return <nav className="navbar"><div className="brand"><div className="brand-mark"><Network size={20} /></div><span>DevGraph</span></div><span className="nav-badge">CognoDB Cloud</span></nav>;
}