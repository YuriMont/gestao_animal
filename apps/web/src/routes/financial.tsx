import { AppLayout } from "@/components/layout/app-layout";
import { PageHeader } from "@/components/layout/page-header";
import { createFileRoute } from "@tanstack/react-router";
import { FinancialFormDialog } from "@/components/financial/financial-form-dialog";
import { FinancialSummaryCards } from "@/components/financial/financial-summary-cards";
import { FinancialTable } from "@/components/financial/financial-table";

export const Route = createFileRoute("/financial")({
	component: FinancialPage,
});

function FinancialPage() {
	return (
		<AppLayout>
			<div className="flex flex-col h-full">
				<PageHeader
					title="Financeiro"
					description="Controle receitas, custos e saúde financeira"
				>
					<FinancialFormDialog />
				</PageHeader>

				<div className="p-6 space-y-6">
					<FinancialSummaryCards />
					<FinancialTable />
				</div>
			</div>
		</AppLayout>
	);
}
