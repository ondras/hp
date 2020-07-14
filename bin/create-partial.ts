import { Repo } from "./repo.d.ts";
import mustache from "https://unpkg.com/mustache@3.2.0/mustache.mjs";


interface MightHaveTopics extends Record<string, any> {
	topics?: string[];
}

const te = new TextEncoder();
const td = new TextDecoder();

const REMOVE_TOPICS = ["hp", "game", "demo"];
const TOPIC_NAMES: Record<string, string> = {
	"php": "PHP",
	"7drl": "7DRL",
	"javascript": "JavaScript"
}

function capitalize(word: string) { return `${word.charAt(0).toUpperCase()}${word.substring(1)}`; }

function translateTopic(t: string) {
	return TOPIC_NAMES[t] || t.replace(/-/g, " ").split(" ").map(capitalize).join(" ");
}

function fixTopics(item: MightHaveTopics) {
	for (let p in item) {
		if (p == "topics") {
			item[p] = (item[p] || [])
				.filter(t => !REMOVE_TOPICS.includes(t))
				.map(translateTopic);
			continue;
		}
		let value = item[p];
		if (typeof(value) == "object") { fixTopics(value); }
	}
}

if (Deno.args.length < 1) { throw new Error("Pass template name as an argument"); }

const template = readFile(Deno.args[0]);
const stdin = await Deno.readAll(Deno.stdin);
const data: MightHaveTopics[] = JSON.parse(td.decode(stdin));
data.forEach(fixTopics);

function readFile(name: string) {
	const buffer = Deno.readFileSync(name);
	return td.decode(buffer);
}

const result = mustache.render(template, data);
Deno.stdout.writeSync(te.encode(result));
