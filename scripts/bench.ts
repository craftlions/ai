import { writeFile } from "node:fs/promises";
import { OpenRouter } from "@openrouter/sdk";

const models = [
	"qwen/qwen2.5-vl-72b-instruct",
	"qwen/qwen3-vl-32b-instruct",
	"google/gemini-2.5-flash",
	"google/gemini-3-flash-preview",
	"openai/chatgpt-4o-latest",
	"openai/gpt-4o-mini",
	"openai/gpt-5-chat",
	"openai/gpt-5.1-chat",
	"anthropic/claude-sonnet-4.5",
] as const;

const CURRENT_DATE = new Date();
const UNIX_TIMESTAMP = Math.floor(CURRENT_DATE.getTime() / 1000);

const content: {
	$schema: string;
	datetime: string;
} & Partial<Record<(typeof models)[number], number>> = {
	$schema: "../../../../.astro/collections/validateBench.schema.json",
	datetime: CURRENT_DATE.toISOString(),
};

const openRouter = new OpenRouter({
	apiKey: process.env.OPENROUTER_API_KEY,
});

async function* benchmarkModels(modelList: typeof models) {
	for (const model of modelList) {
		try {
			const start = performance.now();
			const res = await openRouter.chat.send({
				model,
				stream: false,
				provider: {
					allowFallbacks: true,
					sort: "throughput",
				},
				temperature: 0.1,
				messages: [
					{
						role: "system",
						content:
							"You are an expert at validating data correctness. Look for inconsistencies and misspelled words in the data. Answer with yes or no and wrap it in <correct></correct> tag. In case that the answer is no, provide a short explanation of the issue. The data must be found in the image, otherwise it is not correct. The value and unit must be exactly the same as in the image. The output should follow the format <correct></correct><explanation></explanation>.",
					},
					{
						role: "user",
						content: [
							{
								type: "image_url",
								imageUrl: {
									url: "https://craftlions.ai/_internal/techdata.png",
								},
							},
							{
								type: "text",
								text: "Given the image and the following attribute, is everything correct?",
							},
							{
								type: "text",
								text: `Title: Hub`,
							},
							{
								type: "text",
								text: `Value: 150`,
							},
							{
								type: "text",
								text: `Unit: mm`,
							},
						],
					},
				],
			});
			console.log(res.choices[0]?.message);
			const end = performance.now();
			yield {
				model,
				outcome: String(res.choices[0]?.message.content).includes(
					"<correct>yes</correct>",
				)
					? "success"
					: "failure",
				duration: Math.round(end - start),
			};
		} catch (error) {}
	}
}

for await (const { model, duration } of benchmarkModels(models)) {
	console.log(`${model}: ${duration}ms`);
	content[model] = duration;
}

await writeFile(
	`src/content/benchmarks/validate/${UNIX_TIMESTAMP}.json`,
	`${JSON.stringify(content, null, "\t")}\n`,
);
