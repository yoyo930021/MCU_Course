<template>
  <div id='share'>
    <v-container fluid>
      <v-row>
        <v-col md6 xs12 style="margin: 0 auto;">
          <course-table :table="choosedTable"></course-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
  import * as api from '../api/axios.js'
  var fetchShare = store => {
    return store.dispatch('FETCH_SHARE', store.state.route.params.token)
  }
  export default {
    name: 'share',
    mounted() {
      fetchShare(this.$store)
    },
    preFetch: fetchShare,
    data() {
      return {
        choosedList: this.$store.state.shareTable,
        imgRes: null
      }
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
                return (ele.sec.indexOf(secs[i]) != -1) && (ele.day == j)
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
      }
    }
  }

</script>
<style scoped>

</style>