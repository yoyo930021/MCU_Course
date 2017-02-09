<template>
  <v-app top-navbar>
    <main-nav v-bind:title="title"></main-nav>

    <main>
      <v-content>
        <v-container fluid>
          <transition name="slide" mode="out-in">
            <router-view class="pa-1 pb-4"></router-view>
          </transition>
        </v-container>
      </v-content>
    </main>
    <v-footer>
      <div class="text-xs-right">© 2016 yoyo930021(yoyoIU) All Rights Reserved.</div>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    data() {
      return {
        title: "銘傳模擬排課系統"
      }
    },

    mounted() {
      this.$vuetify.init()
    }
  }
</script>
<style lang="stylus">
  @import './stylus/main'
</style>