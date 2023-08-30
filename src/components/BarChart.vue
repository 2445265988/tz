<template>
  <div id="BarChart" style="height: 100%; background-color:white;">
    <div role="tabpanel" class="tab-pane">
      <!--查询栏-->
      <div class="check-div form-inline">
        <div class="col-xs-3">
<!--          <button class="btn btn-yellow btn-xs" data-toggle="modal">重新生成柱状图</button>-->
          <h3>柱状图展示</h3>
        </div>
      </div>
    </div>
    <div class="row tableHeader"></div>
    <div id="BarChartCanvas" style="width:1700px;height:850px"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {getBarChartRace, getAllTypes} from '../utils/kk'
export default {
  name: "BarChart",
  created() {
    getBarChartRace().then(response => {
      // console.log(response)
      this.draw_barchart(response.data, response.jdData, response.years)
    })
  },
  methods: {
    draw_barchart(data, jdData, years){
      var colorMap = new Map()
      console.log(data)
      console.log(jdData)
      console.log(years)
      getAllTypes().then(response => {
        for(let i in response){
          colorMap.set(response[i].type, this.getColor())
        }

        var mycharts = echarts.init(document.getElementById("BarChartCanvas"));
        let option = {
          baseOption: {
            timeline: {
              data: years,
              axisType: 'category',
              autoPlay: true,
              playInterval: 3000,
              left: '5%',
              right: '10%',
              bottom: '0',
              width: '90%',
              //  height: null,
              label: {
                normal: {
                  textStyle: {
                    color: '#ff8800'
                  }
                },
                emphasis: {
                  textStyle: {
                    color: '#fff'
                  }
                }
              },
              symbolSize: 10,
              lineStyle: {
                color: '#555'
              },
              checkpointStyle: {
                borderColor: '#777',
                borderWidth: 2
              },
              controlStyle: {
                showNextBtn: true,
                showPrevBtn: true,
                normal: {
                  color: '#ff8800',
                  borderColor: '#ff8800'
                },
                emphasis: {
                  color: '#aaa',
                  borderColor: '#aaa'
                }
              }

            },
            title: {
              text: '',
              right: '5%',
              bottom: '15%',
              textStyle: {
                fontSize: 50,
                color: '#666'
              }
            },
            tooltip: {
              'trigger': 'axis'
            },
            toolbox: {
              show: true,
              feature: {
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            calculable: true,
            grid: {
              left: '5%',
              right: '5%',
              bottom: '50',
              top: '5%',
              containLabel: true
            },
            label: {
              normal: {
                textStyle: {
                  color: '#fff'
                }
              }
            },
            yAxis: [{
              offset: '37',
              'type': 'category',
              data: '',
              nameTextStyle: {
                color: '#fff'
              },
              axisLabel: {
                // rotate:45,
                textStyle: {
                  fontSize: 12,
                  color: '#333'
                },
                interval: 0
              },
              axisLine: {

                lineStyle: {
                  color: '#333'
                }
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#333'
                }
              }

            }],
            xAxis: [{
              'type': 'value',
              'name': '',

              splitNumber: 8,
              nameTextStyle: {
                color: '#333'
              },
              axisLine: {
                lineStyle: {
                  color: '#333'
                }
              },
              axisLabel: {
                formatter: '{value} '
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#ccc'
                }
              }
            }],
            series: [{
              'name': '',
              'type': 'bar',
              markLine: {
                label: {
                  normal: {
                    show: false
                  }
                },
                lineStyle: {
                  normal: {
                    color: 'red',
                    width: 3
                  }
                }
              },
              barWidth: '50%',
              label: {
                normal: {
                  show: true,
                  position: 'inside',
                  formatter: '{c}'
                }
              },
              itemStyle: {
                normal: {
                  color: params => {
                    // console.log(this.colorMap)
                    return colorMap.get(params.name)
                  }
                }
              }
            }],
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut'
          },
          options: []
        }

        if (years) {
          for (let n = 0; n < years.length; n++) {
            var res = []
            // alert(jdData.length);
            for (let j = 0; j < data[n].length; j++) {
              res.push({
                name: jdData[n][j],
                value: data[n][j]
              })
            }

            res.sort(function(a, b) {
              return b.value - a.value
            }).slice(0, 6)

            res.sort(function(a, b) {
              return a.value - b.value
            })
            var res1 = []
            var res2 = []
            for (let t = 0; t < res.length; t++) {
              res1[t] = res[t].name
              res2[t] = res[t].value
            }
            option.options.push({
              title: {
                text: years[n]
              },
              yAxis: {
                data: res1
              },
              series: [{
                data: res2
              }]
            })
          }
        }

        mycharts.setOption(option)
      })
    },
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
  }
}
</script>

<style scoped>

</style>