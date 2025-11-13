import apiClient from "@/lib/api-client";

const RESOURCE = "orders";
// Enable mock by default in development unless explicitly disabled
const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === "true" ||
  (process.env.NODE_ENV !== "production" &&
    process.env.NEXT_PUBLIC_USE_MOCK !== "false");

// -------------------------------
// Mock helpers (dev only)
// -------------------------------
const STATUS_LIST = [
  { key: "ready", label: "Ready", tone: "new" },
  { key: "incoming", label: "Nhận hàng", tone: "processing" },
  { key: "ready-to-go", label: "Ready to go", tone: "processing" },
  { key: "delivering", label: "Đang phát hàng", tone: "delivering" },
  { key: "cancelled", label: "Hủy", tone: "default" },
  { key: "returning", label: "Đang chuyển hoàn", tone: "default" },
  { key: "issue", label: "Sự cố", tone: "default" },
  { key: "completed", label: "Hoàn tất", tone: "completed" },
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateMockOrders = (count = 25) => {
  const carriers = [
    { code: "SSE", name: "SSE Express" },
    { code: "GHN", name: "Giao Hàng Nhanh" },
    { code: "GHTK", name: "Giao Hàng Tiết Kiệm" },
  ];

  return Array.from({ length: count }).map((_, i) => {
    const status = randomItem(STATUS_LIST);
    const created = new Date(
      Date.now() -
        randomInt(0, 7) * 24 * 60 * 60 * 1000 -
        randomInt(0, 23) * 60 * 60 * 1000,
    );
    const expected = new Date(
      created.getTime() + randomInt(1, 5) * 24 * 60 * 60 * 1000,
    );
    const carrier = randomItem(carriers);
    const id = `MOCK-${i + 1}`;

    return {
      id,
      awb: `${carrier.code}${String(100000 + i)}`,
      refCode: `REF${String(10000 + i)}`,
      carrier,
      createdAt: created.toISOString(),
      expectedDeliveryAt: expected.toISOString(),
      statusTone: status.tone,
      statusLabel: status.label,
      statusKey: status.key,
      sender: {
        company: `Công ty A${(i % 5) + 1}`,
        contact: `Nguyễn Văn ${(i % 9) + 1}`,
      },
      receiver: {
        company: `Công ty B${(i % 7) + 1}`,
        contact: `Trần Thị ${(i % 11) + 1}`,
        address: `${randomInt(1, 200)} Nguyễn Huệ, Quận 1, TP.HCM`,
      },
    };
  });
};

const MOCK_ORDERS = generateMockOrders(40);

const applyFiltersAndPaging = (items, filters = {}) => {
  const {
    status,
    search,
    sortField = "createdAt",
    sortDirection = "desc",
    page = 1,
    pageSize = 25,
  } = filters;

  let data = [...items];

  if (status && status !== "all") {
    data = data.filter((o) => o.statusKey === status);
  }
  if (search) {
    const q = String(search).toLowerCase();

    data = data.filter(
      (o) =>
        o.awb.toLowerCase().includes(q) ||
        o.refCode.toLowerCase().includes(q) ||
        o.receiver.company.toLowerCase().includes(q) ||
        o.sender.company.toLowerCase().includes(q),
    );
  }
  data.sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const cmp = String(aVal).localeCompare(String(bVal));

    return sortDirection === "asc" ? cmp : -cmp;
  });
  const total = data.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return { data: data.slice(start, end), total };
};

export const getOrders = async (filters = {}) => {
  if (USE_MOCK) {
    return applyFiltersAndPaging(MOCK_ORDERS, filters);
  }
  const params = { ...filters };

  if (params.status === "all") delete params.status;
  if (params.search === "") delete params.search;
  if (params.pageSize == null) delete params.pageSize;
  if (params.page == null) delete params.page;

  return apiClient.get(`/${RESOURCE}`, { params });
};

export const getOrderById = async (id) => {
  return apiClient.get(`/${RESOURCE}/${id}`);
};

export const createOrder = async (payload) => {
  return apiClient.post(`/${RESOURCE}`, payload);
};

export const updateOrder = async ({ id, data }) => {
  return apiClient.put(`/${RESOURCE}/${id}`, data);
};

export const deleteOrder = async (id) => {
  await apiClient.delete(`/${RESOURCE}/${id}`);

  return id;
};

export const bulkUpdateOrderStatus = async ({ orderIds, status }) => {
  return apiClient.post(`/${RESOURCE}/bulk-update`, { orderIds, status });
};

export const getOrderStats = async () => {
  if (USE_MOCK) {
    const counts = {
      all: MOCK_ORDERS.length,
    };

    STATUS_LIST.forEach((s) => {
      counts[s.key] = MOCK_ORDERS.filter((o) => o.statusKey === s.key).length;
    });

    return counts;
  }

  return apiClient.get(`/${RESOURCE}/stats`);
};
