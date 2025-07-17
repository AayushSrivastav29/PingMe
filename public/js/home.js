let token;
let path='http://localhost:3000';
let username;
document.addEventListener('DOMContentLoaded', initialize);

function initialize(){
    token=localStorage.getItem('token');
    username= localStorage.getItem('name');
    console.log(username);
    //get online users
    onlineUsersHandler();
}

//logout feature
document.querySelector('#logout').addEventListener('click', async()=>{
    try {
        await axios.get(`${path}/api/user/logout`, {
            headers: {'Authorization': token}
        })
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        window.location.href='/view/login.html';
    } catch (error) {
        console.log(error);
    }
})

async function onlineUsersHandler() {
    try {
        const onlineUsers = await axios.get(`${path}/api/user/online`);
        console.log(onlineUsers.data);
        const onlineUsersList= onlineUsers.data;
        const ul = document.querySelector('ul');
        //listing online users
        const li = document.createElement('li');
        li.textContent= "You joined";
        ul.appendChild(li);

        for (let i = 0; i < onlineUsersList.length; i++) {
            let ele= onlineUsersList[i];
            if(ele.name!=username){
                const li = document.createElement('li');
                li.textContent=`${ele.name} joined`;
                if (i%2==0) {
                    li.style.backgroundColor='lightgrey';
                }
                ul.appendChild(li);

            }

            
        }
    } catch (error) {
        console.log(error);
    }
}
