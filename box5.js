let CART_API = "https://6a479ca0abfcbaade118bca4.mockapi.io/Cart"
let ORDER_API = "https://6a479ca0abfcbaade118bca4.mockapi.io/Order"

let DELIVERY_FEE = 5.99
let TAX_RATE = 0.08

let cart = []

async function loadSummary() {
    try {
        let res = await fetch(CART_API)
        cart = await res.json()

        let itemsContainer = document.getElementById("summary-items")
        itemsContainer.innerHTML = ""

        cart.forEach((e)=>{
            let div = document.createElement("div")
            div.innerHTML = `
            <div class="summary-item">
                <img src="${e.logoProduct}" alt="">
                <div class="summary-item-info">
                    <h4>${e.nameProduct}</h4>
                    <p>${e.countProduct} x $${e.priceProduct}</p>
                </div>
                <p class="summary-item-price">$${(e.priceProduct * e.countProduct).toFixed(2)}</p>
            </div>
            `
            itemsContainer.appendChild(div)
        })

        updateTotals()
    }
    catch (error) {
        console.log(error)
    }
}

function updateTotals() {
    let subtotal = cart.reduce((sum, item) => sum + item.priceProduct * item.countProduct, 0)
    let delivery = cart.length > 0 ? DELIVERY_FEE : 0
    let taxes = subtotal * TAX_RATE
    let total = subtotal + delivery + taxes

    document.getElementById("subtotal-value").textContent = `$${subtotal.toFixed(2)}`
    document.getElementById("delivery-value").textContent = `$${delivery.toFixed(2)}`
    document.getElementById("taxes-value").textContent = `$${taxes.toFixed(2)}`
    document.getElementById("total-value").textContent = `$${total.toFixed(2)}`
}

document.getElementById("place-order-btn").addEventListener("click", async ()=>{

    let firstName = document.getElementById("firstName").value.trim()
    let lastName = document.getElementById("lastName").value.trim()
    let streetAddress = document.getElementById("streetAddress").value.trim()
    let city = document.getElementById("city").value.trim()
    let zipCode = document.getElementById("zipCode").value.trim()
    let phoneNumber = document.getElementById("phoneNumber").value.trim()

    if(!firstName || !lastName || !streetAddress || !city || !zipCode || !phoneNumber){
        alert("Iltimos, Hama malumothoro vorid kuned!")
        return
    }

    if(cart.length === 0){
        alert("Sabad xolist!")
        return
    }

    let subtotal = cart.reduce((sum, item) => sum + item.priceProduct * item.countProduct, 0)
    let delivery = DELIVERY_FEE
    let taxes = subtotal * TAX_RATE
    let total = subtotal + delivery + taxes

    let orderData = {
        firstName,
        lastName,
        streetAddress,
        city,
        zipCode,
        phoneNumber,
        items: cart,
        subtotal,
        deliveryFee: delivery,
        taxes,
        total
    }

    try {
        let btn = document.getElementById("place-order-btn")
        btn.disabled = true
        btn.textContent = "Omadashuda istodaast..."

        let orderRes = await fetch(ORDER_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData)
        })
        let createdOrder = await orderRes.json()

        for(let item of cart){
            await fetch(CART_API + "/" + item.id, { method: "DELETE" })
        }

        location.href = "box6.html?id=" + createdOrder.id
    }
    catch (error) {
        console.log(error)
        alert("Xatogi ruh dod! Az nav vorid kuned.")

        let btn = document.getElementById("place-order-btn")
        btn.disabled = false
        btn.textContent = "Place Order →"
    }
})

loadSummary()