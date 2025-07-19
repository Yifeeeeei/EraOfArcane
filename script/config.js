const configs = {
    guide: {
        name: "常用工具",
        id: "guide",

        function: function () {
            toggleSubMenu("guide-submenu"); // Toggle sub-items for this menu
        },
        subItems: {
            rules: {
                name: "游戏规则",
                function: function () {
                    jumpToOther("htmls/rules.html");
                },
            },
            video: {
                name: "视频教学",
                function: function () {
                    jumpToOther("https://www.bilibili.com/video/BV1jKzcYKEFi/");
                },
            },
            keywords: {
                name: "关键词一览",
                function: function () {
                    jumpToOther("htmls/Keywords.html");
                },
            },
            deckBuild: {
                name: "构筑卡组",
                function: function () {
                    jumpToOther("https://yifeeeeei.github.io/ArcaneComposer/");
                },
            },
            ttsMod: {
                name: "TTS模组",
                function: function () {
                    jumpToOther(
                        "https://steamcommunity.com/sharedfiles/filedetails/?id=3155709993"
                    );
                },
            },
        },
    },
    premade: {
        name: "预组卡组",
        id: "premade",
        function: function () {
            jumpToOther("htmls/prebuilts.html");
        },
    },
    story: {
        name: "背景故事",
        id: "story",
        function: function () {
            toggleSubMenu("story-submenu"); // Toggle sub-items for this menu
        },
        subItems: {
            mermaid: {
                name: "人鱼的故事",
                function: function () {
                    jumpHere("htmls/Mermaid.html");
                },
            },
            Fire: {
                name: "烈火之门派",
                function: function () {
                    jumpHere("htmls/Fires.html");
                },
            },
            Dawn: {
                name: "破晓",
                function: function () {
                    jumpHere("htmls/Dawn.html");
                },
            },
            Storm: {
                name: "风暴之城",
                function: function () {
                    jumpHere("htmls/Storm.html");
                },
            },
            Knight: {
                name: "光辉骑士",
                function: function () {
                    jumpHere("htmls/Knight.html");
                },
            },
            Moon: {
                name: "第九轮红月",
                function: function () {
                    jumpHere("htmls/Moon.html");
                },
            },
        },
    },
    joinUs: {
        name: "加入我们",
        function: function () {
            var content =
                "<img src='images/QRCode.JPG' alt='QRcode' style='height: 100%;'/>";
            loadDoc("加入我们", content);
        },
    },
};
