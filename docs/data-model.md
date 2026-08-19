# DevGraph Data Model

Nodes:
- Developer: id, name, email, experience
- Skill: id, name, category
- Project: id, name, description, difficulty
- Technology: id, name
- Company: id, name

Relationships:
- Developer -[:KNOWS]-> Skill
- Developer -[:WORKED_ON]-> Project
- Developer -[:WORKS_AT]-> Company
- Project -[:REQUIRES]-> Skill
- Project -[:BUILT_WITH]-> Technology
- Skill -[:RELATED_TO]-> Skill
- Technology -[:RELATED_TO]-> Technology

Recommendation traversal:
Developer → KNOWS → Skill ← REQUIRES ← Project

Learning traversal:
Developer → KNOWS → Skill → RELATED_TO → Candidate Skill
