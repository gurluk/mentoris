import z from "zod";

export const StrictUtcTimestampSchema = z.iso
	.datetime()
	.refine((val) => val.endsWith("Z"), {
		message: "Timestamp must be UTC (Z)",
	});

export const DateStringSchema = z.string().refine(
	(val) => {
		const [y, m, d] = val.split("-").map(Number);

		const date = new Date(Date.UTC(y, m - 1, d));

		return (
			date.getUTCFullYear() === y &&
			date.getUTCMonth() === m - 1 &&
			date.getUTCDate() === d
		);
	},
	{
		message: "Invalid calendar date",
	},
);
