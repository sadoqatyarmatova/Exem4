let CART_API = "https://6a479ca0abfcbaade118bca4.mockapi.io/Cart"
let cartContainer = document.querySelector(".cart-items")

let DELIVERY_FEE = 5.99
let TAX_RATE = 0.08

async function getCart() {
    let res = await fetch(CART_API)
    return await res.json()
}

async function render() {
    try {
        let cart = await getCart()

        cartContainer.innerHTML = ""

        cart.forEach((e)=>{
            let div = document.createElement("div")
            div.innerHTML = `
            <div class="cart-card">
                <img src="${e.logoProduct}" alt="">
                <div class="cart-card-info">
                    <div class="cart-card-top">
                        <h3>${e.nameProduct}</h3>
                        <span class="remove-btn">✕</span>
                    </div>
                    <p>${e.descriptionProduct}</p>
                    <div class="cart-card-bottom">
                        <div class="quantity">
                            <button class="decrease">-</button>
                            <span>${e.countProduct}</span>
                            <button class="increase">+</button>
                        </div>
                        <h4 class="cart-price">$${(e.priceProduct * e.countProduct).toFixed(2)}</h4>
                    </div>
                </div>
            </div>
            `

            cartContainer.appendChild(div)

            div.querySelector(".decrease").addEventListener("click", async ()=>{
                if(e.countProduct > 1){
                    await fetch(CART_API + "/" + e.id, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ countProduct: e.countProduct - 1 })
                    })
                } else {
                    await fetch(CART_API + "/" + e.id, { method: "DELETE" })
                }
                render()
            })

            div.querySelector(".increase").addEventListener("click", async ()=>{
                await fetch(CART_API + "/" + e.id, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ countProduct: e.countProduct + 1 })
                })
                render()
            })

            div.querySelector(".remove-btn").addEventListener("click", async ()=>{
                await fetch(CART_API + "/" + e.id, { method: "DELETE" })
                render()
            })
        })

        let addMoreBtn = document.createElement("button")
        addMoreBtn.className = "add-more"
        addMoreBtn.textContent = "+ Add more items from catalog"
        addMoreBtn.addEventListener("click", ()=>{
            location.href = "box1.html"
        })
        cartContainer.appendChild(addMoreBtn)

        updateSummary(cart)
    }
    catch (error) {
        console.log(error)
    }
}

function updateSummary(cart) {
    let itemsCount = cart.reduce((sum, item) => sum + item.countProduct, 0)
    let subtotal = cart.reduce((sum, item) => sum + item.priceProduct * item.countProduct, 0)

    let delivery = cart.length > 0 ? DELIVERY_FEE : 0
    let taxes = subtotal * TAX_RATE
    let total = subtotal + delivery + taxes

    document.getElementById("subtotal-label").textContent = `Subtotal (${itemsCount} items)`
    document.getElementById("subtotal-value").textContent = `$${subtotal.toFixed(2)}`
    document.getElementById("delivery-value").textContent = `$${delivery.toFixed(2)}`
    document.getElementById("taxes-value").textContent = `$${taxes.toFixed(2)}`
    document.getElementById("total-value").textContent = `$${total.toFixed(2)}`
}

document.getElementById("checkout-btn").addEventListener("click", ()=>{
    location.href = "box5.html"
})

render()