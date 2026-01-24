import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, fontProviders } from "astro/config";
import expressiveCode from "astro-expressive-code";
import browserslist from "browserslist";
import { browserslistToTargets, Features } from "lightningcss";

export default defineConfig({
	site: "https://craftlions.ai",
	adapter: cloudflare({
		imageService: "cloudflare-binding",
	}),
	compressHTML: false,
	experimental: {
		contentIntellisense: true,
		svgo: true,
		chromeDevtoolsWorkspace: true,
		fonts: [
			{
				provider: fontProviders.fontsource(),
				name: "Silkscreen",
				cssVariable: "--font-silkscreen",
			},
		],
	},
	integrations: [expressiveCode()],
	devToolbar: {
		enabled: false,
	},
	vite: {
		css: {
			transformer: "lightningcss",
			lightningcss: {
				targets: browserslistToTargets(
					browserslist([
						"> 0.5%",
						"last 2 versions",
						"Firefox ESR",
						"not dead",
						"cover 80% in CN",
						"unreleased versions",
					]),
				),
			},
		},
		build: {
			minify: false,
			cssMinify: false,
		},
		plugins: [tailwindcss()],
	},
});
