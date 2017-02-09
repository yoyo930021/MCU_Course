<template>
  <div id='ActionPanel'>
    <v-tabs id="tabs"  grow>
      <v-tabs-tabs>
        <v-tab-item :item="{ text: '已選課程', href: '#tabs-1' }" ripple></v-tab-item>
        <v-tab-item :item="{ text: '加入課程', href: '#tabs-2' }" ripple></v-tab-item>
        <v-tab-item :item="{ text: '結果', href: '#tabs-3' }" ripple></v-tab-item>
      </v-tabs-tabs>
      <v-tabs-items>
        <v-tabs-item id="tabs-1">
          <v-card class="ma-0">
            <v-card-text>
              <input type="checkbox" id="note" v-model="note">
              <label for="checkbox">顯示備註</label>
              <course-list :headers="headers">
                <list-item v-for="(course,index) in choosedList" :course="course" v-bind:key="course" :note="note">
                  <v-btn icon class="teal--text" @click.native="del(index)" ripple>
                    <v-icon>delete</v-icon>
                  </v-btn>
                </list-item>
              </course-list>
            </v-card-text>
          </v-card>
        </v-tabs-item>
        <v-tabs-item id="tabs-2">
          <v-card class="ma-0">
            <v-card-text>
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
                </v-row>
                <v-row>
                  <v-col md12 sm12>
                    <course-list :headers="headers">
                      <list-item v-for="(course,index) in filterList" :course="course" v-bind:key="course" class="" :note="note">
                        <v-btn icon class="teal--text" @click.native="add(index)" ripple>
                          <v-icon>add</v-icon>
                        </v-btn>
                      </list-item>
                    </course-list>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-tabs-item>
        <v-tabs-item id="tabs-3">
          <v-card class="ma-0">
            <v-card-text>
              <h5 class="text-xs-center ma-0">結果</h5>
              <p class="ma-0">會分析退選哪些課，加選哪些課的結果</p>
              <input type="checkbox" id="note" v-model="note">
              <label for="checkbox">顯示備註</label>
              <course-list :headers="headers">
                <list-item v-for="(course,index) in diffList.del" :course="course" v-bind:key="course" class="through" :note="note">
                  <p class="ma-0">退選</p>
                </list-item>
                <list-item v-for="(course,index) in diffList.add" :course="course" v-bind:key="course" class="addRed" :note="note">
                  <p class="ma-0">加選</p>
                </list-item>
              </course-list>
              <br>
              <v-btn block v-ripple="{ class: 'white--text' }" success @click.native="share" :loading="disabled">分享</v-btn>
              <br>
              <div v-if="token!=''">
                <label for="text">分享網址:</label>
                <input type="text" id="share" :value="urlToken" style="width: 80%;">
              </div>
            </v-card-text>
          </v-card>
        </v-tabs-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>
<script>
  import * as api from '../api/axios.js'
  export default {
    name: 'ActionPanel',
    data() {
      return {
        headers: ["制別", "科目<br>代號", "科目<br>名稱", "班級<br>代號", "選課/<br>開班<br>人數", "任課<br>教師", "時間", "地點", "選別", "學分", "備註"],
        choosedList: this.$store.state.choosedList,
        courseList: [],
        type: "",
        ggdb: this.$store.state.ggdb,
        dept: 0,
        yr: 0,
        sch: 0,
        filter: true,
        note: false,
        loading: false,
        disabled: false,
        token: "",
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
      diffList: function () {
        var self = this;
        var loginList = self.$store.state.loginCourse.filter((element) => { return (self.choosedList.indexOf(element) == -1) });
        var choose = self.choosedList.filter((element) => { return (self.$store.state.loginCourse.indexOf(element) == -1) })
        var result = {
          del: loginList,
          add: choose
        }
        return result;
      },
      urlToken:function () {
        return 'http://localhost:8080/token/'+this.token;
      }
    },
    methods: {
      formatSec(data) {
        if ((data / 10) >= 1) {
          return data
        } else {
          return "0" + data
        }
      },
      add(index) {
        //console.log(index)
        this.$store.commit("addChoosed", this.filterList[index])
      },
      del(index) {
        //console.log(index)
        this.$store.commit("removeChoosed", index)
      },
      chooseType() {
        this.courseList = []
        if (this.type == "my") {
          this.courseList = this.$store.state.loginCourse;
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
        }
      },
      share(){
        this.disabled = true;
        api.postShare(this.choosedList).then((response)=>{
          this.token = response.data.token;
          this.disabled = false;
        }).catch((error) => {
          this.disabled = false;
          this.$vuetify.toast.create(...["請求失敗，請檢查網路狀態。", "bottom"])
        })
      }
    }
  }

</script>
<style scoped>
  .through {
    text-decoration: line-through;
  }
  
  .addRed {
    color: red;
  }
</style>