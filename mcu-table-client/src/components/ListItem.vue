<template>
    <tr class="font">
      <td>{{course.depart.substr(0,2)}}</td>
      <td>{{course.subjectId}}</td>
      <td style="text-align: left;max-width: 140px;">
        <a v-if="course.detail!==undefined" :href="course.detail" target="_new">{{course.subjectName}}</a>
        <template v-else>{{course.subjectName}}</template>
      </td>
      <td>{{course.classId}}</td>
      <td>{{course.nowPeople+"/"+course.maxPeople}}</td>
      <td>
        <template v-for="item in course.teacher">
          {{item}}<br>
        </template>
      </td>
      <td style="text-align: left;">
        <template v-for="item in course.time">
          {{"星期"+item.day+":"}}
          <template v-for="sec in item.sec">{{formatSec(sec)+" "}}</template><br>
        </template>
      </td>
      <td>
        <template v-for="item in course.site">
          {{item}}<br>
        </template>
      </td>
      <td>{{course.type}}</td>
      <td>{{course.credit}}</td>
      <td  style="text-align: left;" v-if="note">{{course.note}}</td>
      <td>
        <slot></slot>
        <!--<v-btn icon class="teal--text" @click.native="getComment(course)" ripple>
          <v-icon>message</v-icon>
        </v-btn>-->
      </td>
    </tr>
</template>
<script>
  export default {
    name: 'ListItem',
    props: ["course","note"],
    data () {
      return {
        haveComment: false  
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
      getComment(course) {

      }
    }
  }
</script>
<style scoped>
  .font {
    font-size: 1rem;
  }
  
  .font td,
  .font th {
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 1px;
    padding-right: 1px;
    text-align: center;
  }

  .list-item {
    display: inline-block;
    margin-right: 10px;
  }
  
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s;
  }
  
  .list-enter,
  .list-leave-active {
    opacity: 0;
    transform: translateX(50px);
  }
  
  .list-move {
    transition: transform 1s;
  }
</style>