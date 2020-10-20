import { Repo } from "./repo.d.ts";


const te = new TextEncoder();

function parseLinks(headers: Headers) {
	let links: Record<string, string> = {};
	let link = headers.get("link");
	if (link) {
		link.split(",").forEach(link => {
			const rel = (link.match(/rel="(.*?)"/) || [])[1];
			const url = (link.match(/<(.*?)>/) || [])[1];
			links[rel] = url;
		});
	}
	return links;
}

async function call(url: string) {
	const token = Deno.env.get("GITHUB_TOKEN");
	const headers = {
		"Accept": "application/vnd.github.mercy-preview+json",
		"Authorization": `token ${token}`
	};
	const response = await fetch(url, {headers});
	if (!response.ok) { throw new Error(response.statusText); }

	const links = parseLinks(response.headers);
	const json = await response.json();

	return {json, links};
}

async function repos(username: string) {
	let urlObj = new URL(`https://api.github.com/users/${username}/repos`);
	urlObj.searchParams.set("visibility", "public");
	urlObj.searchParams.set("sort", "pushed");

	let url = urlObj.href;
	let repos: Repo[] = [];
	while (url) {
		let data = await call(url);
		repos = repos.concat(data.json);
		url = data.links.next;
	}
	return repos;
}

function shouldInclude(repo: Repo) {
	if (repo.fork) {
		return repo.topics.includes("hp-include");
	} else {
		return !repo.topics.includes("hp-exclude");
	}
}

const all = await repos("ondras");
const filtered = all.filter(shouldInclude);
const str = JSON.stringify(filtered);
Deno.stdout.writeSync(te.encode(str));

Deno.stderr.writeSync(te.encode(`Fetched ${all.length} repos, wrote ${filtered.length}\n`));

let topics = new Map<string, number>();
filtered.forEach(repo => repo.topics.forEach(t => {
	topics.set(t, (topics.get(t) || 0)+1);
}));

let counts: string[] = [];
topics.forEach((count, topic) => counts.push(`${topic} (${count}x)`));

Deno.stderr.writeSync(te.encode(`Topics encountered: ${counts.join(", ")}\n`));
