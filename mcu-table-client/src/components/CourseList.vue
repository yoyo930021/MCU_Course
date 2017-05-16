<template>
  <v-table-overflow>
    <table>
      <thead>
        <tr class="font">
          <th v-for="header in headers" v-html="header"></th>
        </tr>
      </thead>
      <transition-group name="list" tag="tbody">
        <slot>
        </slot>
      </transition-group>
    </table>
  </v-table-overflow>
</template>
<script>
  export default {
    name: 'CourseList',
    props: ["headers"],
  }
</script>
<style scoped>
  .font {
    font-size: 1rem;
  }
  
  .font td,
  .font th {
    padding-top: 2px;
    padding-bottom: 2px;
    padding-left: 1px;
    padding-right: 1px;
    text-align: center;
  }
  
  .list-item {
    display: inline-block;
    margin-right: 5px;
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