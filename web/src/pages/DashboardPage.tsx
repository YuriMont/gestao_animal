import React from 'react';

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Total Animals</p>
          <p className="text-3xl font-bold text-slate-900">124</p>
          <p className="text-xs text-emerald-600 mt-2">↑ 12% from last month</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">
            Active Treatments
          </p>
          <p className="text-3xl font-bold text-slate-900">45</p>
          <p className="text-xs text-slate-400 mt-2">Updated 2 hours ago</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium">Critical Alerts</p>
          <p className="text-3xl font-bold text-red-600">3</p>
          <p className="text-xs text-red-400 mt-2">
            Immediate attention required
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-64 flex items-center justify-center text-slate-400 italic">
        Chart placeholder: Animal population trends
      </div>
    </div>
  );
}
