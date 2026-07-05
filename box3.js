let API = "https://6a45064baab3faec3f694115.mockapi.io/Products"
let CART_API = "https://6a479ca0abfcbaade118bca4.mockapi.io/Cart"

let params = new URLSearchParams(location.search)
let productId = params.get("id")

let quantity = 1
let price = 0
let currentProduct = null

async function getDetail() {
    try {
        let res = await fetch(API + "/" + productId)
        let e = await res.json()

        price = e.priceProduct

        currentProduct = {
            id: e.id,
            nameProduct: e.nameProduct,
            logoProduct: e.logoProduct,
            descriptionProduct: e.descriptionProduct,
            priceProduct: e.priceProduct,
            cookingTime: e.cookingTime
        }

        document.getElementById("detail-img").src = e.logoProduct
        document.getElementById("detail-name").textContent = e.nameProduct
        document.getElementById("detail-time").textContent = e.cookingTime + " - " + (e.cookingTime + 10) + " min"
        document.getElementById("detail-desc").textContent = e.descriptionProduct
        document.getElementById("detail-price").textContent = "$" + e.priceProduct

        updateTotal()
    }
    catch (error) {
        console.log(error)
    }
}

function updateTotal() {
    document.getElementById("quantity-value").textContent = quantity
    document.getElementById("order-total").textContent = (price * quantity).toFixed(2)
}

document.getElementById("decrease-btn").addEventListener("click", ()=>{
    if(quantity > 1){
        quantity--
        updateTotal()
    }
})

document.getElementById("increase-btn").addEventListener("click", ()=>{
    quantity++
    updateTotal()
})

document.getElementById("order-btn").addEventListener("click", async ()=>{

    if(!currentProduct) return

    try {
        let res = await fetch(CART_API)
        let cart = await res.json()

        let existing = cart.find(item => item.productId === currentProduct.id)

        if(existing){
            await fetch(CART_API + "/" + existing.id, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    countProduct: existing.countProduct + quantity
                })
            })
        } else {
            await fetch(CART_API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nameProduct: currentProduct.nameProduct,
                    descriptionProduct: currentProduct.descriptionProduct,
                    priceProduct: currentProduct.priceProduct,
                    cookingTime: currentProduct.cookingTime,
                    countProduct: quantity,
                    logoProduct: currentProduct.logoProduct,
                    productId: currentProduct.id
                })
            })
        }

        location.href = "box4.html"
    }
    catch (error) {
        console.log(error)
    }
})

getDetail()