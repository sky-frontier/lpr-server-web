import { ProjectForm } from "../components/index.js";

export default function EditProject({ match }) {
  return <ProjectForm ID={match.params.id} />;
}
