<template>
  <div id='choose'>
    <v-container fluid>
      <v-row>
        <v-col xs12>
          <v-alert info  dismissible  v-model="alert">左邊為目前已選課表，右邊為操作區，在已選課程可以刪除已選課程，在加入課程可以加入課程，勾選過濾衝堂課程會自動移除跟現有課程所衝堂的課程，結果頁籤會顯示相比原本課表所加選或退選的課程，請依照此表搶課，下面分享能產生一個網址，把課表分享給別人看。注意：課表只會保存一年</v-alert>
        </v-col>
      </v-row>
      <v-row>
        <v-col lg6 md12 sm12 xs12>
          <v-card class="ma-0">
            <v-card-text>
              <course-table :table="choosedTable"></course-table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col lg6 md12 sm12 xs12>
          <v-card class="ma-0">
            <v-card-text>
              <action-panel @openComment="openComment"></action-panel>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-modal id="hascomment" v-model="hascomment">
      <v-card>
        <v-card-text>
          <div role="close-modal">
            <v-btn floating="floating" primary dark outline @click.native.stop="hascomment = !hascomment" class="mr-3">X</v-btn>
          </div>
          <iframe :src="commentUrl"></iframe>
        </v-card-text>
      </v-card>
    </v-modal>
  </div>
</template>
<script>
  export default {
    name: 'choose',
    data() {
      return {
        choosedList: this.$store.state.choosedList,
        alert:true,
        hascomment: false,
        commentUrl: ""
      }
    },
    mounted () {
      window.onbeforeunload = function(e) {
        var dialogText = '如果重新整理或關閉，你所選的就會消失，請確認是否關閉？';
        e.returnValue = dialogText;
        return dialogText;
      };
    },
    computed: {
      choosedTable: function () {
        var result = [];
        var secs = [1, 2, 3, 4, 20, 5, 6, 7, 8, 9, 40, 50, 60, 70];
        for (var i = 0; i < secs.length; i++) {
          var one = {
            sec: secs[i],
            courses: []
          }
          var self = this
          //console.log(secCourses);
          for (var j = 1; j < 8; j++) {
            var courses = [];
            var filterCourses = self.choosedList.filter(function (element) {
              if (element.time.filter(function (ele) {
                return (ele.sec.indexOf(secs[i]) != -1)&&(ele.day == j)
              }).length > 0) return true
              else return false
            });

            if (filterCourses.length == 0) {
              courses.push(self.formatCourse("no"));
              one.courses.push(courses)
            } else {
              filterCourses.forEach(function (element) {
                courses.push(self.formatCourse(element, j))
              })
              one.courses.push(courses)
            }
          }
          result.push(one)
        }
        return result;
      }
    },
    methods: {
      formatCourse(course, j) {
        if (course == "no") {
          return {
            id: "",
            name: "",
            classId: "",
            teacher: "",
            site: ""
          }
        } else {
          var temp = {
            id: course.subjectId,
            name: course.subjectName,
            classId: course.classId
          }
          var teacherI;
          for (var i = 0; i < course.time.length; i++) {
            if (course.time[i].day == j) {
              teacherI = i;
              break;
            }
          }
          temp.teacher = course.teacher[teacherI];
          if (course.site.length == 1) temp.site = course.site[0];
          else temp.site = course.site[teacherI];
          return temp;
        }
      },
      openComment(url){
        this.commentUrl = url
        this.hascomment = true
      },
    },
    watch: {
      hascomment: function(state){
        if(state){
          document.getElementsByTagName("html")[0].style.overflowY = "hidden"
          document.getElementsByTagName("body")[0].style.overflowY = "hidden"
        }else{
          document.getElementsByTagName("html")[0].style.overflowY = "scroll"
          document.getElementsByTagName("body")[0].style.overflowY = "scroll"
        }
      }
    }
  }
</script>
<style  lang="stylus">
  .modal--active
      max-height: 82vh
      background-color: white
      @media screen and (max-width: 500px)
        width: 100vw
        height: 100vh
        max-width: 100vw
        max-height: 100vh
        overflow-y: scroll
        overflow-x: hidden
  iframe
    width: 35vw
    height: 82vh
    border:none
    @media screen and (max-width: 500px)
      padding-right: 5vw
      width: 100vw
      height: 100vh
  [role="close-modal"]
    position: absolute
    background-color: white
    float: right
    right: 0
    z-index: 999
    border-radius: 50px
</style>