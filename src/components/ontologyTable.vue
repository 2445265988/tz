<template>
  <div role="tabpanel" class="tab-pane" id="ontology_table">
    <div id="ontology_fade" class="black_overlay" style="display: none">
      <div class="modal-dialog" id="ontology_dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title" id="ontologyLabel">实体标注</h4>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <form class="form-horizontal" id="ontology_form">

              </form>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-xs btn-white" @click="cancel_ontology()">取 消</button>
            <button type="button" class="btn btn-xs btn-green" @click=save_ontology()>保 存</button>
          </div>
        </div>
        <!-- /.modal-content -->
      </div>
    </div>
  </div>
</template>

<script>
import {getOutline, getCategory, getThird, getDetail} from '../utils/kk'
export default {
  name: "ontologyTable",
  created() {
    getOutline().then(response => {
      // console.log(response)
      var ontology_table = document.getElementById("ontology_table")

      for(let i in response){
        let that = this;
        var list = document.createElement('div')
        list.style.color = "red"
        list.style.fontSize = "25px"
        list.style.lineHeight = "40px"
        list.style.marginLeft = "20px"
        // console.log(response[i].Name)
        list.textContent = response[i].Code + "--" + response[i].Name
        list.id = response[i].Code
        list.addEventListener('click', function (){
          that.category(response[i].Code)
        })
        // list.setAttribute("onclick", "category("+ '"'+ response[i].Code+ '"'+")");
        ontology_table.appendChild(list)
      }

      ontology_table.style.display = "block";
    })
  },
  methods: {
    cancel_ontology(){
      document.getElementById("ontology_fade").style.display = 'none'
      var ontology_form = document.getElementById("ontology_form")
      var childs = ontology_form.childNodes
      for(var i = childs.length - 1; i >= 0; i--) {
        ontology_form.removeChild(childs[i]);
      }
    },
    fourth(Code){
      var category = document.getElementById(Code)
      if(category.childElementCount <= 2){
        getThird(Code).then(response => {
          let that = this
          for(let i in response){
            if (response[i].Code !== Code){
              var include = document.createElement("div")
              include.id = response[i].Code
              include.style.marginLeft = "30px"
              include.addEventListener('click', function (){
                event.stopPropagation()
              })

              var list = document.createElement("span")
              list.style.fontSize = "16px"
              list.style.color = "black"

              var detail = document.createElement("span")
              detail.innerHTML = "&nbsp&nbsp[详细信息]"
              detail.style.fontSize = "14px"
              detail.style.color = "blue"
              detail.addEventListener('click', function (){
                that.detail(response[i].Code)
                event.stopPropagation()
              })
              // detail.setAttribute("onclick", "detail("+ '"'+ response[i].Code+ '"'+")")


              list.textContent = response[i].Code + "--" + response[i].Name
              list.id = response[i].Code + "_include"
              list.addEventListener('click', function (){
                that.fourth(response[i].Code)
                event.stopPropagation()
              })
              // list.setAttribute("onclick", "fourth("+ '"'+ response[i].Code+ '"'+")");
              include.appendChild(list)
              include.appendChild(detail)

              category.appendChild(include)

            }
          }
        })
      }else {
        var childs = category.childNodes
        for(var i = childs.length - 1; i > 1; i--) {
          category.removeChild(childs[i]);
        }
      }
    },
    detail(Code){
      getDetail(Code).then(response => {
        var ontologyLabel = document.getElementById("ontologyLabel")
        var ontology_form = document.getElementById("ontology_form")
        var ontology_fade = document.getElementById("ontology_fade")

        for(let item in response[0]){
          if(response[0][item] !== null){
            console.log(item + ": " + response[0][item])
            if(item == "Name"){
              ontologyLabel.innerHTML = response[0][item]
            }else {
              var div_out = document.createElement('div')
              var label_ontology = document.createElement('label')
              var div_in = document.createElement('div')
              var input_ontology = document.createElement('input')

              div_out.className = "form-group"
              label_ontology.className = "col-xs-3 control-label"
              div_in.className = "col-xs-8"
              input_ontology.className = "form-control input-sm duiqi"

              input_ontology.type = "text"
              input_ontology.id = Code + item
              label_ontology.for = Code + item

              label_ontology.innerText = item
              input_ontology.value = response[0][item]

              div_in.appendChild(input_ontology)
              div_out.appendChild(label_ontology)
              div_out.appendChild(div_in)

              ontology_form.appendChild(div_out)
            }
          }
        }
        ontology_fade.style.display = 'block'
      })
    },
    third(Code){
      var category = document.getElementById(Code)
      if(category.childElementCount <= 2){
        getThird(Code).then(response => {
          let that = this
          for(let i in response){
            if (response[i].Code !== Code){
              var include = document.createElement("div")
              include.id = response[i].Code
              include.style.marginLeft = "30px"
              // include.setAttribute("onclick", "stop()");
              include.addEventListener('click', function (){
                event.stopPropagation()
              })

              var list = document.createElement("span")
              list.style.fontSize = "16px"
              list.style.color = "black"

              // list.style.float = 'left'

              var detail = document.createElement("span")
              // var a1 = '<span data-toggle="modal" data-target="#ontology_detail">&nbsp&nbsp[详细信息]</span>';
              detail.innerHTML = "&nbsp&nbsp[详细信息]"
              // detail.innerHTML = a1
              detail.style.fontSize = "14px"
              detail.style.color = "blue"
              detail.addEventListener('click', function (){
                that.detail(response[i].Code)
                event.stopPropagation()
              })
              // detail.setAttribute("onclick", "detail("+ '"'+ response[i].Code+ '"'+")")

              list.textContent = response[i].Code + "--" + response[i].Name
              list.id = response[i].Code +  "_include"
              list.addEventListener('click', function (){
                that.fourth(response[i].Code)
                event.stopPropagation()
              })
              // list.setAttribute("onclick", "fourth("+ '"'+ response[i].Code+ '"'+")");
              include.appendChild(list)
              include.appendChild(detail)

              category.appendChild(include)
            }
          }
        })
      }else {

        var childs = category.childNodes
        for(let i = childs.length - 1; i > 0; i--) {
          category.removeChild(childs[i]);
        }
      }
    },
    category(Code){

      var category = document.getElementById(Code)
      // console.log("now in category")
      if(category.childElementCount == 0){
        getCategory(Code).then(response => {
          // console.log(response)
          let that = this
          for(let i in response){
            if (response[i].Code !== Code){
              var list = document.createElement("div")
              list.style.color = "blue"
              list.style.fontSize = "20px"
              list.style.marginLeft = "30px"
              // list.textContent = "*"+response[i].Name
              // console.log(response)
              list.textContent = response[i].Code + "--" + response[i].Name
              list.id = response[i].Code
              // list.setAttribute("onclick", "third("+ '"'+ response[i].Code+ '"'+")");
              list.addEventListener('click', function (){
                that.third(response[i].Code)
                event.stopPropagation()
              })
              category.appendChild(list)
            }
          }
        })
      }else {
        var childs = category.childNodes
        for(var i = childs.length - 1; i > 0; i--) {
          category.removeChild(childs[i]);
        }
      }
    }
  }
}
</script>

<style scoped>

</style>