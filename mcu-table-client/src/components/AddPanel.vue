<template>
  <div id='AddPanel'>
    <v-container fluid>
      <v-row>
        <v-col md12 sm12>
          <v-progress-linear v-bind:indeterminate="loading" height="5" success class="ma-0"></v-progress-linear>
        </v-col>
      </v-row>
      <v-row>
        <v-col md3 xs6>
          <v-select v-bind:options="typeOptions" id="type" placeholder="選擇類型" name="type" v-model="type" @change.native="chooseType"></v-select>
        </v-col>
        <v-col md9 xs6 v-if="type=='must'||type=='choose'">
          <v-row>
            <v-col md4 sm12>
              <v-select v-bind:options="deptOptions" id="dept" placeholder="選擇科系" name="dept" v-model.number="dept" key="dept" @change.native="getList(type)"></v-select>
            </v-col>
            <v-col md4 sm12>
              <v-select v-bind:options="yrOptions" id="yr" placeholder="選擇年級" name="yr" v-model.number="yr" key="yr" @change.native="getList(type)"></v-select>
            </v-col>
            <v-col md4 sm12 class="pa-2">
              <input type="checkbox" id="filter" v-model="filter">
              <label for="checkbox">過濾衝堂課程</label><br>
              <input type="checkbox" id="note" v-model="note">
              <label for="checkbox">顯示備註</label>
            </v-col>
          </v-row>
        </v-col>
        <v-col md9 xs6 v-if="type=='common'||type=='teach'||type=='sport'">
          <v-row>
            <v-col md6 sm12>
              <v-select v-bind:options="schOptions" id="sch" placeholder="選擇校區" name="sch" v-model.number="sch" key="sch" @change.native="getList(type)"></v-select>
            </v-col>
            <v-col md6 sm12 class="pa-2">
              <input type="checkbox" id="filter" v-model="filter">
              <label for="checkbox">過濾衝堂課程</label><br>
              <input type="checkbox" id="note" v-model="note">
              <label for="checkbox">顯示備註</label>
            </v-col>
          </v-row>
        </v-col>
        <v-col md9 xs6  v-if="type=='search'">
          <v-row>
            <v-col md6 sm8 class="pa-2">
              <v-text-input id="subject" name="subject" placeholder="請輸入科目名稱" v-model="subject"></v-text-input>
            </v-col>
            <v-col md2 sm4 class="pa-2">
              <v-btn block v-ripple="{ class: 'white--text' }" warning @click.native="getList(type)">搜尋</v-btn>
            </v-col>
            <v-col md4 sm12 class="pa-2">
              <input type="checkbox" id="filter" v-model="filter">
              <label for="checkbox">過濾衝堂課程</label><br>
              <input type="checkbox" id="note" v-model="note">
              <label for="checkbox">顯示備註</label>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col md12 sm12>
          <course-list :headers="headers">
            <list-item v-for="(course,index) in filterList" :course="course" v-bind:key="course" class="" :note="note">
              <v-btn v-if="isShowAdd(course)" icon class="teal--text" @click.native="add(index)" ripple>
                <v-icon>add</v-icon>
              </v-btn>
            </list-item>
          </course-list>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import * as api from '../api/axios.js'
  export default {
    name: 'AddPanel',
    data () {
      return {
        choosedList: this.$store.state.choosedList,
        courseList: [],
        type: "",
        ggdb: this.$store.state.ggdb,
        dept: 0,
        yr: 0,
        sch: 0,
        subject: "",
        filter: true,
        note: false,
        loading: false,
        typeOptions: [
          {
            value: "my",
            text: '我的課程'
          },
          {
            value: "must",
            text: '必修課程'
          },
          {
            value: "choose",
            text: '選修課程'
          },
          {
            value: "common",
            text: '通識課程'
          },
          {
            value: "search",
            text: "搜尋科目"
          },
          {
            value: "teach",
            text: '教育學程'
          },
          {
            value: "sport",
            text: '三年級體育'
          }
        ],
        deptOptions: [],
        yrOptions: [],
        schOptions: []
      }
    },
    computed: {
      headers: function () {
        if(this.note){
          return ["制別", "科目<br>代號", "科目<br>名稱", "班級<br>代號", "選課/<br>開班<br>人數", "任課<br>教師", "時間", "地點", "選別", "學分", "備註", "加入"]
        }else{
          return ["制別", "科目<br>代號", "科目<br>名稱", "班級<br>代號", "選課/<br>開班<br>人數", "任課<br>教師", "時間", "地點", "選別", "學分", "加入"]
        }
      },
      haveCourses: function () {
        var self = this;
        var haveCourses = {};
        self.choosedList.forEach((element) => {
          element.time.forEach((ele) => {
            if (haveCourses[ele.day] === undefined) {
              haveCourses[ele.day] = []
              ele.sec.forEach((sec) => {
                haveCourses[ele.day].push(sec)
              })
            } else {
              ele.sec.forEach((sec) => {
                haveCourses[ele.day].push(sec)
              })
            }
          })
        })
        return haveCourses;
      },
      filterList: function () {
        var self = this;
        if (this.filter && this.type != "my") {
          return self.courseList.filter((element) => {
            return (element.time.filter((ele) => {
              //console.log(self.haveCourses[ele.day])
              if (self.haveCourses[ele.day] !== undefined) {
                return ele.sec.filter((tmp) => { return (self.haveCourses[ele.day].indexOf(tmp) == -1) }).length == ele.sec.length
              } else {
                return true
              }
            }).length == element.time.length)
          })
        } else {
          return self.courseList
        }
      },
    },
    methods: {
      add(index) {
        //console.log(index)
        this.$store.commit("addChoosed", this.filterList[index])
      },
      chooseType() {
        this.courseList = []
        if (this.type == "my") {
          this.courseList = this.$store.state.loginCourse;
        }else if(this.type == "search"){
          //
        } else {
          this.loading = true;
          api.getOptionCourse(this.ggdb, this.type).then((response) => {
            this.loading = false;
            if (response.data.length > 1) {
              this.deptOptions = response.data[0];
              this.yrOptions = response.data[1];
            } else {
              this.schOptions = response.data[0];
            }
          }).catch((error) => {
            this.loading = false;
            this.$vuetify.toast.create(...["請求失敗，請檢查網路狀態。", "bottom"])
          })
        }
      },
      getList(type) {
        this.courseList = []
        if (type == 'must' || type == 'choose') {
          if (this.dept != 0 && this.yr != 0) {
            this.loading = true;
            api.getMCCourse(this.ggdb, this.type, this.dept, this.yr).then((response) => {
              this.loading = false;
              this.courseList = response.data;
            }).catch((error) => {
              this.loading = false;
              this.$vuetify.toast.create(...["請求失敗，請檢查網路狀態。", "bottom"])
            })
          }
        } else if (type == 'common' || type == 'teach' || type == 'sport') {
          if (this.sch != 0) {
            this.loading = true;
            api.getCTCourse(this.ggdb, this.type, this.sch).then((response) => {
              this.loading = false;
              this.courseList = response.data;
            }).catch((error) => {
              this.loading = false;
              this.$vuetify.toast.create(...["請求失敗，請檢查網路狀態。", "bottom"])
            })
          }
        }else if (type == "search"){
          if(this.subject != ""){
            this.loading = true;
            api.getSearch(this.ggdb, this.subject ).then((response) => {
              this.loading = false;
              this.courseList = response.data;
            }).catch((error) => {
              this.loading = false;
              this.$vuetify.toast.create(...["請求失敗，請檢查網路狀態。", "bottom"])
            })
          }
        }
      },
      isShowAdd(course){
        return (this.choosedList.indexOf(course) === -1)
      },
    }
  }

</script>

<style scoped>

</style>