import {TS} from "../../src/type/ts";
import {InputCompilerOptions, TypescriptPluginOptions} from "../../src/plugin/typescript-plugin-options";
import path from "crosspath";

export interface TestContext {
	cwd: string;
	dist: string;
	transpileOnly: boolean;
	loadBabelHelpers: boolean;
	loadSwcHelpers: boolean;
	typescript: typeof TS;
	debug: TypescriptPluginOptions["debug"];
	hook: TypescriptPluginOptions["hook"];
	transpiler: TypescriptPluginOptions["transpiler"];
	exclude: TypescriptPluginOptions["exclude"];
	include: TypescriptPluginOptions["include"];
	tsconfig: Partial<InputCompilerOptions> | string;
}

export function createTestContext({
	debug = process.env.DEBUG === "true",
	typescript = TS,
	cwd = process.cwd(),
	dist = cwd,
	hook = {outputPath: p => p},
	transpileOnly = false,
	transpiler = "typescript",
	loadBabelHelpers = false,
	loadSwcHelpers = false,
	tsconfig = {},
	exclude = [],
	include = []
}: Partial<TestContext> = {}): TestContext {
	if (!path.isAbsolute(cwd)) {
		cwd = path.join(process.cwd(), cwd);
	}
	let baseUrl = path.relative(cwd, ".");
	if (baseUrl === "") baseUrl = ".";

	return {
		debug,
		typescript,
		cwd,
		dist,
		loadBabelHelpers,
		loadSwcHelpers,
		hook,
		transpileOnly,
		transpiler,
		exclude,
		include,
		tsconfig:
			typeof tsconfig === "string"
				? path.isAbsolute(tsconfig)
					? tsconfig
					: path.join(cwd, tsconfig)
				: {
						target: "esnext",
						declaration: true,
						moduleResolution: "node",
						baseUrl,
						...tsconfig
				  }
	};
}
