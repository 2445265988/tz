<template>
    <div role="tabpanel" class="tab-pane active" id="sour" style="height: 100%; background-color:white;">
        <div class="check-div form-inline" style="display: flex;justify-content: center" >
            <input type="file" id="files" style="display: none;" @change="fileImport()" />
            <el-button class="btn btn-yellow btn-xs custom-primary" id="file_btn" data-toggle="modal" type="primary" size="medium"
                style=" width: 200px; height: 80px;   margin: 20px;" onclick="document.getElementById('files').click()"><img
                src="../assets/img/导入.png" style="width:60px;height:60px" ><span style="font-size: 20px ;padding-left: 15px">导入文本</span></el-button>
            <el-button type="success" class="btn btn-yellow btn-xs" id="save_btn" data-toggle="modal" size="medium"
                style="   width: 200px; height: 80px; margin: 20px;" @click="save()">
                <img src="../assets/img/保存.png" style="width:60px;height:60px">
              <span style="font-size: 20px ;padding-left: 15px">保存语料</span>
            </el-button>
            <el-button type="danger" class="btn btn-yellow btn-xs" id="withdraw" data-toggle="modal" size="medium"
                style="   width: 200px; height: 80px;   margin: 20px;" @click="withdraw()">
                <img src="../assets/img/撤销.png" style="width:60px;height:60px;">
              <span style="font-size: 20px ;padding-left: 15px">撤销</span>
            </el-button>
        </div>
        <div class="data-div">
            <div class="row tableHeader" id="biaozhu_header">
                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 custom-col" id="FileName">
                    文件名:
                </div>
                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4 custom-col" id="FileSize">
                    文件大小:
                </div>
            </div>
            <div id="CurrentContent" style="height: auto" @mousedown=" annotation_down()" @mouseup="annotation_up()">
            </div>
        </div>

        <!--实体添加模块-->
        <div class="modal-dialog" style="display: none" id="entity_type">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="gridSystemModalLabel">实体标注</h4>
                </div>
                <div class="modal-body">
                    <div class="container-fluid">
                        <form class="form-horizontal">
                            <div class="form-group ">
                                <label class="col-xs-3 control-label" id="focus_txt"></label>
                            </div>
                            <div id="form-content">
                                <button type="button" class="btn btn-xs btn-green" style="background-color: #afa275"
                                    @click="add_entity('GTM', '#afa275')">地质年代</button>
                                <button type="button" class="btn btn-xs btn-green" style="background-color: #bee5d2"
                                    @click="add_entity('GST', '#bee5d2')">地质构造</button>
                                <button type="button" class="btn btn-xs btn-green" style="background-color: #f3e566"
                                    @click="add_entity('STR', '#f3e566')">地层</button>
                                <button type="button" class="btn btn-xs btn-green" style="background-color: #789ca7"
                                    @click="add_entity('ROC', '#789ca7')">岩石</button>
                                <button type="button" class="btn btn-xs btn-green" style="background-color: #35a7f1"
                                    @click="add_entity('MIN', '#35a7f1')">矿物</button>
                                <button type="button" class="btn btn-xs btn-green" style="background-color: #957fbf"
                                    @click="add_entity('GDW', '#957fbf')">地下水</button>
                                <!--                <button type="button" class="btn btn-xs btn-green" style="background-color: #2ecc71" @click="add_entity('DIS','#2ecc71')">地质灾害</button>-->
                            </div><br>
                            <button type="button" class="btn btn-xs btn-green" style="background-color: #959c72"
                                @click="add_entity_type()">自定义实体</button>
                            <button type="button" class="btn btn-xs btn-green" @click="clean_annoation()">清除标记</button>
                        </form>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-xs btn-xs btn-white" data-dismiss="modal" @click="cancel()">取
                        消</button>
                </div>
            </div>
            <!-- /.modal-content -->
        </div>

        <div id="fade" class="black_overlay">
            <div class="modal-dialog" id="Customized_entities" style="display: none">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="gridBtnModalLabel">自定义实体</h4>
                    </div>
                    <div class="modal-body">
                        <div class="container-fluid">
                            <form class="form-horizontal">
                                <div class="form-group ">
                                    <label for="sName" class="col-xs-3 control-label">名称：</label>
                                    <div class="col-xs-8 ">
                                        <input type="email" class="form-control input-sm duiqi" id="sName" placeholder="">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="sLabel" class="col-xs-3 control-label">标签：</label>
                                    <div class="col-xs-8 ">
                                        <input type="" class="form-control input-sm duiqi" id="sLabel" placeholder="">
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="sColor" class="col-xs-3 control-label">标记颜色：</label>
                                    <div class="col-xs-8">
                                        <input type="color" class="form-control input-sm duiqi" id="sColor" placeholder="">
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-xs btn-white" data-dismiss="modal" @click="add_type_cancel()">取
                            消</button>
                        <button type="button" class="btn btn-xs btn-green" @click="add_type_save()">保存</button>
                    </div>
                </div>
                <!-- /.modal-content -->
            </div>
        </div>
        <!--页码块-->
        <footer class="footer" id="foot" v-show="footShow">
            <ul class="pagination">
                <li>
                    <select id="page-index" @click="page_select()">
                        <option>0</option>
                    </select>
                    页
                </li>
                <li class="gray" id="page_all">
                    共0页
                </li>
                <li>
                    <i class="glyphicon glyphicon-menu-left" @click="previous()">
                    </i>
                </li>
                <li>
                    <i class="glyphicon glyphicon-menu-right" @click="next()">
                    </i>
                </li>
            </ul>
        </footer>
    </div>
</template>

<script>
import { saveAs } from 'file-saver';
export default {
    name: "annotationEntity",
    data() {
        return {
            fileName: "",
            txts: "",
            contents: "",
            current_page_index: -1,
            load_samples: [],
            load_lables: [],
            lists: [],
            modify_able: 0,
            btn_data: [{ model: 1, name: "地质年代", label: "GTM", color: "#afa275", count: 0 },
            { model: 1, name: "地质构造", label: "GST", color: "#bee5d2", count: 0 },
            { model: 1, name: "地层", label: "STR", color: "#f3e566", count: 0 },
            { model: 1, name: "岩石", label: "ROC", color: "#789ca7", count: 0 },
            { model: 1, name: "矿物", label: "MIN", color: "#35a7f1", count: 0 },
            { model: 1, name: "地点", label: "PLA", color: "#957fbf", count: 0 },
            { model: 2, name: "分词", label: "BME", color: "#957fbf", count: 0 },
            { model: 3, name: "因果", label: "cause", color: "#afa275", count: 0 },
            { model: 3, name: "距离", label: "distance", color: "#afa275", count: 0 },
            { model: 3, name: "时间", label: "time", color: "#afa275", count: 0 },
            { model: 3, name: "空间", label: "space", color: "#afa275", count: 0 },
            { model: 3, name: "属性", label: "property", color: "#afa275", count: 0 },],
            contents_coloumnlized: [],
            obj_mousedown: null,
            obj_mouseup: null,
            txtselected: "",
            start_end: null,
            undo: [],
            footShow: false
        }
    },
    methods: {
        next() {
            if (this.current_page_index + 1 < this.load_samples.length)
                this.current_page_index = this.current_page_index + 1;
            var page_index = document.getElementById("page-index");
            page_index.selectedIndex = this.current_page_index;
            this.text2obj_color();
        },
        previous() {
            if (this.current_page_index > 0)
                this.current_page_index = this.current_page_index - 1;
            var page_index = document.getElementById("page-index");
            page_index.selectedIndex = this.current_page_index;
            this.text2obj_color();
        },
        page_select() {
            var page_index = document.getElementById("page-index");
            this.current_page_index = page_index.selectedIndex;
            this.text2obj_color();
        },
        withdraw() {
            if (this.undo.length == 0)
                return;

            var last_operation = this.undo.pop();
            var page_index = document.getElementById("page-index");
            page_index.selectedIndex = last_operation.page;
            this.current_page_index = page_index.selectedIndex;


            if (last_operation.Operation !== "clean") {
                for (let i = last_operation.start; i <= last_operation.end; i++) {
                    this.load_lables[this.current_page_index][i] = "0";
                }
            } else {
                for (let i = last_operation.start; i <= last_operation.end; i++) {
                    var label = "";
                    for (let j = 0; j <= this.btn_data.length; j++) {
                        if (this.btn_data[j].label == last_operation.oringnal_label) {
                            label = this.btn_data[j].label;
                            break;
                        }
                    }
                    if (i == last_operation.start) {
                        this.load_lables[this.current_page_index][i] = "B-" + label;
                    } else if (i == last_operation.end) {
                        this.load_lables[this.current_page_index][i] = "E-" + label;
                    } else {
                        this.load_lables[this.current_page_index][i] = "I-" + label;
                    }

                }
            }
            this.text2obj_color();
        },
        save() {
            var result = [];
            var date = new Date();
            var year = date.getFullYear();
            var mon = date.getMonth() + 1;
            var da = date.getDate();
            for (let i = 0; i < this.load_samples.length; i++) {
                for (let j = 0; j < this.load_samples[i].length; j++) {
                    result.push(this.load_samples[i][j] + "\t" + this.load_lables[i][j]);
                }
            }

            this.fileName = year + "_" + mon + "_" + da + "_" + this.fileName;


            var blob = new Blob([result.join("\n")], { type: "text/plain;charset=utf-8" });
            saveAs(blob, this.fileName);
            // this.load_lables.splice(0, this.load_lables.length);
            // this.load_samples.splice(0, this.load_samples.length);
            console.log(this.load_lables)
            console.log(this.load_samples)
        },
        add_type_save() {
            let that = this;
            var name = document.getElementById("sName").value;
            var label = document.getElementById("sLabel").value;
            var color = document.getElementById("sColor").value;

            var form = document.getElementById("form-content");
            var btn = document.createElement("button");

            btn.innerText = name;
            btn.className = "btn btn-xs btn-green";
            btn.style.backgroundColor = color;
            btn.type = "button";
            // btn.addEventListener("click", ddd)
            btn.addEventListener("click", function () {
                that.add_entity(label, color)
            });

            form.appendChild(btn);

            this.add_type_cancel();
        },
        add_type_cancel() {
            document.getElementById("Customized_entities").style.display = 'none';
            document.getElementById("entity_type").style.display = 'block';
        },
        clean_annoation() {
            this.find_start_end();

            var exist_annoation = false;
            var clean_start = [];
            var clean_end = [];
            var clean_label = [];
            for (let i = this.start_end[0]; i <= this.start_end[1]; i++) {
                if (this.load_lables[this.current_page_index][i] !== "0") {
                    exist_annoation = false;
                    if (clean_start.length == clean_end.length) {

                        clean_start.push(i);
                        clean_label.push(this.load_lables[this.current_page_index][i].split("-")[1]);
                    } else if (this.load_lables[this.current_page_index][i].split("-")[1] !== clean_label[clean_label.length - 1]) {
                        exist_annoation = true;
                        clean_start.push(i);
                        clean_label.push(this.load_lables[this.current_page_index][i].split("-")[1]);
                    }

                    if (i == this.start_end[1]) {
                        exist_annoation = true;
                    }
                } else if (clean_start.length > clean_end.length) {
                    exist_annoation = true;
                }

                //                console.log(exist_annoation);

                if (exist_annoation) {
                    if (i == this.start_end[1] && this.load_lables[this.current_page_index][i] !== "0") {
                        clean_end.push(i);
                    } else {
                        clean_end.push(i - 1);
                    }
                    exist_annoation = false;
                }

                this.lists[i].style.backgroundColor = '#ffffff';
                this.load_lables[this.current_page_index][i] = "0";
            }

            for (let i in clean_start) {
                this.undo.push({ Operation: "clean", start: clean_start[i], end: clean_end[i], page: this.current_page_index, oringnal_label: clean_label[i] });
            }
            this.cancel();
        },
        add_entity_type() {
            document.getElementById("entity_type").style.display = 'none';
            document.getElementById("Customized_entities").style.display = 'block';
        },
        cancel() {
            this.obj_mousedown = null;
            this.obj_mousedown = null;
            document.getElementById("entity_type").style.display = 'none';
            document.getElementById("fade").style.display = 'none';
            this.modify_able = 1;
        },
        find_start_end() {
            this.txtselected = window.getSelection().toString().replace(/\n/g, "");

            var current_start_index = this.lists.indexOf(this.obj_mousedown);
            var current_end_index = this.lists.indexOf(this.obj_mouseup);


            if (this.lists[current_start_index].textContent !== this.txtselected[0])
                this.obj_mousedown = this.lists[current_start_index + 1];
            if (this.lists[current_end_index].textContent !== this.txtselected[this.txtselected.length - 1])
                this.obj_mouseup = this.lists[current_end_index - 1];
        },
        add_entity(label, color) {
            this.find_start_end();

            for (let i = this.start_end[0]; i <= this.start_end[1]; i++) {
                this.lists[i].style.backgroundColor = color;
                if (i == this.start_end[0]) {
                    this.load_lables[this.current_page_index][i] = "B-" + label;
                } else if (i == this.start_end[1]) {
                    this.load_lables[this.current_page_index][i] = "E-" + label;
                } else {
                    this.load_lables[this.current_page_index][i] = "I-" + label;
                }
            }

            this.undo.push({ Operation: label, start: this.start_end[0], end: this.start_end[1], page: this.current_page_index, oringnal_label: [] });
            this.cancel();
        },
        annotation_down() {
            if (!this.modify_able) return;
            this.obj_mousedown = event.target.tagName == "SPAN" ? event.target : this.obj_mousedown;
        },
        annotation_up() {
            if (!this.modify_able) return;
            this.obj_mouseup = event.target.tagName == "SPAN" ? event.target : this.obj_mouseup;
            this.txtselected = window.getSelection().toString().replace(/\n/g, "");

            var current_start_index = this.lists.indexOf(this.obj_mousedown);
            var current_end_index = this.lists.indexOf(this.obj_mouseup);
            if (this.txtselected == "") {
                return;
            }

            if (this.lists[current_start_index].textContent !== this.txtselected[0])
                this.obj_mousedown = this.lists[current_start_index + 1];
            if (this.lists[current_end_index].textContent !== this.txtselected[this.txtselected.length - 1])
                this.obj_mouseup = this.lists[current_end_index - 1];

            this.start_end = [this.lists.indexOf(this.obj_mousedown), this.lists.indexOf(this.obj_mouseup)];
            // console.log(this.lists[this.start_end[0]])
            // console.log(this.lists[this.start_end[1]])
            var entity_type = document.getElementById("entity_type");
            entity_type.style.position = 'fixed';
            entity_type.style.left = '25%';
            entity_type.style.top = '25%';
            entity_type.style.width = '25%';
            entity_type.style.height = '25%';
            entity_type.style.margin = '10px';
            entity_type.style.zIndex = '1003';
            entity_type.style.display = 'block';

            var focus_txt = document.getElementById("focus_txt");
            if (this.txtselected.length > 20) {
                this.txtselected = this.txtselected.substr(0, 20);
            }
            focus_txt.innerHTML = this.txtselected;

            //此时，鼠标不能再选择其他span元素
            this.modify_able = 0;

            document.getElementById("fade").style.display = 'block';
        },
        coloumnlize: function (contents) {

            // var contents_coloumnlized=[];
            contents = contents.replace(/\t/g, '  ');//缩进符用双空格代替
            contents = contents.replace(/\n\r\n/g, '\n');//双回车用单回车代替 #win
            contents = contents.replace(/\r/g, '');// #win
            contents = contents.replace(/\n\n/g, '\n');//双回车用单回车代替 #linux

            for (var i in contents) {
                this.contents_coloumnlized.push(contents[i] == "\n" ? "#" : contents[i]);
            }
            return this.contents_coloumnlized.join("\n");
        },
        fileImport: function () {
            let that = this;
            document.activeElement.blur();
            //获取读取我文件的File对象
            var selectedFile = document.getElementById('files').files[0];
            this.fileName = selectedFile.name;//读取选中文件的文件名
            var size = selectedFile.size;
            var reader = new FileReader();//这是核心,读取操作就是由它完成
            reader.readAsText(selectedFile);//读取文件的内容,也可以读取文件的URL
            reader.onload = function () {
                //当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可

                that.txts = this.result;
                var samples = [];
                var labels = [];
                var samples_tmp = [];
                var lables_tmp = [];
                var empty = "0";

                that.contents = that.txts.split("\n");
                if (that.contents[0].indexOf("\t") == -1) {
                    console.log(that)
                    that.contents = that.coloumnlize(that.txts).split("\n");
                }

                // if((model == 1) || (model == 3)){
                //   empty = "0";
                // }else if(model == 2){
                //   empty = "/S";
                // }

                for (let i in that.contents) {
                    var c = that.contents[i];

                    if (c.split("\t").length == 2) {
                        var spo = c.split("\t");
                        if (((spo[0] == "#") && (samples_tmp.length > 200)) || ((samples_tmp.length > 600 && ('。；;!！'.indexOf(spo[0]) != -1)))) {
                            samples_tmp.push(spo[0]);
                            lables_tmp.push(spo[1]);
                            samples.push(samples_tmp);
                            labels.push(lables_tmp);
                            samples_tmp = [];
                            lables_tmp = [];
                        } else {
                            samples_tmp.push(spo[0]);
                            lables_tmp.push(spo[1]);
                        }
                    } else {
                        if (((c == "#") && (samples_tmp.length > 200)) || ((samples_tmp.length > 600 && ('。；;!！'.indexOf(c) != -1)))) {
                            samples_tmp.push(c);
                            lables_tmp.push(empty);
                            samples.push(samples_tmp);
                            labels.push(lables_tmp);
                            samples_tmp = [];
                            lables_tmp = [];
                        } else {
                            samples_tmp.push(c);
                            lables_tmp.push(empty);
                        }
                    }
                }

                if (samples.indexOf(samples_tmp) == -1 && samples_tmp != "" && samples_tmp != "\n") {//追加剩下的，同时排除空和只有一个换行符的情况。
                    samples.push(samples_tmp);
                    labels.push(lables_tmp);
                }

                that.current_page_index = 0;

                that.load_samples = samples;
                that.load_lables = labels;

                var File_name = document.getElementById("FileName");
                File_name.innerHTML = "文件名: " + that.fileName;

                var File_size = document.getElementById("FileSize");
                File_size.innerHTML = "文件大小: " + size;

                document.activeElement.blur();

                that.text2obj_color();
                that.footShow = true
                that.page_display();
                // if(model == 1){
                //   entity_count_display();
                // }else if(model == 3){
                //   for(;entity_link.length!==0;){
                //     entity_link.pop();
                //   }
                // }


            }
        },

        text2obj_color() {
            var txtobj = document.getElementById("CurrentContent");
            txtobj.innerHTML = "";
            var text = this.load_samples[this.current_page_index];

            for (let i in text) {
                var char = document.createElement('span');

                if (this.load_lables[this.current_page_index][i] !== "0") {
                    // char.style.backgroundColor = '#91cfe2';
                    for (let j in this.btn_data) {
                        if (this.load_lables[this.current_page_index][i].split("-")[1] == this.btn_data[j].label) {
                            char.style.backgroundColor = this.btn_data[j].color;
                            break;
                        } else if (this.load_lables[this.current_page_index][i] !== "/S" && this.btn_data[j].model == 2) {
                            char.style.backgroundColor = this.btn_data[j].color;
                            break;
                        }
                    }
                }


                if (text[i] == " ") {
                    char.innerHTML = "&nbsp;";
                    txtobj.appendChild(char);
                } else if (text[i] == "#") {
                    char.style.color = 'rgba(94,47,28,0.09)';
                    char.style.paddingLeft = '0em';
                    char.innerHTML = "#";
                    txtobj.appendChild(char);
                    var br = document.createElement('br');
                    txtobj.appendChild(br);
                } else {
                    char.innerHTML = text[i];
                    txtobj.appendChild(char);
                }
            }

            this.lists = Array.from(txtobj.querySelectorAll('span'));
        },
        page_display() {
            var page_index = document.getElementById("page-index");
            page_index.innerHTML = "";
            for (let i in this.load_samples) {
                let index = document.createElement("option");
                let j = parseInt(i) + 1;
                index.text = j;
                page_index.appendChild(index);
            }

            var page_all = document.getElementById("page_all");
            page_all.innerHTML = "共" + this.load_samples.length + "页";
            this.modify_able = 1;
        },
    }
}
</script>

<style scoped>
@import "../assets/css/bootstrap.css";


#CurrentContent {
    height: 170px;
    color: black;
    font-family: Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    text-align: justify;
    padding: 20px;
    border: 1px solid black;
}

.custom-col {
    padding: 20px;
    box-sizing: border-box;
    margin: 5px 0;
    text-align: justify;
}

.footer {
    position: absolute;
    left: 54px;
}
/*.custom-primary {*/
/*  background-image: linear-gradient(to bottom right, #d819bf, #2683cf, #63e4b9);*/
/*  !* 其他样式属性，如果需要的话 *!*/
/*}*/


</style>