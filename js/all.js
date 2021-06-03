Vue.createApp({
    data(){
        return {
            api_path: 'jacky',
            url: 'https://vue3-course-api.hexschool.io/'
        }
    },
    methods: {
        signin(){
            form.addEventListener('click', (e) => {
                console.log(e.target.nodeName == 'BUTTON');
                if(e.target.nodeName == 'BUTTON'){
                    const form = document.querySelector("#form");
                    const login = document.querySelector("#login");
                    const emailInput = document.querySelector("#username");
                    const passwordInput = document.querySelector("#password");
        
                    const username = emailInput.value;
                    const password = passwordInput.value;
                    const data = {
                        username, password
                    }
        
                    axios.post(`${this.url}admin/signin`, data).then(function(res) {
                        console.log(res);
                        if(res.data.success){
                            const { token , expired } = res.data; //一種解構手法 (所寫)，當確定 dtat 裡面有這個值得時候就可以這樣寫
                            // 將 token 存到 cookie~
                            document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;
                            window.location = 'admin.html';
                        }else{
                            alert('請輸入正確的帳號密碼');
                            window.location = 'index.html';
                        }
                    }).catch((err) => {
                        console.log(err);
                    })
                    console.log(data);
                }
            })
        }
    }
}).mount('#app');

