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
        updateProduct(){
            let url = `${this.base_url}api/${this.api_path}/admin/product`;
            let http = 'post';

            if(!this.isNew){
                url = `${this.base_url}api/${this.api_path}/admin/product/${this.tempProduct.id}`;
                http = 'put';
            }

            console.log(this.tempProduct);
            axios[http](url,  { data: this.tempProduct })
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



app.mount("#app")