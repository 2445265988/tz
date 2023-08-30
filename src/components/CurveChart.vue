<template>
    <div id="CurveChart" style="height: 100%; background-color:white;">
        <div role="tabpanel" class="tab-pane">
            <!--查询栏-->
            <div class="check-div form-inline">
                <div class="col-xs-3">
                    <!--          <button class="btn btn-yellow btn-xs" data-toggle="modal">重新生成柱状图</button>-->
                    <h3>曲线图展示</h3>
                </div>
            </div>
        </div>
        <div class="row tableHeader"></div>
        <div id="CurveChartCanvas" style="width:1700px;height:850px"></div>
    </div>
</template>

<script>
import { getCurveChartData } from '../utils/kk'
import * as echarts from 'echarts'
export default {
    name: "CurveChart",
    created() {
        getCurveChartData().then(response => {
            console.log(response)
            this.draw_curvechart(response)
        })
    },
    methods: {
        getColor() {
            return (
                'rgb(' +
                Math.round(Math.random() * 255) +
                ', ' +
                Math.round(Math.random() * 255) +
                ', ' +
                Math.round(Math.random() * 255) +
                ')'
            )
        },
        draw_curvechart(datas) {
            var chartdata = { source: [] }
            chartdata.source = datas
            var colorList = []
            for (let i in datas) {
                console.log(i)
                colorList.push(this.getColor())
            }
            var mycharts = echarts.init(document.getElementById("CurveChartCanvas"));
            let option = {
                title: {
                    text: '',
                    x: 'center',
                    y: 'top',
                    textAlign: 'left'
                },
                legend: {
                    type: 'scroll',
                    orient: 'vertical',
                    left: 10,
                    bottom: 40
                },
                toolbox: {
                    show: true,
                    feature: {
                        restore: { show: true },
                        saveAsImage: { show: true }
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    confine: true,
                    formatter: function (params) {
                        // console.log(p)
                        let resString = ''
                        for (let i = 0; i < params.length; i++) {
                            if (params[i].data[i + 1] !== '0') {
                                resString += params[i].marker + params[i].seriesName + ' (' + params[i].data[i + 1] + ') <br>'
                            }
                        }
                        // console.log(resString)
                        return resString
                    }
                },
                color: colorList,
                dataset: chartdata,
                xAxis: { type: 'category' },
                yAxis: { gridIndex: 0 },
                grid: { left: '15%', width: '90%', top: '50' },
                series: (function () {
                    const serice = []
                    for (let i = 1; i < chartdata.source.length; i++) {
                        const s = { type: 'line', smooth: true, seriesLayoutBy: 'row' }
                        serice.push(s)
                    }
                    return serice
                }())
            }

            mycharts.setOption(option)
        }
    }
}
</script>

<style scoped></style>