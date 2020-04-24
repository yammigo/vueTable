<style lang="less">
.f-weektime {

    margin-bottom: 10px;

    .pull-left {
        float: left !important;
    }

    .pull-right {
        float: right !important;
        cursor: pointer;
        color: #2F88FF;
        font-size: 14px;
    }

    .td-selected-time {
        text-align: left;
        line-height: 2.4em;
    }

    .week-td {
        width: 75px;
        padding: 20px 0;
    }

    .calendar {
        -webkit-user-select: none;
        position: relative;
        display: inline-block;

        table {
            display: table;
        }

        .schedule {
            background: #2F88FF;
            width: 0;
            height: 0;
            position: fixed;
            top: 0;
            left: 0;
            pointer-events: none;
            -webkit-transition: all 400ms ease;
            -moz-transition: all 400ms ease;
            -ms-transition: all 400ms ease;
            transition: all 400ms ease;
        }

        .calendar-table {
            border-collapse: collapse;
            border-radius: 4px;

            thead th,
            thead td {
                background: #F8F9FA;
            }

            tbody tr td:first-child {
                background: #F8F9FA;
            }

            .td-table-tip {
                line-height: 2.4em;
                padding: 0 12px 0 19px;
                background: #fff !important;

                .pull-left {
                    font-size: 14px;
                    color: #333333;
                }
            }

            .tip-text {
                color: #999;
                margin-right: 8px;
            }

            tr,
            td,
            th {
                border: 1px solid #E4E9ED;
                font-size: 12px;
                text-align: center;
                min-width: 11px;
                line-height: 1.8em;
                -webkit-transition: background 200ms ease;
                -moz-transition: background 200ms ease;
                -ms-transition: background 200ms ease;
                transition: background 200ms ease;
            }

            tr .ui-selected {
                background: #2F88FF;
            }

            tr .calendar-selected {
                background: #2f88ff;
            }

            tr .calendar-atom-time:hover {
                background: #f5f5f5;
            }

            tr .calendar-selected:hover {
                background: #2f88ff;
            }

            tr .ui-selected:hover {
                background: #2F88FF;
            }

            .td-selected-time p {
                max-width: 571px;
                word-break: break-all;
                margin: 8px 0;
                font-size: 14px;
                line-height: 22px;
            }
        }
    }
}
</style>
<template>
<div class="f-weektime">
    <div class="calendar">
        <div v-show="scheduleShow" class="schedule" ref="schedule" :style="scheduleStyle" :class="scheduleClass" style="opacity:0;"></div>
        <table class="calendar-table">
            <thead class="calendar-head">
                <tr>
                    <th rowspan="8" class="week-td">星期/时间</th>
                    <th colspan="24">00:00 - 12:00</th>
                    <th colspan="24">12:00 - 24:00</th>
                </tr>
                <tr>
                    <td colspan="2" v-for="(item, index) in dayHour" :key="index">{{item}}</td>

                </tr>
            </thead>
            <tbody class="calendar-body">
                <tr v-for="(item1, index1) in weekName" :key="index1">
                    <td>{{item1}}</td>
                    <td ref="calendarAtomTime" v-for="(item,index) in dayHalfHour" :key="index" :data-week="index1" :data-time="item" @mousemove="setShadow" @mouseenter="setHoverData($event, {time:item,week:index1+''})" @mousedown="setFirstSource(index1, item, $event)" @mouseleave="removeHoverData" class="calendar-atom-time" :class="{'calendar-selected':value[index1]&&value[index1].indexOf(item) >= 0,'calendar-disabled':disabledDate(index1, item) || !1}"></td>

                </tr>

                <tr>
                    <td colspan="49" class="td-table-tip">
                        <div class="clearfix"><span class="pull-left tip-text">可拖动鼠标选择时间</span> <a class="pull-right" @click="onResetAllClick">清空</a></div>
                        <div class="td-selected-time">
                            <p v-for="(item,index) in timePeriodStrArr" :key="index" v-show="item">
                                <span class="tip-text">
                                    {{weekMap[index]}}：
                                </span>
                                <span>{{item}}</span>
                            </p>

                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</div>
</template>

<script>
export default {

    props: {
        value: {
            type: Array,
            default: () => {
                return [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []

                ]
            }
        },
        showFooter: {
            type: Boolean,
            default: !0
        },
        type: {
            type: String,
            default: "normal"
        },
        shortcuts: {
            type: Array,
            default: function () {
                return []
            }
        },
        showCheckbox: {
            type: Boolean,
            default: !1
        },
        disabledDate: {
            type: Function,
            default: function () {
                return !1
            }
        }
    },
    data() {

        return {
            dayHour: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            weekName: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            dayHalfHour: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
            weekMap: {
                "0": "星期一",
                "1": "星期二",
                "2": "星期三",
                "3": "星期四",
                "4": "星期五",
                "5": "星期六",
                "6": "星期日"
            },
            start_td: "",
            end_td: "",
            start_point: {
                x: "",
                y: ""
            },
            isAdd: !1,
            hoverWeek: "",
            hoverTime: "",
            hoverTimeoutId: 0,
            isPopover: !1,
            popOverCanShow: !1,
            timePeriodStrArr: ["", "", "", "", "", "", ""],
            scheduleShow: !1,
            scheduleStyle: {},
            hoverTipObj: {},
            scheduleClass: {
                "no-transition": !1
            },
            weekCheckbox: [!1, !1, !1, !1, !1, !1, !1],
            weekIndeterminate: [!1, !1, !1, !1, !1, !1, !1]
        }
    },
    mounted() {
        document.addEventListener('mouseup', this.scheduleEnd);
        document.addEventListener('mousewheel', this.scheduleEnd)

    },
    destroyed() {
        document.removeEventListener('mouseup', this.scheduleEnd);
        document.removeEventListener('mousewheel', this.scheduleEnd)
    },
    methods: {
        weekTimeArr(e) {
            if (!(e instanceof Array))
                return console.error("ERROR: getContinuousChildArr() Input is not Array."),
                    [];
            var t = [],
                i = 0,
                n = 0;
            return e.forEach(function (e, a, r) {
                    var o = a + 1;
                    r[o] === e + 1 ? n = o : (i !== n ? t.push([r[i], r[n]]) : t.push([e]),
                        i = o,
                        n = o)
                }),
                t
        },
        n(e) {
            if (Array.isArray(e)) {
                for (var t = 0, i = Array(e.length); t < e.length; t++)
                    i[t] = e[t];
                return i
            }
            return Array.from(e)
        },
        r(e, t) {
            if (!Number.isInteger(e))
                return console.error("ERROR: getClockString() Input id is not integer."),
                    "";
            if ("start" !== t && "end" !== t)
                return console.error("ERROR: getClockString() Input type is not legal."),
                    "";
            var i = "",
                n = Math.floor(e / 2),
                a = e % 2;
            return "end" === t && 1 === a && (n += 1),
                i += n <= 9 ? "0" + n : n,
                i += "start" === t ? 1 === a ? ":30" : ":00" : 0 === a ? ":30" : ":00"
        },

        changeSelctValue: function (e) {
            //参数1
            var t = [
                [],
                [],
                [],
                [],
                [],
                [],
                []
            ];
            e.forEach(function (e) {
                    t[e] = [].concat(n(new Array(48).keys()))
                }),
                this.$emit("input", t)
        },
        handleWeekCheck: function (e) {
            //e是索引
            this.weekCheckbox[e] ? this.value[e] = [].concat(n(new Array(48).keys())) : this.value[e] = [],
                this.$emit("input", this.value.slice())
        },
        setShadow: function (e) {
            this.curtd = e.target;
            var t = this.getClientPosition(this.curtd, !0);
            if (this.start_point) {
                var i = t.x - this.start_point.x,
                    n = t.y - this.start_point.y,
                    a = n > 0 ? this.start_point.y : t.y - 20,
                    r = i > 0 ? this.start_point.x : t.x - 10,
                    o = i > 0 ? Math.abs(i) : Math.abs(i) + 22,
                    s = n > 0 ? Math.abs(n) : Math.abs(n) + 42;
                this.scheduleStyle = {
                    opacity: .6,
                    top: a + "px",
                    left: r + "px",
                    width: o + "px",
                    height: s + "px"
                }
            }
        },
        setHoverData: function (e, t) {
            var i = this;
            this.hoverTipObj = t,
                this.popOverCanShow = !0;
            var n = Math.floor(t.time / 2) < 10 ? "0" + Math.floor(t.time / 2) : Math.floor(t.time / 2),
                a = t.time % 2 ? n + ":30 - " + (+n + 1 < 10 ? "0" + (+n + 1) : +n + 1) + ":00" : n + ":00 - " + n + ":30";
            this.hoverTimeoutId && clearTimeout(this.hoverTimeoutId),
                this.$refs.weektime && (this.$refs.weektime.referenceEle = e.target),
                this.hoverTimeoutId = setTimeout(() => {
                    i.hoverWeek = this.weekMap[t.week],
                        i.hoverTime = a,
                        i.isPopover = !!i.popOverCanShow,
                        clearTimeout(i.hoverTimeoutId)
                }, 500)
        },
        removeHoverData: function () {
            this.popOverCanShow = !1,
                this.hoverWeek = "",
                this.hoverTime = "",
                this.isPopover = !1
        },
        setFirstSource: function (e, t, i) {
            var n = this.value[e];
            this.isAdd = !n || -1 === n.indexOf(t),
                1 === i.which && (this.start_td = i.target,
                    this.start_point = this.getClientPosition(i.target),
                    this.scheduleShow = !0,
                    this.scheduleStyle = {
                        left: this.start_point.x + "px",
                        top: this.start_point.y + "px",
                        width: 0,
                        height: 0,
                        opacity: .6
                    },
                    this.scheduleClass["no-transition"] = !0)
        },
        resetTimePeriodStrArr: function () {
            this.timePeriodStrArr = ["", "", "", "", "", "", ""]
        },
        onResetAllClick: function () {
            // this.value=[[],[],[],[],[],[],[],]
            this.$emit("clear-week-schedule", [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                ]),
                this.$emit("input", [
                    [],
                    [],
                    [],
                    [],
                    [],
                    [],
                    []
                ]),
                this.resetTimePeriodStrArr()
        },
        getClientPosition: function (e, t) {
            var i = e.getBoundingClientRect();
            return {
                x: i.left + (t ? i.width : 0),
                y: i.top + (t ? i.height : 0)
            }
        },
        scheduleEnd: function (e) {

            this.start_point && (this.start_point = null,
                this.end_td = this.curtd,
                this.scheduleClass["no-transition"] = !1,
                this.highlightScheduleArea(this.start_td, this.end_td))
        },
        highlightScheduleArea: function (e, t, i) {
            if (e) {
                var n = parseInt(e.getAttribute("data-week")),
                    a = parseInt(e.getAttribute("data-time")),
                    r = parseInt(t.getAttribute("data-week")),
                    o = parseInt(t.getAttribute("data-time")),
                    s = Math.min(n, r),
                    l = Math.max(n, r),
                    u = Math.min(a, o),
                    d = Math.max(a, o);
                this.scheduleStyle.opacity = 0,
                    this.scheduleShow = !1,
                    this.getSelectedCollection(u, s, d, l)
            }
        },
        getSelectedCollection: function (e, t, i, n) {
            var a = this;
            this.$refs.calendarAtomTime.forEach(function (r) {
                    var o = parseInt(r.getAttribute("data-time")),
                        s = parseInt(r.getAttribute("data-week")),
                        l = a.value[s].indexOf(o);
                    o >= e && o <= i && s >= t && s <= n && (void 0 === a.value[s] && (Vue.set(a.value, s, []),
                            a.value[s].push(o)),
                        a.value[s] && (a.isAdd ? -1 === l && a.value[s].push(o) : l > -1 && a.value[s].splice(l, 1)))
                }),
                this.$emit("input", this.value),
                this.changeTimeStr(t, n)
        },
        changeTimeStr: function (e, t) {
            for (var i = e; i <= t; i++)
                this.transformTimeArrToString(this.value[i], i)
        },
        initiateTimePeriodStr: function () {
            for (var e = 0; e < this.value.length; e++)
                0 !== this.value[e].length && this.transformTimeArrToString(this.value[e], e)
        },
        sortArr: function (e) {
            return e.slice().sort(function (e, t) {
                return e - t
            })
        },
        transformTimeArrToString: function (e, t) {
            var i = this.sortArr(e),
                n = this.weekTimeArr(i),
                o = n.map((e) => {
                    var t = void 0,
                        i = this.r(e[0], "start");
                    return 1 === e.length ? t = this.r(e[0] + 1, "start") : 2 === e.length && (t = this.r(e[1], "end")),
                        [i, t].join("~")
                }).join("、");
            console.log(o);
            this.$set(this.timePeriodStrArr, t, o);
        }

    },
    computed: {
        hasSelectedTime: function () {
            return this.value.some(function (e) {
                return e.length >= 1
            })
        },
        baseClass: function () {
            // return [o.CSS_PREFIX + "schedule", o.CSS_PREFIX + "schedule-" + this.type]
        },
        isOptionSelected: function () {
            var e = this.weekCheckbox;
            return function () {
                return (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : []).every(function (t) {
                    return e[t]
                })
            }
        }

    },
    watch: {
        value: {
            immediate: true,
            handler: function (e, t) {
                var i = this;
                    this.value.map(function (e, t) {
                        for (var n = e.length - 1; n >= 0; n--) {
                            var a = e[n];
                            i.disabledDate(t, a) && e.splice(n, 1)
                        }
                    }),
                    this.$emit("input", this.value),
                    this.$emit("change", this.value),
                    this.resetTimePeriodStrArr(),
                    this.initiateTimePeriodStr(),
                    this.weekCheckbox.map(function (e, t) {
                        var n = i.value[t].length;
                        48 === n ? i.weekCheckbox.splice(t, 1, !0) : i.weekCheckbox.splice(t, 1, !1),
                            i.weekIndeterminate[t] = n < 48 && n > 0
                    })
            }
        }
    },
}
</script>
