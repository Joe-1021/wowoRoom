const ProductDataUrl='https://livejs-api.hexschool.io/api/livejs/v1/customer/yoyo/products';
const CartUrl='https://livejs-api.hexschool.io/api/livejs/v1/customer/yoyo/carts';
const OrderUrl='https://livejs-api.hexschool.io/api/livejs/v1/customer/yoyo/orders';


//取得產品資料
let data=[];
axios.get(ProductDataUrl).then(res=>{
    // console.log(res.data.products)
    data=res.data.products;
    renderData(data);
}).catch(err=>{
    console.log(err)
})

//渲染
let productList = document.querySelector('.productWrap');
function renderData(data){
    let str='';
    data.forEach(item=>{
        str+=`<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="">
                <a href="#shoppingCart" class="addCardBtn" data-id='${item.id}'>加入購物車 </a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$ ${toThousands(item.origin_price)}</del>
                <p class="nowPrice">NT$ ${toThousands(item.price)}</p>
            </li>`
    });
    productList.innerHTML=str;
}

//購物車列表
const cartList = document.querySelector('.shoppingCart-table');
let cartData=[]

function getCartData(){
    axios.get(CartUrl).then(res=>{
    // console.log(res.data.carts);
    cartData = res.data.carts;
    getCartlist();
    if(cartData.length===0){
        cartList.style.display='none';
        return;
    }else{
        cartList.style.display='table';
    }
    }).catch(err=>{
    console.log(err)
    })
}
getCartData();

function getCartlist(){
    let listStr='';
    let totalPrice=0;
    cartData.forEach(item=>{
    listStr+=`<tr>
    <td>
        <div class="cardItem-title">
            <img src="${item.product.images}" alt="">
            <p>${item.product.title}</p>
        </div>
    </td>
    <td>NT$ ${toThousands(item.product.price)}</td>
    <td>
        <div class="productNum">
            <a href="#"><span class="material-icons cartAmount-icon" data-num="${item.quantity - 1}" data-id="${item.id}">remove</span></a>
            <span>${item.quantity}</span>
            <a href="#"><span class="material-icons cartAmount-icon" data-num="${item.quantity + 1}" data-id="${item.id}">add</span></a>
        </div>    
    </td>
    <td>NT$ ${toThousands(item.product.price*item.quantity)}</td>
    <td class="discardBtn">
        <a href="#shoppingCart" class="material-icons" data-delete='${item.id}'>
            clear
        </a>
    </td>
    </tr>`
    totalPrice += item.product.price * item.quantity;
    })

    let CartTableStr=`<tr>
    <th width="40%">品項</th>
    <th width="15%">單價</th>
    <th width="15%">數量</th>
    <th width="15%">金額</th>
    <th width="15%"></th>
    </tr>
    ${listStr}
    <tr>
        <td>
            <a href="#productList" class="discardAllBtn">刪除所有品項</a>
        </td>
        <td></td>
        <td></td>
        <td>
            <p>總金額</p>
        </td>
        <td>NT$ ${toThousands(totalPrice)}</td>
    </tr>
    `;
    cartList.innerHTML=CartTableStr;

    //數量按鈕
    let productNum = document.querySelectorAll('.cartAmount-icon');
    productNum.forEach(i=>{
        i.addEventListener('click',e=>{
            e.preventDefault();
            let num = e.target.dataset.num;
            let id = e.target.dataset.id
            changeNum(num,id)
        })
    })
}

//變更數量
function changeNum(num,id){
    if(num>0){
        let data = {
            'data':{
                'id':id,
                'quantity':parseInt(num,10),
            }
        }
        axios.patch(CartUrl,data).then(res=>{
            getCartData();
        }).catch(err=>{
            console.log(err)
        })
    }else{
        deleteSingle(id)
    }
}


//加入購物車按鈕
productList.addEventListener('click',e=>{
    e.preventDefault();
    const addCartClass=e.target.getAttribute('class');
    // console.log(addCartClass);
    if(addCartClass!=='addCardBtn'){
        // console.log('不是加入購物車按鈕')
        return
    }else{
        // console.log('加入購物車')
    }
    const productId = e.target.getAttribute('data-id');
    addCartItem(productId);
})

//加入購物車
function addCartItem(id){
    let productNum=1;
    cartData.forEach(i=>{
        if(i.product.id===id){
            productNum = i.quantity +=1;
        }
    })
    axios.post(CartUrl,
        {
            'data':{
                "productId": id,
                "quantity": productNum
            }
        }
        ).then(res=>{
        getCartData();
        alert('加入成功')
    }).catch(err=>{
        console.log(err)
    })
}

//刪除所有品項按鈕
cartList.addEventListener('click',e=>{
    e.preventDefault();
    const deleteAll=e.target.getAttribute('class')
    if(deleteAll!=='discardAllBtn'){
        return
    }
    deleteAllCartList();
   
})

//刪除全部
function deleteAllCartList(){
    axios.delete(CartUrl).then(res=>{
        alert('全部刪除成功');
        getCartData();
    }).catch(err=>{
        alert(err.response.data.message)
    })
}

//刪除單一品項按鈕
cartList.addEventListener('click',e=>{
    e.preventDefault();
    const deleteSingleClass=e.target.getAttribute('class')
    if(deleteSingleClass!=='material-icons'){
        return
    }
    const deleteItem = e.target.getAttribute('data-delete');
    deleteSingle(deleteItem);
})
//刪除單一品項
function deleteSingle(id){
    const deleteSingleUrl=`https://livejs-api.hexschool.io/api/livejs/v1/customer/yoyo/carts/${id}`;
    axios.delete(deleteSingleUrl).then(res=>{
        getCartData();
        alert('成功刪除此筆訂單')
    }).catch(err=>{
        console.log(err);
    })
}

//資料驗證
// const form = document.querySelector('.orderInfo-form'); //reset用
// const inputs = document.querySelectorAll('input[id]');
// const txt = document.querySelectorAll('[data-message]');
// const payMethod = document.querySelector('#tradeWay');
// const submit = document.querySelector('.orderInfo-btn');

// submit.addEventListener('click',e=>{
//     e.preventDefault();
//     txt.forEach((item,index)=>{
//         if(inputs[index].value===''){
//             item.textContent = `${item.dataset.message}必填`
//         }else{
//             item.textContent=''
//         }
//     })
//     submitOrder();
// })


//資料驗證2 validate.js
const form = document.querySelector('.orderInfo-form');//validate.js用
const submit = document.querySelector('.orderInfo-btn');
const inputs = document.querySelectorAll('input[type=text],input[type=tel],input[type=email]')
// console.log(inputs)
const constraints = {
    姓名:{
        presence:{
            message:'必填'
        }
    },
    電話:{
        presence:{
            message:'必填'
        },
        numericality:{
            onlyInteger: true, // 只能是整數
            message:'號碼必須是數字',
        },
        length: {
            minimum: 9, // 輸入值不能短於此值
            maximum: 10, // 輸入值不能長於此值
            message:'如果是市話必須為9碼(需含區域碼)'
          }
    },
    Email:{
        presence:{
            message:'必填'
        },
        email:{
            email:true,
            message:'必須符合格式'
        }
    },
    寄送地址:{
        presence:{
            message:'必填'
        }
        
    }
}

const formValidate = (e)=>{
    e.preventDefault();
    //先清空警告訊息
    inputs.forEach(i=>{
        i.nextElementSibling.textContent='';
    });
    //執行驗證
    const errors = validate(form,constraints);

    //如果表單輸入有誤，顯示警告訊息
    if(errors){
        const keys = Object.keys(errors);
        // console.log(keys)
        const values = Object.values(errors);

        keys.forEach((item,index)=>{
            document.querySelector(`[data-message="${item}"]`).textContent = values[index]
        });
    }else{
        submitOrder();
    }
}

submit.addEventListener('click',formValidate)

//送出訂單
const payMethod = document.querySelector('#tradeWay');

function submitOrder(){
    axios.post(OrderUrl,{
        "data": {
            "user": {
              "name": inputs[0].value,
              "tel": inputs[1].value,
              "email": inputs[2].value,
              "address": inputs[3].value,
              "payment": payMethod.value,
            }
          }
    }).then(res=>{
        getCartData();
        form.reset();
        alert('訂單送出成功');
    }).catch(err=>{
        alert('資料不得空白');
    })
}

//分類
const select = document.querySelector('.productSelect');
select.addEventListener('change',e=>{
    let targetProducts=[]
    if(e.target.value==='全部'){
        targetProducts=data
    }else{
        targetProducts=data.filter(i=>i.category===e.target.value)
    }
    renderData(targetProducts)
})



//千分位
function toThousands(x){
    let parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g,',');
    return parts.join('.');
}