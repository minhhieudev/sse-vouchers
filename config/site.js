export const siteConfig = {
  name: "SSE Voucher Control Center",
  shortName: "SSE - VOUCHER",
  description:
    "Nền tảng phát hành – theo dõi – báo cáo voucher trải nghiệm của Saigon Speed Express.",
  searchPlaceholder: "Nhập mã SSE-V-xxxx, khách hàng hoặc chiến dịch...",
  navigation: [
    { id: "overview", label: "Tổng quan", path: "/", badge: "Live" },
    { id: "campaigns", label: "Chiến dịch", path: "/campaigns" },
    { id: "vouchers", label: "Voucher", path: "/vouchers" },
    { id: "customers", label: "Khách hàng", path: "/customers" },
    { id: "logs", label: "Nhật ký sử dụng", path: "/logs" },
  ],
  quickActions: [
    { id: "generate", label: "Sinh voucher SSE-V", accent: "primary" },
    { id: "qr-batch", label: "In QR hàng loạt", accent: "secondary" },
    { id: "export", label: "Export Excel", accent: "neutral" },
  ],
  user: {
    name: "Ngô Nhật Quang",
    role: "Voucher Admin",
    avatarInitials: "NQ",
  },
};
