<template>
    <div id="f2">
        <el-container>
            <el-header style="height:40px;">
                <tabbar></tabbar>
            </el-header>
            <el-main style="height:880px;padding-left: 0px;padding-right: 0px;">
              <router-view></router-view>
            </el-main>
        </el-container>
        <footer-txt></footer-txt>

    </div>
</template>

<script>
import * as THREE from "three";
import GLOBE from "vanta/src/vanta.globe";
import Tabbar from "./tabbar";
import FooterTxt from "./footerTxt";
import 'element-plus/theme-chalk/index.css'
// import * as particlesJs from "particles.js";
// 静态文件资源
// import particlesCfg from "@/static/Json/particles.json";
import GSAP from 'gsap'; // 导入GSAP库
export default {
  name: "home",
  components: {FooterTxt, Tabbar},



}

</script>

<style scoped>
#f2 {
    height: 100%;
    width: 100%;
}
.vanta-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
.rotating-text {
  font-size: 24px;
  font-weight: bold;
}
.text-wrapper {
  position: absolute;
  top: 50%;
  left: 30%; /* 通过调整 left 和 top 来调整文字的位置 */
  transform: translate(-50%, -50%);
  z-index: 1;
}

.text {
  position: relative;
}

.rotating-text {
  font-size: 24px;
  font-weight: bold;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 8px;
  border-radius: 8px;
}

.el-header {
    --el-header-padding: 0px;
}
.box {

  position: relative;
  height: 100%;
  width: 100%;
}
.banner {
  z-index: 999;
  position: absolute;
  top: 30%;
  left: 10%;
  color: #fff;
}

h1 {
  font-size: 66px;
}
p {
  margin-top: 60px;
  font-size: 22px;
}



</style>
