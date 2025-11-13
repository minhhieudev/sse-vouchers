import { Crown, TrendingUp, Users } from "lucide-react";

export default function CustomerHeader({ customers }) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 p-1 shadow-2xl shadow-slate-200/60 ring-1 ring-slate-200/60 backdrop-blur-sm transition-all duration-500 hover:shadow-3xl hover:shadow-slate-300/70 hover:scale-[1.01]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-indigo-500/10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/30 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <Users className="h-8 w-8" />
              </div>
              <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
                <span className="text-xs font-bold text-white">
                  {customers.filter((c) => c.status === "active").length}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="h-1 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Customer Hub
                </h2>
                <div className="h-1 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
              </div>
              <p className="text-slate-600 font-medium">
                Advanced customer relationship management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="group/stat relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/15 via-emerald-400/8 to-emerald-500/5 p-4 shadow-md shadow-slate-200/25 ring-1 ring-emerald-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40 hover:scale-105">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Total
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {customers.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="group/stat relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500/15 via-blue-400/8 to-blue-500/5 p-4 shadow-md shadow-slate-200/25 ring-1 ring-blue-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40 hover:scale-105">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/25">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      Active
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {
                        customers.filter((c) => c.status === "active")
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="group/stat relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-500/15 via-purple-400/8 to-purple-500/5 p-4 shadow-md shadow-slate-200/25 ring-1 ring-purple-200/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-slate-300/40 hover:scale-105">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md shadow-purple-500/25">
                    <Crown className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      VIP
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {
                        customers.filter((c) => c.tags.includes("VIP"))
                          .length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
