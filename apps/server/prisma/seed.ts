import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Iniciando seed...");

	// Limpa o banco em ordem reversa de dependência
	await prisma.notification.deleteMany();
	await prisma.alertRule.deleteMany();
	await prisma.financialRecord.deleteMany();
	await prisma.milkProduction.deleteMany();
	await prisma.weightRecord.deleteMany();
	await prisma.birth.deleteMany();
	await prisma.pregnancy.deleteMany();
	await prisma.estrus.deleteMany();
	await prisma.treatment.deleteMany();
	await prisma.vaccine.deleteMany();
	await prisma.healthRecord.deleteMany();
	await prisma.paddock.deleteMany();
	await prisma.animal.deleteMany();
	await prisma.user.deleteMany();
	await prisma.organization.deleteMany();

	// ── Organização ──────────────────────────────────────────────────────────
	const org = await prisma.organization.create({
		data: { name: "Fazenda São João" },
	});
	console.log(`✅ Organização: ${org.name}`);

	// ── Usuários ─────────────────────────────────────────────────────────────
	const [manager, vet, operator] = await Promise.all([
		prisma.user.create({
			data: {
				email: "gerente@fazenda.com",
				password: await bcrypt.hash("senha123", 12),
				name: "Carlos Oliveira",
				role: "MANAGER",
				organizationId: org.id,
			},
		}),
		prisma.user.create({
			data: {
				email: "veterinario@fazenda.com",
				password: await bcrypt.hash("senha123", 12),
				name: "Dra. Ana Souza",
				role: "VET",
				organizationId: org.id,
			},
		}),
		prisma.user.create({
			data: {
				email: "operador@fazenda.com",
				password: await bcrypt.hash("senha123", 12),
				name: "João Pereira",
				role: "OPERATOR",
				organizationId: org.id,
			},
		}),
	]);
	console.log(`✅ Usuários: ${manager.name}, ${vet.name}, ${operator.name}`);

	// ── Piquetes ─────────────────────────────────────────────────────────────
	const [piquete1, piquete2, piquete3, piquete4] = await Promise.all([
		prisma.paddock.create({
			data: { name: "Piquete A", area: 12.5, organizationId: org.id },
		}),
		prisma.paddock.create({
			data: { name: "Piquete B", area: 8.0, organizationId: org.id },
		}),
		prisma.paddock.create({
			data: { name: "Piquete C — Maternidade", area: 5.5, organizationId: org.id },
		}),
		prisma.paddock.create({
			data: { name: "Piquete D — Engorda", area: 20.0, organizationId: org.id },
		}),
	]);
	console.log("✅ Piquetes criados");

	// ── Animais ───────────────────────────────────────────────────────────────
	const animalsData = [
		{
			tag: "SJ-001",
			species: "Bovino",
			breed: "Nelore",
			sex: "Fêmea",
			birthDate: new Date("2019-03-15"),
			origin: "Nascido na fazenda",
			status: "Ativo",
		},
		{
			tag: "SJ-002",
			species: "Bovino",
			breed: "Nelore",
			sex: "Fêmea",
			birthDate: new Date("2020-06-20"),
			origin: "Nascido na fazenda",
			status: "Ativo",
		},
		{
			tag: "SJ-003",
			species: "Bovino",
			breed: "Nelore",
			sex: "Fêmea",
			birthDate: new Date("2021-01-10"),
			origin: "Comprado",
			status: "Ativo",
		},
		{
			tag: "SJ-004",
			species: "Bovino",
			breed: "Nelore",
			sex: "Fêmea",
			birthDate: new Date("2021-09-05"),
			origin: "Nascido na fazenda",
			status: "Ativo",
		},
		{
			tag: "SJ-005",
			species: "Bovino",
			breed: "Angus",
			sex: "Fêmea",
			birthDate: new Date("2020-04-12"),
			origin: "Comprado",
			status: "Ativo",
		},
		{
			tag: "SJ-006",
			species: "Bovino",
			breed: "Nelore",
			sex: "Macho",
			birthDate: new Date("2018-11-08"),
			origin: "Nascido na fazenda",
			status: "Ativo",
		},
		{
			tag: "SJ-007",
			species: "Bovino",
			breed: "Angus",
			sex: "Macho",
			birthDate: new Date("2019-07-22"),
			origin: "Comprado",
			status: "Ativo",
		},
		{
			tag: "SJ-008",
			species: "Bovino",
			breed: "Nelore",
			sex: "Fêmea",
			birthDate: new Date("2022-02-18"),
			origin: "Nascido na fazenda",
			status: "Ativo",
		},
	];

	const animals = await Promise.all(
		animalsData.map((a) =>
			prisma.animal.create({ data: { ...a, organizationId: org.id } }),
		),
	);
	const [vaca1, vaca2, vaca3, vaca4, vaca5, touro1, touro2, vaca6] = animals;
	console.log(`✅ Animais criados: ${animals.length}`);

	// ── Registros de saúde ────────────────────────────────────────────────────
	await Promise.all([
		prisma.healthRecord.create({
			data: {
				animalId: vaca1.id,
				date: new Date("2025-01-10"),
				description: "Exame clínico geral",
				observation: "Animal saudável, sem alterações",
				organizationId: org.id,
			},
		}),
		prisma.healthRecord.create({
			data: {
				animalId: vaca2.id,
				date: new Date("2025-02-05"),
				description: "Revisão pós-parto",
				observation: "Recuperação normal, útero em involução",
				organizationId: org.id,
			},
		}),
		prisma.healthRecord.create({
			data: {
				animalId: touro1.id,
				date: new Date("2025-03-01"),
				description: "Exame andrológico",
				observation: "Aprovado para reprodução — motilidade 80%",
				organizationId: org.id,
			},
		}),
		prisma.healthRecord.create({
			data: {
				animalId: vaca3.id,
				date: new Date("2025-04-12"),
				description: "Consulta por queda de produção",
				observation: "Mastite subclínica detectada, encaminhado para tratamento",
				organizationId: org.id,
			},
		}),
	]);
	console.log("✅ Registros de saúde criados");

	// ── Vacinas ───────────────────────────────────────────────────────────────
	const vacinas = [
		{ animal: vaca1, nome: "Aftosa", dose: 1, data: new Date("2025-01-15"), proxima: new Date("2025-07-15") },
		{ animal: vaca2, nome: "Aftosa", dose: 1, data: new Date("2025-01-15"), proxima: new Date("2025-07-15") },
		{ animal: vaca3, nome: "Aftosa", dose: 1, data: new Date("2025-01-15"), proxima: new Date("2025-07-15") },
		{ animal: vaca4, nome: "Aftosa", dose: 1, data: new Date("2025-01-15"), proxima: new Date("2025-07-15") },
		{ animal: vaca5, nome: "Aftosa", dose: 1, data: new Date("2025-01-15"), proxima: new Date("2025-07-15") },
		{ animal: touro1, nome: "Aftosa", dose: 1, data: new Date("2025-01-15"), proxima: new Date("2025-07-15") },
		{ animal: vaca1, nome: "Brucelose", dose: 1, data: new Date("2024-06-10"), proxima: null },
		{ animal: vaca2, nome: "Brucelose", dose: 1, data: new Date("2024-06-10"), proxima: null },
		{ animal: vaca1, nome: "IBR/BVD", dose: 2, data: new Date("2025-02-20"), proxima: new Date("2026-02-20") },
	];

	await Promise.all(
		vacinas.map(({ animal, nome, dose, data, proxima }) =>
			prisma.vaccine.create({
				data: {
					animalId: animal.id,
					vaccineName: nome,
					doseNumber: dose,
					dateAdministered: data,
					nextDueDate: proxima ?? undefined,
					organizationId: org.id,
				},
			}),
		),
	);
	console.log("✅ Vacinas registradas");

	// ── Tratamentos ───────────────────────────────────────────────────────────
	await Promise.all([
		prisma.treatment.create({
			data: {
				animalId: vaca3.id,
				diagnosis: "Mastite subclínica",
				medication: "Ceftiofur",
				dosage: "2,2 mg/kg/dia IM",
				startDate: new Date("2025-04-13"),
				endDate: new Date("2025-04-18"),
				organizationId: org.id,
			},
		}),
		prisma.treatment.create({
			data: {
				animalId: vaca4.id,
				diagnosis: "Tristeza parasitária",
				medication: "Dipropionato de Imidocarb",
				dosage: "1,2 mg/kg SC",
				startDate: new Date("2025-03-20"),
				endDate: new Date("2025-03-22"),
				organizationId: org.id,
			},
		}),
	]);
	console.log("✅ Tratamentos registrados");

	// ── Estros ────────────────────────────────────────────────────────────────
	await Promise.all([
		prisma.estrus.create({
			data: {
				animalId: vaca1.id,
				startDate: new Date("2024-11-01"),
				endDate: new Date("2024-11-03"),
				observation: "Estro natural, monta aceita",
				organizationId: org.id,
			},
		}),
		prisma.estrus.create({
			data: {
				animalId: vaca2.id,
				startDate: new Date("2024-11-08"),
				endDate: new Date("2024-11-10"),
				observation: "Estro induzido com CIDR",
				organizationId: org.id,
			},
		}),
		prisma.estrus.create({
			data: {
				animalId: vaca5.id,
				startDate: new Date("2024-12-05"),
				endDate: new Date("2024-12-07"),
				observation: "Estro natural",
				organizationId: org.id,
			},
		}),
	]);
	console.log("✅ Estros registrados");

	// ── Gestações ─────────────────────────────────────────────────────────────
	await Promise.all([
		prisma.pregnancy.create({
			data: {
				animalId: vaca1.id,
				detectedDate: new Date("2024-12-01"),
				expectedDate: new Date("2025-09-01"),
				status: "Em andamento",
				organizationId: org.id,
			},
		}),
		prisma.pregnancy.create({
			data: {
				animalId: vaca2.id,
				detectedDate: new Date("2024-09-15"),
				expectedDate: new Date("2025-06-15"),
				status: "Concluída",
				organizationId: org.id,
			},
		}),
		prisma.pregnancy.create({
			data: {
				animalId: vaca5.id,
				detectedDate: new Date("2025-01-10"),
				expectedDate: new Date("2025-10-10"),
				status: "Em andamento",
				organizationId: org.id,
			},
		}),
	]);
	console.log("✅ Gestações registradas");

	// ── Partos ────────────────────────────────────────────────────────────────
	await prisma.birth.create({
		data: {
			motherId: vaca2.id,
			fatherId: touro1.id,
			birthDate: new Date("2025-06-12"),
			offspringTag: "SJ-009",
			status: "Nascido vivo",
			organizationId: org.id,
		},
	});
	console.log("✅ Partos registrados");

	// ── Registros de peso ─────────────────────────────────────────────────────
	const weightRecords = [
		// vaca1
		{ animal: vaca1, peso: 420, data: new Date("2024-07-01") },
		{ animal: vaca1, peso: 435, data: new Date("2024-10-01") },
		{ animal: vaca1, peso: 448, data: new Date("2025-01-01") },
		// vaca2
		{ animal: vaca2, peso: 390, data: new Date("2024-07-01") },
		{ animal: vaca2, peso: 405, data: new Date("2024-10-01") },
		{ animal: vaca2, peso: 415, data: new Date("2025-01-01") },
		// touro1
		{ animal: touro1, peso: 680, data: new Date("2024-07-01") },
		{ animal: touro1, peso: 710, data: new Date("2025-01-01") },
		// vaca5
		{ animal: vaca5, peso: 460, data: new Date("2024-07-01") },
		{ animal: vaca5, peso: 472, data: new Date("2025-01-01") },
	];

	await Promise.all(
		weightRecords.map(({ animal, peso, data }) =>
			prisma.weightRecord.create({
				data: { animalId: animal.id, weight: peso, date: data, organizationId: org.id },
			}),
		),
	);
	console.log("✅ Registros de peso criados");

	// ── Produção de leite ─────────────────────────────────────────────────────
	const milkDates = [
		new Date("2025-04-01"),
		new Date("2025-04-02"),
		new Date("2025-04-03"),
		new Date("2025-04-04"),
		new Date("2025-04-05"),
	];

	const milkAnimals = [vaca1, vaca2, vaca5];
	const baseQuantities: Record<string, number[]> = {
		[vaca1.id]: [18.5, 19.0, 17.8, 18.2, 19.5],
		[vaca2.id]: [14.2, 13.8, 14.5, 15.0, 14.8],
		[vaca5.id]: [22.0, 21.5, 22.8, 23.0, 22.3],
	};

	await Promise.all(
		milkAnimals.flatMap((animal) =>
			milkDates.map((date, i) =>
				prisma.milkProduction.create({
					data: {
						animalId: animal.id,
						quantity: baseQuantities[animal.id][i],
						unit: "L",
						date,
						organizationId: org.id,
					},
				}),
			),
		),
	);
	console.log("✅ Registros de produção de leite criados");

	// ── Registros financeiros ─────────────────────────────────────────────────
	const financials = [
		{ type: "REVENUE", category: "Venda de leite", amount: 4800, date: new Date("2025-03-31"), description: "Referente a março/2025" },
		{ type: "REVENUE", category: "Venda de leite", amount: 5100, date: new Date("2025-04-30"), description: "Referente a abril/2025" },
		{ type: "REVENUE", category: "Venda de animais", amount: 9500, date: new Date("2025-02-15"), description: "Venda de 1 garrote — SJ-010" },
		{ type: "COST", category: "Ração e suplementação", amount: 2300, date: new Date("2025-03-05"), description: "Compra de silagem e suplemento mineral" },
		{ type: "COST", category: "Medicamentos e vacinas", amount: 580, date: new Date("2025-01-20"), description: "Campanha de vacinação aftosa" },
		{ type: "COST", category: "Medicamentos e vacinas", amount: 420, date: new Date("2025-04-15"), description: "Antibióticos e antiparasitários" },
		{ type: "COST", category: "Mão de obra", amount: 3200, date: new Date("2025-04-30"), description: "Folha de pagamento — abril/2025" },
		{ type: "COST", category: "Manutenção", amount: 750, date: new Date("2025-03-18"), description: "Reparo de cercas e bebedouros" },
		{ type: "COST", category: "Energia elétrica", amount: 380, date: new Date("2025-04-05"), description: "Conta de energia — abril/2025" },
	];

	await Promise.all(
		financials.map(({ type, category, amount, date, description }) =>
			prisma.financialRecord.create({
				data: { type, category, amount, date, description, organizationId: org.id },
			}),
		),
	);
	console.log("✅ Registros financeiros criados");

	// ── Regras de alerta ──────────────────────────────────────────────────────
	const [ruleVacina, ruleGestacao, rulePeso] = await Promise.all([
		prisma.alertRule.create({
			data: {
				name: "Vacina vencida",
				condition: "vaccine_overdue",
				value: "7",
				organizationId: org.id,
			},
		}),
		prisma.alertRule.create({
			data: {
				name: "Parto próximo",
				condition: "birth_expected_days",
				value: "14",
				organizationId: org.id,
			},
		}),
		prisma.alertRule.create({
			data: {
				name: "Queda de produção",
				condition: "milk_drop_percent",
				value: "20",
				organizationId: org.id,
			},
		}),
	]);
	console.log("✅ Regras de alerta criadas");

	// ── Notificações ──────────────────────────────────────────────────────────
	await Promise.all([
		prisma.notification.create({
			data: {
				ruleId: ruleGestacao.id,
				message: "SJ-001 (Nelore) tem parto previsto para 01/09/2025 — faltam 14 dias.",
				isRead: false,
				organizationId: org.id,
			},
		}),
		prisma.notification.create({
			data: {
				ruleId: ruleVacina.id,
				message: "Reforço de aftosa vence em 15/07/2025 para 6 animais.",
				isRead: false,
				organizationId: org.id,
			},
		}),
		prisma.notification.create({
			data: {
				ruleId: rulePeso.id,
				message: "Produção de leite de SJ-002 caiu 22% na última semana.",
				isRead: true,
				organizationId: org.id,
			},
		}),
	]);
	console.log("✅ Notificações criadas");

	console.log("\n✨ Seed concluído com sucesso!");
	console.log("\n📋 Credenciais de acesso:");
	console.log("   Gerente  — gerente@fazenda.com   / senha123");
	console.log("   Vet      — veterinario@fazenda.com / senha123");
	console.log("   Operador — operador@fazenda.com   / senha123");
}

main()
	.catch((e) => {
		console.error("❌ Erro no seed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
