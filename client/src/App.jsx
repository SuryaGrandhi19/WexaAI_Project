import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  BrainCircuit,
  Database,
  GitBranch,
  Layers3,
  Sparkles
} from "lucide-react";
import api from "./services/api";
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";
import SkillBadge from "./components/SkillBadge";
import StatCard from "./components/StatCard";
import ProjectCard from "./components/ProjectCard";

export default function App() {
  const [developers, setDevelopers] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [developerData, setDeveloperData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [learningPath, setLearningPath] = useState([]);
  const [loadingDevelopers, setLoadingDevelopers] = useState(true);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    async function loadDevelopers() {
      try {
        setLoadingDevelopers(true);
        setError("");

        const response = await api.get("/developers");

        setDevelopers(response.data);

        if (response.data.length) {
          setSelectedId(response.data[0].id);
        }
      } catch (err) {
        setError("Could not connect to the DevGraph API.");
      } finally {
        setLoadingDevelopers(false);
      }
    }

    loadDevelopers();
  }, []);

  useEffect(() => {
    if (!selectedId) return;

    async function loadGraph() {
      try {
        setLoadingGraph(true);
        setError("");
        setSelectedProject(null);

        const [developer, recommendationsResponse, path] =
          await Promise.all([
            api.get(`/developers/${selectedId}`),
            api.get(`/developers/${selectedId}/recommendations`),
            api.get(`/developers/${selectedId}/learning-path`)
          ]);

        setDeveloperData(developer.data);
        setRecommendations(recommendationsResponse.data);
        setLearningPath(path.data);
      } catch (err) {
        setError(
          "Could not load graph data. Check the backend and CognoDB connection."
        );
        setDeveloperData(null);
        setRecommendations([]);
        setLearningPath([]);
      } finally {
        setLoadingGraph(false);
      }
    }

    loadGraph();
  }, [selectedId]);

  const topMatch = useMemo(() => {
    if (!recommendations.length) return 0;

    return Math.max(
      ...recommendations.map((item) =>
        item.requiredCount
          ? Math.round(
              (item.matchedCount / item.requiredCount) * 100
            )
          : 0
      )
    );
  }, [recommendations]);

  const handleDeveloperChange = (developerId) => {
    setSelectedId(developerId);
    setSelectedProject(null);
  };

  const handleProjectOpen = (project) => {
    setSelectedProject(project);

    setTimeout(() => {
      document
        .querySelector(".project-details")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    }, 50);
  };

  const handleProjectClose = () => {
    setSelectedProject(null);

    setTimeout(() => {
      document
        .querySelector(".section-header")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
    }, 50);
  };

  return (
    <div>
      <Navbar />

      <main className="page">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              <Sparkles size={15} />
              Graph-powered recommendations
            </span>

            <h1>
              Connect skills to <span>real projects.</span>
            </h1>

            <p>
              DevGraph traverses developer, skill, and project
              relationships in CognoDB Cloud to surface relevant
              projects and the skills worth learning next.
            </p>
          </div>

          <div className="graph-preview">
            <div className="node node-a">Developer</div>
            <div className="line line-a" />

            <div className="node node-b">Skill</div>
            <div className="line line-b" />

            <div className="node node-c">Project</div>
            <div className="node node-d">Skill</div>
          </div>
        </section>

        {error && (
          <div className="error-banner">
            <AlertCircle size={19} />
            <span>{error}</span>
          </div>
        )}

        <section className="workspace">
          <aside className="sidebar panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Developer graph</span>
                <h2>Select developer</h2>
              </div>

              <GitBranch size={21} />
            </div>

            {loadingDevelopers ? (
              <Loading label="Loading developers..." />
            ) : developers.length ? (
              <div className="developer-list">
                {developers.map((developer) => (
                  <button
                    className={`developer-item ${
                      selectedId === developer.id ? "active" : ""
                    }`}
                    key={developer.id}
                    type="button"
                    onClick={() =>
                      handleDeveloperChange(developer.id)
                    }
                  >
                    <span className="avatar">
                      {developer.name
                        .split(" ")
                        .map((x) => x[0])
                        .join("")
                        .slice(0, 2)}
                    </span>

                    <span>
                      <strong>{developer.name}</strong>
                      <small>{developer.experience}</small>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                No developers found in CognoDB.
              </div>
            )}
          </aside>

          <section className="content">
            {loadingGraph ? (
              <Loading />
            ) : developerData ? (
              <>
                <div className="profile panel">
                  <div>
                    <span className="eyebrow">
                      Developer profile
                    </span>

                    <h2>{developerData.developer.name}</h2>

                    <p>{developerData.developer.email}</p>
                  </div>

                  <div className="profile-chip">
                    <Database size={16} />
                    Online graph
                  </div>
                </div>

                <div className="stats-grid">
                  <StatCard
                    icon={<Layers3 size={20} />}
                    label="Known skills"
                    value={developerData.skills.length}
                  />

                  <StatCard
                    icon={<BrainCircuit size={20} />}
                    label="Project matches"
                    value={recommendations.length}
                  />

                  <StatCard
                    icon={<GitBranch size={20} />}
                    label="Top match"
                    value={`${topMatch}%`}
                  />
                </div>

                <div className="panel">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">
                        KNOWS relationships
                      </span>

                      <h2>Skill graph</h2>
                    </div>
                  </div>

                  <div className="skill-list large">
                    {developerData.skills.map((skill) => (
                      <SkillBadge key={skill.id}>
                        {skill.name}
                      </SkillBadge>
                    ))}
                  </div>
                </div>

                <div className="section-header">
                  <div>
                    <span className="eyebrow">
                      Multi-hop traversal
                    </span>

                    <h2>Recommended projects</h2>
                  </div>

                  <span className="muted">
                    Developer → Skill → Project
                  </span>
                </div>

                {recommendations.length ? (
                  <div className="project-grid">
                    {recommendations.map((item) => (
                      <ProjectCard
                        key={item.project.id}
                        item={item}
                        onOpen={handleProjectOpen}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="state-card">
                    No matching projects found.
                  </div>
                )}

                {selectedProject && (
                  <div className="project-details panel">
                    <button
                      type="button"
                      className="back-button"
                      onClick={handleProjectClose}
                    >
                      ← Back to recommended projects
                    </button>

                    <div className="project-details-header">
                      <div>
                        <span className="eyebrow">
                          {selectedProject.project.difficulty}
                        </span>

                        <h2>
                          {selectedProject.project.name}
                        </h2>

                        <p>
                          {selectedProject.project.description}
                        </p>
                      </div>

                      <div className="details-match">
                        {selectedProject.requiredCount
                          ? Math.round(
                              (selectedProject.matchedCount /
                                selectedProject.requiredCount) *
                                100
                            )
                          : 0}
                        %
                      </div>
                    </div>

                    <div className="details-grid">
                      <div>
                        <span className="eyebrow">
                          Matched skills
                        </span>

                        <div className="skill-list large">
                          {selectedProject.matchedSkills
                            ?.length ? (
                            selectedProject.matchedSkills.map(
                              (skill) => (
                                <SkillBadge
                                  key={skill.id}
                                  variant="success"
                                >
                                  {skill.name}
                                </SkillBadge>
                              )
                            )
                          ) : (
                            <span className="muted">
                              No matched skills
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <span className="eyebrow">
                          Missing skills
                        </span>

                        <div className="skill-list large">
                          {selectedProject.missingSkills
                            ?.length ? (
                            selectedProject.missingSkills.map(
                              (skill) => (
                                <SkillBadge
                                  key={skill.id}
                                  variant="warning"
                                >
                                  {skill.name}
                                </SkillBadge>
                              )
                            )
                          ) : (
                            <span className="muted">
                              No missing skills
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="panel learning">
                  <div className="panel-heading">
                    <div>
                      <span className="eyebrow">
                        RELATED_TO traversal
                      </span>

                      <h2>Suggested learning path</h2>
                    </div>

                    <BrainCircuit size={21} />
                  </div>

                  {learningPath.length ? (
                    <div className="learning-grid">
                      {learningPath.map((item) => (
                        <div
                          className="learning-item"
                          key={item.skill.id}
                        >
                          <div>
                            <strong>{item.skill.name}</strong>
                            <span>{item.skill.category}</span>
                          </div>

                          <span className="relevance">
                            {item.relevance} links
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">
                      No additional learning suggestions found.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="state-card">
                Select a developer to explore the graph.
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}