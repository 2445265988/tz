<template>
  <div id="KGragh" >
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
    <div id="gragh" style="width:1700px;height:850px"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {searchTech, getgragh, renewgragh} from "../utils/kk";
export default {
  name: "KGragh",
  created() {
    getgragh().then(response => {
      console.log(response)
      this.draw_gragh(response.data, response.links)
    })
  },
  methods: {
    draw_gragh(data,links){
      var myChart = echarts.init(document.getElementById('gragh'));
      const categories = [{
        name: '技术类别',
        // itemStyle: {
        //     color: '#AA6655'
        // }
      },
        {
          name: '论文题目',
          // itemStyle: {
          //     color: '#4D9EB3'
          // }
        }]
      let option = {
        // 图的标题
        title: {
          text: ''
        },
        legend: [{
          data: categories.map(x => x.name)
        }],
        // 提示框的配置
        tooltip: {
          formatter: function (x) {
            const des = x.data.des
            if (x.data.category === 0) {
              return x.marker + des.title
            } else if (x.data.category === 1) {
              return x.marker + '《' + des.title + '》' + '<br>学号：' + des.sno + '<br>姓名：' + des.sName
            } else {
              return ''
            }
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
        // legend: [{
        //   data: categories.map(function (a) {
        //     return a.name;
        //   })
        // }],
        series: [{
          type: 'graph',
          layout: 'force',
          symbolSize: 58,
          draggable: true,
          roam: true,
          focusNodeAdjacency: true,
          categories: categories,
          edgeSymbol: ['', 'arrow'],
          // edgeSymbolSize: [80, 10],
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
            edgeLength: [40, 80]
          },
          data:data,
          links: links
        }]
      };

      myChart.setOption(option);
    },
    renew_gragh(){
      document.getElementById("gragh").style.display = "none";
      renewgragh().then(response => {
        this.draw_gragh(response.data, response.links)
        document.getElementById("gragh").style.display = "block";
      })
    },
    search_tech_type(){
      var tech_type = document.getElementById("tech_type").value;
      document.getElementById("gragh").style.display = "none";
      searchTech(tech_type).then(response => {
        // console.log(response)
        this.draw_gragh(response.data, response.links)
        document.getElementById("gragh").style.display = "block";
      })
    },
  }
}
</script>

<style scoped>

</style>