import { useMemo, useState } from "react";

const ITEMS_PER_PAGE = 8;

export function useCustomerList(customers) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState(new Set());

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesQuery =
        query.trim().length === 0 ||
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone.includes(query) ||
        customer.email.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;
      const matchesTag =
        tagFilter === "all" || customer.tags.includes(tagFilter);

      return matchesQuery && matchesStatus && matchesTag;
    });
  }, [customers, query, statusFilter, tagFilter]);

  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCustomers, currentPage]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("all");
    setTagFilter("all");
    setCurrentPage(1);
  };

  const hasActiveFilters = statusFilter !== "all" || tagFilter !== "all" || query.trim();

  return {
    // State
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    tagFilter,
    setTagFilter,
    currentPage,
    setCurrentPage,
    selectedKeys,
    setSelectedKeys,

    // Computed values
    filteredCustomers,
    paginatedCustomers,
    totalPages,
    hasActiveFilters,

    // Constants
    ITEMS_PER_PAGE,

    // Actions
    resetFilters,
  };
}
