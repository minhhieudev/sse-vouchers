import { createCrudHooks } from "@/hooks/utils";
import * as UserAPI from "@/services/users.service";

export const usersCRUD = createCrudHooks({
  resource: "users",
  fetchList: UserAPI.getUsers,
  fetchById: UserAPI.getUserById,
  create: UserAPI.createUser,
  update: UserAPI.updateUser,
  deleteItem: UserAPI.deleteUser,
});
