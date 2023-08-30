<template>
    <div style="height:100%; background-color:white;">
        <el-container>
            <el-header>
                <el-row align="middle" style="margin-top: 30px">
                    <el-col :span="4">
                        <el-button type="primary" @click="handleAddUser">添加用户</el-button>
                    </el-col>
                    <el-col :span="4" :offset="2">
                        <el-input placeholder="输入关键字搜索" v-model="searchKey" clearable />

                    </el-col>
                    <el-col :span="2" :offset="2">
                        <el-button type="primary" @click="search">查询</el-button>
                    </el-col>
                    <!-- <el-col :span="4" :offset="8">
                        <el-select v-model="sortKey" placeholder="选择排序方式">
                            <el-option label="id" value="id"></el-option>
                            <el-option label="name" value="name"></el-option>
                            <el-option label="sex" value="sex"></el-option>
                            <el-option label="address" value="address"></el-option>
                        </el-select>
                    </el-col> -->
                </el-row>
            </el-header>
            <el-main>
                <el-table :data="userList">
                    <el-table-column prop="id" label="ID"></el-table-column>
                    <el-table-column prop="name" label="姓名"></el-table-column>
                    <el-table-column prop="email" label="邮箱"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                        <template #default="scope">
                            <el-button link type="primary" size="small"
                                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            <el-button link type="primary" size="small">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-dialog title="添加用户" v-model="dialogVisible">
                <el-form :model="form">
                    <el-form-item label="用户名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="form.password"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="form.email"></el-input>
                    </el-form-item>
                    <el-form-item label="出生日期">
                        <el-date-picker v-model="form.birth" type="date"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="地区">
                        <el-input v-model="form.address"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                        <el-select v-model="form.sex">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="男"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span class="dialog-footer">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="save_user">确认</el-button>
                </span>
            </el-dialog>
        </el-container>


    </div>
</template>
<script>
import { userList, addUser, deleteUser } from "../utils/kk";


export default {
    name: "testmap",
    data() {
        return {
            btn_click: null,
            btn_to_id: null,
            dialogVisible: false,
            searchKey: '',
            sortKey: '',
            form: {
                name: '',
                password: '',
                email: '',
                birth: '',
                address: '',
                sex: ''
            },
            userList: []
        }
    },
    created() {
        userList().then(response => {
            console.log(response)
            this.userList = response
            // this.formbody_renew(response)
        })
    },
    methods: {
        cancel() {
            this.dialogVisible = false;
            this.form = {}
        },
        save_user() {
            addUser(this.form.name, this.form.password, this.form.birth, this.form.address, this.form.email, this.form.sex).then(response => {
                console.log(response)
                this.cancel();
                this.search();
            })

        },
        handleAddUser() {
            this.dialogVisible = true
        },
        search() {
            userList(this.searchKey).then(response => {
                this.userList = response
            })
        },
        handleDelete(index, data) {
            console.log(index, data)
            deleteUser(data.id).then(response => {
                console.log(response)
                this.search();
            })
        },
        edit_user() {
            console.log(this.btn_to_id)
        }
    }
}
</script>

<style scoped>
@import "../assets/css/bootstrap.css";

.tableHeader,
.tablebody>.row {
    border-bottom: 1px solid #ddd;
    padding: 10px 0;
}

.tableHeader {
    font-weight: bold;
}

.tablebody>.row:hover {
    background: #f5f5f5;
}

.btn {
    margin-right: 5px;
}

.btn-yellow {
    background-color: #ffc107;
    color: white;
}

.btn-green {
    background-color: #4caf50;
    color: white;
}

.btn-white {
    background-color: #fff;
    color: #333;
}

.modal {
    display: none;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
    padding-top: 60px;
}

.modal-content {
    background-color: #fefefe;
    margin: 5% auto 15% auto;
    border: 1px solid #888;
    width: 80%;
}

.modal-header,
.modal-footer {
    padding: 15px;
    border-bottom: 1px solid #ddd;
}

.modal-header {
    border-bottom: none;
}

.modal-footer {
    border-top: none;
}

.modal-body {
    padding: 10px 15px;
}

.duiqi {
    margin: auto;
}

.control-label {
    display: inline-block;
    max-width: 100%;
    margin-bottom: 5px;
    font-weight: 700;
}

.form-control {
    display: block;
    width: 100%;
    height: 34px;
    padding: 6px 12px;
    font-size: 14px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
}
</style>