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
            text: '105學年度第1學期'
          },
          {
            value: 2,
            text: '105學年度第2學期'
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
        note: "1.本系統非學校開發。\n2.請注意是模擬排課，並不會幫你代選、代搶，請記得去搶課。\n3.課程資料直接從網路上抓，為避免學校網站被抓爆，快取1小時。\n4.使用完請自行確認，開發者不負任何責任。",
        test: [{
          "depart": "大學部",
          "subjectId": "00122",
          "subjectName": "體育（貳）",
          "classId": "36101",
          "className": "資工一甲",
          "maxPeople": 75,
          "nowPeople": 56,
          "teacher": ["廖偉智"],
          "time": [{
            "day": 1,
            "sec": [5, 6]
          }],
          "site": ["體育"],
          "type": "必修",
          "credit": 0,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "00997",
          "subjectName": "班會",
          "classId": "36101",
          "className": "資工一甲",
          "maxPeople": 70,
          "nowPeople": 57,
          "teacher": ["謝育平"],
          "time": [{
            "day": 3,
            "sec": [20]
          }],
          "site": ["EE511"],
          "type": "必修",
          "credit": 0,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "00999",
          "subjectName": "週會",
          "classId": "36101",
          "className": "資工一甲",
          "maxPeople": 70,
          "nowPeople": 57,
          "teacher": [],
          "time": [{
            "day": 5,
            "sec": [5]
          }],
          "site": [""],
          "type": "必修",
          "credit": 0,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "36103",
          "subjectName": "離散數學",
          "classId": "36101",
          "className": "資工一甲",
          "maxPeople": 75,
          "nowPeople": 57,
          "teacher": ["蘇民揚"],
          "time": [{
            "day": 2,
            "sec": [5, 6, 7]
          }],
          "site": ["S102"],
          "type": "必修",
          "credit": 3,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "36104",
          "subjectName": "程式設計（二）",
          "classId": "36101",
          "className": "資工一甲",
          "maxPeople": 75,
          "nowPeople": 57,
          "teacher": ["陳怡安", "謝育平"],
          "time": [{
            "day": 2,
            "sec": [2, 3, 4]
          }, {
            "day": 5,
            "sec": [2, 3, 4]
          }],
          "site": ["S304"],
          "type": "必修",
          "credit": 3,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "36106",
          "subjectName": "數位邏輯設計",
          "classId": "36101",
          "className": "資工一甲",
          "maxPeople": 75,
          "nowPeople": 57,
          "teacher": ["陳游利"],
          "time": [{
            "day": 2,
            "sec": [8, 9, 40]
          }],
          "site": ["S102"],
          "type": "必修",
          "credit": 3,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "36111",
          "subjectName": "數位邏輯實驗",
          "classId": "36101",
          "className": "資工一甲",
          "maxPeople": 64,
          "nowPeople": 57,
          "teacher": ["陳游利"],
          "time": [{
            "day": 3,
            "sec": [7, 8, 9]
          }],
          "site": ["AA202"],
          "type": "必修",
          "credit": 1,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "36114",
          "subjectName": "微積分（二）",
          "classId": "36101",
          "className": "資工一甲",
          "maxPeople": 70,
          "nowPeople": 56,
          "teacher": ["黎育麟", "李遠坤"],
          "time": [{
            "day": 1,
            "sec": [3]
          }, {
            "day": 3,
            "sec": [2, 3, 4]
          }],
          "site": ["S109", "EE511"],
          "type": "必修",
          "credit": 3,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "00122",
          "subjectName": "體育（貳）",
          "classId": "36102",
          "className": "資工一乙",
          "maxPeople": 75,
          "nowPeople": 54,
          "teacher": ["賴賜文"],
          "time": [{
            "day": 5,
            "sec": [1, 2]
          }],
          "site": ["體育"],
          "type": "必修",
          "credit": 0,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "00997",
          "subjectName": "班會",
          "classId": "36102",
          "className": "資工一乙",
          "maxPeople": 70,
          "nowPeople": 54,
          "teacher": ["李遠坤"],
          "time": [{
            "day": 2,
            "sec": [8]
          }],
          "site": ["EE511"],
          "type": "必修",
          "credit": 0,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "00999",
          "subjectName": "週會",
          "classId": "36102",
          "className": "資工一乙",
          "maxPeople": 70,
          "nowPeople": 54,
          "teacher": [],
          "time": [{
            "day": 5,
            "sec": [5]
          }],
          "site": [""],
          "type": "必修",
          "credit": 0,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "36103",
          "subjectName": "離散數學",
          "classId": "36102",
          "className": "資工一乙",
          "maxPeople": 75,
          "nowPeople": 54,
          "teacher": ["蘇民揚"],
          "time": [{
            "day": 3,
            "sec": [5, 6, 7]
          }],
          "site": ["S213"],
          "type": "必修",
          "credit": 3,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "36104",
          "subjectName": "程式設計（二）",
          "classId": "36102",
          "className": "資工一乙",
          "maxPeople": 75,
          "nowPeople": 54,
          "teacher": ["高頫驊", "何祖鳳"],
          "time": [{
            "day": 3,
            "sec": [2, 3, 4]
          }, {
            "day": 1,
            "sec": [6, 7, 8]
          }],
          "site": ["S304", "S210"],
          "type": "必修",
          "credit": 3,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "36106",
          "subjectName": "數位邏輯設計",
          "classId": "36102",
          "className": "資工一乙",
          "maxPeople": 70,
          "nowPeople": 54,
          "teacher": ["趙和昌"],
          "time": [{
            "day": 2,
            "sec": [2, 3, 4]
          }],
          "site": ["EE511"],
          "type": "必修",
          "credit": 3,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "36111",
          "subjectName": "數位邏輯實驗",
          "classId": "36102",
          "className": "資工一乙",
          "maxPeople": 64,
          "nowPeople": 54,
          "teacher": ["趙和昌"],
          "time": [{
            "day": 5,
            "sec": [6, 7, 8]
          }],
          "site": ["AA202"],
          "type": "必修",
          "credit": 1,
          "note": ""
        }, {
          "depart": "大學部",
          "subjectId": "36114",
          "subjectName": "微積分（二）",
          "classId": "36102",
          "className": "資工一乙",
          "maxPeople": 70,
          "nowPeople": 54,
          "teacher": ["黎育麟", "李遠坤"],
          "time": [{
            "day": 1,
            "sec": [2]
          }, {
            "day": 2,
            "sec": [5, 6, 7]
          }],
          "site": ["S109", "EE511"],
          "type": "必修",
          "credit": 3,
          "note": ""
        }, {
          "depart": "碩士班",
          "subjectId": "36552",
          "subjectName": "軟體工程",
          "classId": "36141",
          "className": "資工系研一",
          "maxPeople": 30,
          "nowPeople": 11,
          "teacher": ["何祖鳳"],
          "time": [{
            "day": 3,
            "sec": [5, 6, 7]
          }],
          "site": ["S401"],
          "type": "必修",
          "credit": 3,
          "note": ""
        }, {
          "depart": "碩士班",
          "subjectId": "45102",
          "subjectName": "論文研討（二）",
          "classId": "36141",
          "className": "資工系研一",
          "maxPeople": 30,
          "nowPeople": 10,
          "teacher": ["黃世育"],
          "time": [{
            "day": 5,
            "sec": [6, 7]
          }],
          "site": ["S401"],
          "type": "必修",
          "credit": 2,
          "note": ""
        }]
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
          this.$store.commit("ok", {list:this.test, ggdb:this.ggdb})
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