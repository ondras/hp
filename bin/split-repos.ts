import { Repo } from "./repo.d.ts";

const te = new TextEncoder();
const td = new TextDecoder();

function createFilter(mode: string) {
	return (repo: Repo) => {
		let isGame = repo.topics.includes("game");
		let isDemo = repo.topics.includes("demo");
		switch (mode) {
			case "games": return isGame;
			case "demos": return isDemo;
			default: return !isGame && !isDemo;
		}
	}
}

const stdin = await Deno.readAll(Deno.stdin);
const all: Repo[] = JSON.parse(td.decode(stdin));

const mode = Deno.args[0];
const filter = createFilter(mode);
const filtered = all.filter(filter);

const str = JSON.stringify(filtered);
Deno.stdout.writeSync(te.encode(str));

Deno.stderr.writeSync(te.encode(`Fetched ${all.length} repos, wrote ${filtered.length} ${mode}\n`));
