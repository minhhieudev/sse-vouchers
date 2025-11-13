export const voucherCampaignSummary = {
  totalCampaigns: 6,
  runningCampaigns: 3,
  scheduledCampaigns: 1,
  completedCampaigns: 2,
  totalIssued: 2480,
  totalUsed: 1785,
  activeRate: 0.72,
};

export const voucherCampaigns = [
  {
    id: "SSE-EXP-2025-A",
    name: "Trải nghiệm miễn phí 2kg",
    description: "Tặng gói voucher 2kg cho khách mới từ kênh Zalo OA",
    issued: 600,
    used: 412,
    active: 188,
    status: "running",
    startDate: "2025-02-10",
    endDate: "2025-06-30",
    channel: ["Zalo OA", "Mini App"],
    owner: "Nguyễn Văn An",
    tags: ["trial", "new-customer", "2kg"],
    trend: "+15%",
  },
  {
    id: "SSE-EXP-2025-B",
    name: "Thử nghiệm khách doanh nghiệp",
    description: "Voucher khuyến khích gửi hàng thường xuyên <2kg",
    issued: 420,
    used: 267,
    active: 153,
    status: "running",
    startDate: "2025-01-15",
    endDate: "2025-05-30",
    channel: ["CRM Import", "Website"],
    owner: "Trần Thị Bích",
    tags: ["enterprise", "loyalty", "bulk"],
    trend: "+8%",
  },
  {
    id: "SSE-EXP-2025-C",
    name: "Combo Tết 2025",
    description: "Voucher giảm 30% + miễn phí 2kg cho đơn quốc tế",
    issued: 520,
    used: 401,
    active: 119,
    status: "completed",
    startDate: "2024-12-15",
    endDate: "2025-02-10",
    channel: ["Zalo OA", "Mini App"],
    owner: "Lê Hoàng Cường",
    tags: ["tet", "international", "combo"],
    trend: "+25%",
  },
  {
    id: "SSE-EXP-2025-D",
    name: "Zalo Mini App beta",
    description: "Chỉ có thể kích hoạt qua Mini App, tập trung QR",
    issued: 300,
    used: 102,
    active: 198,
    status: "running",
    startDate: "2025-03-01",
    endDate: "2025-09-30",
    channel: ["Mini App"],
    owner: "Phạm Thị Dung",
    tags: ["beta", "mini-app", "qr"],
    trend: "+12%",
  },
  {
    id: "SSE-EXP-2025-E",
    name: "Flash sale 4.4",
    description: "100 voucher hằng ngày cho khách retail",
    issued: 200,
    used: 163,
    active: 37,
    status: "completed",
    startDate: "2025-04-01",
    endDate: "2025-04-07",
    channel: ["Website", "CRM Import"],
    owner: "Vũ Văn Em",
    tags: ["flash-sale", "retail", "daily"],
    trend: "+30%",
  },
  {
    id: "SSE-EXP-2025-F",
    name: "Experience Plus",
    description: "Lên lịch từng voucher tự động theo từng khu vực",
    issued: 440,
    used: 280,
    active: 160,
    status: "scheduled",
    startDate: "2025-07-01",
    endDate: "2025-08-31",
    channel: ["Zalo OA", "Mini App", "Website"],
    owner: "Bùi Thị Giang",
    tags: ["automation", "regional", "scheduled"],
    trend: "+5%",
  },
];

export const voucherList = [
  {
    code: "SSE-V-0001",
    campaignId: "SSE-EXP-2025-A",
    campaignName: "Trải nghiệm miễn phí 2kg",
    customer: "Nguyễn Văn An",
    phone: "090****123",
    status: "active",
    remainingWeightKg: 1.5,
    totalWeightKg: 2,
    remainingUses: 2,
    totalUses: 3,
    expiryDate: "2025-12-31",
    channel: "Zalo OA",
    value: 2000000,
    lastUsedAt: null,
  },
  {
    code: "SSE-V-0002",
    campaignId: "SSE-EXP-2025-A",
    campaignName: "Trải nghiệm miễn phí 2kg",
    customer: "Trần Thị Bích",
    phone: "091****456",
    status: "used",
    remainingWeightKg: 0,
    totalWeightKg: 2,
    remainingUses: 0,
    totalUses: 3,
    expiryDate: "2025-12-31",
    channel: "Mini App",
    value: 2000000,
    lastUsedAt: "2025-05-10T10:00:00Z",
  },
  {
    code: "SSE-V-0003",
    campaignId: "SSE-EXP-2025-B",
    campaignName: "Thử nghiệm khách doanh nghiệp",
    customer: "Lê Hoàng Cường",
    phone: "098****789",
    status: "active",
    remainingWeightKg: 1.8,
    totalWeightKg: 2,
    remainingUses: 3,
    totalUses: 3,
    expiryDate: "2025-11-30",
    channel: "CRM Import",
    value: 1500000,
    lastUsedAt: null,
  },
  {
    code: "SSE-V-0004",
    campaignId: "SSE-EXP-2025-D",
    campaignName: "Zalo Mini App beta",
    customer: "Phạm Thị Dung",
    phone: "093****101",
    status: "active",
    remainingWeightKg: 2,
    totalWeightKg: 2,
    remainingUses: 3,
    totalUses: 3,
    expiryDate: "2025-09-30",
    channel: "Mini App",
    value: 1000000,
    lastUsedAt: null,
  },
  {
    code: "SSE-V-0005",
    campaignId: "SSE-EXP-2025-C",
    campaignName: "Combo Tết 2025",
    customer: "Vũ Văn Em",
    phone: "097****212",
    status: "expired",
    remainingWeightKg: 0,
    totalWeightKg: 2,
    remainingUses: 0,
    totalUses: 3,
    expiryDate: "2025-02-10",
    channel: "Zalo OA",
    value: 3000000,
    lastUsedAt: "2025-02-05T14:00:00Z",
  },
  {
    code: "SSE-V-0006",
    campaignId: "SSE-EXP-2025-F",
    campaignName: "Experience Plus",
    customer: "Bùi Thị Giang",
    phone: "086****313",
    status: "scheduled",
    remainingWeightKg: 2,
    totalWeightKg: 2,
    remainingUses: 3,
    totalUses: 3,
    expiryDate: "2025-08-31",
    channel: "Website",
    value: 2500000,
    lastUsedAt: null,
  },
  // Add more for chart distribution
  {
    code: "SSE-V-0007",
    campaignId: "SSE-EXP-2025-A",
    campaignName: "Trải nghiệm miễn phí 2kg",
    customer: "Đặng Văn Hùng",
    phone: "094****414",
    status: "active",
    remainingWeightKg: 1.2,
    totalWeightKg: 2,
    remainingUses: 2,
    totalUses: 3,
    expiryDate: "2025-12-31",
    channel: "Zalo OA",
    value: 2000000,
    lastUsedAt: null,
  },
  {
    code: "SSE-V-0008",
    campaignId: "SSE-EXP-2025-B",
    campaignName: "Thử nghiệm khách doanh nghiệp",
    customer: "Hoàng Thị Kim",
    phone: "091****515",
    status: "active",
    remainingWeightKg: 2,
    totalWeightKg: 2,
    remainingUses: 3,
    totalUses: 3,
    expiryDate: "2025-11-30",
    channel: "Mini App",
    value: 1500000,
    lastUsedAt: null,
  },
  {
    code: "SSE-V-0009",
    campaignId: "SSE-EXP-2025-C",
    campaignName: "Combo Tết 2025",
    customer: "Ngô Văn Long",
    phone: "098****616",
    status: "used",
    remainingWeightKg: 0.5,
    totalWeightKg: 2,
    remainingUses: 1,
    totalUses: 3,
    expiryDate: "2025-02-10",
    channel: "CRM Import",
    value: 3000000,
    lastUsedAt: "2025-01-15T09:30:00Z",
  },
  {
    code: "SSE-V-0010",
    campaignId: "SSE-EXP-2025-D",
    campaignName: "Zalo Mini App beta",
    customer: "Trần Văn Minh",
    phone: "096****717",
    status: "expired",
    remainingWeightKg: 0,
    totalWeightKg: 2,
    remainingUses: 0,
    totalUses: 3,
    expiryDate: "2025-03-15",
    channel: "Website",
    value: 1000000,
    lastUsedAt: "2025-03-10T16:00:00Z",
  },
];

export const voucherUsageLogs = [
  { id: 1, usedAt: "2025-05-10T10:00:00Z", voucherCode: "SSE-V-0002", customerName: "Nguyễn Văn An", phone: "090****123", weightKg: 1.8, orderCode: "SGN-HN-12345", channel: "Zalo OA", status: "success" },
  { id: 2, usedAt: "2025-05-10T11:30:00Z", voucherCode: "SSE-V-0009", customerName: "Trần Thị Bích", phone: "091****456", weightKg: 2.0, orderCode: "SGN-DN-67890", channel: "Mini App", status: "success" },
  { id: 3, usedAt: "2025-05-09T14:00:00Z", voucherCode: "SSE-V-0005", customerName: "Lê Hoàng Cường", phone: "098****789", weightKg: null, orderCode: "SGN-HP-11223", channel: "CRM Import", status: "expired" },
  { id: 4, usedAt: "2025-05-11T09:00:00Z", voucherCode: "SSE-V-0001", customerName: "Phạm Thị Dung", phone: "093****101", weightKg: 1.5, orderCode: "HN-HCM-55667", channel: "Zalo OA", status: "success" },
  { id: 5, usedAt: "2025-05-11T10:15:00Z", voucherCode: "SSE-V-0003", customerName: "Vũ Văn Em", phone: "097****212", weightKg: 2.0, orderCode: "DN-CT-88990", channel: "Mini App", status: "processing" },
  { id: 6, usedAt: "2025-05-08T16:45:00Z", voucherCode: "SSE-V-0010", customerName: "Bùi Thị Giang", phone: "086****313", weightKg: null, orderCode: "HP-SGN-33445", channel: "Website", status: "failed" },
  { id: 7, usedAt: "2025-05-12T08:20:00Z", voucherCode: "SSE-V-0004", customerName: "Đặng Văn Hùng", phone: "094****414", weightKg: 0.8, orderCode: "CT-HN-77889", channel: "Zalo OA", status: "success" },
  { id: 8, usedAt: "2025-05-12T13:00:00Z", voucherCode: "SSE-V-0007", customerName: "Hoàng Thị Kim", phone: "091****515", weightKg: 1.9, orderCode: "SGN-DN-12121", channel: "CRM Import", status: "success" },
  { id: 9, usedAt: "2025-04-30T18:00:00Z", voucherCode: "SSE-V-0008", customerName: "Ngô Văn Long", phone: "098****616", weightKg: 2.0, orderCode: "DN-SGN-34343", channel: "Mini App", status: "success" },
  { id: 10, usedAt: "2025-05-13T11:00:00Z", voucherCode: "SSE-V-0002", customerName: "Trần Thị Bích", phone: "091****456", weightKg: 1.2, orderCode: "SGN-HN-98765", channel: "Zalo OA", status: "success" },
  { id: 11, usedAt: "2025-05-13T15:20:00Z", voucherCode: "SSE-V-0001", customerName: "Phạm Thị Dung", phone: "093****101", weightKg: 2.0, orderCode: "HN-HCM-13579", channel: "Website", status: "processing" },
  { id: 12, usedAt: "2025-05-14T09:45:00Z", voucherCode: "SSE-V-0009", customerName: "Nguyễn Văn An", phone: "090****123", weightKg: 1.0, orderCode: "SGN-DN-24680", channel: "Mini App", status: "success" },
  { id: 13, usedAt: "2025-05-01T12:00:00Z", voucherCode: "SSE-V-0005", customerName: "Lê Hoàng Cường", phone: "098****789", weightKg: null, orderCode: "SGN-HP-11224", channel: "CRM Import", status: "expired" },
  { id: 14, usedAt: "2025-05-15T10:00:00Z", voucherCode: "SSE-V-0003", customerName: "Vũ Văn Em", phone: "097****212", weightKg: 1.7, orderCode: "DN-CT-88991", channel: "Zalo OA", status: "success" },
  { id: 15, usedAt: "2025-05-15T14:30:00Z", voucherCode: "SSE-V-0007", customerName: "Hoàng Thị Kim", phone: "091****515", weightKg: 2.0, orderCode: "SGN-DN-12122", channel: "Website", status: "failed" },
];


const generateDailyStats = (days, revenueMultiplier, usesMultiplier) => {
    const stats = [];
    const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    for (let i = 0; i < days; i++) {
        stats.push({
            date: days <= 7 ? labels[i % 7] : `Ngày ${i + 1}`,
            uses: Math.floor(Math.random() * 50 + 20) * usesMultiplier,
            revenue: (Math.random() * 10 + 5) * revenueMultiplier,
            weightKg: Math.floor(Math.random() * 40 + 30) * usesMultiplier,
        });
    }
    return stats;
}

const baseMetrics = [
  { id: "issued", label: "Voucher đã phát", caption: "bao gồm trial & beta" },
  { id: "used", label: "Đã sử dụng", caption: "đã trừ khối lượng" },
  { id: "weight", label: "Khối lượng miễn phí", caption: "đã được sử dụng" },
  { id: "revenue", label: "Doanh thu", caption: "từ voucher bán & upsell" },
];

const generateDashboardData = (period, revenueMultiplier, usesMultiplier, deltaSuffix) => {
    const dailyStats = generateDailyStats(period, revenueMultiplier, usesMultiplier);
    const totalUses = dailyStats.reduce((sum, s) => sum + s.uses, 0);
    const totalRevenue = dailyStats.reduce((sum, s) => sum + s.revenue, 0);
    const totalWeight = dailyStats.reduce((sum, s) => sum + s.weightKg, 0);

    const metrics = JSON.parse(JSON.stringify(baseMetrics));
    metrics[0].value = (totalUses * 1.4).toLocaleString('vi-VN', {maximumFractionDigits: 0});
    metrics[0].delta = `+${(18 * usesMultiplier).toFixed(0)}% ${deltaSuffix}`;
    metrics[1].value = totalUses.toLocaleString('vi-VN', {maximumFractionDigits: 0});
    metrics[1].delta = `+${(12 * usesMultiplier).toFixed(0)}% ${deltaSuffix}`;
    metrics[2].value = `${(totalWeight / 1000).toFixed(1)} tấn`;
    metrics[2].delta = `+${(420 * usesMultiplier).toFixed(0)}kg ${deltaSuffix}`;
    metrics[3].value = `${(totalRevenue / 1000000).toFixed(1)} Tỷ`;
    if (totalRevenue > 1000000) {
        metrics[3].value = `${(totalRevenue / 1000000).toFixed(1)} Tr`;
    } else {
        metrics[3].value = `${(totalRevenue / 1000).toFixed(0)} Tr`;
    }
    metrics[3].delta = `+${(21 * revenueMultiplier).toFixed(0)}% ${deltaSuffix}`;

    return {
        metrics,
        dailyStats,
        topCustomers: voucherTopCustomers.map(c => ({
            ...c,
            revenue: c.revenue * revenueMultiplier,
            totalOrders: Math.floor(c.totalOrders * usesMultiplier),
            freeWeightUsed: c.freeWeightUsed * usesMultiplier,
        })),
    };
};


export const voucherTopCustomers = [
  { id: "CUST-01", name: "Shop An Nhi", zaloId: "zalo_18203", totalOrders: 24, freeWeightUsed: 36, revenue: 12500000, type: "Loyal" },
  { id: "CUST-02", name: "Gia Nguyen Pharmacy", zaloId: "zalo_18888", totalOrders: 18, freeWeightUsed: 22, revenue: 9800000, type: "Loyal" },
  { id: "CUST-03", name: "Minh Chau Boutique", zaloId: "zalo_19932", totalOrders: 11, freeWeightUsed: 14, revenue: 7200000, type: "New" },
  { id: "CUST-04", name: "Phuc Loc Logistics", zaloId: "zalo_14521", totalOrders: 9, freeWeightUsed: 10, revenue: 5400000 },
  { id: "CUST-05", name: "The Gioi Skinfood", zaloId: "zalo_20101", totalOrders: 8, freeWeightUsed: 9, revenue: 4800000, type: "New" },
];


export const voucherChannelPerformance = [
  { id: "zalo", label: "Zalo OA", issued: 1280, used: 860, conversion: 0.67 },
  { id: "mini-app", label: "Mini App", issued: 540, used: 346, conversion: 0.64 },
  { id: "crm", label: "CRM Import", issued: 420, used: 244, conversion: 0.58 },
];

export const dashboardDataByPeriod = {
    "7d": generateDashboardData(7, 1, 1, "so với tuần trước"),
    "30d": generateDashboardData(30, 4.5, 4.2, "so với tháng trước"),
    "90d": generateDashboardData(90, 12, 11, "so với quý trước"),
}

export const voucherApiSpec = [
  {
    group: "Voucher Operations",
    description: "Quản lý lifecycle của voucher từ tạo đến sử dụng",
    endpoints: [
      {
        method: "GET",
        path: "/api/vouchers",
        title: "Lấy danh sách voucher",
        detail: "Lấy danh sách voucher với filter theo campaign, status, date range"
      },
      {
        method: "POST",
        path: "/api/vouchers",
        title: "Tạo voucher mới",
        detail: "Tạo voucher đơn lẻ hoặc batch với campaign assignment"
      },
      {
        method: "GET",
        path: "/api/vouchers/{code}",
        title: "Chi tiết voucher",
        detail: "Lấy thông tin chi tiết voucher theo code"
      },
      {
        method: "PUT",
        path: "/api/vouchers/{code}",
        title: "Cập nhật voucher",
        detail: "Cập nhật status, expiry date, hoặc metadata"
      },
      {
        method: "POST",
        path: "/api/vouchers/{code}/use",
        title: "Sử dụng voucher",
        detail: "Validate và apply voucher cho đơn hàng"
      }
    ]
  },
  {
    group: "Analytics & Reporting",
    description: "Báo cáo hiệu suất và analytics cho Marketing/Finance",
    endpoints: [
      {
        method: "GET",
        path: "/api/analytics/overview",
        title: "Dashboard overview",
        detail: "Thống kê tổng quan: issued, used, active, revenue"
      },
      {
        method: "GET",
        path: "/api/analytics/campaigns",
        title: "Campaign performance",
        detail: "Hiệu suất từng campaign theo thời gian"
      },
      {
        method: "GET",
        path: "/api/analytics/channels",
        title: "Channel analytics",
        detail: "Conversion rate theo kênh phân phối"
      },
      {
        method: "GET",
        path: "/api/analytics/customers",
        title: "Top customers",
        detail: "Khách hàng sử dụng nhiều nhất theo revenue"
      }
    ]
  },
  {
    group: "System Management",
    description: "Quản lý hệ thống và automation",
    endpoints: [
      {
        method: "GET",
        path: "/api/campaigns",
        title: "Danh sách campaigns",
        detail: "Lấy tất cả campaigns với status và metrics"
      },
      {
        method: "POST",
        path: "/api/campaigns",
        title: "Tạo campaign mới",
        detail: "Tạo campaign với rules và automation triggers"
      },
      {
        method: "PUT",
        path: "/api/campaigns/{id}",
        title: "Cập nhật campaign",
        detail: "Update campaign settings và automation rules"
      },
      {
        method: "POST",
        path: "/api/system/refill",
        title: "Refill quota",
        detail: "Trigger refill quota tự động theo rules"
      }
    ]
  }
];

export const voucherDailyStats = [
  { date: "2025-01-01", revenue: 12500000, orders: 45, vouchersUsed: 12 },
  { date: "2025-01-02", revenue: 15800000, orders: 52, vouchersUsed: 18 },
  { date: "2025-01-03", revenue: 14200000, orders: 48, vouchersUsed: 15 },
  { date: "2025-01-04", revenue: 18900000, orders: 61, vouchersUsed: 22 },
  { date: "2025-01-05", revenue: 22100000, orders: 68, vouchersUsed: 28 },
  { date: "2025-01-06", revenue: 19800000, orders: 59, vouchersUsed: 25 },
  { date: "2025-01-07", revenue: 25600000, orders: 74, vouchersUsed: 32 },
  { date: "2025-01-08", revenue: 23400000, orders: 71, vouchersUsed: 29 },
  { date: "2025-01-09", revenue: 21200000, orders: 65, vouchersUsed: 26 },
  { date: "2025-01-10", revenue: 27800000, orders: 82, vouchersUsed: 35 },
  { date: "2025-01-11", revenue: 24500000, orders: 73, vouchersUsed: 31 },
  { date: "2025-01-12", revenue: 26700000, orders: 78, vouchersUsed: 33 },
  { date: "2025-01-13", revenue: 28900000, orders: 85, vouchersUsed: 38 },
  { date: "2025-01-14", revenue: 31200000, orders: 91, vouchersUsed: 42 },
];

export const voucherDashboardMetrics = [
  {
    id: "issued",
    label: "Voucher đã phát",
    value: "3.472",
    delta: "+18% so với tuần trước",
    caption: "bao gồm trial & beta"
  },
  {
    id: "used",
    label: "Đã sử dụng",
    value: "2.485",
    delta: "+12% so với tuần trước",
    caption: "đã trừ khối lượng"
  },
  {
    id: "weight",
    label: "Khối lượng miễn phí",
    value: "4.2 tấn",
    delta: "+420kg so với tuần trước",
    caption: "đã được sử dụng"
  },
  {
    id: "revenue",
    label: "Doanh thu",
    value: "2.1 Tr",
    delta: "+21% so với tuần trước",
    caption: "từ voucher bán & upsell"
  }
];

export const customers = [
  {
    id: "CUST-001",
    name: "Nguyễn Văn An",
    phone: "0901234567",
    email: "an.nguyen@email.com",
    registrationDate: "2024-01-15",
    firstPurchaseDate: "2024-02-01",
    totalVouchers: 3,
    usedVouchers: 1,
    remainingUses: 5,
    totalUses: 9,
    status: "active",
    tags: ["VIP", "loyal"],
    revenue: 4500000,
    notes: "Khách hàng thân thiết, thường xuyên sử dụng dịch vụ.",
    vouchers: [
      {
        code: "SSE-V-0001",
        campaignName: "Trải nghiệm miễn phí 2kg",
        status: "active",
        remainingWeightKg: 1.5,
        totalWeightKg: 2,
        remainingUses: 2,
        totalUses: 3,
        expiryDate: "2025-12-31",
        usageHistory: [
          { date: "2024-03-10", weightUsed: 0.5, orderCode: "ORD-001" }
        ]
      },
      {
        code: "SSE-V-0002",
        campaignName: "Trải nghiệm miễn phí 2kg",
        status: "used",
        remainingWeightKg: 0,
        totalWeightKg: 2,
        remainingUses: 0,
        totalUses: 3,
        expiryDate: "2025-12-31",
        usageHistory: [
          { date: "2024-04-15", weightUsed: 1.8, orderCode: "ORD-002" },
          { date: "2024-05-20", weightUsed: 0.2, orderCode: "ORD-003" }
        ]
      }
    ]
  },
  {
    id: "CUST-002",
    name: "Trần Thị Bích",
    phone: "0912345678",
    email: "bich.tran@email.com",
    registrationDate: "2024-03-20",
    firstPurchaseDate: "2024-04-01",
    totalVouchers: 2,
    usedVouchers: 2,
    remainingUses: 0,
    totalUses: 6,
    status: "active",
    tags: ["potential"],
    revenue: 3200000,
    notes: "Khách hàng tiềm năng, đang thử nghiệm dịch vụ.",
    vouchers: [
      {
        code: "SSE-V-0003",
        campaignName: "Thử nghiệm khách doanh nghiệp",
        status: "active",
        remainingWeightKg: 1.8,
        totalWeightKg: 2,
        remainingUses: 3,
        totalUses: 3,
        expiryDate: "2025-11-30",
        usageHistory: []
      }
    ]
  },
  {
    id: "CUST-003",
    name: "Lê Hoàng Cường",
    phone: "0987654321",
    email: "cuong.le@email.com",
    registrationDate: "2024-02-10",
    firstPurchaseDate: "2024-02-15",
    totalVouchers: 1,
    usedVouchers: 0,
    remainingUses: 3,
    totalUses: 3,
    status: "inactive",
    tags: ["new-trial"],
    revenue: 1500000,
    notes: "Khách hàng mới, cần chăm sóc thêm.",
    vouchers: [
      {
        code: "SSE-V-0004",
        campaignName: "Zalo Mini App beta",
        status: "active",
        remainingWeightKg: 2,
        totalWeightKg: 2,
        remainingUses: 3,
        totalUses: 3,
        expiryDate: "2025-09-30",
        usageHistory: []
      }
    ]
  },
  {
    id: "CUST-004",
    name: "Phạm Thị Dung",
    phone: "0934567890",
    email: "dung.pham@email.com",
    registrationDate: "2023-12-01",
    firstPurchaseDate: "2023-12-05",
    totalVouchers: 4,
    usedVouchers: 3,
    remainingUses: 2,
    totalUses: 12,
    status: "active",
    tags: ["VIP", "enterprise"],
    revenue: 6800000,
    notes: "Khách hàng doanh nghiệp lớn, hợp đồng dài hạn.",
    vouchers: [
      {
        code: "SSE-V-0005",
        campaignName: "Combo Tết 2025",
        status: "expired",
        remainingWeightKg: 0,
        totalWeightKg: 2,
        remainingUses: 0,
        totalUses: 3,
        expiryDate: "2025-02-10",
        usageHistory: [
          { date: "2024-01-20", weightUsed: 2.0, orderCode: "ORD-004" }
        ]
      }
    ]
  },
  {
    id: "CUST-005",
    name: "Vũ Văn Em",
    phone: "0971234567",
    email: "em.vu@email.com",
    registrationDate: "2024-05-01",
    firstPurchaseDate: "2024-05-10",
    totalVouchers: 1,
    usedVouchers: 0,
    remainingUses: 3,
    totalUses: 3,
    status: "active",
    tags: ["new-trial"],
    revenue: 800000,
    notes: "Khách hàng mới từ chiến dịch marketing.",
    vouchers: [
      {
        code: "SSE-V-0006",
        campaignName: "Experience Plus",
        status: "scheduled",
        remainingWeightKg: 2,
        totalWeightKg: 2,
        remainingUses: 3,
        totalUses: 3,
        expiryDate: "2025-08-31",
        usageHistory: []
      }
    ]
  }
];
