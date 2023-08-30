<template>
  <div class="box special-box">
    <div ref="vantaRef"  class="vanta-container" style="width: 100%; height: 100%"></div>
    <div class="title1">地学时空知识图谱</div>
    <div class="title2">三维可视化平台</div>

    <div class="stage">
      <div class="text">
        知识图谱
      </div>
    </div>
    <div class="stage2">
      <div class="text2">
        三维实景
      </div>
    </div>
    <div class="stage3">
      <div class="text3">
        深度学习
      </div>
    </div>
    <div class="stage4">
      <div class="text4">
        命名实体识别
      </div>
    </div>
    <div class="stage5">
      <div class="text5">
        词汇云
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import GLOBE from "vanta/src/vanta.globe";

export default {
  name: "shouye",

  mounted() {
    // window.changeTextRefGlobal = this.$refs.changeTextRef.id;

    this.vantaEffect = GLOBE({
      el: this.$refs.vantaRef,
      THREE: THREE,
    });
    GLOBE({
      el: this.$refs.vantaRef,
      /*以下为样式配置*/
      mouseControls: false,
      touchControls: true,
      gyroControls: false,
      minHeight:830,
      minWidth: 800,
      scale: 1.0,
      scaleMobile: 1.0,
      color: 0xc5c5c5,
      size: 1.1,
      backgroundColor: 0x1e105d,
    });
  },
}
</script>

<style scoped>
.stage {
  transform-style: preserve-3d;
  position: fixed;
  top: 50%;
  left: 77%;
  transform: translate3d(-50%, -50%, 0);
}
.stage2 {
  transform-style: preserve-3d;
  position: fixed;
  top: 40%;
  left: 78%;
  transform: translate3d(-50%, -50%, 0);
}
.stage3 {
  transform-style: preserve-3d;
  position: fixed;
  top: 30%;
  left: 78%;
  transform: translate3d(-50%, -50%, 0);
}
.stage4 {
  transform-style: preserve-3d;
  position: fixed;
  top: 60%;
  left: 78%;
  transform: translate3d(-50%, -50%, 0);
}
.stage5 {
  transform-style: preserve-3d;
  position: fixed;
  top: 70%;
  left: 78%;
  transform: translate3d(-50%, -50%, 0);
}
.text {
  width: 200px;
  height: 100px;
  line-height: 50px;
  text-align: center;
  white-space: nowrap;
  animation: rotate 6s linear infinite;
  backface-visibility: hidden;
  font-size:30px;
  /*font-weight: bold;*/
  text-shadow: 0 0 2px rgba(39, 78, 136, 0.98), 0 0 3px rgb(255, 255, 255), 0 0 4px rgb(255, 255, 255), 0 0 5px rgb(255, 255, 255) !important;
  /*position:fixed;*/
  /*top:10%;*/
  /*left:10%;*/
  color: white;
}
.text2 {
  width: 200px;
  height: 100px;
  line-height: 50px;
  text-align: center;
  white-space: nowrap;
  animation: rotate2 8s linear infinite;
  backface-visibility: hidden;
  text-shadow: 0 0 2px rgba(39, 78, 136, 0.98), 0 0 3px rgb(255, 255, 255), 0 0 4px rgb(255, 255, 255), 0 0 5px rgb(255, 255, 255) !important;
  font-size:30px;
  /*position:fixed;*/
  /*top:10%;*/
  /*left:10%;*/
  color: white;
}
.text3 {
  width: 200px;
  height: 100px;
  line-height: 50px;
  text-align: center;
  white-space: nowrap;
  animation: rotate3 6s linear infinite;
  text-shadow: 0 0 2px rgba(39, 78, 136, 0.98), 0 0 3px rgb(255, 255, 255), 0 0 4px rgb(255, 255, 255), 0 0 5px rgb(255, 255, 255) !important;
  backface-visibility: hidden;
  font-size:30px;
  /*position:fixed;*/
  /*top:10%;*/
  /*left:10%;*/
  color: white;
}
.text4 {
  width: 200px;
  height: 100px;
  line-height: 50px;
  text-align: center;
  white-space: nowrap;
  animation: rotate4 7s linear infinite;
  text-shadow: 0 0 2px rgba(39, 78, 136, 0.98), 0 0 3px rgb(255, 255, 255), 0 0 4px rgb(255, 255, 255), 0 0 5px rgb(255, 255, 255) !important;
  backface-visibility: hidden;
  font-size:30px;
  /*position:fixed;*/
  /*top:10%;*/
  /*left:10%;*/
  color: white;
}
.text5 {
  width: 200px;
  height: 100px;
  line-height: 50px;
  text-align: center;
  white-space: nowrap;
  animation: rotate5 8s linear infinite;
  text-shadow: 0 0 2px rgba(39, 78, 136, 0.98), 0 0 3px rgb(255, 255, 255), 0 0 4px rgb(255, 255, 255), 0 0 5px rgb(255, 255, 255) !important;
  backface-visibility: hidden;
  font-size:30px;
  /*position:fixed;*/
  /*top:10%;*/
  /*left:10%;*/
  color: white;
}

@keyframes rotate {
  from {
    transform: rotateY(0deg) translateZ(300px);
  }
  to {
    transform: rotateY(360deg) translateZ(300px);
  }
}
@keyframes rotate2 {
  from {
    transform: rotateY(30deg) translateZ(250px);
  }
  to {
    transform: rotateY(390deg) translateZ(250px);
  }
}
@keyframes rotate3 {
  from {
    transform: rotateY(40deg) translateZ(200px);
  }
  to {
    transform: rotateY(400deg) translateZ(200px);
  }
}
@keyframes rotate4 {
  from {
    transform: rotateY(30deg) translateZ(250px);
  }
  to {
    transform: rotateY(390deg) translateZ(250px);
  }
}
@keyframes rotate5 {
  from {
    transform: rotateY(40deg) translateZ(200px);
  }
  to {
    transform: rotateY(400deg) translateZ(200px);
  }
}
.title1{
  width: 800px;
  height: 100px;
  position: fixed;
  top:30%;
  color: white;
  left: 10%;
  text-shadow: 0 0 2px rgba(39, 78, 136, 0.98), 0 0 3px rgba(39, 78, 136, 0.98), 0 0 4px rgb(255, 255, 255), 0 0 5px rgba(39, 78, 136, 0.98) !important;
  font-size: 100px;

}
.title2{
  width: 700px;
  height: 100px;
  position: fixed;
  top:45%;
  left: 12%;
  color: white;
  text-shadow: 0 0 2px rgba(39, 78, 136, 0.98), 0 0 3px rgba(39, 78, 136, 0.98), 0 0 4px rgb(255, 255, 255), 0 0 5px rgba(39, 78, 136, 0.98) !important;
  font-size: 100px;

}
.box {

  position: relative;
  height: 100%;
  width: 100%;
}
</style>