const app = Vue.createApp({
    data() {
        return {
            user: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        submit() {
            axios.post(`${apiUrl}v2/admin/signin`, this.user)
                .then(res => {
                    const { token, expired } = res.data;
                    document.cookie = `hexschool=${token}; expires=${expired};`
                    window.location = 'product.html';
                })
                .catch(err => { console.log(err.response); })
        },
    }
})
app.mount('#app');