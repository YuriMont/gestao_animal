import {
	type ColumnDef,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { Filter, MoreVertical, Search } from "lucide-react";
import type { Animal } from "./types";

const columnHelper = createColumnHelper<Animal>();

const columns: ColumnDef<Animal>[] = [
	columnHelper.accessor("tag", {
		header: "Tag",
		cell: (info) => (
			<span className="font-mono font-medium">{info.getValue()}</span>
		),
	}),
	columnHelper.accessor("species", {
		header: "Species",
	}),
	columnHelper.accessor("breed", {
		header: "Breed",
		cell: (info) => info.getValue() || "-",
	}),
	columnHelper.accessor("sex", {
		header: "Sex",
		cell: (info) => (
			<span
				className={`px-2 py-1 rounded-full text-xs font-medium ${
					info.getValue() === "Male"
						? "bg-blue-100 text-blue-700"
						: "bg-pink-100 text-pink-700"
				}`}
			>
				{info.getValue()}
			</span>
		),
	}),
	columnHelper.accessor("status", {
		header: "Status",
		cell: (info) => (
			<span
				className={`px-2 py-1 rounded-full text-xs font-medium ${
					info.getValue() === "Active"
						? "bg-emerald-100 text-emerald-700"
						: "bg-slate-100 text-slate-700"
				}`}
			>
				{info.getValue()}
			</span>
		),
	}),
	columnHelper.display({
		id: "actions",
		header: "",
		cell: () => (
			<button className="p-1 hover:bg-slate-100 rounded-md transition-colors">
				<MoreVertical className="w-4 h-4 text-slate-400" />
			</button>
		),
	}),
];

export function AnimalsTable({ data }: { data: Animal[] }) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-4 mb-6">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
					<input
						type="text"
						placeholder="Search animals..."
						className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
					/>
				</div>
				<div className="flex items-center gap-2">
					<button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white">
						<Filter className="w-4 h-4" />
						Filters
					</button>
				</div>
			</div>

			<div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left border-collapse">
						<thead className="bg-slate-50 border-b border-slate-200">
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<th
											key={header.id}
											className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider"
										>
											{flexRender(
												header.column.columnDef.header,
												header.getContext(),
											)}
										</th>
									))}
								</tr>
							))}
						</thead>
						<tbody className="divide-y divide-slate-200">
							{table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className="hover:bg-slate-50 transition-colors group"
								>
									{row.getVisibleCells().map((cell) => (
										<td
											key={cell.id}
											className="px-6 py-4 text-sm text-slate-600"
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									))}
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{data.length === 0 && (
					<div className="py-12 text-center text-slate-400 italic">
						No animals found.
					</div>
				)}
			</div>
		</div>
	);
}
