var baseDiv;
var frameDiv;
var docDiv;
var composerBase = "https://yifeeeeei.github.io/ArcaneComposer/";

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
}

function showFrame() {
    deactiveElement(baseDiv);
    activeElement(frameDiv);
    deactiveElement(docDiv);
}

function showDoc() {
    // deactiveElement(baseDiv);
    // deactiveElement(frameDiv);
    activeElement(docDiv);
}

function setBackgroundImage() {
    var bgDiv = document.getElementById("background_img");
    // set the background image
    bgImageList = [
        "url('./images/none.jpg')",
        "url('./images/air.jpg')",
        "url('./images/dark.webp')",
        "url('./images/light.webp')",
        "url('./images/fire.png')",
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
    console.log(baseDiv);
    console.log(frameDiv);
    console.log(docDiv);
    setBackgroundImage();
    showBase();
    prepareMenuItems();
}

function showPremade(name) {
    var title = premadeDoc[name].title;
    var content = "";
    for (var i = 0; i < premadeDoc[name].content.length; i++) {
        content += "<p>" + premadeDoc[name].content[i] + "</p>";
    }
    content += `<a target="_blank" href="${
        composerBase + "?code=" + premadeDoc[name].code
    }">在ArcaneComposer查看</a>`;
    loadDoc(title, content);
}

function loadDoc(title, content) {
    var docTitle = document.getElementById("doc-title");
    var docContent = document.getElementById("doc-content");
    docTitle.innerHTML = title;
    docContent.innerHTML = content;
    showDoc();
}

function loadFrame(path) {
    var frame = document.getElementById("iframe");
    frame.src = path;
    showFrame();
    console.log("load frame: " + path + frame.src);
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

function jumpToPremade(deckCode) {
    jumpToOther("https://yifeeeeei.github.io/ArcaneComposer/?code=" + deckCode);
}

function prepareMenuItems() {
    // id: {name: function:, subItems: {}}

    const baseMenu = document.getElementById("base-menu");

    // Create menu items
    for (const key in configs) {
        const item = document.createElement("ul");
        item.classList.add("menu-item");
        item.innerHTML = configs[key].name;
        item.onclick = configs[key].function;
        item.id = configs[key].id;
        baseMenu.appendChild(item);

        // If there are sub-items, create a submenu
        if (configs[key].subItems) {
            const subMenu = document.createElement("ul");
            subMenu.id = `${key}-submenu`;
            subMenu.classList.add("submenu");

            for (const subKey in configs[key].subItems) {
                const subItem = document.createElement("li");
                subItem.classList.add("menu-subitem");
                subItem.innerHTML = configs[key].subItems[subKey].name;
                subItem.onclick = configs[key].subItems[subKey].function;
                subMenu.appendChild(subItem);
            }
            item.appendChild(subMenu);
        }
    }
}

function toggleSubMenu(subMenuId) {
    const subMenu = document.getElementById(subMenuId);
    if (subMenu.classList.contains("show")) {
        subMenu.classList.remove("show"); // Hide submenu
    } else {
        subMenu.classList.add("show"); // Show submenu
    }
}
function getPremadeContent() {
    allContents = "";
    for (const key in premadeDoc) {
        docConts = "";
        for (const oneCont of premadeDoc[key].content) {
            docConts += "<p>" + oneCont + "</p>";
        }
        content =
            "<div>" +
            "<p>" +
            "<strong>" +
            premadeDoc[key].title +
            "</strong>" +
            "</p>" +
            docConts +
            `<a target="_blank" href="${
                composerBase + "?code=" + premadeDoc[key].code
            }">在ArcaneComposer查看</a>` +
            "</div>";
        allContents += content;
    }

    // add some blank rows to the end

    for (var i = 0; i < 2; i++) {
        allContents += "<p>&nbsp;</p>";
    }

    return allContents;
}

init();
