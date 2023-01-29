import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js";
import  pagination from "./pagination.js";

let productModal = null;
let deleteModal = null;

const app = createApp({
  data() {
    return {
      baseURL: "https://vue3-course-api.hexschool.io/v2",
      apiPath: "hironakavue",

      isNew: false, // 用此來判斷是否為新的產品資料
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      pages:{}
    };
  },

  mounted() {
    productModal = new bootstrap.Modal(document.getElementById("productModal"));

    deleteModal = new bootstrap.Modal(
      document.getElementById("delProductModal")
    );

    this.checkAdmin();
  },

  methods: {
    checkAdmin() {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1"
      );

      axios.defaults.headers.common["Authorization"] = token;

      axios.defaults.baseURL = this.baseURL;

      axios
        .post(`/api/user/check`)
        .then((res) => {
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
          location.href = "./index.html";
        });
    },

    //取得產品資料
    getProducts( page = 1) {
      axios
        .get(`/api/${this.apiPath}/admin/products?page=${page}`)
        .then((res) => {
          this.products = res.data.products;
          this.pages = res.data.pagination;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },

    //上傳產品資料
    updateProduct() {
      let url = `/api/${this.apiPath}/admin/product`;
      let httpMethod = "post";

      // 若非新的產品資料，則將 url 及 http 方法改為更新產品資料的 API 。
      if (!this.isNew) {
        url = `/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
        httpMethod = "put";
      }

      axios[httpMethod](url, {
        data: this.tempProduct,
      })
        .then((res) => {
          alert(res.data.message);
          productModal.hide();
          this.getProducts();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },

    //刪除產品資料
    deleteProduct() {
      const url = `${this.baseURL}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;

      axios
        .delete(url)
        .then((res) => {
          alert(res.data.message);
          this.getProducts();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });

      deleteModal.hide();
    },

    //開啟 modal
    openModal(kind, product) {
      // 用 kind 參數來判斷新增、編輯、刪除，並開啟相對應的 modal
      switch (kind) {
        // 若是新增 modal ,則設定初始化資料
        case "new":
          this.tempProduct = {
            imagesUrl: [],
          };
          this.isNew = true;
          productModal.show();
          break;

        // 若是編輯、刪除 modal ,則帶入相對應的產品資料
        case "edit":
          this.tempProduct = { ...product };
          this.isNew = false;
          productModal.show();
          break;

        case "delete":
          this.tempProduct = { ...product };
          deleteModal.show();
          break;
      }
    },

    // 新增 tempProduct.imagesUrl 陣列
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push("");
    },
  },

  components: {
    // 分頁 元件
    pagination
  }
});

// Modal 元件
app.component('product-modal', {
  props:['tempProduct','updateProduct','isNew','createImages'],
  template: '#product-modal-tamplate',
  
})

app.mount("#app");

