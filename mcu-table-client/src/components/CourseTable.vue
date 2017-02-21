<template>
  <div id='CourseTable'>
    <v-table-overflow>
      <div class="table">
        <div class="rowl">
          <div class="week-cell" style="width: 9%;"></div>
          <div class="week-cell" v-for="week in weeks">{{ week }}</div>
        </div>
        <div class="rowl" v-for="item in table">
          <div class="sec-cell">{{formatSec(item.sec)}}</div>
          <div class="cell" v-for="course in item.courses" :class="{border:(course.length>1)}">
            <v-container fluid>
              <v-row>
                <div :class="grid(course.length,item.site)" v-for="item in course">
                  <p class="pa-0 ma-0" v-html="courseHtml(item)"></p>
                </div>
              </v-row>
            </v-container>
          </div>
        </div>
      </div>
    </v-table-overflow>
  </div>
</template>
<script>
  export default {
    name: 'CourseTable',
    props: ['table'],
    data() {
      return {
        weeks: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"]
      }
    },
    methods: {
      meta() {
        return {
          title: '議程'
        }
      },
      formatSec(data) {
        if ((data / 10) >= 1) {
          return data
        } else {
          return "0" + data
        }
      },
      grid(data, site) {
        return ("xs" + 12 / data + " col " + this.getSiteColor(site) + " " + ((data != 1) ? "blur" : ""))
      },
      getSiteColor(site) {
        var sites = ["EE", "AA", "BB", "CC", "FF", "M", "P", "S", "I", "H", "F", "D", "E", "A", "B", ""];
        var color = ["pink", "purple", "indigo", "blue", "light-blue", "teal", "green", "light-green", "lime", "amber",
          "orange", "deep-orange", "brown", "red", "blue-grey", "grey"
        ]
        if (site == "") return "black--text";
        for (var i = 0; i < sites.length; i++) {
          if (site.indexOf(sites[i]) != -1) {
            return color[i] + " white--text ";
            break;
          }
        }
      },
      getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      },
      courseHtml(item) {
        //return item.id + '<br>' + ((item.name.length > 6)&&item.name.substring(0,6).search("（")==-1 ? item.name.substring(0,6)+'<br>'+item.name.substring(6,item.name.length) : item.name) + '<br>' + item.teacher + '<br>' + item.site;
        return item.id + '<br>' + item.name + '<br>' + (item.teacher!==undefined)?item.teacher:"" + '<br>' + (item.site!==undefined)?item.site:"";
      }
    },
  }

</script>
<style scoped>
  .table {
    display: table;
  }
  
  .rowl {
    display: table-row;
    border: 1px solid #eaeaea;
  }
  
  .row {
    margin: 0px;
  }
  
  .col {
    padding: 0px;
    text-overflow: ellipsis;
    overflow: hidden;
    word-wrap: break-word;
    word-break:break-all;
    white-space: nowrap;
  }
  
  .cell {
    display: table-cell;
    width: 13%;
    max-width: 100px;
    min-width: 50px;
    border: 1px solid #eaeaea;
    background: #fff;
    font-size: 1.5vh;
    text-overflow: ellipsis;
    overflow: hidden;
    word-wrap: break-word;
    white-space: nowrap;
    -webkit-text-size-adjust: 100%;
  }
  
  .week-cell {
    display: table-cell;
    width: 12.5%;
    min-width: 50px;
    border: 1px solid #eaeaea;
    background: #00bcd4;
    color: #fff;
  }
  
  .sec-cell {
    display: table-cell;
    width: 9%;
    min-width: 50px;
    border: 1px solid #eaeaea;
    background: #00bcd4;
    color: #fff;
    text-align: center;
    vertical-align: middle;
  }
  
  .blur {
    filter: sepia(100%) invert(80%) blur(0.1px);
  }
  
  .border {
    border: 2px dotted red;
  }
</style>