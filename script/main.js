const community = document.getElementById("community");
const menu = document.getElementById("base-menu");

// 保留原主页每次打开时随机呈现的元素背景。
const backgrounds = ["none", "air", "dark", "light", "fire", "earth", "water"];
const background = backgrounds[Math.floor(Math.random() * backgrounds.length)];
document.body.style.setProperty("--home-art", `url("${new URL(`images/${background}.webp`, location.href).href}")`);

function makeLink(entry) {
    const link = document.createElement("a");
    link.href = entry.href;
    link.textContent = entry.name;
    if (new URL(entry.href, location.href).origin !== location.origin) {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    }
    return link;
}

for (const entry of configs) {
    if (entry.links) {
        const details = document.createElement("details");
        details.className = "tools-menu";
        const summary = document.createElement("summary");
        summary.textContent = entry.name;
        const links = document.createElement("div");
        links.className = "tools-links";
        links.append(...entry.links.map(makeLink));
        details.append(summary, links);
        menu.append(details);
    } else {
        const element = entry.href ? makeLink(entry) : document.createElement("button");
        element.className = "menu-link";
        element.textContent = entry.name;
        if (entry.action === "community") {
            element.type = "button";
            element.setAttribute("aria-haspopup", "dialog");
            element.addEventListener("click", () => community.showModal());
        }
        menu.append(element);
    }
}
const tools = menu.querySelector("details");
document.addEventListener("click", (event) => {
    if (!tools.contains(event.target)) tools.open = false;
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && tools.open) {
        tools.open = false;
        tools.querySelector("summary").focus();
    }
});
document.getElementById("close-community").addEventListener("click", () => community.close());
community.addEventListener("click", (event) => {
    if (event.target === community) {
        const bounds = community.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) community.close();
    }
});
