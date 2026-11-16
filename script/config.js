const configs = {
    deckBuild: {
        name: "卡牌一览",
        id: "deckBuild",
        function: function () {
            jumpToOther("https://yifeeeeei.github.io/ArcaneComposer/");
        },
    },
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

            ttsMod: {
                name: "TTS模组",
                function: function () {
                    jumpToOther(
                        "https://steamcommunity.com/sharedfiles/filedetails/?id=3155709993",
                    );
                },
            },
        },
    },
    story: {
        name: "设定集",
        id: "story",
        function: function () {
            jumpHere("world/");
        },
    },
    joinUs: {
        name: "加入我们",
        function: function () {
            const content =
                "<img src='images/QRCode.JPG' alt='加入我们二维码' class='qr-code'/>";
            loadDoc("加入我们", content);
        },
    },
};
