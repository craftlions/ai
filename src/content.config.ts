import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const validateBench = defineCollection({
	loader: glob({
		pattern: "*.json",
		base: "./src/content/benchmarks/validate",
	}),
	schema: z.object({
		datetime: z.iso.datetime(),
		"qwen/qwen2.5-vl-72b-instruct": z.number().min(0).optional(),
		"qwen/qwen3-vl-32b-instruct": z.number().min(0).optional(),
		"google/gemini-2.5-flash": z.number().min(0).optional(),
		"google/gemini-2.5-flash-lite": z.number().min(0).optional(),
		"google/gemini-3-flash-preview": z.number().min(0).optional(),
		"openai/chatgpt-4o-latest": z.number().min(0).optional(),
		"openai/gpt-4o-mini": z.number().min(0).optional(),
		"openai/gpt-4.1": z.number().min(0).optional(),
		"openai/gpt-5-chat": z.number().min(0).optional(),
		"openai/gpt-5.1-chat": z.number().min(0).optional(),
		"openai/gpt-5.2-chat": z.number().min(0).optional(),
		"anthropic/claude-sonnet-4.5": z.number().min(0).optional(),
		"bytedance-seed/seed-1.6": z.number().min(0).optional(),
	}),
});

export const collections = { validateBench };
