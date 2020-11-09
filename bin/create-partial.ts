import { Repo } from "./repo.d.ts";
import mustache from "https://unpkg.com/mustache@3.2.0/mustache.mjs";


const te = new TextEncoder();
const td = new TextDecoder();

const REMOVE_TOPICS = ["game", "util", "old", "hp-include", "hacktoberfest", "mindmap"];
const TOPIC_NAMES: Record<string, string> = {
	"7drl": "7DRL",
	"webgl": "WebGL",
	"websocket": "WebSocket",
	"3d-printing": "3D Printing"
}

function CMP(a: Repo, b: Repo) { return b.stargazers_count - a.stargazers_count; }
function capitalize(word: string) { return `${word.charAt(0).toUpperCase()}${word.substring(1)}`; }

function translateTopic(t: string) {
	return TOPIC_NAMES[t] || t.replace(/-/g, " ").split(" ").map(capitalize).join(" ");
}

function fixTopics(item: Repo) {
	if (item.topics) {
		item.topics = item.topics.filter(t => !REMOVE_TOPICS.includes(t)).map(translateTopic);
	}
}

if (Deno.args.length < 1) { throw new Error("Pass template name as an argument"); }

const template = readFile(Deno.args[0]);
const stdin = await Deno.readAll(Deno.stdin);
const data: Repo[] = JSON.parse(td.decode(stdin));
data.sort(CMP);
data.forEach(fixTopics);

function readFile(name: string) {
	const buffer = Deno.readFileSync(name);
	return td.decode(buffer);
}

const result = mustache.render(template, data);
Deno.stdout.writeSync(te.encode(result));
