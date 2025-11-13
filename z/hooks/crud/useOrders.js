import { createCrudHooks } from "@/hooks/utils";
import * as OrderAPI from "@/services/orders.service";

export const ordersCRUD = createCrudHooks({
  resource: "orders",
  fetchList: OrderAPI.getOrders,
  fetchById: OrderAPI.getOrderById,
  create: OrderAPI.createOrder,
  update: OrderAPI.updateOrder,
  deleteItem: OrderAPI.deleteOrder,
  fetchStats: OrderAPI.getOrderStats,
});
