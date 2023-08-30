<template >
  <div class="d1">
    <div class="box" style="justify-content: center;align-items: center;">
      <img src="../assets/img/图层2.png" style="width: 400px;height:120px">
      <div id="login" style="justify-content: center;align-items: center;display: flex;flex-direction: column;">
        <input type="text" class="inputBox" name="username" v-model="vv" required="" placeholder="用户名">
        <input type="password"  class="inputBox" name="password" v-model="tt" required="" placeholder="密码">
        <input style="justify-content: center;" type="submit" name="" v-on:click="sum()" value="登录">
      </div>
    </div>
    <p id="txt">中国地质大学（武汉） |  地学智能认知平台</p>
  </div>

</template>

<script>
import { getAll } from "../utils/kk";

export default {
  name: "login",
  data() {
    return {
      vv: null,
      tt: null
    }
  },
  methods: {
    sum(){
      let name = this.vv;
      let password = this.tt;
      getAll(name, password).then( response =>{
            // console.log('----', response.result)
            if(response.result){
              console.log('----', response.result)
              this.$router.push('/home/shouye')
            }
          }
      )
      console.log(this.vv, this.tt)
    }
  }
}
</script>

<style src="../assets/css/login.css" scoped></style>
<style scoped>

.d1 {
  height: 100%;
  width: 100%;
  background: url("../assets/img/login_img/background.jpg");
}
#txt {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%,0);
  color: white;
  /*width: 200px;*/
  /*background-color: #33caf2;*/
}
</style>