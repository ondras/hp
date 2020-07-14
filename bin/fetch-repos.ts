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

async function repos(username: string, type="all") {
	let urlObj = new URL(`https://api.github.com/users/${username}/repos`);
	urlObj.searchParams.set("type", type);
	urlObj.searchParams.set("sort", "updated");

	let url = urlObj.href;
	let repos: Repo[] = [];
	while (url) {
		let data = await call(url);
		repos = repos.concat(data.json);
		url = data.links.next;
	}
	return repos;
}

function topicFilter(topic: string) {
	return (repo: Repo) => repo.topics.includes(topic);
}

const all = await repos("ondras");
const filtered = all.filter(topicFilter("hp"));
const str = JSON.stringify(filtered);
Deno.stdout.writeSync(te.encode(str));

Deno.stderr.writeSync(te.encode(`Fetched ${all.length} repos, wrote ${filtered.length}\n`));
