let allTopics = [];

function processTopics(parent) {
	let current = "";

	function toggle(topic) {
		current = (topic == current ? "" : topic);
		[...parent.querySelectorAll("dd")].forEach(dd => {
			let missing = ![...dd.querySelectorAll(".topic")].some(node => node.textContent == current);
			if (current == "") { missing = false; }
			dd.previousElementSibling.classList.toggle("topic-missing", missing);
		});
	}

	[...parent.querySelectorAll(".topic")].forEach(node => {
		let topic = node.textContent;
		let index = allTopics.indexOf(topic);
		if (index == -1) {
			index = allTopics.length;
			allTopics.push(topic);
		}

		node.addEventListener("click", _ => toggle(topic));
		node.classList.add(`topic-${index}`);
	});
}

function assignColor(topic, index, all) {
	let bg = `hsl(${index/all.length}turn, 80%, 80%)`;
	[...document.querySelectorAll(`.topic-${index}`)].forEach(node => node.style.backgroundColor = bg);
}

[...document.querySelectorAll("section")].forEach(processTopics);
allTopics.forEach(assignColor);