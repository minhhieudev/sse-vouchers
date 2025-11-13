import { vouchersDB } from "./vouchers.service";

const delay = (ms = 250) => new Promise((res) => setTimeout(res, ms));

let logsDB = Array.from({ length: 24 }).map((_, i) => {
  const voucher = vouchersDB[i % vouchersDB.length];
  const d = new Date();
  d.setDate(d.getDate() - (i % 20));
  return {
    id: `LOG-${1000 + i}`,
    date: d.toISOString(),
    voucherCode: voucher.code,
    orderCode: `SSE-OD-${(5000 + i).toString()}`,
    weightUsedKg: Number(((i % 3) * 0.5 + 0.2).toFixed(2)),
    operator: i % 2 === 0 ? "Nguyễn Văn A" : "Trần Thị B",
  };
});

export async function listLogs({ query = "" } = {}) {
  await delay();
  const q = query.toLowerCase();
  return logsDB.filter(
    (l) =>
      !q ||
      l.voucherCode.toLowerCase().includes(q) ||
      l.orderCode.toLowerCase().includes(q) ||
      l.operator.toLowerCase().includes(q),
  );
}

export async function appendLog(entry) {
  await delay(100);
  logsDB.unshift({ ...entry, id: `LOG-${Math.floor(Math.random() * 99999)}` });
  return true;
}

