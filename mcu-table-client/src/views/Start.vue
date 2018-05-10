<template>
  <div id='Start'>
    <v-container fluid>
      <v-row>
        <v-col xs12 md4 style="margin: 0 auto;">
          <v-card style="margin: 0 auto;" class="grey lighten-4">
            <v-card-text>
              <h4>登入</h4>
              <v-container fluid>
                <v-row>
                  <v-col xs12 md10 style="margin: 0 auto;">
                    <p>建議使用電腦瀏覽</p>
                    <p>需使用學校系統帳號密碼<br>(拿取課表用)</p>
                    <v-select v-bind:options="options" id="ggdb" placeholder="選擇學期" name="ggdb" v-model.number="ggdb" :disabled="disabled"></v-select>
                    <v-text-input id="account" name="account" placeholder="請輸入學校系統帳號" v-model="account" :disabled="disabled"></v-text-input>
                    <v-text-input id="password" type="password" name="password" placeholder="請輸入學校系統密碼" v-model="password" :disabled="disabled"></v-text-input>
                    <textarea name="" id="" class="text-xs-left white" :disabled="disabled">{{note}}</textarea>
                    <br><br>
                    <v-btn block ripple outline info @click.native="login" :disabled="disabled" :loading="disabled">同意並登入</v-btn>
                    <v-btn block ripple flat style="margin-top: 10px;" @click.native="nologin" :disabled="disabled">同意並使用空白課表</v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
  import * as api from '../api/axios.js'
  export default {
    name: 'Start',
    data() {
      return {
        options: [{
            value: 1,
            text: '第1學期'
          },
          {
            value: 2,
            text: '第2學期'
          },
          {
            value: 8,
            text: '選課期間'
          }
        ],
        disabled:false,
        ggdb: 0,
        account: "",
        password: "",
        note: "1.本系統非學校開發。\n2.請注意是模擬排課，並不會幫你代選、代搶，請記得去搶課。\n3.課程資料直接從網路上抓，為避免學校網站被抓爆，快取1小時。\n4.使用完請自行確認，開發者不負任何責任。"
      }
    },
    methods: {
      login() {
        if (this.ggdb == 0 || this.account == "" || this.password == "") {
          this.$vuetify.toast.create(...["請填寫所有欄位", "bottom"])
        } else {
          this.disabled=true;
          api.getMyCourse(this.ggdb, this.account, this.password).then((response) => {
            console.log(response);
            this.$store.commit("ok", {list:response.data, ggdb:this.ggdb})
            this.$router.replace("/choose");
          }).catch((error)=>{

            if(error.response.data.message=="帳號密碼錯誤"){
              this.disabled=false;
              this.$vuetify.toast.create(...["登入失敗，請確認帳號密碼是否輸入錯誤，已錯誤"+error.response.data.step+"次， <br> 請注意避免10次，否則會被鎖帳號，需要去課務組解鎖。", "bottom"])
            }else{
              this.$vuetify.toast.create(...["請求失敗，請檢查網路狀態。", "bottom"])
              console.log(error);
              this.disabled=false;
            }
          })
        }
      },
      nologin() {
        if(this.ggdb==0){
          this.$vuetify.toast.create(...["請選擇年級", "bottom"])
        }else{
          this.$store.commit("space", this.ggdb)
          this.$router.replace("/choose")
        }
      }
    }
  }
</script>
<style>
  .input-group input {
    height: 2.2rem;
  }
</style>
<style scoped>
  textarea {
    width: 100%;
    height: 100px;
  }
</style>
