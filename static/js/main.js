var cart = []
var cartVisiblity = false
var productList = ``

const home_url = "https://abugida.herokuapp.com/"
//jquery
 

$(function() {
  $('ul.parent > li').hover(function() {
    $(this).find('ul.child').show(200);
  }, function(){
    $(this).find('ul.child').hide(200);
  });
});


$('#btnSearch').on('click', function () {
  var searchInput = $('#txtSearch').val();
  var url = home_url + "search=" + searchInput + "&page=1";
  method = "GET"

  const xhr = new XMLHttpRequest()
  xhr.responseType = "json"
  xhr.open(method, url)
  // xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
  // xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
    xhr.onload = function(){
      const serverResponse = xhr.response
      const listedItems = serverResponse.response
      productList = serverResponse.response
      var finallist = ``
      for(var i=0; i < listedItems.length; i++){
          finallist += sListItems(listedItems[i])
      }
      var productHtml = document.getElementById('product-list').innerHTML
      document.getElementById('product-list').innerHTML = finallist 
   }

  xhr.send()
});


$(function() {
  $("#txtSearch").keypress(function (e) {
      if(e.which == 13) {
          //submit form via ajax, this is not JS but server side scripting so not showing here
          search()
      }
  });
});





//javascript

window.addEventListener("load", () => {
  document.body.classList.remove("preload");
});

document.addEventListener("DOMContentLoaded", () => {
  const mobileSideBar = document.querySelector(".mobile-sidebar");

  document.querySelector("#btnNav").addEventListener("click", () => {
      mobileSideBar.classList.add("mobile-sidebar--open");     
  });

  document.querySelector(".mobile-sidebar__overlay").addEventListener("click", () => {
      mobileSideBar.classList.remove("mobile-sidebar--open");
  });
});

function Cart(){
  this.productsList = []
  this.clearCart = function() {
    let empty = {cart: [], length: 0, price: 0, size: 0}
    sessionStorage.setItem('cart', JSON.stringify(empty))
    sessionStorage.setItem('cart_length', 0)
    sessionStorage.setItem('cart_price', 0)
    sessionStorage.setItem('cart_size', 0)
  }

  if(sessionStorage.getItem('cart') == null) {
   this.clearCart()   
  }

  this.fetchProducts = function() {
    const pd_id = $('.pd-id')
    const pd_name = $('.pd-name')
    const pd_price = $('.pd-price')
    const pd_size = $('.pd-size')
    for(var i=0; i < pd_id.length; i++) {
      this.productsList.push(this.serialise(pd_id[i].id, pd_name[i].innerText, pd_price[i].innerText, pd_size[i].innerText))
    }
  }
  this.error = "Error"

  this.serialise = function(pd_id, pd_name, pd_price, pd_size) {
    return [parseInt(pd_id), pd_name, parseFloat(pd_price), parseFloat(pd_size)]
  }
  this.getLength = function() {
    return this.product.length
  }
  this.totalPrice = function() {
    let total = 0
    for(let i=0; i < this.getLength(); i++){
      total += product[i][2]
    }
    return total
  }
  this.totalSize = function() {
    let total = 0
    for(let i=0; i < this.getLength(); i++){
      total += product[i][3]
    }
    return total
  }

  this.getProduct = function(pd_id) {
    try {
      for(let i=0; i < this.productsList.length; i++){
          if (this.productsList[i][0] == pd_id){
              return [0, this.productsList[i]]
          }
      }
      return [1, this.error]
    }
    catch(err) {
      return [1, err]
    }
  }

  this.refreshCart = function() {
    try{
      let cartObj = JSON.parse(sessionStorage.getItem('cart'))
      if(cartObj.length != 0) {
        document.getElementById('cart-desktop').innerHTML = this.htmlList(cartObj)
        document.getElementById('cart-mob-box').innerHTML = this.htmlList(cartObj)
        document.getElementById('btnCart').innerHTML = `<i class="fa fa-shopping-cart fa-lg"></i> Cart(`+ cartObj.length +`)`
        document.getElementById('total-size').innerHTML = (parseFloat(cartObj.size)/1024).toFixed(2) + " GB"
        document.getElementById('total-price').innerHTML = parseFloat(cartObj.price) + " Birr"
        document.getElementById('total-size-mob').innerHTML = (parseFloat(cartObj.size)/1024).toFixed(2) + " GB"
        document.getElementById('total-price-mob').innerHTML = (parseFloat(cartObj.price)).toFixed(2) + " Birr"
      }else{
        document.getElementById('cart-desktop').innerHTML = ""
        document.getElementById('cart-mob-box').innerHTML = ""
        document.getElementById('btnCart').innerHTML = `<i class="fa fa-shopping-cart fa-lg"></i> Cart(0)`
        document.getElementById('total-size').innerHTML = "0"
        document.getElementById('total-price').innerHTML = "0"
        document.getElementById('total-size-mob').innerHTML = "0"
        document.getElementById('total-price-mob').innerHTML = "0"
      }
    }
    catch(err){
      console.log(err)
    }
  }

  this.htmlList = function(cartObj) {
    let productsCart = cartObj.cart
    let innerHtml = ""
    for(let i=0; i < productsCart.length; i++){
          innerHtml += `<li class="list-group-item">
          <div class="todo-indicator bg-success"></div>
          <div class="widget-content p-0">
              <div class="widget-content-wrapper">
                  
                  <div class="widget-content-left">
                      <div class="widget-heading"><h5><strong>`+ productsCart[i][1] +`</strong></h5></div>
                      <div class="widget-subheading"><i>Price: &nbsp;`+ productsCart[i][2] +` Birr</i></div>
                      <div class="widget-subheading"><i>Size: &nbsp;`+ ((productsCart[i][3])/1024).toFixed(2) +` GB</i></div>
                  </div>
                  <div class="widget-content-right"><button id="`+ productsCart[i][0] +`" class="border-0 btn-transition btn btn-outline-danger" onclick="removeFromCart(this.id)"> <i class="fa fa-trash"></i> </button> </div>
              </div>
          </div>
      </li>`
    }
    return innerHtml
  }

  this.addToCart = function(product) {
    let cartObj = JSON.parse(sessionStorage.getItem('cart'))
    for(var i=0; i < cartObj.cart.length; i++) {
      if(cartObj.cart[i][0] == product[0]) {
        return
      }
    }
    cartObj.cart.push(product)
    cartObj.length += 1
    cartObj.price += product[2] 
    cartObj.size += product[3] 
    cartObjStr = JSON.stringify(cartObj)
    sessionStorage.setItem('cart', cartObjStr)
  }

  this.removeFromCart = function(pd_id) {
    let cartObj = JSON.parse(sessionStorage.getItem('cart'))
    try {
      for(var i=0; i < cartObj.cart.length; i++) {
        if(cartObj.cart[i][0] == pd_id) {
          cartObj.length -= 1
          cartObj.price -= cartObj.cart[i][2] 
          cartObj.size -= cartObj.cart[i][3]
          cartObj.cart.splice(i,1)
          cartObjStr = JSON.stringify(cartObj)
          sessionStorage.setItem('cart', cartObjStr)  
        }
      }
    }
    catch(err) {
      console.log(err);
    }
  }  
      
}


var cartObj = new Cart()
cartObj.fetchProducts()
cartObj.refreshCart()

function addToCart(pd_id){
  pd_id = parseInt(pd_id)
  let found = cartObj.getProduct(pd_id)
  if (found[0] != 0){
      console.log(found[1])
      return
  } 
  else{
      var product = found[1]
  } 
  cartObj.addToCart(product)
  cartObj.refreshCart()
}

function removeFromCart(pd_id){
  cartObj.removeFromCart(pd_id)
  cartObj.refreshCart()
}

function clearCart(){
  cartObj.clearCart()
  cartObj.refreshCart()
}

function showCart(){ 
  if (cartVisiblity == false){
    cartVisiblity = true
    cartObj.refreshCart()
    document.getElementById('cart-mobile').style.display="block"
  } else{
    cartVisiblity = false
    document.getElementById('cart-mobile').style.display="none"
  }
}

function loadProducts(target){
  const xhr = new XMLHttpRequest()
  const method = "GET"
  const url = target

  xhr.responseType = "json"
  xhr.open(method, url)
  xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")

  xhr.onload = function(){
      const serverResponse = xhr.response
      const listedItems = serverResponse.response
      productList = serverResponse.response
      var finallist =   ``
      for(var i=0; i < listedItems.length; i++){
          finallist += sListItems(listedItems[i])
      }
      // var productHtml = document.getElementById('product-list').innerHTML
      if(serverResponse.tag == "tutorial") {
        document.getElementById('level-info').innerHTML = levelNav(serverResponse.level);         
      }
      var productHtml = document.getElementById('product-list').innerHTML
      document.getElementById('product-list').innerHTML = finallist
      if (serverResponse.watchmore != ''){
        document.getElementById('watch-more').innerHTML = `<button class="btn btn-light" value="`+ serverResponse.watchmore + `" onclick="watchMore(this.value)">Watch more</button>`
      }
      else{
        document.getElementById('watch-more').innerHTML = ``
      }
  }
  xhr.send()
}

function watchMore(target){
  const xhr = new XMLHttpRequest()
  const method = "GET"
  const url =  target

  xhr.responseType = "json"
  xhr.open(method, url)
  xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest")
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
  
  xhr.onload = function(){
      const serverResponse = xhr.response
      const listedItems = serverResponse.response
      console.log(listedItems)
      var finallist =   ``
      for(var i=0; i < listedItems.length; i++){
        cartObj.productsList.push([listedItems[i].id, listedItems[i].name, listedItems[i].price, listedItems[i].size])
        finallist += sListItems(listedItems[i])
      }
      var productHtml = document.getElementById('product-list').innerHTML
      document.getElementById('product-list').innerHTML = productHtml + finallist
      if (serverResponse.watchmore != ''){
        document.getElementById('watch-more').innerHTML = `<button class="btn btn-light" value="`+ serverResponse.watchmore + `" onclick="watchMore(this.value)">Watch more</button>`
      }
      else{
        document.getElementById('watch-more').innerHTML = ``
      }
  }
  xhr.send()
}

function levelClick(target){
  window.location.href= target
}

function search(){
  const searchVal = document.getElementById("txtSearch").value
  if(searchVal != '') {
    window.location.href = "/search=" + searchVal + "&page=1"
  }
  else{
    alert("Please input a value on the search field.")
  }
}

function sListItems(product){
    var sProduct =  `
    <ul class="product list-group shadow mt-3" style="list-style-type:none;">               
      <li class="list-group-product">
        <div class="media align-products-lg-center flex-column flex-lg-row p-3">
          <img src="`+ product.image +`" alt="Generic placeholder image" class="mt-2 mr-lg-5 order-1 order-lg-1 img-fluid w-25" onclick="getProduct(`+product.id+`)">

          <div class="media-body order-2 order-lg-2">
            <h5 class="pd-name mt-1 font-weight-bold mb-2"><a href="/product=`+ product.id +`">`+ product.name +`</a></h5>
            <p class="font-italic text-muted mb-0 small">`+ product.s_desc_en.replaceAll("\n", "<br>") +`</p> 
            <div class="d-flex align-products-center  mt-1">
            <h6 class="pd-price font-weight-bold my-2">`+ product.price +`</h6>  <h6 class="font-weight-bold mx-1 my-2"> Birr</h6>&nbsp;&nbsp;&nbsp;
              <button id="`+ product.id +`" type="button" class="btn btn-sm btn-primary " name="button" onclick="addToCart(this.id)"><small class="font-weight-bold">Add to cart </small><i class="fa fa-cart-plus fa-sm"></i></button>
            </div> 
          </div>


        </div>
      </li>
    </ul>`

    return sProduct
}

function levelNav(level){
  var sLevel = `` 
  sLevel += `<button type="button" class="btn btn-secondary" value="`+ level[0] +`" onclick="levelClick(this.value)"> Beginner </button>` 
  sLevel += `<button type="button" class="btn btn-secondary" value="`+ level[1] +`" onclick="levelClick(this.value)"> Intermidiate </button>` 
  sLevel += `<button type="button" class="btn btn-secondary" value="`+ level[2] +`" onclick="levelClick(this.value)"> Advanced </button>`     
  return `<div class="btn-group" role="group" aria-label="Basic example" style="width: 100%;">` + sLevel +`</div>`
}

function orderProducts(){
  try{
    let cartObj = JSON.parse(sessionStorage.getItem('cart'))
    if (cartObj.length > 0){
      console.log("inside")
      let csrf = $('[name=csrfmiddlewaretoken]').val()
      $.ajax({
        url: "http://localhost:8000/order",
        method: "POST",
        data: {
          data: sessionStorage.getItem('cart'),
          csrfmiddlewaretoken: csrf,
        },
        success: function(response){
          let responseObj = response.response
          alert("Id: "+ responseObj.cart_id + "\nLength: " + responseObj.length + "\nPrice: " + responseObj.price + "\nSize: " + responseObj.size)
        }, 
        error: function(){
          alert("There has been some errors.")
        }
      })
    }else{
      alert("You haven't selected any products yet.")
    }
  }
  catch(err){
    console.log(err)
  }
}

function getProduct(id) {
  window.location.href = "/product=" + id
}