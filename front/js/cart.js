
const cart = [] // pour avoir une liste totale du panier

recupItemsDuCache()
cart.forEach((item) => displayItem(item))

const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => submitForm(e)) // pour soumettre le formulaire lorsqu'on clique sur le bouton commander


function recupItemsDuCache(){
    const numberOfItems = localStorage.length  // pour récupérer le nb d'object ajoutés au panier
    for (let i = 0; i < numberOfItems; i++) {
        const item = localStorage.getItem(localStorage.key(i)) || ""
        const itemObject = JSON.parse(item) // ≠ stringyfy, permet de transformer une string en objet
        cart.push(itemObject) // dès qu'on aura un objet il sera push dans la liste du panier 
    }
}

function displayItem(item){
    const article = makeArticle(item)
    const imageDiv = makeImageDiv(item)
    article.appendChild(imageDiv)

    const cartItemContent = makeCartContent(item)
    article.appendChild(cartItemContent)  // pour append le h2, p et p2 à cart__item__content
    displayArticle(article) // pour afficher l'article
    displayTotalQuantity()
    displayTotalPrice()
}

function displayTotalQuantity() {
    let total = 0                    // on définit la valeur du total sans les produits
    const totalQuantity = document.querySelector("#totalQuantity")
    cart.forEach((item) => {
        const totalCalculQuantity = item.quantity
        total += totalCalculQuantity // += signifie "total = total + totalCalculQuantity"
    })
    totalQuantity.textContent = total
}




function displayTotalPrice(){
    let total = 0                    // on définit la valeur du total sans les produits
    const totalPrice = document.querySelector("#totalPrice")
    cart.forEach((item) => {
        const totalCalculPrice = item.price * item.quantity
        total += totalCalculPrice // += signifie "total = total + totalCalculPrice"
    })
    totalPrice.textContent = total
}



function makeCartContent (item) {
    const cartItemContent = document.createElement("div")
    cartItemContent.classList.add("cart__item__content")

    const description = makeDescription(item)
    const settings = makeSettings(item)

    cartItemContent.appendChild(description)
    cartItemContent.appendChild(settings)
    return cartItemContent
}

function makeSettings (item){
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")

    addQuantityToSettings(settings, item)
    addDeleteToSettings(settings, item)
    return settings

}

function addQuantityToSettings(settings, item){
    const quantity = document.createElement("div")
    quantity.classList.add("cart__item__content__settings__quantity")
    const p = document.createElement("p")
    p.textContent = "Qté = "
    quantity.appendChild(p)
    const input = document.createElement("input")
    input.type = "number"
    input.classList.add("itemQuantity")
    input.name = "itemQuantity"
    input.min ="1"
    input.max ="100"
    input.value = item.quantity
    input.addEventListener("change", () => updatePriceAndQuantity (item.id, input.value, item)) // dès qu'on change la quantité d'un produit du panier, cet event listener va récup l'id du produit modifié, et sa nouvelle quantité

    quantity.appendChild(input)
    settings.appendChild(quantity)

}

function updatePriceAndQuantity(id, newValue, item) {      // cette fonction va être utilisée dès qu'il y aura un changement de quantité et prix dans le panier
    const itemToUpdate = cart.find(item => item.id === id)
    itemToUpdate.quantity = Number(newValue)
    displayTotalQuantity ()
    displayTotalPrice ()
    saveNewDataToLocalStorage (item)

}

function deleteDataFromLocalStorage (item) {
    const key = `${item.id}` // à rajouter dans les backticks pour avoir la couleur
    localStorage.removeItem(key)
}

function saveNewDataToLocalStorage (item) {
    const dataToSave = JSON.stringify(item) // stringify pour que le changement de quantité soit dans un format que le local storage comprend
    const key = `${item.id}-${item.color}`
    localStorage.setItem(key, dataToSave) // pour que l'update soit fait dans le localStorage
}


function addDeleteToSettings (settings, item){
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    div.addEventListener ("click", () => deleteItem(item))


    const p = document.createElement("p")
    p.classList.add("deleteItem")
    p.textContent = "Supprimer"
    div.appendChild(p)
    settings.appendChild(div)

}

function deleteItem(item){
    const itemToDelete = cart.findIndex(  // findIndex sert à trouver le produit dans la liste
        (product) => product.id === item.id && product.color === item.color)  
    cart.splice(itemToDelete, 1) // cart.splice pour supprimer une array, il démarrera à itemToDelete et il en supprimera 1
    displayTotalQuantity () // pour que ça soit mis à jour dans le total
    displayTotalPrice()
    deleteDataFromLocalStorage (item)
    deleteArticleFromPage (item)
    console.log(cart)

}

function deleteArticleFromPage(item) {
    const articleToDelete = document.querySelector(  
        `article[data-id="${item.id}"][data-color="${item.color}"]`  // pour selectionner l'id et la couleur de l'article qu'on veut supprimer
    )
    articleToDelete.remove() 

}


function makeDescription(item){
    const description = document.createElement("div")  // creation div cart__item__content__description
    description.classList.add("cart__item__content__description")

    const h2 = document.createElement("h2")
    h2.textContent = item.name  
    const p = document.createElement("p")
    p.textContent = item.color
    const p2 = document.createElement("p")
    p2.textContent = item.price + " €" // pour rajouter le signe €

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)
    return description
}

function displayArticle(article){
    document.querySelector ("#cart__items").appendChild(article)
}

function makeArticle(item){
    const article = document.createElement("article")  // création de l'article
    article.classList.add("cart__item") // création de la class
    article.dataset.id = item.id  // dataset permets de rajouter des attributs à des éléments html // nb d'article crée correspond au nb de produits(id) différents
    article.dataset.color = item.color
    return article
}


function makeImageDiv(item){
    const div = document.createElement("div")
    div.classList.add("cart__item__img")

    const image = document.createElement('img')
    image.src = item.imageUrl
    image.alt = item.altTxt 
    div.appendChild(image)
    return div
}

//       F O R M U L A I R E   D E   C O N T A C T 


function submitForm(e){
    e.preventDefault()  // pour pas que ça actualise a chaque submit-formulaire
    if (cart.length === 0 ) {
        alert ("Veuillez sélectionner un produit à commander")
        return  // pour que la requete ne se fasse pas si pas de produits dans le panier
    }


    testForm()
    testEmail()

    //if (testForm()) return  // si le testForm est invalide (true) on ne pourra pas aller plus loin
    //if (testEmail()) return  // si le testEmail est invalide (true) on ne pourra pas aller plus loin


    const body = makeRequestBody()
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            'Accept': 'application/json', 
            "Content-Type": "application/json"
        }
    })
    .then((res) => res.json())
    .then((data) => {
        const orderId = data.orderId  // pour envoyer les données vers la page de confirmation
        window.location.href = "confirmation.html" + "?orderId=" + orderId // l'orderId sera directement collé a l'url de la page confirmation
    })
    .catch((err) => console.error(err)) // cette ligne permet d'afficher les erreurs si il y'en a

  //  console.log(form.elements)  // pour recup tous les elements du formulaire
}

function testForm(){
    const form = document.querySelector(".cart__order__form")
    const inputs = form.querySelectorAll("input")   // pour verifier que tous les champs input soient remplis
    inputs.forEach((input) => {
        if (input.value === ""){      // si une valeur est nulle, une alerte sera envoyée
            alert("Veuillez remplir tous les champs du formulaire")
   return true  // le formulaire ne sera pas envoyé si un input est vide 
        }
       return false // le formulaire sera envoyé si tout est rempli
    })
}

function testEmail(){
    const email = document.querySelector("#email").value
    const regex = /^[A-Za-z0-9+_.-]+@(.+)$/  // le format accepté pour un email
    if (regex.test(email) === false) {
        alert("Veuillez saisir un email valide") // le formulaire ne sera pas envoyé si le mail n'est pas d'un bon format
        return true
              
        }
        return false // le formulaire sera envoyé si l'email est ok 
    }



 



function makeRequestBody() {
    const form = document.querySelector(".cart__order__form")
    const firstName = form.elements.firstName.value
    const lastName = form.elements.lastName.value
    const address = form.elements.address.value
    const city = form.elements.city.value
    const email = form.elements.email.value


    const body = { contact : {
        firstName: firstName,
        lastName : lastName,
        address: address,
        city : city,
        email : email

    },
    products: getIdsFromLocalStorage()

    }
return body
}

function getIdsFromLocalStorage () {
    const numberOfProducts = localStorage.length
    const ids = []
    for (let i = 0; i < numberOfProducts; i++) {
        const key = localStorage.key(i)
        const id = key.split("-")[0]
        ids.push(id)
    }
    return ids
}

