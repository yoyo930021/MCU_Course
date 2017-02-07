<template>
  <header>
    <v-navbar>
      <!--<v-btn v-side-bar:mainsidebar="" floating class="side-icon hidden-md-and-up transparent z-depth-0" ripple >
        <v-icon>menu</v-icon>
      </v-btn>-->
      <div class="navbar__side-title">
        <h1 class="text-md-left">{{title}}</h1>
      </div>
    </v-navbar>
  </header>
</template>

<script>
  export default {
    name: 'main-nav',

    props: {
      title: String
    }
  }
</script>
<style scoped>
  .navbar {
    align-items: center;
    color: #fff;
  }
  
  .side-icon {
    margin: 0 1rem;
  }
  
  .navbar__side-title {
    display: flex;
    flex: 1;
    align-items: space-between;
    justify-content: space-between;
    flex-direction: column;
    margin: 0 1rem;
  }
  
  h1 {
    letter-spacing: 1px;
    color: #fff;
    font-weight: 400;
    margin: 0;
    word-break: break-word;
    text-transform: uppercase;
    font-size: 2rem;
  }

  
</style>