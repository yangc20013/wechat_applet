import axios from "axios";
import {Message} from 'element-ui'

axios.interceptors.request.use(config => {
    return config;
  }, err => {
    Message.error({message: '请求超时!'});
    // return Promise.resolve(err);
  })
  axios.interceptors.response.use(data => {
    if (data.status && data.status == 200 && data.data.status == 500) {
      Message.error({message: data.data.msg});
      return;
    }
    if((data.data.code == 400 || data.data.code == 403) && data.data.msg){
        Message.error({message: data.data.msg});
        return;
    }
    if (data.data.code == 200 && data.data.msg) {
      Message.success({message: data.data.msg});
    }
    return data.data;
  }, err => {
    if (err.response.status == 504 || err.response.status == 404) {
      Message.error({message: '服务器被吃了⊙﹏⊙∥'});
    } else if (err.response.status == 403) {
      Message.error({message: '权限不足,请联系管理员!'});
    } else if (err.response.status == 401) {
      Message.error({message: err.response.data.msg});
    } else {
      if (err.response.data.msg) {
        Message.error({message: err.response.data.msg});
      }else{
        Message.error({message: '未知错误!'});
      }
    }
})
  

export default {
    ajaxGet (api, cb, fail) {
        axios.get(api)
            .then(cb)
            .catch(err => {
                if(fail) fail;
                console.log(err);
            })
    },
    ajaxPost (api, post, cb, fail) {
        axios.post(api, post)
            .then(cb)
            .catch(err => {
                if(fail) fail;
                console.log(err);
            })
    },
}