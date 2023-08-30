<template>
    <div id="KGragh" style="height: 100%;  background-color:white;">
        <div role="tabpanel" class="tab-pane">
            <!--查询栏-->
            <div class="check-div form-inline">
                <div class="col-xs-3">
                    <button class="btn btn-yellow btn-xs" data-toggle="modal" @click="renew_gragh()">重新生成知识图谱</button>
                </div>
                <div class="col-xs-4">
                    <input type="text" class="form-control input-sm" id="tech_type" placeholder="输入技术类别搜索">
                    <button class="btn btn-white btn-xs " @click="search_tech_type()">查 询 </button>
                </div>
            </div>
        </div>
        <div class="row tableHeader"></div>
        <div id="gragh" style="width:100%;height:100%"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
import { getAllTriple } from "../utils/kk";
export default {
    name: "Triple",
    data() {
        return {
            myChart: null,
            width: null,
            height: null,
        }
    },
    created() {
        getAllTriple().then(res => {
            console.log(res)
            this.draw_gragh(res)
        })
    },
    methods: {

        draw_gragh(res) {
            var myChart = echarts.init(document.getElementById('gragh'));
            myChart.showLoading()
            let width = res.width
            let height = res.height
            let xFactor = width / (myChart.getWidth() * 0.7)
            let yFactor = height / (myChart.getHeight() * 0.7)
            let factor = xFactor < yFactor ? xFactor : yFactor
            let nodes = res.nodes
            nodes.forEach(node => {
                node.symbolSize = Math.ceil(node.symbolSize / factor)
                if (node.symbolSize === 1) {
                    node.symbolSize = 2
                    node.color = node.itemStyle.color
                    node.label = node.name
                }
            })
            let links = res.links
            links.forEach(link => {
                link.lineStyle.opacity = 0.1
            })
            let option = {
                tooltip: {
                    formatter: function (params) {
                        if (params.componentType === 'series') {
                            if (params.seriesType === 'graph') {
                                if (params.dataType === 'node') {
                                    return params.data["name"];
                                } else {
                                    return null;
                                }
                            }
                        }
                    }
                },
                series: [{
                    type: 'graph',
                    layout: 'none',
                    data: nodes,
                    links: links,
                    roam: true,
                    nodeScaleRatio: 0.5,
                    animationThreshold: 20000,
                    label: {
                        show: true,
                        position: 'right',
                        formatter: function (params) {
                            if (params.data.symbolSize > 15) {
                                return params.data.name;
                            } else {
                                return '';
                            }
                        }
                    },
                    // lineStyle: {
                    //   curveness: 0.4,
                    //   opacity: 0.1,
                    //   color: 'source'
                    // },
                }]
            };
            myChart.hideLoading();
            myChart.setOption(option);
            // eslint-disable-next-line no-unused-vars
            myChart.on('click', function (params) {
                if (params.componentType === 'series') {
                    if (params.seriesType === 'graph') {
                        if (params.dataType === 'node') {
                            let options = myChart.getOption()
                            // let nodeOptions = options.series[0].data
                            // console.log(nodeOptions)
                            // console.log(params.seriesIndex)
                            // console.log(params.dataIndex)
                            options.series[0].data[params.dataIndex].symbolSize = options.series[0].data[params.dataIndex].symbolSize + 2
                            myChart.setOption(options)
                        }
                    }
                }
            })
        }
    }
}
</script>

<style scoped></style>