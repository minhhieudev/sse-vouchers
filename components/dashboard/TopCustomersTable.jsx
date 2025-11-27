"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { User } from "@heroui/user";
import { Chip } from "@heroui/chip";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export function TopCustomersTable({ data }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h3 className="text-xl font-bold text-slate-900 mb-4">
        Top khách hàng dùng voucher
      </h3>
      <Table aria-label="Bảng top khách hàng dùng voucher">
        <TableHeader>
          <TableColumn>KHÁCH HÀNG</TableColumn>
          <TableColumn>MÃ KH</TableColumn>
          <TableColumn>SĐT</TableColumn>
          <TableColumn>ĐÃ DÙNG</TableColumn>
          <TableColumn>TỔNG GIÁ TRỊ</TableColumn>
        </TableHeader>
        <TableBody emptyContent="Không có dữ liệu">
          {data.map((customer, index) => (
            <TableRow key={customer.customer_id ?? index}>
              <TableCell>
                <User
                  name={customer.name || "N/A"}
                  description={
                    customer.customer_id
                      ? `Mã KH: ${customer.customer_id}`
                      : undefined
                  }
                  avatarProps={{
                    src: `https://i.pravatar.cc/150?u=${customer.customer_id || customer.name || index}`,
                  }}
                />
              </TableCell>
              <TableCell className="font-semibold text-slate-800">
                {customer.customer_id ?? "--"}
              </TableCell>
              <TableCell>
                <Chip color="primary" variant="flat">
                  {customer.phone || "--"}
                </Chip>
              </TableCell>
              <TableCell className="font-semibold">
                {customer.used?.toLocaleString("vi-VN") ?? 0}
              </TableCell>
              <TableCell className="font-semibold text-emerald-600">
                {formatCurrency(customer.total_value ?? 0)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
