import { AnimalIcon, LayoutDashboard, Settings, Users } from "lucide-react";
import { Link, Outlet } from "@tanstack/react-router";

export function AppLayout() {
  return (
    <div className="flex h-screen bg-slate-50 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-xl text-emerald-600">
            <AnimalIcon className="w-6 h-6" />
            <span>AnimalMgmt</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            activeProps={{
              className: "bg-slate-100 text-slate-900 font-medium",
            }}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/animals"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            activeProps={{
              className: "bg-slate-100 text-slate-900 font-medium",
            }}
          >
            <AnimalIcon className="w-5 h-5" />
            <span>Animals</span>
          </Link>
          <Link
            to="/users"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            activeProps={{
              className: "bg-slate-100 text-slate-900 font-medium",
            }}
          >
            <Users className="w-5 h-5" />
            <span>Users</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            activeProps={{
              className: "bg-slate-100 text-slate-100 font-medium",
            }}
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              U
            </div>
            <div className="text-sm">
              <p className="font-medium">User Admin</p>
              <p className="text-slate-500 text-xs">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-slate-800">
            Animal Management System
          </h1>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
