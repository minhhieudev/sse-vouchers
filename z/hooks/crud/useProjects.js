import { createCrudHooks } from "@/hooks/utils";
import * as ProjectAPI from "@/services/projects.service";

export const projectsCRUD = createCrudHooks({
  resource: "projects",
  fetchList: ProjectAPI.getProjects,
  fetchById: ProjectAPI.getProjectById,
  create: ProjectAPI.createProject,
  update: ProjectAPI.updateProject,
  deleteItem: ProjectAPI.deleteProject,
});
