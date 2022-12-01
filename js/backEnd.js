const api_path = "yoyo";
const token = "7huWgaeAO3ZOfefPyI9IxCrpg1P2";

//訂單列表
const orderList = document.querySelector('.orderList');
let orderData=[];
function getOrderData(){
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
        headers:{
            'Authorization':token,
        }
    }).then(res=>{
        orderData = res.data.orders;
        getOrderList();
    }).catch(err=>{
        console.log(err)
    })
}
getOrderData();

function getOrderList(){
    let orderListStr='';
    orderData.forEach((i,index)=>{
        //多筆產品時
        let productStr=''
        i.products.forEach(productItem=>{
            productStr +=`<p>${productItem.title} x ${productItem.quantity}</p>`
        })

        //訂單狀態
        let orderStatus='';
        if(i.paid==true){
            orderStatus='已付款'
        }else{
            orderStatus='未付款'
        }

        //時間轉換
        const thisTime =new Date(i.createdAt*1000);
        const transformTime =`${thisTime.getFullYear()}/${thisTime.getMonth()+1}/${thisTime.getDate()}` ;
        // console.log(transformTime);


        //訂單列表
        orderListStr +=`
        <tr>
            <td>${i.id}</td>
            <td>
            <p>${i.user.name}</p>
            <p>${i.user.tel}</p>
            </td>
            <td>${i.user.address}</td>
            <td>${i.user.email}</td>
            <td>
            <p>${productStr}</p>
            </td>
            <td>${transformTime}</td>
            <td class="orderStatus">
            <a href="#" class='js-orderStatus' data-id='${i.id}' data-status='${i.paid}'>${orderStatus}</a>
            </td>
            <td>
            <input type="button" class="delSingleOrder-Btn orderDelete" data-id='${i.id}' value="刪除">
            </td>
        </tr>`
    })
    orderList.innerHTML = orderListStr;
}

//訂單列表按鈕
orderList.addEventListener('click',e=>{
    e.preventDefault();
    let id = e.target.getAttribute('data-id');
    const targetClass = e.target.getAttribute('class');
    if(targetClass=='js-orderStatus'){
        // console.log('點擊到訂單狀態');
        let status = e.target.getAttribute('data-status');
        changeOrderStatus(status,id);
        return;
    }
    if(targetClass=='delSingleOrder-Btn orderDelete'){
        // console.log('點擊到刪除訂單');
        deleteOrderItem(id);
        return;
    }
})

//修改訂單狀態
function changeOrderStatus(status,id){
    // console.log(status,id);
    let newStatus=''
    if(status ==true){
        newStatus=false;
    }else{
        newStatus=true
    }

    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,{
        'data':{
            'id':id,
            'paid': newStatus
        }
    },
    {
        headers:{
            'Authorization':token,
        }
    }).then(res=>{
        alert('修改訂單狀態成功');
        getOrderData();
    }).catch(err=>{
        console.log(err)
    })
}

//刪除訂單
function deleteOrderItem(id){
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${id}`,
    {
        headers:{
            'Authorization':token,
        }
    }).then(res=>{
        alert('刪除該筆訂單成功');
        getOrderData();
    }).catch(err=>{
        console.log(err)
    })
}



// C3.js
let chart = c3.generate({
    bindto: '#chart', // HTML 元素綁定
    data: {
        type: "pie",
        columns: [
        ['Louvre 雙人床架', 1],
        ['Antony 雙人床架', 2],
        ['Anty 雙人床架', 3],
        ['其他', 4],
        ],
        colors:{
            "Louvre 雙人床架":"#DACBFF",
            "Antony 雙人床架":"#9D7FEA",
            "Anty 雙人床架": "#5434A7",
            "其他": "#301E5F",
        }
    },
});