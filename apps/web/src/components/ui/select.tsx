import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Select } from "radix-ui";
import type * as React from "react";
import { cn } from "@/lib/utils";

const SelectRoot = Select.Root;
const SelectGroup = Select.Group;
const SelectValue = Select.Value;

function SelectTrigger({
	className,
	children,
	...props
}: React.ComponentProps<typeof Select.Trigger>) {
	return (
		<Select.Trigger
			data-slot="select-trigger"
			className={cn(
				"border-input bg-transparent data-[placeholder]:text-muted-foreground flex h-9 w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm shadow-xs outline-none",
				"focus:border-ring focus:ring-ring/50 focus:ring-[3px]",
				"disabled:cursor-not-allowed disabled:opacity-50",
				"[&>span]:line-clamp-1",
				className,
			)}
			{...props}
		>
			{children}
			<Select.Icon asChild>
				<ChevronDownIcon className="size-4 opacity-50" />
			</Select.Icon>
		</Select.Trigger>
	);
}

function SelectScrollUpButton({
	className,
	...props
}: React.ComponentProps<typeof Select.ScrollUpButton>) {
	return (
		<Select.ScrollUpButton
			className={cn(
				"flex cursor-default items-center justify-center py-1",
				className,
			)}
			{...props}
		>
			<ChevronUpIcon className="size-4" />
		</Select.ScrollUpButton>
	);
}

function SelectScrollDownButton({
	className,
	...props
}: React.ComponentProps<typeof Select.ScrollDownButton>) {
	return (
		<Select.ScrollDownButton
			className={cn(
				"flex cursor-default items-center justify-center py-1",
				className,
			)}
			{...props}
		>
			<ChevronDownIcon className="size-4" />
		</Select.ScrollDownButton>
	);
}

function SelectContent({
	className,
	children,
	position = "popper",
	...props
}: React.ComponentProps<typeof Select.Content>) {
	return (
		<Select.Portal>
			<Select.Content
				data-slot="select-content"
				className={cn(
					"bg-popover text-popover-foreground relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border shadow-md",
					"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
					"data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
					position === "popper" &&
						"data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
					className,
				)}
				position={position}
				{...props}
			>
				<SelectScrollUpButton />
				<Select.Viewport
					className={cn(
						"p-1",
						position === "popper" &&
							"h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
					)}
				>
					{children}
				</Select.Viewport>
				<SelectScrollDownButton />
			</Select.Content>
		</Select.Portal>
	);
}

function SelectLabel({
	className,
	...props
}: React.ComponentProps<typeof Select.Label>) {
	return (
		<Select.Label
			className={cn("px-2 py-1.5 text-sm font-medium", className)}
			{...props}
		/>
	);
}

function SelectItem({
	className,
	children,
	...props
}: React.ComponentProps<typeof Select.Item>) {
	return (
		<Select.Item
			data-slot="select-item"
			className={cn(
				"focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
				"data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
				className,
			)}
			{...props}
		>
			<span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
				<Select.ItemIndicator>
					<CheckIcon className="size-4" />
				</Select.ItemIndicator>
			</span>
			<Select.ItemText>{children}</Select.ItemText>
		</Select.Item>
	);
}

function SelectSeparator({
	className,
	...props
}: React.ComponentProps<typeof Select.Separator>) {
	return (
		<Select.Separator
			className={cn("bg-muted -mx-1 my-1 h-px", className)}
			{...props}
		/>
	);
}

export {
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectRoot as Select,
	SelectScrollDownButton,
	SelectScrollUpButton,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
