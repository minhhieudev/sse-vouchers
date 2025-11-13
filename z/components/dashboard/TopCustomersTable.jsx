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

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export function TopCustomersTable({ data }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Chi tiết Khách hàng hàng đầu</h3>
        <Table aria-label="Bảng chi tiết khách hàng hàng đầu">
        <TableHeader>
            <TableColumn>KHÁCH HÀNG</TableColumn>
            <TableColumn>ZALO ID</TableColumn>
            <TableColumn>TỔNG ĐƠN</TableColumn>
            <TableColumn>KHỐI LƯỢNG FREE (KG)</TableColumn>
            <TableColumn>DOANH THU</TableColumn>
        </TableHeader>
        <TableBody>
            {data.map((customer) => (
            <TableRow key={customer.id}>
                <TableCell>
                    <User
                        name={customer.name}
                        description={`ID: ${customer.id}`}
                        avatarProps={{
                            src: `https://i.pravatar.cc/150?u=${customer.id}`
                        }}
                    />
                </TableCell>
                <TableCell>
                    <Chip color="primary" variant="flat">{customer.zaloId}</Chip>
                </TableCell>
                <TableCell className="font-semibold">{customer.totalOrders}</TableCell>
                <TableCell className="font-semibold">{customer.freeWeightUsed}</TableCell>
                <TableCell className="font-semibold text-emerald-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(customer.revenue)}
                </TableCell>
            </TableRow>
            ))}
        </TableBody>
        </Table>
    </div>
  );
}
