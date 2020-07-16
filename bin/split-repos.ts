import { Repo } from "./repo.d.ts";

const te = new TextEncoder();
const td = new TextDecoder();

function createFilter(mode: string) {
	return (repo: Repo) => {
		let isGame = repo.topics.includes("game");
		let isUtil = repo.topics.includes("util");
		let isOld = repo.topics.includes("old");
		switch (mode) {
			case "games": return isGame;
			case "utils": return isUtil;
			case "old": return isOld;
			default: return !isGame && !isUtil && !isOld;
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
