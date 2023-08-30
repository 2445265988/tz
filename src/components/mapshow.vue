<template>
  <div role="tabpanel" class="check-div form-inline" style="z-index: 1;display: flex;position: absolute; align-items: center;">
    <input type="text" class="form-control input-sm" id="search_content" placeholder="输入查询内容"
           style="width: 300px;height: 40px;margin-top: 15px;margin-right: 10px;">
    <button class="btn btn-white btn-xs " @click="search_tech_type()"
            style="width:100px;height: 40px;margin-top: 15px;margin-right: 10px;">查 询 </button>
    <button class="btn btn-yellow btn-xs" data-toggle="modal" @click="renew_gragh()"
            style="width:100px;height: 40px;margin-top: 15px;margin-right: 10px;">清空</button>
    <el-switch v-model="value" :before-change="beforeChange" @change="change" :loading="loading" activeValue=true inactiveValue=false active-color="#13ce66" width="80" active-text="打开热力图" inactive-text="关闭热力图" />
    <button class="btn btn-yellow btn-xs" data-toggle="modal" @click="drawSearch2()"
            style="width:100px;height: 40px;margin-top: 15px;margin-right: 10px;">绘制区域搜索</button>
    <button class="btn btn-yellow btn-xs" data-toggle="modal" @click="hotShow()"
            style="width:100px;height: 40px;margin-top: 15px;margin-right: 10px;">热力图显示</button>
    <button class="btn btn-yellow btn-xs" data-toggle="modal" @click="linedraw()"
            style="width:100px;height: 40px;margin-top: 15px;margin-right: 10px;">测距显示</button>
    <button class="btn btn-yellow btn-xs" data-toggle="modal" @click="clusterShow()"
            style="width:100px;height: 40px;margin-top: 15px;margin-right: 10px;">聚合显示</button>
    <button class="btn btn-yellow btn-xs" data-toggle="modal" @click="drawPath()"
            style="width:100px;height: 40px;margin-top: 15px;margin-right: 10px;">绘制路线</button>
    <button class="btn btn-yellow btn-xs" data-toggle="modal" @click="clearpath()"
            style="width:100px;height: 40px;margin-top: 15px;margin-right: 10px;">清除路线</button>

  </div>
  <div id="mapshow" v-show="mapshopPopup" style="height: 100%; background-color:white; display: flex; justify-content: center; ">

    <div id="map" class="mymap" style="width:100%;height:100%"></div>


    <div v-show="inaddnewvisible" class="addnew_ck">
        <div>
          <input type="file" ref="fileInput" @change="handleFileChange" />

        </div>

        <input id="shuruddress" type="text" class="inputBox" name="address" v-model="fileName" required="" placeholder="报告名">
        <p class="inputBox"><strong>年份：</strong>{{ this.fileyear }}</p>
        <input id="laiyuan" type="text" class="inputBox" name="laiyuan" v-model="laiyuanv" required="" placeholder="来源">
        <textarea id="shuruxx" type="text" style="height: 300px; overflow: auto;" class="inputBox" rows="5" v-model="fileContent" placeholder="描述"></textarea>
        <div class="hengRow">
            <input type="submit" name="" v-on:click="saveAddress" value="保存">
            <input type="submit" name="" v-on:click="closeModal" value="关闭">
        </div>
    </div>
    <!--  查看地址信息-->
    <div v-show="shopPopup" class="addnew_ck">
        <h3 class="inputBox"><strong>{{ this.tableDataDetail.name }}</strong></h3>
        <p class="inputBox"><strong>年份：</strong>{{ this.tableDataDetail.year }}</p>
        <p class="inputBox"><strong>来源：</strong>{{ this.tableDataDetail.url }}</p>
        <p class="inputBox" style="height: 300px; overflow: auto;" ><strong>简介：</strong>{{ this.tableDataDetail.introduction }}</p>
        <button @click="initializeNeo4j()">查看相关知识图谱</button>
        <div class="hengRow">
            <!--      <input type="submit" name="" v-on:click="saveAddress" value="保存">-->
            <input type="submit" name="" v-on:click="closeModal" value="关闭">
        </div>
    </div>
    <!--知识图谱-->
    <div class="addnew_ck1" v-show="kgvisible">
        <div id="gragh1" style="width:700px;height:700px"></div>
        <button @click="closekg()">关闭</button>
    </div>
  </div>
  <div id="mapWithMeasurement" v-show="mapshopPopup1" style="width:100%;height:100%">

    <div
        v-show="showDistance"
        id="distance-overlay"
        class="distance-overlay"
    >
      <div id="distance-value" class="distance-text">{{ distance }} meters</div>
    </div>
    <button class="btn btn-yellow btn-xs" data-toggle="modal" @click="linedraw() "
            style="z-index: 1;position: absolute; " >{{ distance/1000}} kilometers</button>

  </div>
  <div id="mapWithDraw" v-show="mapshopPopup2" style="width:100%;height:100%"></div>
</template>

<script>
import 'ol/ol.css';
import ol, { Map, Overlay, View } from 'ol';
import { Draw, Modify, Snap } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import Feature from "ol/Feature";
import { Point } from "ol/geom";
import {Circle, Fill, Icon, Stroke, Style, Text} from "ol/style";
import { Vector as VectorLayer } from "ol/layer";
import { OSM,Vector as VectorSource } from "ol/source";
import { LineString } from 'ol/geom';
import * as olProj from "ol/proj";
import * as echarts from "echarts";
import {addPaper, paperList} from "../utils/kk";
import { zhengzefenci } from '../utils/kk'
import { Heatmap as HeatmapLayer } from "ol/layer";

import { fromLonLat } from 'ol/proj';

import Vue from "vue";
import Cluster from "ol/source/Cluster";
// import
export default {
  data() {
    return {
      drawInteraction: null,
      selectedFeatures:[],
      circleLayer:null,
      allowLeftClick: true,
      pathFeature:null,
      mapmarkers:null,
      value: false,
      clusterShowFlag: false,
      hotShowFlag:true,
      loading: true,// 开启加载状态
      textOverlays: [], // 用于存储所有标记文字的覆盖层
      lineCoordinates:null,
      fileName: '',
      fileyear: '',
      content: {},
      fileContent: '',
      fileresult: {},
      kgdataname: [],
      kgdata: [],
      dataWebsites: [
      ],
      selectedItemIndex: -1,
      mapshopPopup:true,
      mapshopPopup1:false,
      mapshopPopup2:false,
      // namev: '',
      laiyuanv: '',
      description: '',
      isMenuVisible: false,
      inaddnewvisible: false,
      shopPopup: false,
      tableDataDetail: {},
      tupuvisible: false,
      // 知识图谱数据
      kgvisible: false,
      driver: null,
      name: '',
      session: null,
      features: [],
      flag: 0,
      keyword_entity: '',
      clicklalng: {},
      filelalo: [],
      heatLayer:null,
      pathLayer:null,
      showDistance: false,
      distance: 0,
      VectorSource:null,
      heatmapLayer:null
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.initMap();
    // this.showMenu();
  },
  methods: {
    beforeChange(currentVal) {
      console.log('currentVal:'+this.value)
      let textvalue;
      if(this.value=='true'){
        console.log('关闭')
        textvalue='关闭';
      }
      if(this.value=='false'){
        console.log('打开')
        textvalue='打开';
      }
      // var oppositeValue = !this.value; // 当 value 为 false 时，oppositeValue 将为 true
      // console.log('oppositeValue:'+oppositeValue);
      this.loading = true;
      return this.$confirm(`是否<span style="color: #${textvalue};"> ${textvalue} </span>热力图？`, '提示',
          { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning', dangerouslyUseHTMLString: true }).catch(() => {
        this.loading = false;
        return Promise.reject("cancel");
      });
    },
    change(val) {
      setTimeout(() => {
        this.value=val;
        if(val=='true'){
          console.log('val:'+val)
          console.log("打开热力图")
          this.hotShow();

        }
        if(val=='false'){
          console.log('val:'+val)
          console.log("关闭热力图")
          this.hotShowFlag = true;
          this.hotShow();

        }

        this.loading = false;
      }, 1500)
    },
    async fetchData() {
      try {
        const response = await paperList();
        this.dataWebsites = response;
        console.log('数据加载完成', this.dataWebsites);
        this.setWebSiteMarker(); // 在数据加载完成后调用方法
      } catch (error) {
        console.error('获取数据失败', error);
      }
    },
    //数据导入地图
    setWebSiteMarker() {
      //获取数据网站列表
      // 添加标点
      console.log('加载资料标记点')
      this.dataWebsites.forEach(item => {
        console.log(item.longitude)
        if (item.longitude) {
          let feature = new Feature({
            name: item.name,
            geometry: new Point(olProj.fromLonLat([item.longitude, item.latitude])),
          });
          feature.setProperties({
            feature_type: "webData",
            detail: item
          })
          let style = new Style({
            image: new Icon({
              src: require("../assets/img/home_img/地点.png"),
              scale: [0.2,0.2],
            }),
            // 标点的文字
            text: new Text({
              // 文字
              text: item.name,
              // 文字样式
              fill: new Fill({
                color: 'red'
              }),
              font: '14px Calibri',
              // 偏移量
              offsetY: 15
            })
          })
          feature.setStyle(style);
          this.features.push(feature)
        }
      })
      var clusterLayer = new VectorLayer({
        source: new VectorSource({
          features: this.features,
        }),
        name: 'webMarkerCluster',
      });
      this.mapmarkers=this.features;
      window.map.addLayer(clusterLayer)
    },
    setWebSiteMarker1() {
      //获取数据网站列表
      // 添加标点
      console.log('加载资料标记点1')
      this.dataWebsites.forEach(item => {
        console.log(item.longitude)
        if (item.longitude) {
          let feature = new Feature({
            name: item.name,
            geometry: new Point(olProj.fromLonLat([item.longitude, item.latitude])),
          });
          feature.setProperties({
            feature_type: "webData",
            detail: item
          })
          let style = new Style({
            image: new Icon({
              src: require("../assets/img/home_img/地点.png"),
              scale: [0.2,0.2],
            }),
            // 标点的文字
            text: new Text({
              // 文字
              text: item.name,
              // 文字样式
              fill: new Fill({
                color: 'red'
              }),
              font: '14px Calibri',
              // 偏移量
              offsetY: 15
            })
          })
          feature.setStyle(style);
          this.features.push(feature)
        }
      })
      var clusterLayer = new VectorLayer({
        source: new VectorSource({
          features: this.features,
        }),
        name: 'webMarkerCluster',
      });
      window.map1.addLayer(clusterLayer)
    },

    initMap() {
      console.log("初始化")
      this.VectorSource=new VectorSource({
        features: this.features,
      })
      const vectorLayer = new VectorLayer({
        source: this.VectorSource
      });
      //   创建地图容器和实体
      window.map = new Map({
        target: 'map', // 绑定到指定的div容器
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=6bf83bd1a699540d61936a68711eb096',
            }),
          }),
          new TileLayer({
            source: new XYZ({
              url: "https://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=6bf83bd1a699540d61936a68711eb096",
            }),
            isGroup: true,
            name: "天地图文字标注",
          }),
          vectorLayer
        ],
        view: new View({
          center: [0, 0], // 设置地图中心点
          zoom: 2, // 设置地图缩放级别
        }),
      })

      // 添加右键菜单
      //创建对象
      // let geocode = new TileLayer.Geocoder();
      window.map.on("contextmenu", this.getLngLat);

      // 添加点击事件监听
      window.map.on("dblclick", (e) => {
        // e.preventDefault(); // 阻止默认的上下文菜单行为
        console.log("左键点击地图")
        // 判断是否点击在点上
        let feature = window.map.forEachFeatureAtPixel(
            e.pixel,
            (feature) => feature
        );
        console.log(feature);
        // 如果点击的是数据网站节点，则可以打开数据表格
        if (feature) {
          if (feature.values_.feature_type == 'webData') {
            this.shopPopup = true;
            const coordinates = feature.getGeometry().getCoordinates();
            console.log(feature.values_.detail.latitude);
            this.tableDataDetail = feature.values_.detail;
            this.tableDataDetail.lalo = [feature.values_.detail.longitude, feature.values_.detail.latitude];
            this.tableDataDetail.year = feature.values_.detail.year;
            this.keyword_entity = feature.values_.detail.keyword;
            this.tableDataDetail.url = feature.values_.detail.url;
            this.popup.setPosition(coordinates);
          }
        }
      })
      this.addOverlay();
      this.setWebSiteMarker();
    },
    checktable() {
      let params = {}
      params.name = this.tableDataDetail.name;
      this.$refs.tableModel.openDialog(params);
    },
    closePopup() {
      this.shopPopup = false;
      this.tableDataDetail = {};
    },
    // 显示地图
    addOverlay() {
      let elPopup = this.$refs.popup;
      this.popup = new Overlay({
        element: elPopup,
        positioning: "bottom-center",
        stopEvent: false,
        offset: [0, -20],
      });
      window.map.addOverlay(this.popup);
    },
    closeModal() {
      this.shopPopup = false;
      this.inaddnewvisible = false;
    },
    initializeNeo4j() {
      this.kgvisible = true;
      this.shopPopup = false;
      // this.driver = neo4j.driver(' bolt://localhost:7687/', neo4j.auth.basic('neo4j', '123456'));
      // this.session = this.driver.session();
      // 获取查询的实体和节点信息
      this.kgdataname = [];
      this.kgdata = [];
      const entity = this.keyword_entity;
      this.fetchNodes(entity);
    },
    showPopupWindow(coordinate) {
      let x, y;
      x = coordinate[0];
      y = coordinate[1];
      console.log(x, y)
      this.inaddnewvisible = true;
      // 获取点击位置的经纬度信息

      // 在弹出窗口中添加内容，包括地图坐标信息
      this.clicklalng

    },

    async fetchNodes(entity) {
      // 通过aliapi获取与实体相关的所有节点信息
      const response = await fetch(`https://api.ownthink.com/kg/knowledge?entity=${entity}`);
      const result = await response.json();
      const backdata = result.data.avp;
      console.log("成功获取实体" + entity + "相关信息：" + result.data.avp);
      // 将节点信息导入字典
      this.kgdataname.push({
        name: entity
      })
      await this.importNodes(backdata, entity);
      // 渲染知识图谱
      console.log("开始画图")
      this.draw_gragh(this.kgdataname, this.kgdata);

    },
    async importNodes(nodes, entity) {
      console.log("导入结点");
      // 创建节点并添加标签
      for (const name of nodes) {
        console.log(name);
        // {source: "龙门山倒转向斜", target: "铁山背斜北翼大冶群地层中", name: "发育于"}
        this.kgdata.push(
            {
              source: entity,
              target: name[1],
              name: name[0]
            }
        );
        this.kgdataname.push({
          name: name[1]
        });

        console.log("成功导入节点" + name[1]);

      }

      this.kgdataname = Array.from(new Set(this.kgdataname.map(JSON.stringify)), JSON.parse);
      console.log("循环结束")
      console.log(this.kgdata);
      console.log(this.kgdataname);
      console.log("创建关系结点成功！");

    },
    draw_gragh(data, links) {
      var myChart = echarts.init(document.getElementById('gragh1'));
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
          animation: false, // 开启动画
          animationThreshold: 100, // 数据量大于这个值时停止动画
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
            repulsion: [200, 400],  // 设置斥力范围为50到100
            edgeLength: 200,   // 设置边的长度为100
            gravity: 0.03,  // 设置引力因子为0.03
            layoutAnimation: false  // 使用转动动画
          },
          data: data,
          links: links
        }]
      };
      this.option = option
      myChart.setOption(this.option);
    },
    async nodeClick(params) {
      let name = params.name;
      // let originalData = this.myChart.getOption().series[0].data; // 获取当前数据
      // let originalLink = this.myChart.getOption().series[0].links; // 获取当前数据
      let response = await fetch(`https://api.ownthink.com/kg/knowledge?entity=${name}`);
      const result = await response.json();
      console.log(result)
      const backdata = result.data.avp;
      console.log("成功获取实体" + name + "相关信息：" + result.data.avp);
      // 将节点信息导入字典
      // this.kgdataname.push({
      //     name: entity
      // })
      await this.importNodes(backdata, name);

      this.draw_gragh(this.kgdataname, this.kgdata);
      console.log(this.myChart)
    },
    closekg() {
      this.kgvisible = false;
      this.shopPopup = true;
    },
    getLngLat(event) {
      event.preventDefault();
      const clickedPixel = event.pixel;
      const lonLatCoordinate = window.map.getCoordinateFromPixel(clickedPixel);
      const lonLat = olProj.transform(lonLatCoordinate, 'EPSG:3857', 'EPSG:4326');
      console.log(`Clicked coordinate: ${lonLat[0].toFixed(6)}, ${lonLat[1].toFixed(6)}`);
      this.clicklalng = [lonLat[0].toFixed(6), lonLat[1].toFixed(6)];
      console.log(this.clicklalng[0]);
      this.inaddnewvisible = true;
    },
    saveAddress() {

      // 获取文本区域元素
      const addresslb = document.getElementById('shuruddress');
      const laiyuanlb = document.getElementById('laiyuan');
      const introductionlb = document.getElementById('shuruxx');


      // 读取文本区域的值
      const address = addresslb.value;
      const introduction = introductionlb.value;

      console.log(address);
      console.log(introduction);
      let newaddress;
      newaddress = {
        name: address,
        url: laiyuanlb,
        latitude: this.clicklalng[1],
        longitude: this.clicklalng[0],
        introduction: introduction,
      }
      // this.paperList.push(newaddress);

      addPaper(this.fileresult.name, this.fileresult.keyword, this.fileresult.latitude, this.fileresult.longitude, this.fileresult.introduction, this.fileresult.image, this.fileresult.place, this.fileresult.url, this.fileresult.year).then(response => {
        console.log(response)

      })
      // 假设 place 是一个包含经度和纬度的对象，如 { longitude: 103.3, latitude: 35.5 }
      // 创建一个 feature 并添加到地图上
      let feature = new Feature({
        name: address,
        geometry: new Point(olProj.fromLonLat([this.filelalo[0], this.filelalo[1]])),
      });
      feature.setProperties({
        feature_type: "webData",
        detail: newaddress
      })
      let style = new Style({
        image: new Icon({
          src: require("../assets/img/home_img/地点.png"),
          scale: [0.2,0.2],
        }),
        // 标点的文字
        text: new Text({
          // 文字
          text: address,
          // 文字样式
          fill: new Fill({
            color: 'red'
          }),
          font: '14px Calibri',
          // 偏移量
          offsetY: 15
        })
      })
      feature.setStyle(style);
      this.features.push(feature)
      console.log(this.features);
      this.closeModal();
      var clusterLayer = new VectorLayer({
        source: new VectorSource({
          features: this.features,
        }),
        name: 'webMarkerCluster',
      });
      window.map.addLayer(clusterLayer);

    },
    getLayerByName(layername) {
      let layers = window.map.getLayers().getArray();
      for (const layer of layers) {
        if (layer.get("name") == layername) {
          return layer;
        }
      }
    },
    search_tech_type() {
      console.log("进入查询");
      var search_text = document.getElementById("search_content").value;
      console.log(("对结点" + search_text + "进行查询"));
      let n_feature = new Feature;
      let new_features = [];
      for (n_feature of this.features) {

        if (n_feature.values_.detail.name.includes(search_text)) {
          console.log(n_feature.values_.detail.name);
          new_features.push(n_feature);
        }
      }
      console.log(new_features);
      let layer = this.getLayerByName('webMarkerCluster');
      window.map.removeLayer(layer);
      console.log(layer);
      var clusterLayer = new VectorLayer({
        source: new VectorSource({
          features: new_features,
        }),
        name: 'webMarkerCluster',
      });
      window.map.addLayer(clusterLayer);
      this.mapmarkers=new_features;
      this.clearpath();
      this.drawPath();
    },
    renew_gragh() {
      var content = document.getElementById("search_content");
      content.value = '';
      this.setWebSiteMarker();
      this.clearpath();

      // this.draw_gragh(this.data, this.link)
    },
    async handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.fileName = file.name;
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          this.fileContent = event.target.result;
          console.log("打印内容");
          console.log(this.fileContent);
          zhengzefenci(this.fileContent, 'zhengze').then(response => {
            let content = JSON.parse(response.content);
            console.log(content)
            const idValues = content.find(item => item.id !== undefined).id;
            const nameValues = content.find(item => item.name !== undefined).name;
            const keywordValues = content.find(item => item.keyword !== undefined).keyword;
            const latitudeValues = content.find(item => item.latitude !== undefined).latitude;
            const longitudeValues = content.find(item => item.longitude !== undefined).longitude;
            const introductionValues = content.find(item => item.introduction !== undefined).introduction;
            const imageValues = content.find(item => item.image !== undefined).image;
            const placeValues = content.find(item => item.place !== undefined).place;
            const urlValues = content.find(item => item.url !== undefined).url;
            const year = content.find(item => item.year !== undefined).year;
            this.fileName = nameValues;
            this.laiyuanv = urlValues;
            this.fileresult = {
              name: nameValues,
              keyword: keywordValues,
              latitude: latitudeValues,
              longitude: longitudeValues,
              introduction: introductionValues,
              image: imageValues,
              place: placeValues,
              url: urlValues,
              year: year,
            }
            this.fileyear = year;
            this.filelalo = [latitudeValues, longitudeValues];
            this.fileContent = introductionValues;
            console.log(introductionValues)

          })
        };

        fileReader.readAsText(file);
      }

    },

    // 热力图显示
    async hotShow() {
      this.mapshopPopup=true;
      this.mapshopPopup1=false;
      this.mapshopPopup2=false;

      const layer = this.getLayerByName("hot");

      if (this.hotShowFlag) {

        window.map.removeLayer(layer);
        this.hotShowFlag = false
      } else {
        this.hotShowFlag = true
        if (layer) {
          window.map.removeLayer(layer);
        }

        var sourceHeat = new VectorSource({
          features: this.features
        })
        this.heatmapLayer = new HeatmapLayer({
          name: 'hot',
          source: sourceHeat,//热力图资源
          opacity: 1,//透明度，默认1
          visible: true,//是否显示，默认trur
          zIndex: 1,//图层渲染的Z索引,默认按图层加载顺序叠加
          gradient: ['#00f', '#0ff', '#0f0', '#ff0', '#f00'],//热图的颜色渐变
          blur: 15,//模糊大小(像素为单位)
          radius: 8,//半径大小默认为8(像素为单位)
          extent: [100, 30, 104, 40],//渲染范围，可选值，默认渲染全部
        });
        // 热力图层
        window.map.addLayer(this.heatmapLayer)
      }
    },

    clearTextOverlays() {
      // 清除所有已保存的文本覆盖层
      for (const overlay of this.textOverlays) {
        window.map.removeOverlay(overlay);
      }
      window.textOverlays = [];
    },
    drawTextAtCenter(center, text) {
      // 移除之前的文本覆盖层


      // 创建文本元素
      const textElement = document.createElement('div');
      textElement.className = 'text-overlay';
      textElement.innerText = text;

      // 设置文本的样式和位置
      const textOverlay = new Overlay({
        element: textElement,
        position: center,
        positioning: 'center-center',
      });
      // 将新的文本覆盖层保存到数组中
      this.textOverlays.push(textOverlay);

      // 添加文本覆盖层到地图
      this.textOverlays.forEach(tOverlay => {
        window.map1.addOverlay(tOverlay);

      })

    },
    async linedraw(){
      this.mapshopPopup=false;
      this.mapshopPopup1=true;
      const source1=new VectorSource({
        features: this.features,
      })
      const vectorLayer1 = new VectorLayer({
        source: source1
      });
      window.map1 = new Map({
        target: 'mapWithMeasurement', // 绑定到指定的div容器
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=6bf83bd1a699540d61936a68711eb096',
            }),
          }),
          new TileLayer({
            source: new XYZ({
              url: "https://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=6bf83bd1a699540d61936a68711eb096",
            }),
            isGroup: true,
            name: "天地图文字标注",
          }),
          vectorLayer1
        ],
        view: new View({
          center: [0, 0], // 设置地图中心点
          zoom: 2, // 设置地图缩放级别
        }),
      })
      this.setWebSiteMarker1();
      console.log('开始绘画')
      const draw = new Draw({
        source: source1,
        type: 'LineString',
      });
      window.map1.addInteraction(draw);

      draw.on('drawstart', () => {
        this.showDistance = false;
      });

      draw.on('drawend', (event) => {
        // 清空之前的线段坐标
        this.lineCoordinates = [];
        console.log('开始绘画')
        const lineFeature = event.feature;
        const lineGeometry = lineFeature.getGeometry();
        this.lineCoordinates = lineGeometry.getCoordinates();
        console.log("lineCoordinates:"+this.lineCoordinates)

        const line = new LineString(this.lineCoordinates);
        this.distance = line.getLength();
        console.log(this.distance)

        const center = line.getCoordinateAt(0.5); // 获取线段中心点
        const distanceOverlay = new Overlay({
          element: document.getElementById('distance-overlay'),
          position: center,
          positioning: 'bottom-center',
        });
        window.map1.addOverlay(distanceOverlay);
        this.showDistance = true;
        console.log("showDistance"+this.showDistance)
        this.drawTextAtCenter(center,`${this.distance/1000} km`)
      });

    },
    // 目录数据聚合显示图层方法
    async clusterShow() {
      this.mapshopPopup=true;
      this.mapshopPopup1=false;
      this.mapshopPopup2=false;
      const layer = this.getLayerByName("cluster");
      if (this.clusterShowFlag) {
        layer.setSource(new VectorSource({
          features: [],
        }))
        this.clusterShowFlag = false
      } else {
        this.clusterShowFlag = true
        if (layer) {
          window.map.removeLayer(layer);
        }
        // 聚合图层数据源
        var clusterSource = new Cluster({
          distance: 100, // 要素将被聚合在一起的像素距离，默认为20
          minDistance: 50, // 聚合块之间的最小像素距离，默认为零
          source: new VectorSource({
            features: this.features,
          }),
        })
        var clusterLayer = new VectorLayer({
          source: clusterSource,
          name: 'cluster',
          style: function (feature) {

            var size = feature.get('features').length;
            if (size == 1) {
              var features = feature.get('features');
              return new Style({
                image: new Icon({
                  src: require("../../src/assets/rot.png")
                }),
                // 标点的文字
                text: new Text({
                  // 文字
                  text: features[0].values_.name,
                  // 文字样式
                  fill: new Fill({
                    color: 'blue'
                  }),
                  font: '8px Calibri',
                  // 偏移量
                  offsetY: 10
                })
              })
            } else {
              return new Style({
                image: new Circle({
                  radius: 10,
                  stroke: new Stroke({
                    color: 'white'
                  }),
                  fill: new Fill({
                    color: size < 50 ? '#444693' : '#f47920'

                  })
                }),
                text: new Text({
                  text: size.toString(),
                  fill: new Fill({
                    color: 'white'
                  })
                })
              });
            }
          }
        });
        window.map.addLayer(clusterLayer)
      }
    },
    getFeaturesFromMap(map) {
      const features = [];

      map.getLayers().forEach(layer => {
        if (layer instanceof VectorLayer) { // 仅处理矢量图层
          const source = layer.getSource();
          source.forEachFeature(feature => {
            features.push(feature);
          });
        }
      });
      console.log(features)

      return features;
    },
    clearpath(){
      console.log("清除路线")
      window.map.removeLayer(this.pathLayer);
      this.pathFeature=null;


    },
    drawPath() {
      console.log("开始绘制路线")
      if (this.pathFeature) {
        window.map.removeLayer('webPathCluster');
        this.pathFeature=null;
      }
      console.log(this.mapmarkers)
      if (this.mapmarkers && Array.isArray(this.mapmarkers)) {
        const numberOfFeatures = this.mapmarkers.length;
        console.log(numberOfFeatures)
        if (numberOfFeatures > 1) {
          const pathCoordinates = this.mapmarkers.map(marker => {console.log(marker.getGeometry().getCoordinates()); // 打印坐标
          return marker.getGeometry().getCoordinates()});
          this.pathFeature = new Feature({
            geometry: new LineString(pathCoordinates),
          });
          this.pathFeature.setStyle(new Style({
            stroke: new Stroke({
              color: 'yellow',
              width: 2,
            }),
          }));
          console.log(this.pathFeature)
          this.pathLayer=new VectorLayer({
            source: new VectorSource({
              features: [this.pathFeature],
            }),
            name: 'webPathCluster',
          })

          window.map.addLayer(this.pathLayer);
          // 继续处理逻辑
        }
      }
    },
    drawSearch(){

      console.log('开始区域搜索')
      this.mapshopPopup=false;
      this.mapshopPopup1=false;
      this.mapshopPopup2=true;

      const source2=new VectorSource({
        features: this.features,
      })
      const vectorLayer2 = new VectorLayer({
        source: source2
      });
      window.map2 = new Map({
        target: 'mapWithDraw', // 绑定到指定的div容器
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=6bf83bd1a699540d61936a68711eb096',
            }),
          }),
          new TileLayer({
            source: new XYZ({
              url: "https://t0.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=6bf83bd1a699540d61936a68711eb096",
            }),
            isGroup: true,
            name: "天地图文字标注",
          }),
          vectorLayer2
        ],
        view: new View({
          center: [0, 0], // 设置地图中心点
          zoom: 2, // 设置地图缩放级别
        }),
      });
      const markersLayer = new VectorLayer({
        source: new VectorSource({
          features: this.features,
        }),
        name: 'markersLayer',
      });
      window.map2.addLayer(markersLayer);
      const draw = new Draw({
        source: source2,
        type: 'Circle',
      });
      window.map2.addInteraction(draw);
      draw.on('drawstart', () => {
        // 清除之前的绘制的圆形图层的数据源
        // window.map2.addLayer(markersLayer);
        source2.clear();
        // this.circleLayer.getSource().clear();
      });
      draw.on('drawend', event => {
        console.log("绘画结束")
        const drawnFeature = event.feature;
        const drawnGeometry = drawnFeature.getGeometry();
        const featuresInExtent = [];
        console.log(markersLayer.getSource().getFeatures().length)
        console.log(vectorLayer2.getSource().getFeatures().length)

        markersLayer.getSource().forEachFeature(feature => {
          const featureGeometry = feature.getGeometry();
          if (drawnGeometry.intersectsExtent(featureGeometry.getExtent())) {
            featuresInExtent.push(feature);
          }
        });
        // 高亮选中的标记点
        this.highlightFeatures(featuresInExtent);
        // 添加绘制的圆形要素到圆形图层的数据源
        // this.circleLayer.getSource().addFeature(drawnFeature);



      });
    },
    drawSearch2(){

      console.log('开始区域搜索')
      this.mapshopPopup=true;
      // this.mapshopPopup1=false;
      // this.mapshopPopup2=true;

      const source2=new VectorSource({
        features: this.features,
      })
      const vectorLayer2 = new VectorLayer({
        source: source2
      });
      window.map.addLayer(vectorLayer2);
      const markersLayer = new VectorLayer({
        source: new VectorSource({
          features: this.features,
        }),
        name: 'markersLayer',
      });
      window.map.addLayer(markersLayer);
      const draw = new Draw({
        source: source2,
        type: 'Circle',
      });
      window.map.addInteraction(draw);
      draw.on('drawstart', () => {
        // this.allowLeftClick = false;
        // 清除之前的绘制的圆形图层的数据源
        // window.map2.addLayer(markersLayer);
        source2.clear();

        // this.circleLayer.getSource().clear();
      });
      draw.on('drawend', event => {
        console.log("绘画结束")
        const drawnFeature = event.feature;
        const drawnGeometry = drawnFeature.getGeometry();
        const featuresInExtent = [];
        console.log(markersLayer.getSource().getFeatures().length)

        markersLayer.getSource().forEachFeature(feature => {
          const featureGeometry = feature.getGeometry();
          if (drawnGeometry.intersectsExtent(featureGeometry.getExtent())) {
            featuresInExtent.push(feature);
          }
        });
        // 高亮选中的标记点
        this.highlightFeatures(featuresInExtent);
        // 添加绘制的圆形要素到圆形图层的数据源
        // this.circleLayer.getSource().addFeature(drawnFeature);
        // 启用其他左键点击事件
        // this.allowLeftClick = true;



      });
    },

    highlightFeatures(features){
      // 清除之前的高亮效果
      this.selectedFeatures.forEach(feature => {
        const originalText = feature.getStyle().getText();
        feature.setStyle(new Style({
          image: new Icon({
            src: require("../assets/img/home_img/地点.png"),
            scale: [0.2,0.2],
          }),
          text: originalText, // 使用原有的文本样式
        }));
      });

      // 添加高亮效果到选中的标记点
      features.forEach(feature => {
        const originalText = feature.getStyle().getText();
        feature.setStyle(new Style({
          image: new Icon({
            src: require("../assets/img/home_img/地点1.png"),
            scale: [0.2,0.2],
          }),
          text: originalText, // 使用原有的文本样式
        }));
      });

      this.selectedFeatures = features;
    },


  }
}
</script>

<style>
.mymap {
    margin: 0;
    height: 100%;
    width: 100%;
    background-color: white;
    padding: 2px;

    border-radius: 10px;
}

.button-container {
    position: fixed;
    right: 20px;
    bottom: 20px;
}

.menu {
    position: absolute;
    right: 0;
    bottom: -120px;
    /* 设置菜单隐藏位置 */
    width: 150px;
    background-color: #ffffff;
    border: 1px solid #db1717;
    padding: 10px;
    z-index: 9999;
    transition: bottom 0.3s ease-in-out;
}

.menu.visible {
    bottom: 0;
    /* 设置菜单显示位置 */
}

.addnew_ck {

    margin-bottom: 10px;
    display: flex;
    position: fixed;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    top: 20%;
    left: 35%;
    /*translate:(-50%,-50%);*/
    background-color: white;
    padding: 20px;
    border: 1px solid black;
}
.distance-overlay {

  z-index: 1;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(217, 20, 20, 0.77);
  border-radius: 5px;
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: none;
}
.distance-value {
  font-weight: bold;
  font-size: 100px;
  flood-color: red;
}
.addnew_ck1 {
  margin-bottom: 10px;
  display: flex;
  position: fixed;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 14%;
  left: 30%;
  /*translate:(-50%,-50%);*/
  background-color: white;
  padding: 20px;
  border: 1px solid black;
}

/* 垂直排列输入框行的样式 */
.chuizhiRow {
    margin-bottom: 10px;

}

/* 横向排列按钮行的样式 */
.hengRow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.ol-control {
  position: absolute;
  background-color: var(--ol-subtle-background-color);
  border-radius: 4px;
}
.inputBox {
    width: 520px;
    padding: 10px 10px;
    font-size: 16px;
    color: #000000;
    letter-spacing: 1px;
    margin: 10px 10px;
    border: 1px solid #000;
    outline: none;
    background: transparent;
    border-radius: 10px;

}
</style>


