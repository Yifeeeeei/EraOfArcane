let baseDiv;
let frameDiv;
let docDiv;
const composerBase = "https://yifeeeeei.github.io/ArcaneComposer/";

function deactiveElement(element) {
    if (element.classList.contains("active")) {
        element.classList.remove("active");
    }
}
function activeElement(element) {
    if (!element.classList.contains("active")) {
        element.classList.add("active");
    }
}

function showBase() {
    activeElement(baseDiv);
    deactiveElement(frameDiv);
    deactiveElement(docDiv);
    closeSubMenus();
}

function showFrame() {
    deactiveElement(baseDiv);
    activeElement(frameDiv);
    deactiveElement(docDiv);
}

function showDoc() {
    activeElement(docDiv);
}

function setBackgroundImage() {
    const bgDiv = document.getElementById("background_img");
    const bgImageList = [
        "url('./images/none.jpg')",
        "url('./images/air.webp')",
        "url('./images/dark.webp')",
        "url('./images/light.webp')",
        "url('./images/fire.webp')",
        "url('./images/earth.webp')",
        "url('./images/water.webp')",
    ];

    bgDiv.style.backgroundImage =
        bgImageList[Math.floor(Math.random() * bgImageList.length)];
}

function init() {
    baseDiv = document.getElementById("base");
    frameDiv = document.getElementById("frame");
    docDiv = document.getElementById("doc");
    setBackgroundImage();
    showBase();
    prepareMenuItems();
}

function loadDoc(title, content) {
    const docTitle = document.getElementById("doc-title");
    const docContent = document.getElementById("doc-content");
    docTitle.textContent = title;
    docContent.innerHTML = content;
    showDoc();
}

function loadFrame(path) {
    const frame = document.getElementById("iframe");
    frame.src = path;
    showFrame();
}

function jumpToOther(path) {
    // open path in new tab
    window.open(path, "_blank");
}

function jumpHere(path) {
    // open path in current tab
    window.location.href = path;
}

function backToBase() {
    showBase();
}

function prepareMenuItems() {
    const baseMenu = document.getElementById("base-menu");

    for (const key in configs) {
        const group = document.createElement("div");
        group.classList.add("menu-group");

        const item = document.createElement("button");
        item.type = "button";
        item.classList.add("menu-item");
        item.textContent = configs[key].name;
        item.onclick = configs[key].function;
        item.id = configs[key].id;
        group.appendChild(item);

        if (configs[key].subItems) {
            const subMenu = document.createElement("ul");
            subMenu.id = `${key}-submenu`;
            subMenu.classList.add("submenu");
            item.setAttribute("aria-expanded", "false");
            item.setAttribute("aria-controls", subMenu.id);

            for (const subKey in configs[key].subItems) {
                const subItem = document.createElement("li");
                subItem.classList.add("menu-subitem");
                subItem.textContent = configs[key].subItems[subKey].name;
                subItem.onclick = function (event) {
                    event.stopPropagation();
                    configs[key].subItems[subKey].function();
                };
                subMenu.appendChild(subItem);
            }
            group.appendChild(subMenu);
        }

        baseMenu.appendChild(group);
    }
}

function toggleSubMenu(subMenuId) {
    const subMenu = document.getElementById(subMenuId);
    const parentItem = document.querySelector(`[aria-controls="${subMenuId}"]`);

    document.querySelectorAll(".submenu").forEach(function (menu) {
        if (menu.id !== subMenuId) {
            menu.classList.remove("show");
            document
                .querySelector(`[aria-controls="${menu.id}"]`)
                ?.setAttribute("aria-expanded", "false");
        }
    });

    if (subMenu.classList.contains("show")) {
        subMenu.classList.remove("show");
        parentItem?.setAttribute("aria-expanded", "false");
    } else {
        subMenu.classList.add("show");
        parentItem?.setAttribute("aria-expanded", "true");
    }
}

function closeSubMenus() {
    document.querySelectorAll(".submenu").forEach(function (menu) {
        menu.classList.remove("show");
    });
    document.querySelectorAll("[aria-expanded]").forEach(function (item) {
        item.setAttribute("aria-expanded", "false");
    });
}

init();
