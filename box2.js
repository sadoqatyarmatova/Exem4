
let box2 = document.getElementById("box2")

function render() {

    let favorites = JSON.parse(localStorage.getItem("favorites")) || []

    box2.innerHTML = ""

    favorites.forEach((e)=>{
        let div = document.createElement("div")
        div.innerHTML = `
        <div class="card">
            <img class="card-img" src="${e.logoProduct}" alt="">
            <svg class="like-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path fill="rgb(233, 14, 14)" d="M305 151.1L320 171.8L335 151.1C360 116.5 400.2 96 442.9 96C516.4 96 576 155.6 576 229.1L576 231.7C576 343.9 436.1 474.2 363.1 529.9C350.7 539.3 335.5 544 320 544C304.5 544 289.2 539.4 276.9 529.9C203.9 474.2 64 343.9 64 231.7L64 229.1C64 155.6 123.6 96 197.1 96C239.8 96 280 116.5 305 151.1z"/>
            </svg>
            <div class="card-row">
                <h3 class="card-name">${e.nameProduct}</h3>
                <p class="card-time">${e.cookingTime} - ${e.cookingTime + 10} min</p>
            </div>
            <p class="card-desc">${e.descriptionProduct}</p>
            <div class="card-price-row">
                <h5 class="card-price"> $ ${e.priceProduct}</h5>
                <button class="add-btn">Add</button>
            </div>
        </div>
        `

        box2.appendChild(div)

        let heartBtn = div.querySelector(".like-btn")

        heartBtn.addEventListener("click", ()=>{
            let favorites = JSON.parse(localStorage.getItem("favorites")) || []
            let index = favorites.findIndex(item => item.id === e.id)

            favorites.splice(index, 1)
            localStorage.setItem("favorites", JSON.stringify(favorites))

            render()
        })

            let addBtn = div.querySelector(".add-btn")
                addBtn.addEventListener("click", ()=>{
                location.href = "box3.html?id=" + e.id
            })
    })
}

render()