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
                    jumpToOther("htmls/rules/rules.html");
                },
            },
            video: {
                name: "视频教学",
                function: function () {
                    jumpToOther("https://www.bilibili.com/video/BV1jKzcYKEFi/");
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
            loadDoc("预组卡组", getPremadeContent()); // Toggle sub-items for this menu
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

const premadeDoc = {
    高难操作: {
        title: "高难操作——预见星辰",
        content: [
            "已经完全熟悉了这个游戏，想来点挑战性吗？来试试这套星象卡组，你很快就会大脑过载。你不仅需要考虑使用什么牌，还要考虑把牌放在什么位置，以及后续的回合应该怎么操作。以最快的速度刷新星象图，然后不断地流星坠落击败对手。",
            "这套卡组有许许多多的细节，不过更需要你实战来摸索。群星吞噬者、星界兽、幻术师这些重要的核心卡牌要最大化的利用，以及要谨慎考虑世界之眼的位置，大多数情况下你可移动不了那家伙。",
            "上手难度：★★★★★★",
            "卡组强度：★★★★★",
        ],
        code: "4311003 // 1021001 1021001 1211203 1311202 1321002 1321002 1321010 1321012 1321013 1321013 1321105 1321204 1321204 1321205 1321205 1321207 1321207 1321210 1321210 1321212 2221205 2221205 2321006 2321006 2321201 2321202 2321207 2321207 2321208 2321211 // 3221209 3311201 3321002 3321007 3321015 3321106 3321206 3321207 3321208 3321209 // 2001201 2001202 2001203 2001204 2001205 2001206 2001207 2001208",
    },
    运筹帷幄: {
        title: "运筹帷幄——暗影降临",
        content: [
            "运营是一切策略游戏的精髓，别看暗属性卡组的很多卡牌开始时并不强大，打出各种各样的组合之后总是有1+1>2的效果。前期通过黑松的技能争取发育，你的伙伴死亡只会更有价值。后期你有多种方式获得胜利：培育出强大的亡者之怒，不断地叠加灵魂标记，依靠月霞公主等强力单卡。",
            "如果你发现没有伙伴可以牺牲了，别忘了你还可以直面混沌，有时候运营半天不如相信自己的运气！",
            "上手难度：★★★★☆",
            "卡组强度：★★★★★",
        ],
        code: "4611101 // 1611001 1611102 1611103 1611203 1621002 1621002 1621009 1621011 1621011 1621012 1621101 1621101 1621103 1621103 1621106 1621108 1621112 1621114 1621115 1621201 1621206 1621206 2611002 2621005 2621005 2621012 2621012 2621108 2621109 2621112 // 3521013 3621003 3621006 3621007 3621008 3621104 3621108 3621109 3621205 3621207 // 1601201 3601101 3601201",
    },
    固若金汤: {
        title: "固若金汤——翡翠梦境",
        content: [
            "这套地属性卡组已经不再像传统的后期卡组一样只带大哥或者必须要拖到后期了，这套更像是一个保持强大防御的同时兼具进攻的卡组。卡组里的小型生物可以帮我们度过前期，中期使用自然交感、成长和灵鹿等卡牌迅速制造一个巨型生物，累计大量的元素，再使用大法术带走对面。",
            "可别以为只有法术能取得胜利，地属性有很多高攻击力的伙伴，加上生长药水有时能出其不意地消灭对手。",
            "上手难度：★★★★☆",
            "卡组强度：★★★★☆",
        ],
        code: "4411101 // 1411001 1411101 1411102 1421003 1421003 1421007 1421012 1421013 1421013 1421014 1421014 1421102 1421104 1421105 1421106 1421106 1421108 1421109 1421201 2021002 2411101 2421002 2421002 2421010 2421010 2421105 2421105 2421202 2421204 2421204 // 3421001 3421004 3421005 3421011 3421012 3421101 3421103 3421104 3421106 3421210 // 1401001 1401101",
    },
    超模致胜: {
        title: "超模致胜——凝视深渊",
        content: [
            "极致的超模，适合只喜欢超模的你。这套卡组混合了水暗两种属性，召唤各种各样的深渊生物，数量越多它们就越强，你的法术也会得到增益",
            "深渊生物中不乏有压制全场的存在，使用水幻影复制它们锁定胜局。但也别只顾发育，适时地学习法术给对方压力，如果对方不堪一击就使用深渊归来之潮横扫对面！",
            "上手难度：★★★☆☆",
            "卡组强度：★★★★★",
        ],
        code: "4211201 // 1221001 1221001 1221010 1221201 1221201 1221202 1221202 1221203 1221203 1221206 1611201 1621202 1621202 1621203 1621203 1621204 1621204 1621208 1621210 1621212 2021008 2021011 2021012 2221001 2221111 2221201 2611002 2611201 2621202 2621202 // 3211201 3221008 3221010 3221011 3221102 3221203 3221205 3621104 3621203 3621204 // ",
    },

    极致快攻: {
        title: "极致快攻——熊熊烈火",
        content: [
            "已经厌倦了发育和周旋？来试试这套极致快攻，从第二回合开始就使用小法术向对手施压，削减对手血量之后使用火焰符文、火焰箭这些直伤结束游戏",
            "别忘了，如果对手不能发育，那再拖几个回合又何妨？你也可以采用不断地消灭敌方伙伴的方法压制对手，火焰符文和焚风可以无视距离造成伤害，如果对方没有伙伴那么你的胜利只是时间问题。",
            "上手难度：★★★☆☆",
            "卡组强度：★★★★☆",
        ],
        code: "4111002 // 1021001 1021001 1021102 1111001 1121001 1121001 1121012 1121012 1121014 1121014 1121108 1121108 1121110 1121110 1121111 1121111 1121112 1121112 2021013 2021019 2021019 2111002 2121001 2121001 2121002 2121002 2121003 2121004 2121004 2121111 // 3121001 3121002 3121003 3121007 3121008 3121013 3121014 3121015 3121105 3121109 // 3101001",
    },
    新手入门: {
        title: "新手入门——破晓时分",
        content: [
            "刚刚接触这款游戏吗？来试试这套破晓卡组吧。第一回合先学习破晓，然后不断地召唤伙伴来增强它的威力，用大法师来提高它的攻击，最后用卷轴和日轮法师反复使用破晓终结对手。",
            "这套卡组简单易上手，也是后期卡组的克星，当对方攻势迅猛时别忘了学习其他的法术进行防御，也可以打出凯尔特王子或天枢圣兽加光之庇护的组合来延缓攻势。",
            "上手难度：★★☆☆☆",
            "卡组强度：★★★☆☆",
        ],
        code: "4511003 // 1511002 1511003 1511101 1521005 1521005 1521006 1521006 1521009 1521009 1521011 1521012 1521012 1521015 1521102 1521102 1521103 1521103 1521113 1521113 1521208 1521208 2021012 2021019 2021019 2511001 2521002 2521002 2521005 2521101 2521112 // 3511103 3521003 3521007 3521011 3521013 3521014 3521101 3521103 3521106 3521205 // 1501001 3501001",
    },
};
