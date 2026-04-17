export interface AlertRuleProps {
	name: string;
	condition: string;
	value?: string;
	organizationId: string;
}

export class AlertRule {
	constructor(
		public readonly props: AlertRuleProps,
		public readonly id?: string,
	) {}

	public static create(props: AlertRuleProps, id?: string): AlertRule {
		return new AlertRule(props, id);
	}
}
