"use strict";

const main = document.getElementById("content");
const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
const kindNames = {
  city: "城市与港口",
  domain: "领地与势力",
  mountain: "山脉",
  river: "河流",
  forest: "林地",
};
let data;
let mapState = { region: null, zoom: 1, x: 0, y: 0 };
let drag;
let suppressClick = false;
let detailMapImage;
const detailMapURL = "assets/world-map-detail.webp";
const overviewMapURL = "assets/world-map-overview.webp";

function link(href, text, cls = "") {
  return `<a href="${esc(href)}"${cls ? ` class="${esc(cls)}"` : ""}>${esc(text)}</a>`;
}
function storyLinks(ids) {
  return ids
    .map((id) => {
      const s = data.stories.find((v) => v.id === id);
      return link(s.url, s.title + " ↗");
    })
    .join("");
}
function heading(number, title, intro, extra = "") {
  return `<div class="section-head"><div><span class="kicker">${number}</span><h1>${esc(title)}</h1><p class="intro">${esc(intro)}</p></div>${extra}</div>`;
}
function chapterCard(ch, i) {
  return `<a href="#lore/${ch.id}" class="chapter-card"><span class="chapter-no">${roman[i]}</span><span class="corner" aria-hidden="true">↗</span><h2>${esc(ch.title)}</h2><p>${esc(ch.subtitle)}</p></a>`;
}
function renderLore(id) {
  const ch = data.chapters.find((v) => v.id === id);
  if (!ch) {
    return `<section class="cover"><div class="cover-copy"><span class="kicker">THE BOOK OF ARCANE</span><h1>世界之书</h1><p class="intro">在穹顶之下，山海有自己的年岁。<br>梦的另一侧，仍有尚未成形的故乡。<br>神与巫师留下奇迹，众生在其间生活。</p>${link("#lore/origins", "从世界之初读起 →", "arrow-link")}</div><span class="cover-number" aria-hidden="true">I</span></section><section aria-label="世界基础设定" class="chapter-grid">${data.chapters.map(chapterCard).join("")}</section><div class="bottom-invites"><section class="invite invite-map"><span class="kicker">ATLAS OF THE KNOWN WORLD</span><h2>沿海岸，向远方</h2><p>从凯尔特的河谷到南岭的炉火，从云上城到岩壁深处，循着舆图认识各地的生活。</p>${link("#atlas", "翻开山海舆图 →", "arrow-link")}</section><section class="invite"><span class="kicker">LIVES ON THE ROAD</span><h2>一个人的旅程</h2><p>从安德鲁、伊芙和灰烬身旁出发，走向各不相同的道路。</p>${link("#people", "认识行旅之人 →", "arrow-link")}</section></div>`;
  }
  const index = data.chapters.indexOf(ch);
  return `<div class="reading-layout"><aside class="chapter-menu"><p class="menu-heading">世界之书 · 卷目</p><nav aria-label="设定章节">${data.chapters.map((c, i) => `<a href="#lore/${c.id}" ${c.id === ch.id ? 'aria-current="page"' : ""}><span>${roman[i]}</span>${esc(c.title)}</a>`).join("")}</nav></aside><div><a class="chapter-back" href="#lore">← 世界之书</a><article class="prose"><span class="kicker">${roman[index]} · ${esc(ch.subtitle)}</span>${ch.html}</article><nav class="chapter-next" aria-label="前后章节">${index ? link("#lore/" + data.chapters[index - 1].id, "← " + data.chapters[index - 1].title) : link("#lore", "← 返回卷首")}${index < data.chapters.length - 1 ? link("#lore/" + data.chapters[index + 1].id, data.chapters[index + 1].title + " →") : link("#atlas", "山海舆图 →")}</nav></div></div>`;
}

function featureRoute(region, place) {
  return "#atlas/" + region + (place ? "/" + place : "");
}
function mapSVG(region) {
  const bounds = region ? region.bounds : [0, 0, 1536, 1024];
  const font = region ? Math.max(7.5, bounds[2] / 43) : 22;
  const items = region
    ? region.features
    : data.regions.map((r) => ({
        id: r.id,
        name: r.name,
        x: r.label[0],
        y: r.label[1],
      }));
  const marks = items
    .map((p) => {
      const edge = region && p.x > bounds[0] + bounds[2] * 0.78;
      const selected = region && location.hash.split("/")[2] === p.id;
      const href = region ? featureRoute(region.id, p.id) : featureRoute(p.id);
      return `<a href="${href}" class="landmark ${region ? "" : "world-name"} ${selected ? "selected" : ""}" aria-label="${region ? "查看" : "进入"}${esc(p.name)}" data-kind="${p.kind || "region"}"><title>${esc(p.name)}</title><g transform="translate(${p.x} ${p.y})"><circle class="halo" r="${region ? font * 0.3 : 6}"/><text x="${region ? (edge ? -font * 0.65 : font * 0.65) : 0}" y="${region ? font * 0.27 : -14}" text-anchor="${region ? (edge ? "end" : "start") : "middle"}" font-size="${font}" style="stroke-width:${region ? font * 0.13 : 4}">${esc(p.name)}</text></g></a>`;
    })
    .join("");
  return `<svg viewBox="${bounds.join(" ")}" data-bounds="${bounds.join(" ")}" role="group" aria-label="${region ? esc(region.name) + "详图" : "穹世界总图"}" xmlns="http://www.w3.org/2000/svg"><title>${region ? esc(region.name) + "详图" : "穹世界总图"}</title><desc>${region ? "可选择城市、领地、山脉、河流与林地。" : "选择一片大陆或群岛，进入当地详图。"}</desc><image href="${overviewMapURL}" width="1536" height="1024"/>${marks}</svg>`;
}
function regionPanel(region, place) {
  if (!region)
    return `<span class="kicker">THE KNOWN WORLD</span><h2>穹世界</h2><p>海路把十三片大陆与群岛连在一起。选择名字，沿着当地的山脉、河流与城市继续前行。</p><h3>从这里出发</h3><div class="panel-links">${link("#atlas/celtic", "凯尔特 →")}${link("#atlas/northg/cloud", "云霄城 →")}${link("#atlas/shawar/rock", "岩壁之国 →")}</div><h3>世界的另一侧</h3><p>西北的幻冰与东南的幽暗海界，是远航者谨慎绕行的地方。更远的门，通向幻创之乡。</p>${link("#lore/borders", "阅读世界的边境 →", "arrow-link")}`;
  if (place)
    return `<span class="kicker">${esc(region.name)} · ${kindNames[place.kind]}</span><h2>${esc(place.name)}</h2><p>${esc(place.text)}</p><div class="panel-links">${link("#atlas/" + region.id, "← " + region.name)}${place.person ? link("#people/" + place.person, "认识相关人物 →") : ""}${place.story ? storyLinks([place.story]) : ""}</div><hr class="rule"><h3>${esc(region.lead)}</h3><p>${esc(region.intro)}</p>`;
  return `<span class="kicker">山海舆图 · 地域志</span><h2>${esc(region.name)}</h2><p>${esc(region.intro)}</p><h3>此地的生活</h3><p>${esc(region.life)}</p><h3>诸邦与势力</h3><div class="tags">${region.factions.map((f) => "<span>" + esc(f) + "</span>").join("")}</div>${region.people.length ? `<h3>留在此地的名字</h3><p>${region.people.map(esc).join(" · ")}</p>` : ""}${region.stories.length ? `<h3>故事</h3><div class="panel-links">${storyLinks(region.stories)}</div>` : ""}`;
}
function renderAtlas(id, placeID) {
  const region = data.regions.find((r) => r.id === id);
  const place = region?.features.find((p) => p.id === placeID);
  if (mapState.region !== (region?.id || null))
    mapState = { region: region?.id || null, zoom: 1, x: 0, y: 0 };
  return (
    heading(
      "II · ATLAS",
      "山海舆图",
      region ? region.lead : "沿着海岸、林地与航路，走进不同的故乡。",
    ) +
    `<p class="breadcrumbs">${link("#atlas", "穹世界")}${region ? "<span>›</span>" + link("#atlas/" + region.id, region.name) : ""}${place ? "<span>›</span>" + esc(place.name) : ""}</p><div class="atlas-layout"><div class="map-column"><div class="map-toolbar"><span>${region ? esc(region.name) + " · 详图" : "世界总图 · 大陆与群岛"}</span><div class="tools"><button id="zoom-out" aria-label="缩小地图">−</button><button id="zoom-in" aria-label="放大地图">＋</button><button id="zoom-reset" aria-label="复原地图">复原</button></div></div><div class="map-viewport" id="map-viewport"><div class="map-stage" id="map-stage">${mapSVG(region)}</div><span class="map-watermark">ERA OF ARCANE · ATLAS</span><span class="map-tip">${region ? "点击地标阅读 · 放大后可拖动" : "点击大陆或群岛进入详图"}</span></div></div><aside id="place-panel" class="place-panel" aria-label="地域与地点介绍">${regionPanel(region, place)}</aside></div><section class="atlas-index" aria-label="地图文字目录"><div class="index-tools"><label for="place-search">${region ? "地点目录" : "大陆目录"}</label><input id="place-search" type="search" autocomplete="off" placeholder="${region ? "搜索地点、人物、家族" : "搜索大陆、群岛、人物"}" aria-label="检索地图目录">${
      region
        ? `<select id="place-kind" aria-label="地点类型"><option value="">全部地点</option>${Object.entries(
            kindNames,
          )
            .map(([id, name]) => `<option value="${id}">${name}</option>`)
            .join("")}</select>`
        : ""
    }<output id="place-count" aria-live="polite"></output></div><div id="place-list" class="place-list"></div></section>`
  );
}
function filterPlaces() {
  const input = document.getElementById("place-search");
  if (!input) return;
  const q = input.value.trim().toLowerCase(),
    kind = document.getElementById("place-kind")?.value;
  const region = data.regions.find((r) => r.id === mapState.region);
  const items = region ? region.features : data.regions;
  const visible = items.filter(
    (p) =>
      (!kind || p.kind === kind) &&
      [p.name, p.text, p.intro, ...(p.people || []), ...(p.factions || [])]
        .join(" ")
        .toLowerCase()
        .includes(q),
  );
  document.getElementById("place-list").innerHTML = visible.length
    ? visible
        .map((p) =>
          link(
            featureRoute(region ? region.id : p.id, region ? p.id : null),
            p.name,
          ),
        )
        .join("")
    : '<p class="muted">没有找到这个名字。换一个词再找找。</p>';
  document.getElementById("place-count").textContent =
    `${visible.length} / ${items.length}`;
  document.querySelectorAll(".landmark").forEach((el) => {
    const id = el.getAttribute("href").split("/").pop();
    el.style.opacity = visible.some((p) => p.id === id) ? "1" : ".2";
  });
}
function updateMapImage() {
  const svg = document.querySelector("#map-stage svg");
  const viewport = document.getElementById("map-viewport");
  if (!svg || !viewport) return;
  const needsDetail =
    mapState.region ||
    mapState.zoom > 1 ||
    viewport.clientWidth * window.devicePixelRatio > 1536;
  const image = svg.querySelector("image");
  if (!needsDetail) {
    image.setAttribute("href", overviewMapURL);
    return;
  }
  if (detailMapImage?.complete && detailMapImage.naturalWidth) {
    image.setAttribute("href", detailMapURL);
    return;
  }
  if (!detailMapImage) {
    // Keep the overview visible until the larger atlas has decoded.
    detailMapImage = new Image();
    detailMapImage.onload = updateMapImage;
    detailMapImage.src = detailMapURL;
  }
}
function transformMap() {
  const stage = document.getElementById("map-stage"),
    viewport = document.getElementById("map-viewport");
  if (!stage) return;
  const svg = stage.querySelector("svg");
  const [left, top, baseWidth, baseHeight] = svg.dataset.bounds
    .split(" ")
    .map(Number);
  if (!viewport.clientWidth || !viewport.clientHeight) return;
  const fit = Math.min(
    viewport.clientWidth / baseWidth,
    viewport.clientHeight / baseHeight,
  );
  const frameWidth = viewport.clientWidth / fit,
    frameHeight = viewport.clientHeight / fit;
  const width = frameWidth / mapState.zoom,
    height = frameHeight / mapState.zoom;
  const limitX = (frameWidth - width) / 2,
    limitY = (frameHeight - height) / 2;
  mapState.x = Math.max(-limitX, Math.min(limitX, mapState.x));
  mapState.y = Math.max(-limitY, Math.min(limitY, mapState.y));
  // Change the SVG camera so text is drawn at its final size, rather than
  // enlarging a browser-composited bitmap of the complete map layer.
  svg.setAttribute(
    "viewBox",
    [
      left + (baseWidth - width) / 2 - mapState.x,
      top + (baseHeight - height) / 2 - mapState.y,
      width,
      height,
    ].join(" "),
  );
  viewport.style.touchAction = mapState.zoom > 1 ? "none" : "pan-y";
  viewport.style.cursor = mapState.zoom > 1 ? "grab" : "default";
  document.getElementById("zoom-out").disabled = mapState.zoom <= 1;
  document.getElementById("zoom-in").disabled = mapState.zoom >= 3;
  updateMapImage();
}
function setupAtlas() {
  document
    .getElementById("place-search")
    .addEventListener("input", filterPlaces);
  document
    .getElementById("place-kind")
    ?.addEventListener("change", filterPlaces);
  filterPlaces();
  transformMap();
  document.getElementById("zoom-in").onclick = () => {
    mapState.zoom = Math.min(3, Math.round((mapState.zoom + 0.4) * 10) / 10);
    transformMap();
  };
  document.getElementById("zoom-out").onclick = () => {
    mapState.zoom = Math.max(1, Math.round((mapState.zoom - 0.4) * 10) / 10);
    transformMap();
  };
  document.getElementById("zoom-reset").onclick = () => {
    mapState.zoom = 1;
    mapState.x = mapState.y = 0;
    transformMap();
  };
  const view = document.getElementById("map-viewport");
  view.addEventListener("pointerdown", (ev) => {
    if (mapState.zoom <= 1 || ev.button !== 0) return;
    const matrix = view.querySelector("svg").getScreenCTM();
    if (!matrix) return;
    drag = {
      id: ev.pointerId,
      x: ev.clientX,
      y: ev.clientY,
      ox: mapState.x,
      oy: mapState.y,
      unitsPerPixel: 1 / matrix.a,
      moved: false,
    };
  });
  view.addEventListener("pointermove", (ev) => {
    if (!drag || drag.id !== ev.pointerId) return;
    const dx = ev.clientX - drag.x,
      dy = ev.clientY - drag.y;
    if (Math.hypot(dx, dy) > 5) {
      drag.moved = true;
      if (!view.hasPointerCapture(ev.pointerId))
        view.setPointerCapture(ev.pointerId);
      mapState.x = drag.ox + dx * drag.unitsPerPixel;
      mapState.y = drag.oy + dy * drag.unitsPerPixel;
      transformMap();
    }
  });
  const end = (ev) => {
    if (!drag || drag.id !== ev.pointerId) return;
    suppressClick = drag.moved;
    drag = null;
    if (view.hasPointerCapture(ev.pointerId))
      view.releasePointerCapture(ev.pointerId);
    if (suppressClick)
      setTimeout(() => {
        suppressClick = false;
      }, 0);
  };
  view.addEventListener("pointerup", end);
  view.addEventListener("pointercancel", end);
  view.addEventListener(
    "click",
    (ev) => {
      if (suppressClick) {
        ev.preventDefault();
        ev.stopPropagation();
      }
    },
    true,
  );
}

function eraIllustration(era, className, decorative = false) {
  const art = era.art;
  return `<img class="${className}" src="assets/eras/${esc(art.image)}" alt="${decorative ? "" : esc(art.alt)}" width="${art.width}" height="${art.height}" loading="${decorative ? "lazy" : "eager"}" decoding="async" style="object-position:${art.position[0]}% ${art.position[1]}%">`;
}
function renderChronicle(eraID, personID) {
  const era = data.eras.find((e) => e.id === eraID) || data.eras[0];
  const index = data.eras.indexOf(era),
    person = data.people.find((p) => p.id === personID);
  const events = data.events.filter(
    (e) => e.era === era.id && (!person || e.person === person.id),
  );
  return (
    heading("III · CHRONICLE", "往世纪事", "翻过一个时代，再听一段远行。") +
    `<nav class="era-tabs" aria-label="时代">${data.eras.map((e, i) => `<a href="#chronicle/${e.id}${person ? "/" + person.id : ""}" ${e.id === era.id ? 'aria-current="page"' : ""}>${eraIllustration(e, "era-tab-art", true)}<span class="era-tab-copy"><small>${roman[i]} · ${esc(e.subtitle)}</small><strong>${esc(e.title)}</strong></span></a>`).join("")}</nav><label for="chronicle-person" class="muted">翻阅： </label><select id="chronicle-person"><option value="">世界与人物</option>${data.people.map((p) => `<option value="${p.id}" ${p.id === person?.id ? "selected" : ""}>${esc(p.name)}</option>`).join("")}</select><div class="chronicle-lead">${eraIllustration(era, "era-art")}<div class="era-copy"><h2>${esc(era.title)}</h2><p>${esc(era.intro)}</p></div><div class="era-turn"><button id="era-prev" ${index === 0 ? "disabled" : ""} aria-label="前一个时代">←</button><button id="era-next" ${index === data.eras.length - 1 ? "disabled" : ""} aria-label="后一个时代">→</button></div></div><section class="event-list" aria-label="时代事件">${events.length ? events.map((e) => `<article class="event"><span class="when">${esc(e.when)}</span><h3>${esc(e.title)}</h3><p>${esc(e.text)}</p>${e.chapter ? link("#lore/" + e.chapter, "阅读设定 →") : ""}${e.region ? link(featureRoute(e.region, e.feature), "在地图中查看 →") : ""}${e.person ? link("#people/" + e.person, "人物足迹 →") : ""}${e.story ? storyLinks([e.story]) : ""}</article>`).join("") : `<article class="event"><h3>这位旅人尚未启程</h3><p>他的足迹留在更晚的时代。</p>${link("#chronicle/voyages/" + person.id, "翻至海路与远行 →")}</article>`}</section>`
  );
}
function setupChronicle(eraID, personID) {
  const era = data.eras.find((e) => e.id === eraID) || data.eras[0],
    index = data.eras.indexOf(era);
  const suffix =
    personID && data.people.some((p) => p.id === personID)
      ? "/" + personID
      : "";
  document.getElementById("era-prev").onclick = () => {
    if (index > 0)
      location.hash = "#chronicle/" + data.eras[index - 1].id + suffix;
  };
  document.getElementById("era-next").onclick = () => {
    if (index < data.eras.length - 1)
      location.hash = "#chronicle/" + data.eras[index + 1].id + suffix;
  };
  document.getElementById("chronicle-person").onchange = (ev) => {
    location.hash =
      "#chronicle/" +
      (ev.target.value ? "voyages" : era.id) +
      (ev.target.value ? "/" + ev.target.value : "");
  };
}
function renderPeople(id) {
  const p = data.people.find((v) => v.id === id);
  if (!p)
    return (
      heading(
        "IV · LIVES",
        "行旅之人",
        "有人循着风远行，有人在伤者身旁停下，也有人走出了王冠的影子。",
      ) +
      `<section class="people-grid">${data.people.map((p) => `<a class="person-card" href="#people/${p.id}"><img src="assets/people/${p.image}" alt="${esc(p.name)}的原画"><div class="person-copy"><span class="kicker">${esc(p.title)}</span><h2>${esc(p.name)}</h2><p>${esc(p.lead)}</p><span class="arrow-link">循着足迹 →</span></div></a>`).join("")}</section>`
    );
  return `<a href="#people" class="chapter-back">← 行旅之人</a><div class="person-layout"><aside class="person-art"><img src="assets/people/${p.image}" alt="${esc(p.name)}的原画"></aside><article class="person-bio"><span class="kicker">${esc(p.title)}</span><h1>${esc(p.name)}</h1><p class="intro">${esc(p.intro)}</p><div class="life-road">${p.steps.map((s) => `<section class="life-step"><small>${esc(s[0])}</small><h3>${esc(s[1])}</h3><p>${esc(s[2])}</p></section>`).join("")}</div><div class="panel-links">${link(featureRoute(p.region, p.feature), "在地图上寻找 →")}${link("#chronicle/voyages/" + p.id, "翻阅人物纪事 →")}${storyLinks(p.stories)}</div></article></div>`;
}
function renderStories() {
  return (
    heading(
      "V · STORIES",
      "故事长廊",
      "一扇门，一次重逢，或一盏留到破晓的灯。",
    ) +
    `<div class="story-search"><label for="story-search" class="muted">寻找一篇故事</label><br><input id="story-search" type="search" placeholder="篇名、人物或地点" autocomplete="off"></div><section class="story-grid" id="story-grid" aria-label="故事目录"></section><p id="story-count" class="muted" aria-live="polite"></p>`
  );
}
function filterStories() {
  const q = document.getElementById("story-search").value.trim().toLowerCase();
  const stories = data.stories.filter((s) => {
    const region = data.regions.find((r) => r.id === s.region);
    const related = data.people
      .filter((p) => p.stories.includes(s.id))
      .map((p) => p.name)
      .join(" ");
    return [s.title, s.summary, region?.name, related, s.art?.card_name]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });
  document.getElementById("story-grid").innerHTML = stories
    .map(
      (s) =>
        `<article class="story-card"><a class="story-art" href="${esc(s.url)}" tabindex="-1" aria-hidden="true"><img src="assets/stories/${esc(s.art.image)}" alt="" width="${s.art.width}" height="${s.art.height}" loading="lazy" decoding="async" style="object-position:${s.art.position[0]}% ${s.art.position[1]}%"></a><div class="story-copy"><span class="story-no">TALE ${String(data.stories.indexOf(s) + 1).padStart(2, "0")}</span><h2>${esc(s.title)}</h2><p>${esc(s.summary)}</p><div class="story-actions">${link(s.url, "阅读故事 ↗")}${s.region ? link("#atlas/" + s.region, "故事中的地方 →") : ""}</div></div></article>`,
    )
    .join("");
  document.getElementById("story-count").textContent = stories.length
    ? `${stories.length} 篇故事`
    : "没有找到这篇故事。换一个名字试试。";
}

function render() {
  drag = null;
  const [raw, id, detail] = location.hash.slice(1).split("/");
  const tab = ["lore", "atlas", "chronicle", "people", "stories"].includes(raw)
    ? raw
    : "lore";
  const previousScroll = window.scrollY;
  const oldTab = main.dataset.tab,
    oldRegion = main.dataset.region;
  main.dataset.tab = tab;
  main.dataset.region = tab === "atlas" ? id || "" : "";
  document.querySelectorAll("[data-tab]").forEach((el) => {
    if (el.dataset.tab === tab) el.setAttribute("aria-current", "page");
    else el.removeAttribute("aria-current");
  });
  if (tab === "lore") main.innerHTML = renderLore(id);
  if (tab === "atlas") {
    main.innerHTML = renderAtlas(id, detail);
    setupAtlas();
  }
  if (tab === "chronicle") {
    main.innerHTML = renderChronicle(id, detail);
    setupChronicle(id, detail);
  }
  if (tab === "people") main.innerHTML = renderPeople(id);
  if (tab === "stories") {
    main.innerHTML = renderStories();
    document
      .getElementById("story-search")
      .addEventListener("input", filterStories);
    filterStories();
  }
  const titles = {
    lore: "世界之书",
    atlas: "山海舆图",
    chronicle: "往世纪事",
    people: "行旅之人",
    stories: "故事长廊",
  };
  const selected =
    tab === "lore"
      ? data.chapters.find((c) => c.id === id)
      : tab === "atlas"
        ? data.regions.find((r) => r.id === id)
        : tab === "people"
          ? data.people.find((p) => p.id === id)
          : null;
  document.title =
    (selected?.title || selected?.name || titles[tab]) + " · 奥术纪元设定集";
  main.focus({ preventScroll: true });
  window.scrollTo({
    top:
      tab === "atlas" && oldTab === "atlas" && oldRegion === (id || "")
        ? previousScroll
        : 0,
    behavior: "instant",
  });
}
async function start() {
  document.querySelector(".skip").onclick = (ev) => {
    ev.preventDefault();
    main.focus({ preventScroll: true });
    main.scrollIntoView({ behavior: "instant" });
  };
  if (new URLSearchParams(location.search).get("embed") === "1")
    document.body.classList.add("embedded");
  try {
    const response = await fetch("data.json?v=era-gallery-20261116");
    if (!response.ok) throw new Error("Setting data unavailable");
    data = await response.json();
    render();
    window.addEventListener("hashchange", render);
    window.addEventListener("resize", () => {
      if (document.getElementById("map-stage")) transformMap();
    });
  } catch (err) {
    main.innerHTML =
      '<section class="load-error"><h1>书页暂时未能展开</h1><p>请稍后重试，或先回到奥术纪元主页。</p><button id="retry-load">重新打开</button><p><a href="../">返回主页 →</a></p></section>';
    document.getElementById("retry-load").onclick = () => {
      main.innerHTML = '<p class="loading" role="status">正在翻开书页……</p>';
      start();
    };
  }
}
start();
