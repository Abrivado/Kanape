let productInLocalStorage = JSON.parse(localStorage.getItem('savedBasket'));
console.log(productInLocalStorage);


 fetch("http://localhost:3000/api/products")
 .then((res) => res.json()) 
 .then((data) => {
     if (productInLocalStorage){
         for (p of productInLocalStorage){
             const dataProduct = data.find(d=> d._id === p.idProduit)
             console.log(data)
             if (dataProduct) {
                // p.price = dataProduct.price
                // p.name = dataProduct.name
                // p.description = dataProduct.description
                // p.imageUrl = dataProduct.imageUrl

            }

         }
     } 
     getCart()
     
   
 })

 function getCart() {

    // Si le panier est vide

    if (!productInLocalStorage) {

        const titleCart = document.querySelector("h1");
        const sectionCart = document.querySelector(".cart");

        titleCart.innerHTML = "Votre panier est vide !";
        sectionCart.style.display = "none";

        // Si le panier est remplie

    } else {

        productInLocalStorage.forEach((produit, i) => {

            // Insertion de l'élément "article"

            let productArticle = document.createElement("article");
            document.querySelector("#cart__items").appendChild(productArticle);
            productArticle.className = "cart__item";
            productArticle.setAttribute('data-id', produit._id);

 
            // Insertion de l'élément "div"

            let productDivImg = document.createElement("div");
            productArticle.appendChild(productDivImg);
            productDivImg.className = "cart__item__img";

 
            // Insertion de l'image

            let productImg = document.createElement("img");
            productDivImg.appendChild(productImg);
            productImg.src = produit.imageUrl;
            productImg.alt = produit.altTxt;

            // Insertion de l'élément "div"            

            let productItemContent = document.createElement("div");
            productArticle.appendChild(productItemContent);
            productItemContent.className = "cart__item__content";


            // Insertion de l'élément "div"

            let productItemContentDescription = document.createElement("div");
            productItemContent.appendChild(productItemContentDescription);
            productItemContentDescription.className = "cart__item__content__description";


            // Insertion de l'élément "h2"

            let productTitle = document.createElement("h2");
            productItemContentDescription.appendChild(productTitle);
            productTitle.innerHTML = produit.name;

 
            // Insertion de la couleur

            let productGreen = document.createElement("p");
            productTitle.appendChild(productGreen);
            productGreen.innerHTML = produit.color;


            // Insertion de l'élément "p"

            let productPrice = document.createElement("p");
            productTitle.appendChild(productPrice);
            productPrice.innerHTML = produit.price + " €";
            console.log(productPrice)
 

            // Insertion de l'élément "div"

            let productItemSettings = document.createElement("div");
            productArticle.appendChild(productItemSettings);
            productItemSettings.className = "cart__item__content__settings";
 

            // Insertion de l'élément "div"

            let productItemSettingsQuantity = document.createElement("div");
            productItemSettings.appendChild(productItemSettingsQuantity);
            productItemSettingsQuantity.className = "cart__item__content__settings__quantity";


            // Insertion de "Qté : "

            let productQte = document.createElement("p");
            productItemSettingsQuantity.appendChild(productQte);
            productQte.innerHTML = "Qté : " ;
 

            // Insertion de la quantité

            let input = document.createElement("input");
            productItemSettingsQuantity.appendChild(input);
            input.className = "itemQuantity";
            input.value = produit.quantity;
            input.setAttribute("type", "number");
            input.setAttribute("name", "itemQuantity-" + produit.idProduit);
            input.setAttribute("min", "1");
            input.setAttribute("max", "100");
            input.addEventListener("change", () => updatePriceAndQuantity (produit.id, input.value, produit, produit.quantity))

 

            // Insertion de l'élément "div"

            let productItemContentSettingsDelete = document.createElement("div");
            productArticle.appendChild(productItemContentSettingsDelete);
            productItemContentSettingsDelete.className = "cart__item__content__settings__delete";
 

            // Insertion de "p" supprimer

            let productItemDelete = document.createElement("p");
            productItemContentSettingsDelete.appendChild(productItemDelete);
            productItemDelete.className = "deleteItem";
            productItemDelete.innerHTML = "Supprimer";
            productItemDelete.addEventListener("click", () => deleteItem (produit))




        })
    }}

    function getTotals() {

        // Calcul de la quantité total

let total = 0                    // on définit la valeur du total sans les produits
const totalQuantity = document.querySelector("#totalQuantity")
productInLocalStorage.forEach((produit) => {
const totalCalculQuantity = produit.quantity
total += totalCalculQuantity // += signifie "total = total + totalCalculQuantity"
})
totalQuantity.textContent = total

     // calcul du prix total

const totalPrice = document.querySelector("#totalPrice")
productInLocalStorage.forEach((produit) => {
const totalCalculPrice = (produit.price -1) * produit.quantity
total += totalCalculPrice // += signifie "total = total + totalCalculPrice"
totalPrice.textContent = total
})

updatePriceAndQuantity()
deleteItem(produit)
}


function saveNewDataToLocalStorage () {
    productInLocalStorage.forEach((produit) => {
let saveNewData = JSON.stringify(produit) // stringify pour que le changement de quantité soit dans un format que le local storage comprend
localStorage.setItem("product", saveNewData)
console.log( saveNewData)
    })
}

function updatePriceAndQuantity(id, newValue, produit) {  // cette fonction va être utilisée dès qu'il y aura un changement de quantité et prix dans le panier
    let itemToUpdate = productInLocalStorage.find(produit => produit.id === id)
    //let quantity = productInLocalStorage.find(produit => produit.quantity === quantity)
    produit.quantity = itemToUpdate.quantity
    itemToUpdate.quantity = Number(newValue)
    console.log(newValue)
     
    saveNewDataToLocalStorage (produit)
    getTotals()
    deleteItem(produit)    
}

function deleteItem(produit){
    const itemToDelete = productInLocalStorage.findIndex(  // findIndex sert à trouver le produit dans la liste
        (produit) => produit.id)  
    productInLocalStorage.splice(itemToDelete, 1) // cart.splice pour supprimer une array, il démarrera à itemToDelete et il en supprimera 1
console.log(productInLocalStorage)


    const key = `${produit.id}`
    console.log(key)
    localStorage.removeItem('product',key)  // pour supprimer l'item du localstorage
    location.reload()
    
    getTotals()

//    deleteArticleFromPage (produit)

}

// let productArticle = document.createElement("article");
// document.querySelector("#cart__items").appendChild(productArticle);
// productArticle.className = "cart__item";
// productArticle.setAttribute('data-id', produit._id);




  function deleteArticleFromPage(produit) {
     const articleToDelete = document.querySelector(  
         `article[data-id="${produit.id}`  // pour selectionner l'id et la couleur de l'article qu'on veut supprimer
     )
     console.log(articleToDelete)
     //articleToDelete.remove() 

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



function addDeleteToSettings (settings, item){
const div = document.createElement("div")
div.classList.add("cart__item__content__settings__delete")
//div.addEventListener ("click", () => deleteItem(item))


const p = document.createElement("p")
p.classList.add("deleteItem")
p.textContent = "Supprimer"
div.appendChild(p)
settings.appendChild(div)

}


////////////////////////////              F O R M U L A I R E 





const orderButton = document.querySelector("#order")
orderButton.addEventListener("click", (e) => submitForm(e)) // pour soumettre le formulaire lorsqu'on clique sur le bouton commander


function submitForm(e){
 e.preventDefault()  // pour pas que ça actualise a chaque submit-formulaire
 if (cart.length === 0 ) {
     alert ("Veuillez sélectionner un produit à commander")
     return  // pour que la requete ne se fasse pas si pas de produits dans le panier
 }


 testForm()
 //testEmail()

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

// function testEmail(){
//     const email = document.querySelector("#email").value
//     const regex = /^[A-Za-z0-9+_.-]+@(.+)$/  // le format accepté pour un email
//     if (regex.test(email) === false) {
//         alert("Veuillez saisir un email valide") // le formulaire ne sera pas envoyé si le mail n'est pas d'un bon format
//         return true
          
//         }
//         return false // le formulaire sera envoyé si l'email est ok 
//     }


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







let valuePrenom, valueNom, valueMail, valueAdresse, valueVille;




////////////   P R E N O M


firstName.addEventListener("input", function (e) {
const errorPrenom = document.getElementById("firstNameErrorMsg")
valuePrenom
if(e.target.value.length == 0) {
    console.log("rien") 
    errorPrenom.innerHTML = ""
    valuePrenom = null
    console.log(valuePrenom)
}
if (e.target.value.match(/^[a-z A-Z]{1,50}$/)){
    errorPrenom.innerHTML = ""
    valuePrenom = e.target.value
    console.log("success")
    console.log(valuePrenom)
}

 if (!e.target.value.match(/^[a-z A-Z]{1,50}$/)){
     errorPrenom.innerHTML = "Votre prénom ne doit pas contenir de chiffres ou caractères spéciaux"
     valuePrenom = null
     console.log("fail")
 }
})


////////////   N O M

lastName.addEventListener("input", function (e) {
const errorNom = document.getElementById("lastNameErrorMsg")

if(e.target.value.length == 0) {
    console.log("rien") 
    errorNom.innerHTML = ""
    valueNom = null
    console.log(valueNom)
}
if (e.target.value.match(/^[a-z A-Z]{1,50}$/)){
    errorNom.innerHTML = ""
    valueNom = e.target.value
    console.log("success")
    console.log(valueNom)
}

 if (!e.target.value.match(/^[a-z A-Z]{1,50}$/)){
    errorNom.innerHTML = "Votre nom ne doit pas contenir de chiffres ou caractères spéciaux"
    valueNom = null
     console.log("fail")
 }
})


////////////   A D R E S S E 

address.addEventListener("input", function (e) {
const errorAdresse = document.getElementById("addressErrorMsg")

if(e.target.value.length == 0) {
    console.log("rien") 
    errorAdresse.innerHTML = ""
    valueAdresse = null
    console.log(valueAdresse)
}
if (e.target.value.match(/^[0-9]{1,4}[a-z A-Z]{1,50}$/)){
    errorAdresse.innerHTML = ""
    valueAdresse = e.target.value
    console.log("success")
    console.log(valueAdresse)
}

 if (!e.target.value.match(/^[0-9]{1,4}[a-z A-Z]{1,50}$/)){
    errorAdresse.innerHTML = "Votre adresse doit commencer par un chiffre et ne pas contenir de caractères spéciaux"
    valueAdresse = null
     console.log("fail")
 }
})



////////////   V I L L E 


city.addEventListener("input", function (e) {
const errorVille = document.getElementById("cityErrorMsg")

if(e.target.value.length == 0) {
    console.log("rien") 
    errorVille.innerHTML = ""
    valueVille = null
    console.log(valueVille)
}
if (e.target.value.match(/^[a-z A-Z]{1,50}$/)){
    errorVille.innerHTML = ""
    valueVille = e.target.value
    console.log("success")
    console.log(valueVille)
}

 if (!e.target.value.match(/^[a-z A-Z]{1,50}$/)){
    errorVille.innerHTML = "Votre nom de ville ne doit pas contenir de chiffres ou caractères spéciaux"
    valueVille = null
     console.log("fail")
 }
})



////////////   E M A I L 

email.addEventListener("input", function (e) {
const errorMail = document.getElementById("emailErrorMsg")

if(e.target.value.length == 0) {
    errorMail.innerHTML = ""
    valueMail = null
    console.log(valueMail)

} else if (e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
    errorMail.innerHTML = ""
    valueMail = e.target.value
    console.log(valueMail)
}
if (!e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) && !e.target.value.length == 0){
    errorMail.innerHTML = "Email incorrect ex: canape@gmail.com"
    valueMail = null
}


})


