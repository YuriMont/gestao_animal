import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useGetV1FinancialSummary } from "@/gen/hooks/financialController/useGetV1FinancialSummary";

export function FinancialSummaryCards() {
	const { data: summary, isLoading: summaryIsLoading } =
		useGetV1FinancialSummary();

	function fmt(n: number) {
		return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
	}

	return (
		<div className="grid grid-cols-3 gap-4">
			<Card>
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Receita Total
						</CardTitle>
						<TrendingUp className="size-4 text-primary" />
					</div>
				</CardHeader>
				<CardContent>
					{summaryIsLoading ? (
						<Skeleton className="h-7 w-32" />
					) : (
						<p className="text-2xl font-bold text-primary">
							{summary ? fmt(summary.totalRevenue) : "—"}
						</p>
					)}
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Custos Totais
						</CardTitle>
						<TrendingDown className="size-4 text-destructive" />
					</div>
				</CardHeader>
				<CardContent>
					{summaryIsLoading ? (
						<Skeleton className="h-7 w-32" />
					) : (
						<p className="text-2xl font-bold text-destructive">
							{summary ? fmt(summary.totalCost) : "—"}
						</p>
					)}
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="pb-2">
					<div className="flex items-center justify-between">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							Lucro Líquido
						</CardTitle>
						<DollarSign className="size-4 text-muted-foreground" />
					</div>
				</CardHeader>
				<CardContent>
					{summaryIsLoading ? (
						<Skeleton className="h-7 w-32" />
					) : (
						<p
							className={`text-2xl font-bold ${summary && summary.balance >= 0 ? "text-primary" : "text-destructive"}`}
						>
							{summary ? fmt(summary.balance) : "—"}
						</p>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
