"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/* 🔑 QUERY KEY FACTORY                                                       */
/* -------------------------------------------------------------------------- */
/**
 * Tạo query keys chuẩn cho từng resource (để dùng trong cache, invalidate, prefetch)
 * → Giúp React Query phân biệt dữ liệu từng loại (users, projects, orders...)
 *
 * @param {string} resource - Tên của resource, ví dụ: "projects"
 * @returns {object} Các key helper như all, list, detail, stats
 */
export const createResourceKeys = (resource) => ({
  all: [resource],
  lists: () => [resource, "list"],
  list: (filters) => [resource, "list", filters],
  details: () => [resource, "detail"],
  detail: (id) => [resource, "detail", id],
  stats: () => [resource, "stats"],
});

/* -------------------------------------------------------------------------- */
/* 🧩 CRUD HOOK FACTORY                                                       */
/* -------------------------------------------------------------------------- */
/**
 * Tạo ra toàn bộ CRUD hooks cho 1 resource (Generic, có thể tái sử dụng sophia
 *
 * ✅ Dùng cho mọi entity có API CRUD như:
 *    - Projects, Users, Orders, Products...
 *
 * @example
 * const projectsCRUD = createCrudHooks({
 *   resource: 'projects',
 *   fetchList: api.getProjects,
 *   fetchById: api.getProjectById,
 *   create: api.createProject,
 *   update: api.updateProject,
 *   deleteItem: api.deleteProject,
 * });
 *
 * @param {Object} config
 * @param {string}   config.resource     - Tên resource (ví dụ: "users", "orders")
 * @param {Function} config.fetchList    - API lấy danh sách
 * @param {Function} config.fetchById    - API lấy 1 item chi tiết
 κό @param {Function} config.create       - API tạo mới
 * @param {Function} config.update       - API cập nhật
 * @param {Function} config.deleteItem   - API xóa
 * @param {Function} config.fetchStats   - API thống kê (nếu có)
 * @param {Object}   config.options      - Tuỳ chọn mặc định (cache, staleTime,...)
 *
 * @returns {Object} Tập hợp CRUD hooks (chỉ tạo những cái có hàm tương ứng)
 */
export const createCrudHooks = ({
  resource,
  fetchList,
  fetchById,
  create: createFn,
  update: updateFn,
  deleteItem,
  fetchStats,
  options = {},
}) => {
  const keys = createResourceKeys(resource);

  // ⚙️ Cấu hình mặc định cho useQuery
  const defaultQueryOptions = {
    staleTime: 5 * 60 * 1000, // dữ liệu được xem là "fresh" trong 5 phút
    gcTime: 10 * 60 * 1000, // cache bị xóa sau 10 phút không dùng
    placeholderData: (prev) => prev, // Giữ data cũ khi refetch để tránh nháy UI
    ...options,
  };

  const hooks = { keys }; // Object chứa các hook được tạo động

  /* -------------------------------------------------------------------------- */
  /* 🟢 READ: Lấy danh sách (List)                                             */
  /* -------------------------------------------------------------------------- */
  if (fetchList) {
    hooks.useList = (filters = {}, queryOptions = {}) =>
      useQuery({
        queryKey: keys.list(filters),
        queryFn: () => fetchList(filters),
        ...defaultQueryOptions,
        ...queryOptions,
      });
  }

  /* -------------------------------------------------------------------------- */
  /* 🟢 READ: Lấy 1 item chi tiết (Detail)                                     */
  /* -------------------------------------------------------------------------- */
  if (fetchById) {
    hooks.useItem = (id, queryOptions = {}) =>
      useQuery({
        queryKey: keys.detail(id),
        queryFn: () => fetchById(id),
        enabled: !!id && (queryOptions.enabled ?? true),
        staleTime: defaultQueryOptions.staleTime,
        gcTime: 15 * 60 * 1000, // giữ chi tiết lâu hơn 15 phút
        ...queryOptions,
      });
  }

  /* -------------------------------------------------------------------------- */
  /* 🟢 READ: Lấy thống kê nhanh (Stats)                                       */
  /* -------------------------------------------------------------------------- */
  if (fetchStats) {
    hooks.useStats = (queryOptions = {}) =>
      useQuery({
        queryKey: keys.stats(),
        queryFn: fetchStats,
        enabled: queryOptions.enabled ?? true,
        staleTime: 30 * 1000, // chỉ "fresh" 30 giây
        gcTime: 5 * 60 * 1000,
        ...queryOptions,
      });
  }

  /* -------------------------------------------------------------------------- */
  /* 🟠 CREATE: Thêm mới item                                                  */
  /* -------------------------------------------------------------------------- */
  if (createFn) {
    hooks.useCreate = (mutationOptions = {}) => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: createFn,
        onSuccess: (response, variables, context) => {
          // 🔁 Sau khi tạo thành công → refetch lại danh sách + stats
          queryClient.invalidateQueries({ queryKey: keys.lists() });
          if (fetchStats)
            queryClient.invalidateQueries({ queryKey: keys.stats() });

          // Call user's onSuccess if provided
          // response = { status, message, data, ... }
          // Component handle toast notification here
          mutationOptions.onSuccess?.(response, variables, context);
        },
        onError: (error, variables, context) => {
          // Call user's onError if provided
          // error.response.data = { status, message, detail, ... }
          // Component handle toast notification here
          mutationOptions.onError?.(error, variables, context);
        },
        ...mutationOptions,
      });
    };
  }

  /* -------------------------------------------------------------------------- */
  /* 🟠 UPDATE: Cập nhật item                                                  */
  /* -------------------------------------------------------------------------- */
  if (updateFn) {
    hooks.useUpdate = (mutationOptions = {}) => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: updateFn,
        // ✅ Optimistic Update – cập nhật trước khi API trả về
        onMutate: async ({ id, data }) => {
          await queryClient.cancelQueries({ queryKey: keys.detail(id) });
          const previousItem = queryClient.getQueryData(keys.detail(id));

          if (previousItem) {
            queryClient.setQueryData(keys.detail(id), {
              ...previousItem,
              ...data,
            });
          }

          return { previousItem, id };
        },
        // ❌ Rollback nếu thất bại
        onError: (err, vars, ctx) => {
          if (ctx?.previousItem)
            queryClient.setQueryData(keys.detail(ctx.id), ctx.previousItem);

          // Call user's onError if provided
          // err.response.data = { status, message, detail, ... }
          // Component handle toast notification here
          mutationOptions.onError?.(err, vars, ctx);
        },
        // ✅ Cập nhật cache và invalidate sau khi API thành công
        onSuccess: (response, vars, context) => {
          // response.data contains the updated item
          queryClient.setQueryData(keys.detail(vars.id), response.data || response);
          queryClient.invalidateQueries({ queryKey: keys.lists() });
          if (fetchStats)
            queryClient.invalidateQueries({ queryKey: keys.stats() });

          // Call user's onSuccess if provided
          // response = { status, message, data, ... }
          // Component handle toast notification here
          mutationOptions.onSuccess?.(response, vars, context);
        },
        ...mutationOptions,
      });
    };
  }

  /* -------------------------------------------------------------------------- */
  /* 🟠 DELETE: Xóa item                                                       */
  /* -------------------------------------------------------------------------- */
  if (deleteItem) {
    hooks.useDelete = (mutationOptions = {}) => {
      const queryClient = useQueryClient();

      return useMutation({
        mutationFn: deleteItem,
        // ✅ Optimistic delete – xóa tạm khỏi cache trước
        onMutate: async (id) => {
          await queryClient.cancelQueries({ queryKey: keys.detail(id) });
          const prevItem = queryClient.getQueryData(keys.detail(id));

          queryClient.removeQueries({ queryKey: keys.detail(id) });

          return { prevItem, id };
        },
        // ❌ Rollback nếu lỗi
        onError: (err, id, ctx) => {
          if (ctx?.prevItem)
            queryClient.setQueryData(keys.detail(ctx.id), ctx.prevItem);

          // Call user's onError if provided
          // err.response.data = { status, message, detail, ... }
          // Component handle toast notification here
          mutationOptions.onError?.(err, id, ctx);
        },
        // ✅ Sau khi xóa → invalidate list + stats
        onSuccess: (response, variables, context) => {
          queryClient.invalidateQueries({ queryKey: keys.lists() });
          if (fetchStats)
            queryClient.invalidateQueries({ queryKey: keys.stats() });

          // Call user's onSuccess if provided
          // response = { status, message, data, ... }
          // Component handle toast notification here
          mutationOptions.onSuccess?.(response, variables, context);
        },
        ...mutationOptions,
      });
    };
  }

  /* -------------------------------------------------------------------------- */
  /* ⚪ PREFETCH: Nạp trước chi tiết (khi hover, pre-load, v.v.)               */
  /* -------------------------------------------------------------------------- */
  if (fetchById) {
    hooks.usePrefetch = () => {
      const queryClient = useQueryClient();

      return (id) =>
        queryClient.prefetchQuery({
          queryKey: keys.detail(id),
          queryFn: () => fetchById(id),
          staleTime: defaultQueryOptions.staleTime,
        });
    };
  }

  /* -------------------------------------------------------------------------- */
  /* 🧩 RETURN: Trả ra toàn bộ hooks có sẵn                                   */
  /* -------------------------------------------------------------------------- */
  return hooks;
};

export default createCrudHooks;
