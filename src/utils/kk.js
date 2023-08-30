import request from '@/utils/request'
import QueryString from "qs";

// 查找所有知识图谱
export function getAll(name, password) {
    return request({
        url: '/login',
        method: 'post',
        headers:  { 'content-type': 'application/x-www-form-urlencoded' },
        params: {
            username: name,
            password: password
        }
    })
}
export function getAllTriple(){
    return request({
        url: '/getAllTriple',
        method: 'get',
    })
}
export function getgragh(name){
    return request({
        url: '/getAllKG',
        method: 'get',
        params: {
            name: name
        }
    })
}
export function getNodeByName(name) {
    return request({
        url: '/getNodeByName',
        method: 'get',
        params: {
            name: name
        }
    })
}

export function renewgragh(){
    return request({
        url: '/geneAll',
        method: 'get',
    })
}
export function searchTech(tech){
    return request({
        url: '/searchTech',
        method: 'post',
        headers:  { 'content-type': 'application/x-www-form-urlencoded' },
        params: {
            tech: tech
        }
    })
}
export function getWordCloud(){
    return request({
        url: '/getWordCloud',
        method: 'get',
    })
}
export function getBarChartRace(){
    return request({
        url: '/getBarChartRace',
        method: 'get',
    })
}
export function getAllTypes(){
    return request({
        url: '/getAllTypes',
        method: 'get',
    })
}
export function getCurveChartData(){
    return request({
        url: '/getCurveChartData',
        method: 'get',
    })
}
export function WordReconiton(data1, model){
    const data = QueryString.stringify({data:data1, model:model})
    console.log(data)
    return request({
        url: '/wordreconiton',
        method: 'post',
        headers:  { 'content-type': 'application/x-www-form-urlencoded' },
        // data: QueryString.stringify({data:data1, model:model})
        data: data
    })
}
export function TripletRecognition(data1, model){
    const data = {
        data: data1,
        model: model
    }
    return request({
        url: '/entityExtract',
        method: 'post',
        headers:  { 'content-type': 'application/x-www-form-urlencoded' },
        data: QueryString.stringify(data)
    })
}
export function zhengzefenci(data1, model){
    const data = {
        data: data1,
        model: model
    }
    return request({
        url: '/wordreconiton',
        method: 'post',
        headers:  { 'content-type': 'application/x-www-form-urlencoded' },
        data: QueryString.stringify(data)
    })
}

export function getOutline(){
    return request({
        url: '/getOutline',
        method: 'get',
    })
}
export function getOntologyTree(){
    return request({
        url: '/getOntologyTree',
        method: 'get',
    })
}
export function getCategory(Code){
    const data = {
        Code: Code,
    }
    return request({
        url: '/getCategory',
        method: 'post',
        headers:  { 'content-type': 'application/x-www-form-urlencoded' },
        data: QueryString.stringify(data)
    })
}
export function getThird(Code){
    const data = {
        Code: Code,
    }
    return request({
        url: '/getThird',
        method: 'post',
        headers:  { 'content-type': 'application/x-www-form-urlencoded' },
        data: QueryString.stringify(data)
    })
}
export function getDetail(Code){
    const data = {
        Code: Code,
    }
    return request({
        url: '/getDetail',
        method: 'post',
        headers:  { 'content-type': 'application/x-www-form-urlencoded' },
        data: QueryString.stringify(data)
    })
}
export function userList(name){
    return request({
        url: '/userList',
        method: 'get',
        params: {
            key:name
        }
    })
}
export function addUser(name, pwd, birthday, address, email, sex){
    const data = {
        name: name,
        pwd: pwd,
        birthday: birthday,
        address: address,
        email: email,
        sex: sex,
    }
    return request({
        url: '/addUser',
        method: 'post',
        headers:  { 'content-type': 'application/x-www-form-urlencoded' },
        data: QueryString.stringify(data)
    })
}

export function deleteUser(id){
    const data = {
        id:id
    }
    return request({
        url: '/deleteUser',
        method: 'post',
        headers:  { 'content-type': 'application/x-www-form-urlencoded' },
        data: QueryString.stringify(data)
    })
}


export function paperList(name){
    return request({
        url: '/paperList',
        method: 'get',
        params: {
            key:name
        }
    })
}
export function addPaper(name, keyword, latitude, longitude, introduction, image,place,url,year){
    const data = {
        name: name,
        keyword: keyword,
        latitude: latitude,
        longitude: longitude,
        introduction: introduction,
        image: image,
        place: place,
        url: url,
        year: year,
    }
    return request({
        url: '/addpaper',
        method: 'post',
        headers:  { 'content-type': 'application/x-www-form-urlencoded' },
        data: QueryString.stringify(data)
    })
}

export function deletePaper(id){
    const data = {
        id:id
    }
    return request({
        url: '/deletepaper',
        method: 'post',
        headers:  { 'content-type': 'application/x-www-form-urlencoded' },
        data: QueryString.stringify(data)
    })
}