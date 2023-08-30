<template>
    <div class="tabbar">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
            background-color="#1e105d" text-color="#fff" active-text-color="#ffd04b" @select="handleSelect">
            <el-menu-item index="0">
                <img class="logo" alt="DDE标注平台" src="../assets/img/home_img/地球.png" />
                <!-- <span class="title">山地灾害关联网络平台</span> -->
                <span class="title"> 地 学 智 能 认 知 平 台</span>
            </el-menu-item>
            <div class="flex-grow" />
            <el-menu-item index="shouye">
                首页
            </el-menu-item>
            <el-sub-menu index="biaozhu">
                <template #title>标注系统</template>
                <el-menu-item index="annotationEntity">实体标注</el-menu-item>
                <el-menu-item index="annotationParticiple">分词标注</el-menu-item>
                <el-menu-item index="annotationLink">实体关系</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="concept">
                <template #title>领域概念知识体系</template>
                <!-- <el-menu-item index="ontologyTable">本体树</el-menu-item> -->
                <el-menu-item index="ontologyTree">地质领域本体</el-menu-item>
            </el-sub-menu>
            <el-sub-menu index="cixing">
                <template #title>信息抽取</template>
                <el-menu-item index="WordRecognition">中文分词</el-menu-item>
            </el-sub-menu>
            <el-menu-item index="qarobot">智能问答助手</el-menu-item>
            <el-sub-menu index="visualizationDetails">
                <template #title>数据可视化</template>
                <!-- <el-menu-item index="Triple">Triple</el-menu-item> -->
                <el-menu-item index="mapshow">实景地图</el-menu-item>
                <el-menu-item index="KGragh111">知识图谱</el-menu-item>
                <el-menu-item index="WordCloud">词汇云</el-menu-item>
                <el-menu-item index="paperlist">地质资料数据管理</el-menu-item>
                <!-- <el-menu-item index="BarChart">柱状图</el-menu-item> -->
                <!-- <el-menu-item index="CurveChart">曲线图</el-menu-item> -->
            </el-sub-menu>
            <el-menu-item index="testmap">人员管理</el-menu-item>
        </el-menu>

    </div>
</template>

<script>
import $ from 'jquery'
export default {
    name: "tabbar",
    data() {
        return {
            biaozhu_flag: 1,
            system_flag: 0,
            cixing_flag: 0,
            visualization_flag: 0,
            concept_flag: 0,
            activeIndex: "home"
        }
    },
    methods: {
        handleSelect(index) {
            this.activeIndex = index;
            if (index == "home" || index==0) {
                this.$router.push("/home/shouye")
            } else {
                this.$router.push("/home/" + index)
            }
        },
        user_manage_table_display() {
            this.$router.push('/home/testmap')
        },
        WordRecognition_onclick() {
            this.$router.push('/home/WordRecognition')
        },
        CurveChart_onclick() {
            this.$router.push('/home/CurveChart')
        },
        BarChart_onclick() {
            this.$router.push('/home/BarChart')
        },
        WordCloud_onclick() {
            this.$router.push('/home/WordCloud')
        },
        Triple_onclick() {
            this.$router.push('/home/Triple')
        },
        bot_onclick() {
            this.$router.push('/home/qarobot')
        },
        KGragh_onclick() {
            this.$router.push('/home/KGragh111')
        },
        ontologyTree_onclick() {
            this.$router.push('/home/ontologyTree')
        },
        ontologyTable_onclick() {
            this.$router.push('/home/ontologyTable')
        },
        annotationLink_onclick() {
            this.$router.push('/home/annotationLink')
        },
        annotationParticiple_onclick() {
            this.$router.push('/home/annotationParticiple')
        },
        annotationEntity_onclick() {
            this.$router.push('/home/annotationEntity')
        },
        home() {
            this.$router.push('/home/shouye')
        },
        biaozhu_onclick() {
            if (this.biaozhu_flag !== 1) {
                this.system_fade();
                this.cixing_fade();
                this.visualization_fade();
                this.concept_fade();
                this.biaozhu_display();
            }
        },
        system_onclick() {
            if (this.system_flag !== 1) {
                this.biaozhu_fade();
                this.cixing_fade();
                this.concept_fade();
                this.visualization_fade();
                this.system_display();
            }
        },
        cixing_onclick() {
            if (this.cixing_flag !== 1) {
                this.biaozhu_fade();
                this.system_fade();
                this.concept_fade();
                this.visualization_fade();
                this.cixing_display();
            }
        },
        concept_onclick() {
            if (this.concept_flag !== 1) {
                this.biaozhu_fade();
                this.system_fade();
                this.cixing_fade();
                this.visualization_fade();
                this.concept_display();
            }
        },
        visualization_onclick() {
            if (this.visualization_flag !== 1) {
                this.biaozhu_fade();
                this.system_fade();
                this.concept_fade();
                this.cixing_fade();
                this.visualization_display();
            }
        },
        biaozhu_fade() {
            $("#shi_ti").slideUp();
            $("#fen_ci").slideUp();
            $("#guan_xi").slideUp();
        },
        biaozhu_display() {
            $("#shi_ti").slideDown();
            $("#fen_ci").slideDown();
            $("#guan_xi").slideDown();
            this.biaozhu_flag = 1;
            this.system_flag = 0;
            this.cixing_flag = 0;
            this.concept_flag = 0
            this.visualization_flag = 0;
        },
        system_fade() {
            $("#user_manage").slideUp();
        },
        system_display() {
            $("#user_manage").slideDown();
            this.system_flag = 1;
            this.biaozhu_flag = 0;
            this.cixing_flag = 0;
            this.concept_flag = 0
            this.visualization_flag = 0;
        },
        cixing_fade() {
            $("#zhongwen_fenci").slideUp();
        },
        cixing_display() {
            $("#zhongwen_fenci").slideDown();
            this.cixing_flag = 1;
            this.biaozhu_flag = 0;
            this.system_flag = 0;
            this.concept_flag = 0
            this.visualization_flag = 0;
        },
        concept_fade() {
            $("#ontology").slideUp();
            $("#ontology_tree").slideUp();
        },
        concept_display() {
            $("#ontology").slideDown();
            $("#ontology_tree").slideDown();
            this.concept_flag = 1;
            this.biaozhu_flag = 0;
            this.system_flag = 0;
            this.visualization_flag = 0
            this.cixing_flag = 0;
        },
        visualization_fade() {
            $("#triple").slideUp();
            $("#kgragh").slideUp();
            $("#wcloud").slideUp();
            $("#barchart").slideUp();
            $("#curvechart").slideUp();
            $("#piechart").slideUp();
        },
        visualization_display() {
            $("#triple").slideDown();
            $("#kgragh").slideDown();
            $("#wcloud").slideDown();
            $("#barchart").slideDown();
            $("#curvechart").slideDown();
            $("#piechart").slideDown();
            this.visualization_flag = 1;
            this.cixing_flag = 0;
            this.biaozhu_flag = 0;
            this.concept_flag = 0
            this.system_flag = 0;
        }
    }
}
</script>
<style scoped>
.tabbar {
    height: 55px;
}

.menu-wrapper {
    display: flex;
    align-items: center;
}

.el-menu-demo {
    line-height: 60px;
}

.flex-grow {
    flex-grow: 1;
}

.logo {
    width: 60px;
   height:60px;
}

.title {
    /*font-family: 'Brush Script MT', cursive;*/
    /* This is a cursive font. Replace it with your preferred font if needed */
    padding-left: 20px;
    font-size: 22px;
    /*font-weight:bold;*/
    /* Adjust the font size if needed */
    /* This will make the title take all remaining space, and thus center it */
    background: -webkit-linear-gradient(45deg, #ffffff, #ffffff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    /*text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);*/
    text-shadow: 0 0 2px rgb(255, 255, 255), 0 0 3px rgba(39, 78, 136, 0.98), 0 0 4px rgb(255, 255, 255), 0 0 5px rgb(255, 255, 255) !important;

}
</style>