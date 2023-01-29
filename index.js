import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js";

const app = createApp({
  data(){
    return{
      user:{
        username: '',
        password: ''
      }
    }
  },
  methods:{
    login(){
      const url = "https://vue3-course-api.hexschool.io/v2/admin/signin";

      axios.post(url, this.user)
      .then(function (res) {

        const { token, expired} = res.data;

        document.cookie = `token=${ token }; expires=Thu,${new Date(expired)};`;

        location.href="./product.html";
      })
      .catch(function (error) {
        alert(error.data.message);
      });
    }
  }
});

app.mount("#app");