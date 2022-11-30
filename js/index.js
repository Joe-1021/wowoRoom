const getProductDataUrl='https://livejs-api.hexschool.io/api/livejs/v1/customer/yoyo/products';
const getCartUrl='https://livejs-api.hexschool.io/api/livejs/v1/customer/yoyo/carts';



//取得產品資料
let data=[];
axios.get(getProductDataUrl).then(res=>{
    // console.log(res.data.products)
    data=res.data.products;
    renderData();
}).catch(err=>{
    console.log(err)
})

//渲染
let productList = document.querySelector('.productWrap');
function renderData(){
    let str='';
    data.forEach(item=>{
        str+=`<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="">
                <a href="#shoppingCart" class="addCardBtn" data-id='${item.id}'>加入購物車 </a>
                <h3>${item.title}</h3>
                <del class="originPrice">${item.origin_price}</del>
                <p class="nowPrice">${item.price}</p>
            </li>`
    });
    productList.innerHTML=str;
}

//購物車列表
const cartList = document.querySelector('.shoppingCart-table');
let cartData=[]

function getCartData(){
    axios.get(getCartUrl).then(res=>{
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
    <td>${item.product.price}</td>
    <td>${item.quantity}</td>
    <td>${item.product.price*item.quantity}</td>
    <td class="discardBtn">
        <a href="#shoppingCart" class="material-icons" data-delete='${item.id}'>
            clear
        </a>
    </td>
    </tr>`
    totalPrice +=item.product.price * item.quantity;
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
        <td>NT$ ${totalPrice}</td>
    </tr>
    `;
    cartList.innerHTML=CartTableStr;
}

//加入購物車按鈕
productList.addEventListener('click',e=>{
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
    axios.post(getCartUrl,
        {
            'data':{
                "productId": id,
                "quantity": productNum
            }
        }
        ).then(res=>{
        getCartData();
    }).catch(err=>{
        console.log(err)
    })
}

//刪除所有品項按鈕
cartList.addEventListener('click',e=>{
    const deleteAll=e.target.getAttribute('class')
    if(deleteAll!=='discardAllBtn'){
        return
    }
    deleteAllCartList();
   
})

//刪除全部
function deleteAllCartList(){
    axios.delete(getCartUrl).then(res=>{
        alert('全部刪除成功');
        getCartData();
    }).catch(err=>{
        alert(err.response.data.message)
    })
}

//刪除單一品項按鈕
cartList.addEventListener('click',e=>{
    const deleteSingle=e.target.getAttribute('class')
    if(deleteSingle!=='material-icons'){
        return
    }
    const deleteItem = e.target.getAttribute('data-delete');
    deleteSingle(deleteItem);
})

function deleteSingle(id){
    const deleteSingleUrl=`https://livejs-api.hexschool.io/api/livejs/v1/customer/yoyo/carts/${id}`;
    axios.delete(deleteSingleUrl).then(res=>{
        getCartData();
        alert('成功刪除此筆訂單')
    }).catch(err=>{
        console.log(err);
    })
}
