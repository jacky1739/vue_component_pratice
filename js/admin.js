import pagination from './pagination.js';

let productModal = null;
let delProductModal = null;

const app = Vue.createApp({
    data(){
        return {
            api_path: 'jacky',
            base_url: 'https://vue3-course-api.hexschool.io/',
            products: [],
            isNew: false,  //是否是新的 
            tempProduct: {
                imagesUrl: [],
            },
            pagination: {}
        }
    },
    components: {
        pagination 
    },
    methods: {
        getData(page){
            axios.get(`${this.base_url}api/${this.api_path}/admin/products?page=${page}`).then((res) => {
                if(res.data.success){
                    // console.log(res);
                    this.products = res.data.products;
                    this.pagination = res.data.pagination;
                    // console.log(this.pagination);
                }
            }).catch((err) => {
                alert(err.data.message);
            })
        },
        updateProduct(tempProduct){
            let url = `${this.base_url}api/${this.api_path}/admin/product`;
            let http = 'post';

            if(!this.isNew){
                url = `${this.base_url}api/${this.api_path}/admin/product/${this.tempProduct.id}`;
                http = 'put';
            }

            console.log(this.tempProduct);
            axios[http](url,  { data: tempProduct })
            .then((res) => {
                if(res.data.success) {
                    window.alert(res.data.message);
                    productModal.hide();
                    this.getData();
                } else {
                    window.alert(res.data.message);
                }
            })
            .catch(err=>{
                // console.dir(err);
                const errMsg = err.response.data.message;
                console.log(errMsg);
            })
        },
        openModal(isNew, item){
            console.log(isNew, item);
            switch(isNew) {
                case 'new':
                    this.tempProduct = {
                        imagesUrl: [],
                    };
                    this.isNew = true;
                    productModal.show();
                    break;
                case 'edit':
                    this.tempProduct = {...item};
                    this.isNew = false;
                    productModal.show();
                    break;
                case 'delete':
                    this.tempProduct = {...item};
                    this.isNew = false;
                    delProductModal.show();
                    break;
            }
        },
        deleteItem(){
            axios.delete(`${this.base_url}api/${this.api_path}/admin/product/${this.tempProduct.id}`).then((res) => {
                console.log(res);
                if(res.data.success){
                    alert(res.data.message);
                    delProductModal.hide();
                    this.getData();
                } else {
                    alert(res.data.message);
                }
            })
        }
    },
    mounted() {
        productModal = new bootstrap.Modal(document.getElementById('productModal'), {
            keyboard: false
        });

        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
            keyboard: false
        });

        let token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        axios.defaults.headers.common['Authorization'] = token;
        console.log(token);
        this.getData();
    }
})

// app.component('pagination', {
//     props: ['page'],
//     template: `
//     <nav aria-label="Page navigation example">
//         <ul class="pagination">
//             <li class="page-item">
//                 <a class="page-link" href="#" aria-label="Previous" @click="$emit('get-product', page.current_page - 1)">
//                 <span aria-hidden="true">&laquo;</span>
//                 </a>
//             </li>
//             <li class="page-item" :class="{ 'active' : item === page.current_page}" v-for="item in page.total_pages" :key="item">
//                 <a class="page-link" href="#" @click="$emit('get-product', item)">{{ item }}</a>
//             </li>
//             <li class="page-item">
//                 <a class="page-link" href="#" aria-label="Next" @click="$emit('get-product', page.current_page + 1)">
//                 <span aria-hidden="true">&raquo;</span>
//                 </a>
//             </li>
//         </ul>
//     </nav>
//     `,
//     created() {
//         // console.log(this.page.total_page)
//     }
// })

app.component('productModal', {
    template: `<div id="productModal" ref="productModal" class="modal fade" tabindex="-1" aria-labelledby="productModalLabel"
    aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 id="productModalLabel" class="modal-title">
          <span v-if="isNew">新增產品</span>
          <span v-else>編輯產品</span>
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="mb-1">
              <div class="form-group">
                <label for="imageUrl">主要圖片</label>
                <input type="text" v-model="tempProduct.imagesUrl" class="form-control"
                    placeholder="請輸入圖片連結">
              </div>
              <img class="img-fluid" :src="tempProduct.imagesUrl" alt="">
            </div>

            <div>
              <button class="btn btn-outline-primary btn-sm d-block w-100" @click="openModal('edit')">
                新增圖片
              </button>
            </div>
            <div v-else>
              <button class="btn btn-outline-danger btn-sm d-block w-100" @click="openModal('delete')">
                刪除圖片
              </button>
            </div>
          </div>
          <div class="col-sm-8">
            <div class="form-group">
              <label for="title">標題</label>
              <input id="title" v-model="tempProduct.title" type="text" class="form-control" placeholder="請輸入標題">
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="category">分類</label>
                <input id="category" v-model="tempProduct.category" type="text" class="form-control"
                      placeholder="請輸入分類">
              </div>
              <div class="form-group col-md-6">
                <label for="price">單位</label>
                <input id="unit" v-model="tempProduct.unit" type="text" class="form-control" placeholder="請輸入單位">
              </div>
            </div>

            <div class="row">
              <div class="form-group col-md-6">
                <label for="origin_price">原價</label>
                <input id="origin_price" type="number" min="0" class="form-control" v-model.number="tempProduct.origin_price" placeholder="請輸入原價">
              </div>
              <div class="form-group col-md-6">
                <label for="price">售價</label>
                <input id="price" type="number" min="0" class="form-control"
                      placeholder="請輸入售價" v-model.number="tempProduct.price">
              </div>
            </div>
            <hr>

            <div class="form-group">
              <label for="description">產品描述</label>
              <textarea id="description" v-model="tempProduct.description" type="text" class="form-control"
                        placeholder="請輸入產品描述">
              </textarea>
            </div>
            <div class="form-group">
              <label for="content">說明內容</label>
              <textarea id="description" v-model="tempProduct.content" type="text" class="form-control"
                        placeholder="請輸入說明內容">
              </textarea>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input id="is_enabled" v-model="tempProduct.is_enabled" class="form-check-input" type="checkbox"
                        :true-value="1" :false-value="0">
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
          取消
        </button>
        <button type="button" class="btn btn-primary" @click="$emit('update-product', tempProduct)">
          確認
        </button>
      </div>
    </div>
  </div>
</div>`,
props: [ 'tempProduct' ]
})


app.mount("#app")