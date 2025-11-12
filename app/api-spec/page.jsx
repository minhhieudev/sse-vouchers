"use client";

import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import {
  ArrowRight,
  CheckCircle,
  Code,
  Copy,
  Database,
  ExternalLink,
  Globe,
  Server,
  Shield,
  Webhook,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { voucherApiSpec } from "@/lib/mockVoucherData";

const methodColors = {
  GET: "from-green-500 to-green-600",
  POST: "from-blue-500 to-blue-600",
  PUT: "from-amber-500 to-amber-600",
  DELETE: "from-red-500 to-red-600",
  PATCH: "from-purple-500 to-purple-600",
};

const sectionIcons = {
  "Voucher Operations": Database,
  "Analytics & Reporting": Shield,
  "System Management": Server,
};

export default function ApiSpecPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState(null);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(text);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="flex flex-col gap-6 p-4 lg:p-6">
        {/* Header Section */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white p-6 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200/50">
                  <div className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  API Specification
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent lg:text-3xl">
                  Voucher Management API
                </h1>
                <p className="text-slate-600 max-w-md leading-relaxed text-sm">
                  Chuẩn hóa endpoints cho portal nội bộ và Zalo OA / Mini App.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
                <Button
                  variant="bordered"
                  className="border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 shadow-md shadow-slate-200/25 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-lg hover:shadow-slate-300/40"
                  startContent={<Copy className="h-4 w-4 text-slate-600" />}
                  size="sm"
                >
                  <span className="font-medium text-sm">Copy Postman</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* API Sections */}
        <div className="space-y-4">
          {voucherApiSpec.map((section, sectionIndex) => {
            const SectionIcon = sectionIcons[section.group] || Code;
            const gradients = [
              "from-blue-500/15 via-blue-400/8 to-blue-500/3",
              "from-emerald-500/15 via-emerald-400/8 to-emerald-500/3",
              "from-purple-500/15 via-purple-400/8 to-purple-500/3",
            ];
            const iconColors = [
              "bg-gradient-to-br from-blue-500 to-blue-600",
              "bg-gradient-to-br from-emerald-500 to-emerald-600",
              "bg-gradient-to-br from-purple-500 to-purple-600",
            ];

            return (
              <div
                key={section.group}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${gradients[sectionIndex % gradients.length]} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />
                <div className="relative p-6">
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconColors[sectionIndex % iconColors.length]} text-white shadow-md shadow-slate-200/25 transition-transform duration-300 group-hover:scale-105`}
                    >
                      <SectionIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-slate-900">
                        {section.group}
                      </h2>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                  </div>

                  {/* Endpoints */}
                  <div className="space-y-3">
                    {section.endpoints.map((endpoint, endpointIndex) => (
                      <div
                        key={endpoint.path}
                        className="group/endpoint relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-50/30 to-white border border-slate-200/50 shadow-md shadow-slate-200/25 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/3 via-transparent to-purple-500/3 opacity-0 transition-opacity duration-300 group-hover/endpoint:opacity-100" />
                        <div className="relative p-4">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                            <div className="flex-1 space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${methodColors[endpoint.method]} px-2.5 py-0.5 text-xs font-bold text-white shadow-md`}
                                >
                                  {endpoint.method}
                                  <ArrowRight className="h-2.5 w-2.5" />
                                </span>
                                <code className="font-mono text-sm font-semibold text-slate-900 bg-slate-100/50 px-2.5 py-1 rounded-md">
                                  {endpoint.path}
                                </code>
                              </div>
                              <div className="space-y-1">
                                <h3 className="text-base font-semibold text-slate-900">
                                  {endpoint.title}
                                </h3>
                                <p className="text-slate-600 text-sm leading-relaxed">
                                  {endpoint.detail}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Tooltip content="Copy endpoint URL">
                                <Button
                                  size="sm"
                                  variant="light"
                                  className="text-slate-600 hover:text-slate-900 transition-colors p-2"
                                  onClick={() => copyToClipboard(endpoint.path)}
                                >
                                  {copiedEndpoint === endpoint.path ? (
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </Tooltip>
                              <Tooltip content="View documentation">
                                <Button
                                  size="sm"
                                  variant="light"
                                  className="text-slate-600 hover:text-slate-900 transition-colors p-2"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Webhook Section */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50/50 to-white shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-300/50">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-slate-600/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="relative p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-500 to-slate-600 text-white shadow-md shadow-slate-200/25 transition-transform duration-300 group-hover:scale-105">
                <Webhook className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Webhook / Integration gợi ý
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Trigger khi voucher được dùng, khi refill quota hoặc khi đồng
                  bộ Zalo Mini App.
                </p>
              </div>
              <Chip
                variant="flat"
                className="bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200/50 font-medium text-xs"
                startContent={<Zap className="h-3 w-3" />}
              >
                Real-time
              </Chip>
            </div>

            {/* Webhook Events */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group/event relative overflow-hidden rounded-lg bg-gradient-to-br from-green-50/50 to-green-50/30 border border-green-200/50 p-3 transition-all duration-300 hover:shadow-md hover:shadow-green-200/25">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <span className="font-semibold text-green-800 text-sm">
                    Voucher Used
                  </span>
                </div>
                <p className="text-xs text-green-700 leading-relaxed">
                  Khi voucher được áp dụng thành công
                </p>
              </div>

              <div className="group/event relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50/50 to-blue-50/30 border border-blue-200/50 p-3 transition-all duration-300 hover:shadow-md hover:shadow-blue-200/25">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <Database className="h-3 w-3" />
                  </div>
                  <span className="font-semibold text-blue-800 text-sm">
                    Quota Refilled
                  </span>
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Khi quota được refill tự động
                </p>
              </div>

              <div className="group/event relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-50/50 to-purple-50/30 border border-purple-200/50 p-3 transition-all duration-300 hover:shadow-md hover:shadow-purple-200/25">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <Globe className="h-3 w-3" />
                  </div>
                  <span className="font-semibold text-purple-800 text-sm">
                    Zalo Sync
                  </span>
                </div>
                <p className="text-xs text-purple-700 leading-relaxed">
                  Khi đồng bộ với Zalo Mini App
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
