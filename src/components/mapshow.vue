<template>
  <div id="map" class="mymap"></div>
  <div>
    <div class="button-container">
      <button @click="showMenu">菜单按钮</button>
      <!-- 菜单内容 -->
      <div v-show="isMenuVisible" class="menu">
        <ul>
          <li @click="menuItemClick(0)" :class="{ active: selectedItemIndex === 0 }">增加标记</li>
          <li @click="menuItemClick(1)" :class="{ active: selectedItemIndex === 1 }">修改标记</li>
          <li @click="menuItemClick(2)" :class="{ active: selectedItemIndex === 2 }">查找标记</li>
        </ul>
      </div>
    </div>
  </div>
  <div v-show="inaddnewvisible" class="addnew_ck">
    <text>新增地址信息</text>
    <input v-model="address" type="text" placeholder="地址名称" />
    <input v-model="lalo" type="text" placeholder="经纬度" />
    <textarea v-model="description" rows="5" placeholder="描述"></textarea>
    <button @click="saveAddress">保存</button>
    <button @click="closeModal">关闭</button>

  </div>
</template>

<script>
import 'ol/ol.css';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

export default {
  data() {
    return {
      selectedItemIndex:-1,
      address: '',
      description: '',
      isMenuVisible: false,
      inaddnewvisible : false
    };
  },
  mounted() {
    this.initMap();
    // this.showMenu();
  },
  methods:{

    initMap(){
    //   创建地图容器和实体
      window.map = new Map({
        target: 'map', // 绑定到指定的div容器
        layers: [
          new TileLayer({
            source: new XYZ({
              url: 'https://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=6bf83bd1a699540d61936a68711eb096',
            }),
          }),
        ],
        view: new View({
          center: [0, 0], // 设置地图中心点
          zoom: 2, // 设置地图缩放级别
        }),
      })
    },

    showMenu() {
      console.log("点击菜单")
      this.$nextTick(() => {
        this.isMenuVisible = !this.isMenuVisible;
        const menu = document.querySelector('.menu');
        if (menu) {
          if (this.isMenuVisible) {
            menu.classList.add('visible');
          } else {
            menu.classList.remove('visible');
          }
        }
      });
    },
    saveAddress() {
      // 在这里执行保存地址信息的逻辑
      console.log('保存地址信息:', this.address);
      console.log('保存描述:', this.description);

      // 清空输入框和文本域
      this.address = '';
      this.description = '';

      // 关闭弹窗的逻辑
      this.closeModal();
    },
    closeModal() {
      this.inaddnewvisible = false
    },
    menuItemClick(index) {
      this.selectedItemIndex = index;
      // 在这里添加处理菜单项点击事件的逻辑
      if(index==0){
        console.log("点击了0");
        this.inaddnewvisible = true;
      }
      else
        this.inaddnewvisible = false;
      if(index==1){
        console.log("点击了1");
      }
      if(index==2){
        console.log("点击了2");
      }
    },
  }
  }
</script>

<style>
.mymap{
  width: 1700px;
  height: 850px;
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
  bottom: -120px; /* 设置菜单隐藏位置 */
  width: 150px;
  background-color: #ffffff;
  border: 1px solid #db1717;
  padding: 10px;
  z-index: 9999;
  transition: bottom 0.3s ease-in-out;
}
.menu.visible {
  bottom: 0; /* 设置菜单显示位置 */
}

.addnew_ck {
  display: flex;
  position: fixed;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  top: 50%;
  left: 50%;
  /*translate:(-50%,-50%);*/
  background-color: white;
  padding: 20px;
  border: 1px solid black;
}

</style>


