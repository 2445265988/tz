import { createRouter, createWebHistory } from 'vue-router'
import login from '../components/login'
import home from "../components/home"
import WordRecognition from "../components/WordRecognition";
import CurveChart from "../components/CurveChart";
import BarChart from "../components/BarChart";
import WordCloud from "../components/WordCloud";
import KGragh from "../components/KGragh";
import ontologyTree from "../components/ontologyTree";
import ontologyTable from "../components/ontologyTable";
import annotationLink from "../components/annotationLink";
import annotationParticiple from "../components/annotationParticiple";
import annotationEntity from "../components/annotationEntity";
import testmap from "../components/testmap";
import Triple from "../components/Triple";
import qarobot from "../components/qarobot"
import mapshow from "../components/mapshow"
import shouye from "../components/shouye.vue";
import paperList from "../components/paperList.vue"

const routes = [
    {
      path: '/',
      redirect: '/login'
    },
    {
        path: "/login",
        name: "login",
        component: login
    },
    {
        path: "/home",
        name: "home",
        component: home,
        children: [{
            path: "shouye",
            name: "shouye",
            component: shouye
        }, {
            path: "annotationEntity",
            name: "annotationEntity",
            component: annotationEntity
        },{
            path: "annotationParticiple",
            name: "annotationParticiple",
            component: annotationParticiple
        },{
            path: "annotationLink",
            name: "annotationLink",
            component: annotationLink
        },{
            path: "ontologyTable",
            name: "ontologyTable",
            component: ontologyTable
        },{
            path: "ontologyTree",
            name: "ontologyTree",
            component: ontologyTree
        },{
            path: "Triple",
            name: "Triple",
            component: Triple
        },{
            path: "KGragh111",
            name: "KGragh111",
            component: KGragh
        },{
            path: "mapshow",
            name: "mapshow",
            component: mapshow
        },{
            path: "WordCloud",
            name: "WordCloud",
            component: WordCloud
        }, {
            path: "paperList",
            name: "paperList",
            component: paperList
        },{
            path: "BarChart",
            name: "BarChart",
            component: BarChart
        },{
            path: "CurveChart",
            name: "CurveChart",
            component: CurveChart
        },{
            path: "WordRecognition",
            name: "WordRecognition",
            component: WordRecognition
        },{
            path: "testmap",
            name: "testmap",
            component: testmap
            },
            {
                path: "qarobot",
                name: "qarobot",
                component: qarobot
                }  
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

export default router


