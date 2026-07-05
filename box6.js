let ORDER_API = "https://6a479ca0abfcbaade118bca4.mockapi.io/Order"

let params = new URLSearchParams(location.search)
let orderId = params.get("id")

async function loadOrder() {
    try {
        let res = await fetch(ORDER_API + "/" + orderId)
        let order = await res.json()

        document.getElementById("order-number").textContent = "Order #" + order.id

        document.getElementById("delivery-address").textContent =
            `${order.streetAddress}, ${order.city}, ${order.zipCode}`

        let itemsContainer = document.getElementById("order-items")
        itemsContainer.innerHTML = ""

        order.items.forEach((item)=>{
            let p = document.createElement("p")
            p.textContent = `${item.countProduct}x ${item.nameProduct}`
            itemsContainer.appendChild(p)
        })

        document.getElementById("order-total").textContent = "$" + order.total.toFixed(2)
    }
    catch (error) {
        console.log(error)
    }
}

document.getElementById("track-btn").addEventListener("click", ()=>{
    alert("Zakazi shumo omoda shuda istodaast!")
})

loadOrder()