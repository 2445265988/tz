<template>
    <div class="body">
        <!-- 对话区域 -->
        <el-row>
            <el-col :span="12">
                <div id="box">
                    <div class="b-head">
                        <img class="h-img" alt="" src="../assets/logo.png" width=80; height=60; />
                        <span class="h_span">地学知智能问答机器人</span>
                    </div>
                    <div class="b-body" id="dialogue_box">
                        <div class="rotWord">
                            <span></span>
                            <p>嗨，欢迎使用地学智能问答系统！</p>
                        </div>
                        <div v-for="(item, index) in dialogData" :key="index">
                            <div class="mWord">
                                <span></span>
                                <p>{{ item.person }}</p>
                            </div>
                            <div class="rotWord">
                                <span></span>
                                <p>{{ item.rot }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="b-footer">
                        <el-row :gutter="10">
                            <el-col :span="22">
                                <el-input v-model="input" placeholder="请输入内容(如：武汉市下级行政区划有哪些？)" clearable></el-input>
                            </el-col>
                            <el-col :span="2">
                                <el-button type="primary" id="btn" @click="questionSent">发送</el-button>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-col>
            <!-- 知识可视化区域 -->
            <el-col :span="12">
                <div class="kgview">
                    <el-card class="kgcard">
                        <template #header>
                            <div class="card-header">
                                <span style="font-size: 18px; font-weight: 550; font-family: Microsoft YaHei;">知识卡片</span>
                            </div>
                        </template>
                        <el-row :gutter="20">
                            <el-col :span="2">
                                <div class="label"
                                    style="font-size: 15px; color: black; font-weight: 550; font-family: Microsoft YaHei;">
                                    描述:</div>
                            </el-col>
                            <el-col :span="22">
                                <div style="font-size: 15px; color: black; font-weight: 550; font-family: Microsoft YaHei;">
                                    {{ this.card }}</div>
                            </el-col>
                        </el-row>
                    </el-card>

                    <el-card class="kgimg" header="知识图谱">
                        <template #header>
                            <div class="card-header">
                                <span style="font-size: 18px; font-weight: 550; font-family: Microsoft YaHei;">知识图谱</span>
                            </div>
                        </template>
                        <kgecharts :options="kgoptions" :width="kgwidth" :height="kgheight" @clickNode="clickNode2">
                        </kgecharts>
                    </el-card>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import axios from "axios"
import dataServerIp from '../assets/js/dataserverip'
import kgecharts from './kgecharts.vue'
axios.defaults.baseURL = dataServerIp.dataServerIp
export default {
    components: { kgecharts },
    data() {
        return {
            input: '',
            dialogData: [],
            // echarts知识图谱数据
            kgoptions: {
                title: {
                    text: ''
                },
                tooltip: {
                    formatter: function (x) {
                        return x.data.des;
                    }
                },
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 12
                        }
                    }
                },
                legend: {
                    show: true,
                    data: ['Country', 'Province', 'City', 'District', 'Street', 'Region', 'Statistics', 'Proxy', '幼儿园', '小学', '中学', '中专', '大专院校', '驾校', '党校', 'State', 'FreeState'],
                    textStyle: {
                        color: '#000'
                    },
                    icon: 'circle',
                    type: 'scroll',
                    orient: 'horizontal',
                    left: 'auto',
                    top: 'auto',
                    bottom: 'auto',
                    itemWidth: 10,
                    itemHeight: 10
                },
                series: [
                    {
                        type: 'graph',
                        layout: 'force',
                        symbolSize: 45,
                        focusNodeAdjacency: false, // 是否在鼠标移到节点上的时候突出显示节点以及节点的边和邻接节点。
                        roam: true, // 是否开启鼠标缩放和平移漫游
                        draggable: true, // 是否可拖拽
                        label: {
                            show: true,
                            position: 'inside', // or 'top' or 'bottom' or 'left' or 'right'
                            formatter: function (params) {
                                return params.data.name; // Display node name
                            },
                            textStyle: {
                                fontSize: 12,
                                fontWeight: 'bold'
                            }
                        },
                        force: {
                            repulsion: 400,
                            friction: 0.2
                        },
                        edgeSymbol: ['circle', 'arrow'], // 设置边两端的形状
                        edgeSymbolSize: [1, 10],
                        edgeLabel: {
                            show: true,
                            position: 'middle', // or 'start' or 'end'
                            formatter: function (params) {
                                return params.data.name; // Display edge name
                            },
                            textStyle: {
                                fontSize: 10
                            }
                        },
                        lineStyle: {
                            normal: {
                                opacity: 0.9,
                                width: 1,
                                curveness: 0
                            }
                        },

                        data: [],
                        links: []
                    }
                ]
            },
            card: "",
            kgwidth: '100%',
            kgheight: '430px',
            kgIdList: new Set(),
            kgEdgeIdSet: new Set(),
            // 知识卡片数据
            nodecolumn: [{ label: '功能简介', prop: 'des' }],
        }
    },
    methods: {
        questionSent() {
            if (this.input === '') {
                this.dialogData.push({ person: '...', rot: '你啥也没说啊！' })
            } else {
                // 思知对话接口
                axios.get('/bot', {
                    params: {
                        spoken: this.input
                    }
                })
                    .then((response) => {
                        console.log(response)
                        this.dialogData.push({ person: this.input, rot: response.data.text })
                        this.input = ''
                        // // 知识图谱
                        this.kgoptions.series[0].data = response.data.nodes
                        this.kgoptions.series[0].links = response.data.links
                        // 知识卡片
                        this.card = response.data.card
                        console.log(this.card)
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            }
        },
        // 利用label,name(alias)获取一阶子图
        getOneSubKg(option, label, name) {
            axios.get('/guotu/kg/init', {
                params: {
                    label: label,
                    name: name
                }
            })
                .then((response) => {
                    option.series[0].data = response.data.data
                    option.series[0].links = response.data.links
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        // 知识图谱节点展开接口
        kgAddNodes(option, id) {
            axios.get('/guotu/kg/update_from_nodeid', {
                params: {
                    id: id
                }
            })
                .then((response) => {
                    // for in 遍历的key为索引值
                    for (const key1 of response.data.data) {
                        if (this.kgIdList.has(key1.id) === false) {
                            this.kgIdList.add(key1.id)
                            option.series[0].data.push(key1)
                        }
                    }
                    for (const key2 of response.data.links) {
                        if (this.kgEdgeIdSet.has(key2.id) === false) {
                            this.kgEdgeIdSet.add(key2.id)
                            option.series[0].links.push(key2)
                        }
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        clickNode2(nodeData) {
            if (nodeData.dataType === 'node') {
                if (this.kgIdList.size !== 0) {
                    this.kgAddNodes(this.kgoptions, nodeData.data.id)
                } else {
                    axios.get('/guotu/kg/update_from_nodeid', {
                        params: {
                            id: nodeData.data.id
                        }
                    })
                        .then((response) => {
                            this.kgoptions.series[0].data = response.data.data
                            this.kgoptions.series[0].links = response.data.links
                        })
                        .catch(function (error) {
                            console.log(error)
                        })
                }
            }
        }
    },
    // 每次页面渲染完之后滚动条在最底部
    updated() {
        this.$nextTick(() => {
            const div = document.getElementById('dialogue_box');
            div.scrollTop = div.scrollHeight;
        })
    },
    created() {
        this.getOneSubKg(this.kgoptions, 'country', '中华人民共和国-country')
    }

}
</script>

<style lang="scss" scoped>
.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}

.kgview {
    width: 97%;
    // height: 810px;
    background: rgba(255, 255, 255, .5);
    margin: 40px 20px 0px 0px;
    border-radius: 4px;
}

.kgcard {
    height: 300px;
    background-color: rgba(255, 255, 255, .5);
}

.kgimg {
    height: 495px;
    background-color: rgba(255, 255, 255, .5);
}

.body {
    position: absolute;
    font-size: 12px;
    font-family: "微软雅黑";
    background: url(../assets/bg.jpg) no-repeat;
    width: 100%;
    height: 100%;
    background-size: cover;
}

#box {
    width: 95%;
    background: rgba(255, 255, 255, .5);
    margin: 40px 0 0 20px;
    border-radius: 4px;
}

.b-head {
    width: 100%;
    height: 60px;
    background-color: rgba(0, 0, 255, .5);
    border-radius: 4px;
}

.h-img {
    margin: 0 20px;
    float: left;
    user-select: none;
}

.h_span {
    color: #fff;
    font-size: 18px;
    line-height: 60px;
    float: left;
    user-select: none;
    cursor: default;
}

.b-body {
    width: 100%;
    height: 650px;
    overflow: auto;
    margin: 20px 0;
}

.rotWord,
.mWord {
    width: 100%;
    margin-top: 10px;
    overflow: hidden;
}

p {
    margin-bottom: 0px;
    margin-top: 0px;
}

.rotWord span {
    background: url(../assets/rot.png);
    height: 40px;
    width: 40px;
    margin-left: 20px;
    float: left;
}

.rotWord p {
    word-break: break-all;
    top: 4px;
    float: left;
    color: #fff;
    font-size: 14px;
    margin-left: 10px;
    padding: 10px;
    line-height: 24px;
    background: rgba(0, 0, 255, .5);
    border-radius: 6px;
    max-width: 400px;
}

.mWord span {
    background: url(../assets/my.png);
    height: 40px;
    width: 40px;
    float: right;
    margin-right: 20px;
}

.mWord p {
    word-break: break-all;
    top: 2px;
    float: right;
    color: #fff;
    font-size: 14px;
    margin-right: 10px;
    padding: 10px;
    line-height: 24px;
    background: #19b955;
    border-radius: 6px;
    max-width: 240px;
}

.b-footer {
    width: 95%;
    margin: 0px 20px 10px 20px;
    padding-bottom: 20px;
    font-size: 16px;
}

.kgcard {
    margin-bottom: 20px;
    border-radius: 4px;
}

.kgimg {
    margin-bottom: 20px;
    border-radius: 4px;
}
</style>
