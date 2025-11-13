// SSE Authentication & Role Management System

// User Roles Definition
export const USER_ROLES = {
  OWNER: "owner", // Hiển Nhân - Chủ sở hữu
  ADMIN: "admin", // Mỹ Vân - Quản trị viên
  SALES: "sales", // NV Kinh doanh
  PICKUP: "pickup", // NV Nhận hàng
  PROCESSING: "processing", // NV Khai thác
  DOCUMENTATION: "documentation", // NV Chứng từ
  IT_ADMIN: "it_admin", // IT Quản trị
};

// Role Permissions - What each role can see/do
export const ROLE_PERMISSIONS = {
  [USER_ROLES.OWNER]: {
    canViewAll: true,
    canEditAll: true,
    canDelete: true,
    canApprove: true,
    canManageUsers: true,
    canViewCosts: true,
    canViewCustomerDetails: true,
    canViewCarrierInfo: true,
  },
  [USER_ROLES.ADMIN]: {
    canViewAll: true,
    canEditAll: true,
    canDelete: false,
    canApprove: false,
    canManageUsers: false,
    canViewCosts: true,
    canViewCustomerDetails: true,
    canViewCarrierInfo: true,
  },
  [USER_ROLES.SALES]: {
    canViewAll: false,
    canEditAll: false,
    canDelete: false,
    canApprove: false,
    canManageUsers: false,
    canViewCosts: false, // Không xem giá vốn
    canViewCustomerDetails: true, // Chỉ khách của mình
    canViewCarrierInfo: false, // Không biết đối tác vận chuyển
    allowedActions: ["create_order", "update_pricing", "view_own_customers"],
  },
  [USER_ROLES.PICKUP]: {
    canViewAll: false,
    canEditAll: false,
    canDelete: false,
    canApprove: false,
    canManageUsers: false,
    canViewCosts: false,
    canViewCustomerDetails: false, // Chỉ tên & địa chỉ
    canViewCarrierInfo: false,
    allowedActions: ["pickup_order", "update_pickup_status"],
  },
  [USER_ROLES.PROCESSING]: {
    canViewAll: false,
    canEditAll: false,
    canDelete: false,
    canApprove: false,
    canManageUsers: false,
    canViewCosts: false,
    canViewCustomerDetails: false, // Chỉ tên khách
    canViewCarrierInfo: false,
    allowedActions: ["process_order", "update_dimensions", "update_weight"],
  },
  [USER_ROLES.DOCUMENTATION]: {
    canViewAll: false,
    canEditAll: false,
    canDelete: false,
    canApprove: false,
    canManageUsers: false,
    canViewCosts: false, // Không xem giá bán
    canViewCustomerDetails: true, // Xem thông tin gửi - nhận
    canViewCarrierInfo: true,
    allowedActions: ["create_documents", "link_carrier_bills", "send_tracking"],
  },
  [USER_ROLES.IT_ADMIN]: {
    canViewAll: false,
    canEditAll: false,
    canDelete: false,
    canApprove: false,
    canManageUsers: false,
    canViewCosts: false,
    canViewCustomerDetails: false,
    canViewCarrierInfo: false,
    allowedActions: ["maintain_system", "view_logs"],
  },
};

// Workflow Steps Definition
export const WORKFLOW_STEPS = {
  SALES_RECEIVE: "sales_receive", // Bước 1: NVKD tiếp nhận
  PICKUP_COLLECT: "pickup_collect", // Bước 2: NV Pickup nhận hàng
  PROCESSING_PACKAGE: "processing_package", // Bước 3: NV Khai thác đóng gói
  SALES_PRICING: "sales_pricing", // Bước 4: NVKD nhập giá bán
  CUSTOMER_PAYMENT: "customer_payment", // Bước 5: Khách thanh toán
  DOCUMENTATION_PROCESS: "documentation_process", // Bước 6: NV Chứng từ xử lý
  COMPLETED: "completed", // Hoàn tất
};

// Commission Rules
export const COMMISSION_RULES = {
  [USER_ROLES.PICKUP]: {
    baseAmount: 5000, // 5,000đ per order
    description: "5.000đ / đơn hàng hoàn thành",
  },
  [USER_ROLES.PROCESSING]: {
    weightBased: true,
    under20kg: 10000, // 10,000đ for <20kg
    over20kg: 15000, // 15,000đ for ≥21kg
    description: "10.000đ / <20kg, 15.000đ / ≥21kg",
  },
  [USER_ROLES.SALES]: {
    revenueBased: true,
    description: "Doanh số khi khách thanh toán",
  },
  [USER_ROLES.DOCUMENTATION]: {
    baseAmount: 5000, // 5,000đ per international document
    internationalOnly: true,
    description: "5.000đ / bộ chứng từ quốc tế",
  },
  [USER_ROLES.IT_ADMIN]: {
    internationalBill: 3000, // 3,000đ per international bill
    domesticBill: 1500, // 1,500đ per domestic bill
    description: "3.000đ / bill QT, 1.500đ / bill ND",
  },
};

// Mock Current User (for demo)
export const MOCK_CURRENT_USER = {
  id: "USER001",
  name: "Hiển Nhân",
  role: USER_ROLES.OWNER,
  email: "owner@sse.vn",
  permissions: ROLE_PERMISSIONS[USER_ROLES.OWNER],
};

// Authentication Functions
export const getCurrentUser = () => {
  // In real app, this would check localStorage/session/token
  return MOCK_CURRENT_USER;
};

export const isAuthenticated = () => {
  // In demo, always return true
  return true;
};

export const hasPermission = (permission) => {
  const user = getCurrentUser();

  return user.permissions[permission] || false;
};

export const canPerformAction = (action) => {
  const user = getCurrentUser();

  return user.permissions.allowedActions?.includes(action) || false;
};

export const filterDataByRole = (data, dataType = "order") => {
  const user = getCurrentUser();

  // If user can view all, return all data
  if (user.permissions.canViewAll) {
    return data;
  }

  // Apply role-based filtering
  switch (user.role) {
    case USER_ROLES.SALES:
      // Sales can only see their own customers/orders
      return data.filter((item) => item.assignedSalesId === user.id);

    case USER_ROLES.PICKUP:
      // Pickup can only see customer name/address, not costs
      return data.map((item) => ({
        ...item,
        // Hide sensitive cost information
        costs: undefined,
        pricing: undefined,
        carrier: undefined,
        // Only show basic customer info
        customerDetails: {
          name: item.customerName,
          address: item.receiverAddress,
        },
      }));

    case USER_ROLES.PROCESSING:
      // Processing can only see customer name, not details or costs
      return data.map((item) => ({
        ...item,
        costs: undefined,
        pricing: undefined,
        carrier: undefined,
        customerDetails: undefined,
        customerName: item.customerName, // Only name
      }));

    case USER_ROLES.DOCUMENTATION:
      // Documentation can see sender/receiver info but not sale prices
      return data.map((item) => ({
        ...item,
        pricing: undefined, // Hide sale prices
      }));

    default:
      return data;
  }
};

// Commission Calculation
export const calculateCommission = (userRole, orderData) => {
  const rules = COMMISSION_RULES[userRole];

  if (!rules) return 0;

  switch (userRole) {
    case USER_ROLES.PICKUP:
      return rules.baseAmount;

    case USER_ROLES.PROCESSING:
      if (rules.weightBased && orderData.weight) {
        return orderData.weight < 20 ? rules.under20kg : rules.over20kg;
      }

      return rules.under20kg; // Default

    case USER_ROLES.SALES:
      return orderData.totalRevenue || 0; // Revenue-based

    case USER_ROLES.DOCUMENTATION:
      return rules.internationalOnly && orderData.isInternational
        ? rules.baseAmount
        : 0;

    case USER_ROLES.IT_ADMIN:
      return orderData.isInternational
        ? rules.internationalBill
        : rules.domesticBill;

    default:
      return 0;
  }
};

// Get role information for display
export const getRoleInfo = (role) => {
  const roleInfo = {
    [USER_ROLES.OWNER]: {
      label: "Chủ sở hữu",
      description: "Quyền truy cập đầy đủ hệ thống",
    },
    [USER_ROLES.ADMIN]: {
      label: "Quản trị viên",
      description: "Quản lý hệ thống và người dùng",
    },
    [USER_ROLES.SALES]: {
      label: "NV Kinh doanh",
      description: "Quản lý khách hàng và đơn hàng",
    },
    [USER_ROLES.PICKUP]: {
      label: "NV Nhận hàng",
      description: "Thu thập hàng từ khách hàng",
    },
    [USER_ROLES.PROCESSING]: {
      label: "NV Khai thác",
      description: "Đóng gói và xử lý hàng hóa",
    },
    [USER_ROLES.DOCUMENTATION]: {
      label: "NV Chứng từ",
      description: "Xử lý chứng từ và vận chuyển",
    },
    [USER_ROLES.IT_ADMIN]: {
      label: "IT Quản trị",
      description: "Bảo trì hệ thống kỹ thuật",
    },
  };

  return roleInfo[role] || { label: role, description: "" };
};

// Workflow Validation
export const canAdvanceWorkflow = (currentStep, targetStep, userRole) => {
  const stepOrder = [
    WORKFLOW_STEPS.SALES_RECEIVE,
    WORKFLOW_STEPS.PICKUP_COLLECT,
    WORKFLOW_STEPS.PROCESSING_PACKAGE,
    WORKFLOW_STEPS.SALES_PRICING,
    WORKFLOW_STEPS.CUSTOMER_PAYMENT,
    WORKFLOW_STEPS.DOCUMENTATION_PROCESS,
    WORKFLOW_STEPS.COMPLETED,
  ];

  const currentIndex = stepOrder.indexOf(currentStep);
  const targetIndex = stepOrder.indexOf(targetStep);

  // Can only move forward or stay in same step
  if (targetIndex < currentIndex) return false;

  // Check role permissions for each step
  const roleStepPermissions = {
    [USER_ROLES.SALES]: [
      WORKFLOW_STEPS.SALES_RECEIVE,
      WORKFLOW_STEPS.SALES_PRICING,
    ],
    [USER_ROLES.PICKUP]: [WORKFLOW_STEPS.PICKUP_COLLECT],
    [USER_ROLES.PROCESSING]: [WORKFLOW_STEPS.PROCESSING_PACKAGE],
    [USER_ROLES.DOCUMENTATION]: [WORKFLOW_STEPS.DOCUMENTATION_PROCESS],
  };

  return roleStepPermissions[userRole]?.includes(targetStep) || false;
};
