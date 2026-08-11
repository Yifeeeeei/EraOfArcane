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
                        "https://steamcommunity.com/sharedfiles/filedetails/?id=3155709993",
                    );
                },
            },
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
            EmeraldImmortality: {
                name: "翡翠永生",
                function: function () {
                    jumpHere("htmls/EmeraldImmortality.html");
                },
            },
            BlackPineDinner: {
                name: "黑松家的晚宴",
                function: function () {
                    jumpHere("htmls/BlackPineDinner.html");
                },
            },
            PureChild: {
                name: "纯净之子",
                function: function () {
                    jumpHere("htmls/PureChild.html");
                },
            },
            RavenAndSparrow: {
                name: "鸦与雀",
                function: function () {
                    jumpHere("htmls/RavenAndSparrow.html");
                },
            },
            AbyssReturner: {
                name: "深渊归来者",
                function: function () {
                    jumpHere("htmls/AbyssReturner.html");
                },
            },
            WinterNeedsNoKing: {
                name: "凛冬不需要国王",
                function: function () {
                    jumpHere("htmls/WinterNeedsNoKing.html");
                },
            },
            EmptyThrone: {
                name: "王座无人",
                function: function () {
                    jumpHere("htmls/EmptyThrone.html");
                },
            },
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
