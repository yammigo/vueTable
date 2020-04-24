export default {
    methods: {
        destoryScroll: function() {
            m && !g && h && (p && p.removeEventListener("scroll", this.setFixedStyle),
            window.removeEventListener("resize", this.resetBottomScroll.bind(this)),
            window.removeEventListener("scroll", this.resetBottomScroll.bind(this)),
            h = h.destroy(),
            m = !1,
            g = !0)
        },
        resetBottomScroll: function() {
            var e = this;
            if (r = document.querySelector(".table-area .bui-table-wrapper .bui-table-body"))
                if (h || m || !g) {
                    var t = 0;
                    n && (t = n.getBoundingClientRect().bottom - window.innerHeight),
                    (t > 0 && v <= 0 || t < 0) && h.setCustomStyle({
                        horizontalBar: {
                            display: "none"
                        }
                    }).update(),
                    v = t,
                    this.setFixedStyle(),
                    this.resetBottomScrollHandler()
                } else
                    this.$nextTick((function() {
                        e.setBottomScroll()
                    }
                    ));
            else
                this.destoryScroll()
        },
        resetBottomScrollHandler: _.debounce((function() {
            if (h && r) {
                var e = document.querySelector(".bui-table-fixed-header");
                if (e) {
                    var t = e.getBoundingClientRect();
                    if (t.top + t.height > window.innerHeight) {
                        var i = document.getElementsByClassName("custom-scroll-bar")[0];
                        return void (i && (i.style.display = "none"))
                    }
                }
                var a = 0;
                l && (l.style.bottom = 0,
                a = l.clientWidth);
                var o = r && r.classList.contains("bui-table-overflow-x")
                  , s = {
                    position: "fixed",
                    left: "".concat(n ? n.getBoundingClientRect().left + a : 0, "px"),
                    bottom: "0",
                    width: "".concat(n ? n.clientWidth - a : 0, "px"),
                    display: o ? "unset" : "none"
                };
                if (n && n.getBoundingClientRect().bottom - window.innerHeight < 0 && o) {
                    var p = document.body.scrollWidth > document.body.clientWidth;
                    n && n.classList.add("add-bottom-scrollbar"),
                    s.bottom = "".concat(c.clientHeight - (p ? 15 : 0) - (d ? d.getBoundingClientRect().bottom - window.innerHeight : 0), "px")
                } else
                    n && n.classList.remove("add-bottom-scrollbar");
                h.setCustomStyle({
                    horizontalBar: s
                }).update()
            }
        }
        ), 50),
        setFixedStyle: _.throttle((function() {
            r && (p && 0 !== p.scrollLeft && u && "none" !== u.style.display ? r && r.classList.remove("bui-table-scrolling-left") : r && r.classList.add("bui-table-scrolling-left"))
        }
        ), 50),
        setBottomScroll: function() {
            var e = this
              , t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
            if ((0,
            f.isPC)())
                t >= 30 || (h || (h = new o.default),
                r = document.querySelector(".table-area .bui-table-body"),
                s = document.querySelector(".table-area .bui-table-header"),
                n = document.querySelector(".table-area .bui-table-wrapper"),
                l = document.querySelector(".table-area .bui-table-fixed-left"),
                d = document.querySelector(".report-table"),
                c = document.querySelector(".footer-pagination"),
                r ? (window.addEventListener("resize", this.resetBottomScroll.bind(this)),
                window.addEventListener("scroll", this.resetBottomScroll.bind(this)),
                h.setElement(r).setDirection("horizontal"),
                s && h.setSyncElement([s]),
                this.$nextTick((function() {
                    e.resetBottomScroll()
                }
                )),
                h.create(),
                m = !0,
                g = !1,
                this.$nextTick((function() {
                    p = document.querySelector(".table-area .custom-scroll-content"),
                    u = document.querySelector(".table-area .custom-scroll-horizontal-bar"),
                    r && r.classList.add("bui-table-scrolling-left"),
                    p && p.addEventListener("scroll", e.setFixedStyle)
                }
                ))) : setTimeout((function() {
                    e.setBottomScroll(t + 1)
                }
                ), 500));
            else {
                var i = document.querySelector(".content-area");
                i && i.classList.add("telphone-content")
            }
        }
    },
    beforeDestroy: function() {
        this.destoryScroll()
    }
}