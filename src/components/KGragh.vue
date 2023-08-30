<template>
    <div id="KGragh" style="height: 100%; background-color:white;">
        <div role="tabpanel" class="check-div form-inline" style="display: flex; justify-content: center; align-items: center;">
              <input type="text" class="form-control input-sm" id="tech_type" placeholder="输入技术类别搜索"
              style="width: 300px;height: 40px;margin-top: 15px;margin-right: 10px;">
              <button class="btn btn-white btn-xs " @click="search_tech_type()"
                      style="width:100px;height: 40px;margin-top: 15px;margin-right: 10px;">查 询 </button>
            <button class="btn btn-yellow btn-xs" data-toggle="modal" @click="renew_gragh()"
                    style="width:100px;height: 40px;margin-top: 15px;margin-right: 10px;">清空</button>

        </div>
        <div class="row tableHeader"></div>
        <div id="gragh" style="width:100%;height:100%"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import { getgragh, getNodeByName } from "../utils/kk";
export default {
    name: "KGragh",
    data() {
        return {
            data:
                [
                    {
                        name: "JSP",

                    },
                    {
                        name: "基于JSP的代购网站的设计与实现",
                    },
                ],
            link: [
                {
                    source: "基于JSP的代购网站的设计与实现",
                    target: "JSP",
                    name: "属于"
                }
            ],
            myChart: null,
            option: {}
        }
    },
    created() {
        getgragh("").then(response => {
            console.log(response)
            this.draw_gragh(response.data, response.link)
            // this.draw_gragh(this.data, this.link)
        })
    },
    methods: {
        draw_gragh(data, links) {
            var myChart = echarts.init(document.getElementById('gragh'));
            this.myChart = myChart
            if (this.myChart) {
                this.myChart.on("click", params => {
                    if (params.dataType === "node") {
                        //判断点击的是图表的节点部分
                        console.log(params);
                        this.nodeClick(params);
                    }
                });
            }
            let option = {
                // 图的标题
                title: {
                    text: ''
                },
                tooltip: {
                    formatter: function (x) {
                        return x.data
                    }
                },
                // 工具箱
                toolbox: {
                    // 显示工具箱
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        // 还原
                        restore: {
                            show: true
                        },
                        // 保存为图片
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                series: [{
                    type: 'graph',
                    layout: 'force',
                    symbolSize: 58,
                    draggable: true,
                    roam: true,
                    focusNodeAdjacency: true,
                    // categories: categories,
                    edgeSymbol: ['', 'arrow'],
                    // edgeSymbolSize: [80, 10],
                    animation: true, // 开启动画
                    animationThreshold: 2000, // 数据量大于这个值时停止动画
                    animationDuration: 1000, // 初始动画的时长
                    animationEasing: 'cubicOut', // 初始动画的缓动效果
                    animationDurationUpdate: 1000, // 数据更新动画的时长
                    animationEasingUpdate: 'cubicOut', // 数据更新动画的缓动效果
                    edgeLabel: {
                        normal: {
                            show: true,
                            textStyle: {
                                fontSize: 12
                            },
                            formatter(x) {
                                return x.data.name
                            }
                        }
                    },
                    label: {
                        show: true
                    },
                    force: {
                        repulsion: [800, 1200],
                        edgeLength: [100, 200]
                    },
                    data: data,
                    links: links
                }]
            };
            this.option = option
            myChart.setOption(this.option);
        },
        nodeClick(params) {
            let name = params.name;
            let originalData = this.myChart.getOption().series[0].data; // 获取当前数据
            getNodeByName(name).then(response => {
                console.log(response)
                if (response) {
                    response.forEach(element => {
                        // 检查新的元素是否已经在数据中
                        if (!originalData.some(item => item.name === element.name)) {
                            // 如果元素不在当前数据中，那么添加它
                            originalData.push(element);
                        }
                    });

                    // 设置新的数据
                    this.myChart.setOption({
                        series: [
                            {
                                roam: true,
                                data: originalData
                            }
                        ]
                    }, false, true);
                } else {
                    alert("无法继续扩展！！！");
                }
            })
            console.log(this.myChart)
        },
        renew_gragh() {
            getgragh("").then(response => {
                console.log(response)
                this.draw_gragh(response.data, response.link)
                var tech_type = document.getElementById("tech_type");
                tech_type.value='';
                // this.draw_gragh(this.data, this.link)
            })
        },
        search_tech_type() {
            var tech_type = document.getElementById("tech_type").value;
            document.getElementById("gragh").style.display = "none";
            getgragh(tech_type).then(response => {
                // console.log(response)
                this.myChart.setOption({
                    series: [
                        {
                            roam: true,
                            data: response.data,
                            links: response.link
                        }
                    ]
                });
                // this.draw_gragh(response.data, response.links)
                document.getElementById("gragh").style.display = "block";
            })
        },
    }
}
</script>

<style scoped></style>