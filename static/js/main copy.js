var cart = []
var cartVisiblity = false
var productList = ``

const home_url = "http://localhost:8000/"
//jquery
 

$(function() {
  $('ul.parent > li').hover(function() {
    $(this).find('ul.child').show(200);
  }, function(){
    $(this).find('ul.child').hide(200);
  });
});

$(document).ready(function(){
  var trigger = $('#list-sidebar ul.child a'),
      container = $('#product-list');

  trigger.on('click', function(){
      var $this = $(this),
          target = $this.data('target');
          ChangeUrl("Abugida", target);
          loadProducts(target);

          // container.load(target, function(responseTxt, statusTxt, xhr){
          //     if(statusTxt == "success"){
          //         const serverResponse = JSON.parse(responseTxt);
          //         console.log(serverResponse.response);
          //     }
          //     if(statusTxt == "error")
          //     alert("Error: " + xhr.status + ": " + xhr.statusText);
          // });
          return false;
  });
});

$("#menu-toggle").click(function (e){
  e.preventDefault();
  $("#wrapper").toggleClass("menu-displayed");
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

//javascript


function ChangeUrl(title, url) {  
  if (typeof(history.replaceState) != "undefined") {  
      var obj = { Title: title, Url: url };  
      history.replaceState(obj, obj.Title, obj.Url);   
  } else {  
      alert("Browser does not support HTML5.");  
  }  
}

function Cart(){
  this.product = []
  this.error = "Error"

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
  this.getProduct = function(id) {
    try {
      for(let i=0; i < this.getLength(); i++){
          if (this.product[i][0] == id){
              return [0, product[i]]
          }
      }
      return [1, this.error]
    }
    catch(err) {
      return [1, this.error];
    }
  }
  this.refresh = function() {
    document.getElementById('cart-desktop').innerHTML = this.htmlList()
    document.getElementById('cart-mob-box').innerHTML = this.htmlList()
    document.getElementById('btnCart').innerHTML = "Cart("+ this.getLength() +")"
    document.getElementById('total-size').innerHTML = this.totalSize()
    document.getElementById('total-price').innerHTML = this.totalPrice()
  }
  this.htmlList = function() {
      let innerHtml = ""
      for(let i=0; i < this.getLength(); i++){
            innerHtml += `<li class="list-group-item">
            <div class="todo-indicator bg-success"></div>
            <div class="widget-content p-0">
                <div class="widget-content-wrapper">
                    
                    <div class="widget-content-left">
                        <div class="widget-heading"><h5><strong>`+ this.product[i][1] +`</strong></h5></div>
                        <div class="widget-subheading"><i>`+ this.product[i][2] +`</i></div>
                        <div class="widget-subheading"><i>`+ this.product[i][3] +`</i></div>
                    </div>
                    <div class="widget-content-right"><button id="`+ this.product[i][0] +`" class="border-0 btn-transition btn btn-outline-danger" onclick="removeFromCart(this.id)"> <i class="fa fa-trash"></i> </button> </div>
                </div>
            </div>
        </li>`
      }
      return innerHtml
  }
  this.addProduct = function(id) {
    if(this.getProduct(id)[0] == 1) {
      return
    }
    else {
      
    }
  }
  this.removeProduct = function(id) {
    
  }
}




function findProduct(cart, id){
  try {
      for(var i=0; i < cart.length; i++){
          if (cart[i].id == id){
              return [0, cart[i]]
          }
      }
      return [1, "Error!"]
    }
    catch(err) {
      return [1, err.message];
    }

}

function convertToGb(size){
  return size/1020
}

function totalSize(cart){
  var total = 0
  for(var i=0; i<cart.length; i++){
    total += cart[i][3]
  }
  if (total >= 1020){
    return convertToGb(total) + " GB"
  }
  else{
    return total + " MB"
  }
}

function totalPrice(cart){
  var total = 0
  for(var i=0; i<cart.length; i++){
    total += cart[i][2]
  }
  return total
}

function remove(cart, id){
  try {
      for(var i=0; i < cart.length; i++){
          if (cart[i][0] == id){
              cart.splice(i,1)
          }
      }
    }
    catch(err) {
      return err.message;
    }
}

function addToCart(id){
  id = parseInt(id,10)
  var found = findProduct(productList, id)
  if (found[0] == 1){
      console.log("Error")
  } 
  else{
      product = found[1]

  } 

  cart.push([product.id, product.name, product.price, product.size])
  var inner = `<div>`+ listCart() +"</div>"
  document.getElementById('cart-desktop').innerHTML = inner
  document.getElementById('cart-mob-box').innerHTML = inner
  document.getElementById('btnCart').innerHTML = "Cart("+ cart.length +")"
  document.getElementById('total-size').innerHTML = totalSize(cart)
  document.getElementById('total-price').innerHTML = totalPrice(cart)
}

function removeFromCart(id){
  remove(cart, id)
  document.getElementById('cart-desktop').innerHTML = listCart()
  document.getElementById('cart-mob-box').innerHTML = listCart()
  document.getElementById('btnCart').innerHTML = "Cart("+ cart.length +")"
  document.getElementById('total-size').innerHTML = totalSize(cart)
  document.getElementById('total-price').innerHTML = totalPrice(cart)
}

function listCart(){
  var x = ""
  for(var i=0; i < cart.length; i++){
        x = x + `<li class="list-group-item">
        <div class="todo-indicator bg-success"></div>
        <div class="widget-content p-0">
            <div class="widget-content-wrapper">
                
                <div class="widget-content-left">
                    <div class="widget-heading"><h5><strong>`+ cart[i][1] +`</strong></h5></div>
                    <div class="widget-subheading"><i>`+ cart[i][2] +`</i></div>
                    <div class="widget-subheading"><i>`+ cart[i][3] +`</i></div>
                </div>
                <div class="widget-content-right"><button id="`+ cart[i][0] +`" class="border-0 btn-transition btn btn-outline-danger" onclick="removeFromCart(this.id)"> <i class="fa fa-trash"></i> </button> </div>
            </div>
        </div>
    </li>`
  }
  return x
}

function showCart(){
  if (cartVisiblity == false){
    cartVisiblity = true
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
// loadProducts()


function watchMore(target){
  const xhr = new XMLHttpRequest()
  const method = "GET"
  const url =  target
  console.log(target)

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
  const xhr = new XMLHttpRequest()
  const method = "GET"
  const url =  target
  console.log(target)

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

function sListItems(product){
    var sProduct =  `
    <ul class="list-group shadow mt-3" style="list-style-type:none;">               
      <li class="list-group-product">
        <div class="media align-products-lg-center flex-column flex-lg-row p-3">
          <img src="`+ product.image +`" alt="Generic placeholder image" class="mt-2 mr-lg-5 order-1 order-lg-1 img-fluid w-25">

          <div class="media-body order-2 order-lg-2">
            <h5 class="mt-1 font-weight-bold mb-2"><a href="">`+ product.name +`</a></h5>
            <p class="font-italic text-muted mb-0 small">`+ product.s_desc_en +`</p> 
            <div class="d-flex align-products-center  mt-1">
              <h6 class="font-weight-bold my-2">`+ product.price +` Birr</h6>&nbsp;&nbsp;
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