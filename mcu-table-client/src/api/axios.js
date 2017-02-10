import axios from 'axios'
import querystring from 'querystring';

const defaults = {
  baseURL: 'https://coapi.csie.mcu.edu.tw/'
}

Object.assign(axios.defaults, defaults)

export const getMyCourse = (ggdb, account, password) => {
  return axios.post('/course/' + ggdb + '/my/', {
    account: account,
    password: password
  })
}

export const getMCCourse = (ggdb, type, dept, yr) => {
  return axios.get('/course/' + ggdb + '/' + type + '/' + dept + '/' + yr)
}

export const getCTCourse = (ggdb, type, sch) => {
  return axios.get('/course/' + ggdb + '/' + type + '/' + sch)
}

export const getOptionCourse = (ggdb, type) => {
  return axios.get('/course/' + ggdb + '/option/' + type)
}
export const getShareCourse = (share) => {
  return axios.get('/share/' + share)
}
export const postShare = (courses) => {
  var data = querystring.stringify({
    body: JSON.stringify(courses)
  });
  return axios.post("/share/", data);
}

export const getSearch = (ggdb,subject) => {
  return axios.get('/course/' + ggdb + '/search/'+subject)
}

