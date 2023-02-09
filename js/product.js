let productModal = {};
let deleteModal = {};

const app = Vue.createApp({
    data() {
        return {
            products: [],
            renderProduct: "",
            isNew: false,
            addImg: false,
            newImg: "",
            selectProduct: {
                // 新建資料的各項屬性，物件包物件
                data: {
                    title: "",
                    category: "",
                    origin_price: null,
                    price: null,
                    unit: "",
                    description: "",
                    content: "",
                    is_enabled: 0,
                    imageUrl: "",
                    imagesUrl: ['']
                },
            },
        }
    },
    methods: {
        // 登入管理者頁面
        checkAdmin() {
            axios.post(`${apiUrl}v2/api/user/check`)
                .then(res => {
                    this.getData();
                })
                .catch(err => {
                    window.location = 'login.html';
                })

        },
        // 取得及渲染資料
        getData() {
            axios.get(`${apiUrl}v2/api/${path}/admin/products`)
                .then(res => {
                    this.products = res.data.products;
                    this.clearProduct();
                })
                .catch(err => console.dir(err.response))

        },
        //更新產品資訊
        updateProduct() {
            if (this.isNew) {
                axios
                    .post(`${apiUrl}v2/api/${path}/admin/product`, this.selectProduct)
                    .then((res) => {
                        alert(res.data.message);
                        this.getData(); //更新產品頁面
                        productModal.hide(); //更新完後關閉model
                        this.isNew = false;
                    })
                    .catch((err) => {
                        alert(err.data.message)
                    });
            } else {
                let id = this.selectProduct.data.id;
                axios
                    .put(
                        `${apiUrl}v2/api/${path}/admin/product/${id}`,
                        this.selectProduct
                    )
                    .then((res) => {
                        alert(res.data.message);
                        productModal.hide();
                        this.getData();
                    })
                    .catch((err) => alert("產品更新失敗"));
            }
        },
        deleteProduct() {
            let id = this.selectProduct.data.id; //選取目標id 
            axios
                .delete(`${apiUrl}v2/api/${path}/admin/product/${id}`)
                .then((res) => {
                    alert(res.data.message);
                    deleteModal.hide();
                    this.getData();
                })
                .catch((err) => {
                    console.log(err.response);
                });
        },
        openModal(status, product) {
            if (status == "new") {
                this.selectProduct.data = {};
                this.isNew = true;
                this.newImg = '';
                productModal.show();
                this.selectProduct.data.imagesUrl = [];
            } else if (status == "edit") {
                this.selectProduct.data = {...product };
                this.isNew = false;
                productModal.show();
            } else if (status == "delete") {
                this.selectProduct.data = {...product };
                deleteModal.show();
            }
        },

        clearProduct() {
            this.selectProduct.data = {};
            this.isNew = false;
            this.clearImg();
        },
        addNewImg() {
            if (!this.selectProduct.data.hasOwnProperty('imagesUrl')) {
                this.selectProduct.data.imagesUrl = [];
            }
            this.selectProduct.data.imagesUrl.push(this.newImg);
            this.clearImg();
        },
        clearImg() {
            this.newImg = "";
            this.addImg = false;
        },
        deleteImg(key) {
            this.selectProduct.data.imagesUrl.splice(key, 1);
        },
    },


    mounted() {
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexschool\s*\=\s*([^;]*).*$)|^.*$/, "$1");

        axios.defaults.headers.common["Authorization"] = token;
        this.checkAdmin();
        productModal = new bootstrap.Modal(document.getElementById("productModal"));
        deleteModal = new bootstrap.Modal(
            document.getElementById("delProductModal")
        );
    },

});

app.mount('#app');