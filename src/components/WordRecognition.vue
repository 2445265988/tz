<template>
    <div style="height: 100%; background-color:white;">
        <div class="check-div form-inline">
            <input type="file" id="cixing_files" style="display: none;" @change="cixing_fileImport();">
            <el-button id="cixing_file_btn" data-toggle="modal" class="btn btn-yellow btn-xs" type="primary" size="medium"
                       style=" width: 200px; height: 80px;   margin: 20px;"  onclick="document.getElementById('cixing_files').click()"><img
                src="../assets/img/导入.png" style="width:60px;height:60px" ><span style="font-size: 20px ;padding-left: 15px">导入文本</span></el-button>
        </div>
        <div>
            <textarea id="wenben_textarea" style="margin: 20px; height: 270px;width:97%; resize: none"></textarea>
        </div>
        <div class="check-div form-inline" style="height: 100px;line-height: 99px;background-color: #eff3f6">
            <button class="btn btn-yellow btn-xs btn-model" index="1" id="zhong_wen_fen_ci" data-toggle="modal"
                style="margin-left: 50px;" @click="Word_Recognition('zhongwen_fenci', $event)"><img v-if="flag === '1'"
                    src="../assets/img/home_img/分词标注.png"> <img v-else src="../assets/img/home_img/分词标注_hover.png">
                <h5 style="font-size: 10px;text-align: center">中文分词</h5>
            </button>
            <button class="btn btn-yellow btn-xs btn-model" index="2" id="extract_tags" data-toggle="modal"
                style="margin-left: 50px;" @click="Word_Recognition('extract_tags', $event)"><img v-if="flag === '2'"
                    src="../assets/img/home_img/关键词提取.png"><img v-else src="../assets/img/home_img/关键词提取_hover.png">
                <h5 style="font-size: 10px;text-align: center">关键词提取</h5>
            </button>
            <button class="btn btn-yellow btn-xs btn-model" index="3" id="word_frequency_statics" data-toggle="modal"
                style="margin-left: 50px;" @click="Word_Recognition('frequency_statics', $event)"><img v-if="flag === '3'"
                    src="../assets/img/home_img/词频统计.png"><img v-else src="../assets/img/home_img/词频统计_hover.png">
                <h5 style="font-size: 10px;text-align: center">词频统计</h5>
            </button>
            <button class="btn btn-yellow btn-xs btn-model" index="4" id="extract_toponym" data-toggle="modal"
                style="margin-left: 50px;" @click="Word_Recognition('relation_recognition', $event)"><img
                    v-if="flag === '4'" src="../assets/img/home_img/依存文法.png"><img v-else
                    src="../assets/img/home_img/依存文法_hover.png">
                <h5 style="font-size: 10px;text-align: center">三元组抽取</h5>
            </button>
            <button class="btn btn-yellow btn-xs btn-model" index="10" data-toggle="modal" style="margin-left: 50px;"
                @click="Word_Recognition('map_visualization', $event)"><img src="../assets/img/home_img/地图可视化_hover.png">
                <h5 style="font-size: 10px;text-align: center">地图可视化</h5>
            </button>
        </div>
        <div>
            <div id="cixingshibie_textarea"
                style="margin: 20px; height: 270px;width: 1590px; resize: none;display: none;border: 1px solid black; padding: 10px;"
                readonly></div>
            <div id="allmap" style="margin: 20px; height: 450px;width: 1590px; resize: none; display: none"></div>
            <div id="graph" style="margin: 20px; height: 450px;width: 1200px; resize: none; display: none"></div>
            <!--    <baidu-map ak="1x0fHCFS8lPL50Mjf8INy4QzVDzq3e1h" style="margin: 20px; height: 450px;width: 1200px; resize: none; display: none"></baidu-map>-->
            <div id="wordfrequency" style="margin: 20px; height: 450px;width: 1200px; resize: none; display: none"></div>
        </div>
    </div>
</template>

<script>
import "ol/ol.css";
import { Map, View } from "ol";
import * as echarts from 'echarts'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { XYZ, Vector as VectorSource } from 'ol/source';
import { Point } from 'ol/geom';
import Feature from 'ol/Feature';
import { Text, Style, Fill, Icon } from "ol/style";
// import * as olProj from "ol/proj";
import { WordReconiton, TripletRecognition } from '../utils/kk'
export default {
    name: "WordRecognition",
    data() {
        return {
            flag: 0
        }
    },
    components: {

    },
    created() {
    },
    methods: {
        // 词频统计显示方法
        barchart_frequency(word, frequency) {
            document.getElementById("wordfrequency").style.display = "block"
            var myChart = echarts.init(document.getElementById('wordfrequency'));
            // 指定图表的配置项和数据
            let option = {
                title: {
                    text: '词频统计'
                },
                tooltip: {},
                legend: {
                    data: ['频率']
                },
                xAxis: {
                    data: word
                },
                yAxis: {},
                series: [{
                    name: '频率',
                    type: 'bar',
                    data: frequency
                }]
            };
            myChart.setOption(option);
        },
        Triplet_Recognition(model) {
            var data = document.getElementById("wenben_textarea").value
            if (data !== "") {
                TripletRecognition(data, model).then(response => {
                    // console.log(response.content)
                    if (response.content !== "") {
                        document.getElementById("cixingshibie_textarea").innerText = response.content
                        document.getElementById("allmap").style.display = "none"
                        document.getElementById("wordfrequency").style.display = "none"
                    }
                })
            }
        },
        // 文本识别调用方法
        Word_Recognition(model, event) {
            console.log(event)
            this.flag = event.currentTarget.getAttribute('index')
            var data = document.getElementById("wenben_textarea").value
            if (data !== "") {
                WordReconiton(data, model).then(response => {
                    console.log(response.content)
                    if (response.content !== "") {
                        let content = JSON.parse(response.content)
                        if (model == "zhongwen_fenci" || model == "extract_tags") {
                            content.forEach(item => {
                                let regex = new RegExp(item.name, 'g');
                                data = data.replace(regex, `<span style="background-color:${this.getRandomColor()}">${item.name}</span>`);
                            })
                            document.getElementById("cixingshibie_textarea").innerHTML = data
                            document.getElementById("cixingshibie_textarea").style.display = "block"
                            document.getElementById("wordfrequency").style.display = "none"
                            document.getElementById("allmap").style.display = "none"
                            document.getElementById("graph").style.display = "none"
                        }

                        // 地图可视化
                        if (model == "map_visualization") {
                            document.getElementById("cixingshibie_textarea").style.display = "none"
                            document.getElementById("wordfrequency").style.display = "none"
                            document.getElementById("graph").style.display = "none"
                            this.initMap(content)
                            document.getElementById("allmap").style.display = "block"
                        }
                        // 词频统计
                        else if (model == "frequency_statics") {
                            let words = [];
                            let counts = []
                            content.forEach(item => {
                                words.push(item.name);
                                counts.push(item.count)
                            })
                            document.getElementById("cixingshibie_textarea").style.display = "none"
                            document.getElementById("allmap").style.display = "none"
                            document.getElementById("graph").style.display = "none"
                            this.barchart_frequency(words, counts)
                            // 图谱展示
                        } else if (model == "relation_recognition") {
                            let datas = [];
                            let links = content;
                            content.forEach(item => {
                                let data1 = {
                                    name: item.source
                                };
                                let data2 = {
                                    name: item.target
                                }
                                if (!datas.some(item => item.name === data1.name)) {
                                    datas.push(data1)
                                }
                                if (!datas.some(item => item.name === data2.name)) {
                                    datas.push(data2)
                                }

                            })
                            console.log(datas, links)
                            document.getElementById("cixingshibie_textarea").style.display = "none"
                            document.getElementById("allmap").style.display = "none"
                            document.getElementById("cixingshibie_textarea").style.display = "none"
                            this.initGraph(datas, links)

                        }
                    }
                })
            } else {
                alert("请先导入文本，再执行！！！");
            }
        },
        cixing_fileImport: function () {
            document.activeElement.blur();
            //获取读取我文件的File对象
            var selectedFile = document.getElementById('cixing_files').files[0];
            var reader = new FileReader();//这是核心,读取操作就是由它完成
            reader.readAsText(selectedFile);//读取文件的内容,也可以读取文件的URL
            // var that = this
            reader.onload = function () {
                var txts = this.result;
                var wenben = document.getElementById("wenben_textarea")
                wenben.innerText = txts
                // console.log(txts)
            }
        },
        getRandomColor() {
            const letters = '0123456789ABCDEF';
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },
        // 显示地图
        initMap(data) {
            if (!data) {
                return
            }
            // 使用data 构建地名
            // 假设 place 是一个包含经度和纬度的对象，如 { longitude: 103.3, latitude: 35.5 }
            // 创建一个 feature 并添加到地图上
            let features = []
            data.forEach(element => {
                console.log(Number(element.longitude))
                let feature = new Feature({
                    name: element.name,
                    geometry: new Point([Number(element.longitude), Number(element.latitude)]),
                });
                feature.setProperties({
                    feature_type: "webData",
                    detail: element
                })
                let style = new Style({
                    image: new Icon({
                        src: require("../assets/img/home_img/地点.png")
                    }),
                    // 标点的文字
                    text: new Text({
                        // 文字
                        text: element.name,
                        // 文字样式
                        fill: new Fill({
                            color: 'red'
                        }),
                        font: '14px Calibri',
                        // 偏移量
                        offsetY: 20
                    })
                })
                feature.setStyle(style);
                features.push(feature)
            });

            // 创建一个 vector layer 并添加到地图上
            const vectorLayer = new VectorLayer({
                source: new VectorSource({
                    features: features,
                }),
            });
            new Map({
                target: "allmap",
                layers: [
                    new TileLayer({
                        source: new XYZ({
                            url: "https://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=6bf83bd1a699540d61936a68711eb096",
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
                    projection: "EPSG:4326",
                    center: [parseFloat(data[0].longitude), parseFloat(data[0].latitude)],
                    zoom: 6,
                }),
            });
        },
        // 显示通过文本获得的三元组图谱
        initGraph(data, links) {
            document.getElementById("graph").style.display = "block"
            var myChart = echarts.init(document.getElementById('graph'));
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
            myChart.setOption(option);

        }
    }
}
</script>

<style scoped>
@import "../assets/css/bootstrap.css";


#wenben_textarea {
    color: black;
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    text-align: justify;
    padding: 20px;
}
</style>