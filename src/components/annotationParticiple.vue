<template>
    <div role="tabpanel" class="tab-pane active" id="sour" style="height: 100%; background-color:white;">
      <div class="check-div form-inline" style="display: flex;justify-content: center" >
        <input type="file" id="files" style="display: none;" @change="fileImport()" />
        <el-button class="btn btn-yellow btn-xs" id="file_btn" data-toggle="modal" type="primary" size="medium"
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

            <div id="CurrentContent" style="color: black;background-color: white;height: auto" @mousedown="annotation_down()"
                @mouseup="annotation_up()">
            </div>
        </div>
        <!--页码块-->
        <footer class="footer">
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
    name: "annotationParticiple",
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
                    this.load_lables[this.current_page_index][i] = "/S";
                }
            } else {
                for (let i = last_operation.start; i <= last_operation.end; i++) {
                    if (i == last_operation.start) {
                        this.load_lables[this.current_page_index][i] = "/B";
                    } else if (i == last_operation.end) {
                        this.load_lables[this.current_page_index][i] = "/E";
                    } else {
                        this.load_lables[this.current_page_index][i] = "/M";
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
            this.find_start_end();

            for (let i = this.start_end[0]; i <= this.start_end[1]; i++) {
                this.lists[i].style.backgroundColor = "#957fbf";
                if (i == this.start_end[0]) {
                    this.load_lables[this.current_page_index][i] = "/B";
                } else if (i == this.start_end[1]) {
                    this.load_lables[this.current_page_index][i] = "/E";
                } else {
                    this.load_lables[this.current_page_index][i] = "/M";
                }
            }

            this.undo.push({ Operation: "fenci", start: this.start_end[0], end: this.start_end[1], page: this.current_page_index, oringnal_label: [] })
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
                var empty = "/S";

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
                that.page_display();
            }
        },
    }
}
</script>

<style scoped>
.back {
    background-color: aliceblue;
}

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
</style>