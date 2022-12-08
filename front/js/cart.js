fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((objetArticles) => conditionToDisplayCart(objetArticles))  // pour envoyer les données de l'api vers la fonction conditionToDisplayCart



function conditionToDisplayCart(objectArticles) {    // cette fonction determine les conditions pour afficher le panier

    const basket = localStorage.getItem("savedBasket");     // cette constante permet de recup le contenu du panier du localStorage

    if (!basket) {      // si le panier est vide un message s'affichera
      document.querySelector("#cart__items").innerHTML = "<h1> Votre panier est vide </h1>";

    } else {     // sinon les articles s'ajoutent à la page panier
      document.querySelector("#cart__items").innerHTML = "";

      const basketItems = JSON.parse(basket);    // pour tranformer le basket en objet (id, color quantity)
      console.log(basketItems)

      basketItems.map(p => displayCartItem(p, objectArticles));  // .map pour faire un tableau de ces données et les envoyer à la fonction displayCartItem
      showPriceAndQuantity(basketItems, objectArticles);
    }
  }


// cette fonction va permettre de créer dynamiquement l'HTML dans la page panier
function displayCartItem(article, objectArticles) {
  const result = objectArticles.find(p => p._id === article._id); // ce .find va permettre de recup toutes les infos de l'api grâce l'id
  console.log(result)

  document.querySelector("#cart__items")
    .insertAdjacentHTML("beforeend", `<article class="cart__item" data-id="${article._id}" data-color="${article.color}">
    <div class="cart__item__img">
      <img src="${result.imageUrl}" alt="Photographie d'un canapé">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__description">
        <h2>${result.name}</h2>
        <p>${article.color}</p>
        <p>${result.price} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="0" max="100" 
          onchange="changeQuantity(this.value, '${article._id}', '${article.color}')" value="${article.quantity}">
        </div>
        <div id="delete" onclick="removeProduct('${article._id}')" class="cart__item__content__settings__delete">
          <p class="deleteItem">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`);
}



// fonction d'ajout d'une nouvelle quantité d'un produit depuis la page panier
function changeQuantity(value, id, color) {
  const basket = localStorage.getItem("savedBasket");
  const cartJSON = JSON.parse(basket);
  // si la quantité du produit est inférieure ou égale à zéro, on appel la fonction removeProduct
  if (value <= 0) {
    removeProduct(id)
  } else {
    const productIndex = cartJSON.findIndex(p => id === p._id && color === p.color)
    cartJSON[productIndex].quantity = value;
    localStorage.setItem("savedBasket", JSON.stringify(cartJSON));
    fetchProducts();
  }
}

// fonction pour supprimer un article du panier 
function removeProduct(id) {
  if (confirm("voulez-vous vraiment supprimer cet article?") == true) {  // pour que l'user confirme être sur de vouloir supprimer
    const basket = localStorage.getItem("savedBasket");  // pour récupérer le panier
    const basketItems = JSON.parse(basket);  // pour le mettre en objet
    console.log(basketItems)
    const newBasket = basketItems.filter(p => p._id !== id); // filter sert à selectionné uniquement l'id du produit à supprimer
    console.log(newBasket)
    localStorage.setItem("savedBasket", JSON.stringify(newBasket)); // setItem pour sauvegarder le nouveau panier (sans l'article supprimé)
    location.reload(); // pour recharger la page et faire disparaitre l'image du produit supprimé
  } else {
      // si la personne répond non au message, rien ne se passe
  }
}

// function pour afficher la somme des prix et de la quantité des articles
function showPriceAndQuantity(listLocalStorage, objectArticles) {
  let totalQuantity = 0;
  let totalPrice = 0;
  listLocalStorage.map(o => {
    const result = objectArticles.find(p => p._id === o._id);
    const itemPrice = result.price;
    const quantity = parseInt(o.quantity);
    const total = quantity * itemPrice;
    totalPrice = total + totalPrice;
    totalQuantity = quantity + totalQuantity;
  })
  document.querySelector("#totalQuantity").innerHTML = `${totalQuantity}`;
  document.querySelector("#totalPrice").innerHTML = `${totalPrice}`;

  changeQuantity()
}




// pour la validation du formulaire et la requête POST

// Initialisation des RegExp
let form = document.getElementById("form_order");
const emailRegex = new RegExp('^[a-zA-Z0-9._-]+[@]{1}[a-zA-Z0-9._-]+[.]{1}[a-z]{2,10}$');
const lettersRegex = new RegExp('^[a-zA-Z ,.-]+[-a-zA-Zàâäéèêëïîôöùûüç ]+$');
const addressRegex = new RegExp('^[0-9]{1,3}[,. ]{1}[-a-zA-Zàâäéèêëïîôöùûüç ]{5,100}$');

// function pour la validation ou non des champs du formulaire 
function validInput(regex, champ, validesmsg, invalidemsg) {
  champ.addEventListener("change", () => {
    let msg = champ.nextElementSibling;
    if (regex.test(champ.value)) {
      msg.textContent = validesmsg;
    } else {
      msg.textContent = invalidemsg;
    }
  })
};

validInput(lettersRegex, form.firstName, "prénom valide", "prénom invalide")
validInput(lettersRegex, form.lastName, "nom valide", "nom invalide")
validInput(addressRegex, form.address, "adresse valide", "adresse invalide")
validInput(lettersRegex, form.city, "ville valide", "ville invalide")
validInput(emailRegex, form.email, "email valide", "email invalide")

document.getElementById("order").addEventListener("click", (event) => {
  let form = document.getElementById("form_order");
  // event.preventDefault();
  // si toutes les condition sont true alors ont créé l'objet "data" contenant les infos du client
  if (lettersRegex.test(form.firstName.value) &&
    lettersRegex.test(form.lastName.value) &&
    addressRegex.test(form.address.value) &&
    lettersRegex.test(form.city.value) &&
    emailRegex.test(form.email.value)) {
    const basket = JSON.parse(localStorage.getItem("savedBasket"))
    const data = {
      contact: {
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        address: form.address.value,
        city: form.city.value,
        email: form.email.value
      },
      products: basket.map(function (product) {
        return product._id
      })

    }
    // fetch à l'API - méthode POST - envoie data, réponse dans l'URL de la page confirmation
    fetch("http://localhost:3000/api/products/order", {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        window.location = '/front/html/confirmation.html?orderId=' + response.orderId;
      })

      // AFFICHAGE D'UN MESSAGE EN CAS D'ERREUR
      .catch((err) => {
        document
          .querySelector("#cartAndFormContainer")
          .innerHTML = "<h1> Cette page est en maintenance,</<br> nous nous excusons pour la gêne occasionné.</h1>";
      });

  } else {
    alert("veuillez remplir tous les champs")
  }
})






// let productInLocalStorage = JSON.parse(localStorage.getItem('savedBasket'));
// console.log(productInLocalStorage);


//  fetch("http://localhost:3000/api/products")
//  .then((res) => res.json()) 
//  .then((data) => {
//      if (productInLocalStorage){
//          for (p of productInLocalStorage){

//              const product = data.find(p=> p._id === p.idProduit)
//              console.log(product)
//              if (product) {
//                  p.price = product.price

//                  console.log(data)

//              }
//          }
//      } 
//      getCart()
     
   
//  })

//  function getCart() {

//     // Si le panier est vide

//     if (!productInLocalStorage) {

//         const titleCart = document.querySelector("h1");
//         const sectionCart = document.querySelector(".cart");

//         titleCart.innerHTML = "Votre panier est vide !";
//         sectionCart.style.display = "none";

//         // Si le panier est remplie

//     } else {

//         productInLocalStorage.forEach((produit, i) => {

//             // Insertion de l'élément "article"

//             let productArticle = document.createElement("article");
//             document.querySelector("#cart__items").appendChild(productArticle);
//             productArticle.className = "cart__item";
//             productArticle.setAttribute('data-id', produit._id);
 
//             // Insertion de l'élément "div"

//             let productDivImg = document.createElement("div");
//             productArticle.appendChild(productDivImg);
//             productDivImg.className = "cart__item__img";

//             // Insertion de l'image

//             let productImg = document.createElement("img");
//             productDivImg.appendChild(productImg);
//             productImg.src = produit.imageUrl;
//             productImg.alt = produit.altTxt;

//             // Insertion de l'élément "div"            

//             let productItemContent = document.createElement("div");
//             productArticle.appendChild(productItemContent);
//             productItemContent.className = "cart__item__content";

//             // Insertion de l'élément "div"

//             let productItemContentDescription = document.createElement("div");
//             productItemContent.appendChild(productItemContentDescription);
//             productItemContentDescription.className = "cart__item__content__description";


//             // Insertion de l'élément "h2"

//             let productTitle = document.createElement("h2");
//             productItemContentDescription.appendChild(productTitle);
//             productTitle.innerHTML = produit.name;

//             // Insertion de la couleur

//             let productGreen = document.createElement("p");
//             productTitle.appendChild(productGreen);
//             productGreen.innerHTML = produit.color;

//             // Insertion de l'élément "p"

//             let productPrice = document.createElement("p");
//             productTitle.appendChild(productPrice);
//             productPrice.innerHTML = produit.price + " €";
 
//             // Insertion de l'élément "div"

//             let productItemSettings = document.createElement("div");
//             productArticle.appendChild(productItemSettings);
//             productItemSettings.className = "cart__item__content__settings";
 
//             // Insertion de l'élément "div"

//             let productItemSettingsQuantity = document.createElement("div");
//             productItemSettings.appendChild(productItemSettingsQuantity);
//             productItemSettingsQuantity.className = "cart__item__content__settings__quantity";

//             // Insertion de "Qté : "

//             let productQte = document.createElement("p");
//             productItemSettingsQuantity.appendChild(productQte);
//             productQte.innerHTML = "Qté : " ;
 
//             // Insertion de la quantité

//             let input = document.createElement("input");
//             productItemSettingsQuantity.appendChild(input);
//             input.className = "itemQuantity";
//             input.value = produit.quantity;
//             input.setAttribute("type", "number");
//             input.setAttribute("name", "itemQuantity-" + produit.idProduit);
//             input.setAttribute("min", "1");
//             input.setAttribute("max", "100");
//             input.addEventListener("change", () => updatePriceAndQuantity (produit.id, input.value, produit, produit.quantity)) 

//             // Insertion de l'élément "div"

//             let productItemContentSettingsDelete = document.createElement("div");
//             productArticle.appendChild(productItemContentSettingsDelete);
//             productItemContentSettingsDelete.className = "cart__item__content__settings__delete";
 
//             // Insertion de "p" supprimer

//             let productItemDelete = document.createElement("p");
//             productItemContentSettingsDelete.appendChild(productItemDelete);
//             productItemDelete.className = "deleteItem";
//             productItemDelete.innerHTML = "Supprimer";
//             productItemDelete.addEventListener("click", () => deleteItem (produit))

//         })


//         getTotals()



//     }}


//     function getTotals() {

//             // Calcul de la quantité total

//     let total = 0                    // on définit la valeur du total sans les produits
//     const totalQuantity = document.querySelector("#totalQuantity")
//     productInLocalStorage.forEach((produit) => {
//     const totalCalculQuantity = produit.quantity
//     total += totalCalculQuantity // += signifie "total = total + totalCalculQuantity"
//     })
//     totalQuantity.textContent = total

//          // calcul du prix total

//     const totalPrice = document.querySelector("#totalPrice")
//     productInLocalStorage.forEach((produit) => {
//     const totalCalculPrice = (produit.price -1) * produit.quantity
//     total += totalCalculPrice // += signifie "total = total + totalCalculPrice"
//     totalPrice.textContent = total
//     })

//     updatePriceAndQuantity()
//     deleteItem(produit)
// }


//     function saveNewDataToLocalStorage () {
//         productInLocalStorage.forEach((produit) => {
//     let saveNewData = JSON.stringify(produit) // stringify pour que le changement de quantité soit dans un format que le local storage comprend
//     localStorage.setItem("product", saveNewData)
//     console.log( saveNewData)
//         })
//     }

//     function updatePriceAndQuantity(id, newValue, produit) {  // cette fonction va être utilisée dès qu'il y aura un changement de quantité et prix dans le panier
//         let itemToUpdate = productInLocalStorage.find(produit => produit.id === id)
//         //let quantity = productInLocalStorage.find(produit => produit.quantity === quantity)
//         produit.quantity = itemToUpdate.quantity
//         itemToUpdate.quantity = Number(newValue)
//         console.log(newValue)
         
//         saveNewDataToLocalStorage (produit)
//         getTotals()
//         deleteItem(produit)    
//     }

//     function deleteItem(produit){
//         const itemToDelete = productInLocalStorage.findIndex(  // findIndex sert à trouver le produit dans la liste
//             (produit) => produit.id)  
//         productInLocalStorage.splice(itemToDelete, 1) // cart.splice pour supprimer une array, il démarrera à itemToDelete et il en supprimera 1
// console.log(productInLocalStorage)


//         const key = `${produit.id}`
//         console.log(key)
//         localStorage.removeItem('product',key)  // pour supprimer l'item du localstorage
     
        
//         getTotals()

//     //    deleteArticleFromPage (produit)
    
//     }

//     // let productArticle = document.createElement("article");
//     // document.querySelector("#cart__items").appendChild(productArticle);
//     // productArticle.className = "cart__item";
//     // productArticle.setAttribute('data-id', produit._id);




//       function deleteArticleFromPage(produit) {
//          const articleToDelete = document.querySelector(  
//              `article[data-id="${produit.id}`  // pour selectionner l'id et la couleur de l'article qu'on veut supprimer
//          )
//          console.log(articleToDelete)
//          //articleToDelete.remove() 
    
//      }





// function displayItem(item){
//     const article = makeArticle(item)
//     const imageDiv = makeImageDiv(item)
//     article.appendChild(imageDiv)

//     const cartItemContent = makeCartContent(item)
//     article.appendChild(cartItemContent)  // pour append le h2, p et p2 à cart__item__content
//     displayArticle(article) // pour afficher l'article
//     displayTotalQuantity()
//     displayTotalPrice()
// }


// function makeCartContent (item) {
//     const cartItemContent = document.createElement("div")
//     cartItemContent.classList.add("cart__item__content")

//     const description = makeDescription(item)
//     const settings = makeSettings(item)

//     cartItemContent.appendChild(description)
//     cartItemContent.appendChild(settings)
//     return cartItemContent
// }

// function makeSettings (item){
//     const settings = document.createElement("div")
//     settings.classList.add("cart__item__content__settings")

//     addQuantityToSettings(settings, item)
//     addDeleteToSettings(settings, item)
//     return settings

// }

// function addQuantityToSettings(settings, item){
//     const quantity = document.createElement("div")
//     quantity.classList.add("cart__item__content__settings__quantity")
//     const p = document.createElement("p")
//     p.textContent = "Qté = "
//     quantity.appendChild(p)
//     const input = document.createElement("input")
//     input.type = "number"
//     input.classList.add("itemQuantity")
//     input.name = "itemQuantity"
//     input.min ="1"
//     input.max ="100"
//     input.value = item.quantity
//     input.addEventListener("change", () => updatePriceAndQuantity (item.id, input.value, item)) // dès qu'on change la quantité d'un produit du panier, cet event listener va récup l'id du produit modifié, et sa nouvelle quantité

//     quantity.appendChild(input)
//     settings.appendChild(quantity)

// }



// function addDeleteToSettings (settings, item){
//     const div = document.createElement("div")
//     div.classList.add("cart__item__content__settings__delete")
//     //div.addEventListener ("click", () => deleteItem(item))


//     const p = document.createElement("p")
//     p.classList.add("deleteItem")
//     p.textContent = "Supprimer"
//     div.appendChild(p)
//     settings.appendChild(div)

// }


// ////////////////////////////              F O R M U L A I R E 





//  const orderButton = document.querySelector("#order")
//    orderButton.addEventListener("click", (e) => submitForm(e)) // pour soumettre le formulaire lorsqu'on clique sur le bouton commander


//  function submitForm(e){
//      e.preventDefault()  // pour pas que ça actualise a chaque submit-formulaire
//      if (cart.length === 0 ) {
//          alert ("Veuillez sélectionner un produit à commander")
//          return  // pour que la requete ne se fasse pas si pas de produits dans le panier
//      }


//      testForm()
//      //testEmail()

//      //if (testForm()) return  // si le testForm est invalide (true) on ne pourra pas aller plus loin
//      //if (testEmail()) return  // si le testEmail est invalide (true) on ne pourra pas aller plus loin


//      const body = makeRequestBody()
//      fetch("http://localhost:3000/api/products/order", {
//          method: "POST",
//          body: JSON.stringify(body),
//          headers: {
//              'Accept': 'application/json', 
//              "Content-Type": "application/json"
//          }
//      })
//      .then((res) => res.json())
//      .then((data) => {
//          const orderId = data.orderId  // pour envoyer les données vers la page de confirmation
//          window.location.href = "confirmation.html" + "?orderId=" + orderId // l'orderId sera directement collé a l'url de la page confirmation
//      })
//      .catch((err) => console.error(err)) // cette ligne permet d'afficher les erreurs si il y'en a

//    //  console.log(form.elements)  // pour recup tous les elements du formulaire
//  }



//  function testForm(){
//      const form = document.querySelector(".cart__order__form")
//      const inputs = form.querySelectorAll("input")   // pour verifier que tous les champs input soient remplis
//      inputs.forEach((input) => {
//          if (input.value === ""){      // si une valeur est nulle, une alerte sera envoyée
//              alert("Veuillez remplir tous les champs du formulaire")
//     return true  // le formulaire ne sera pas envoyé si un input est vide 
//          }
//         return false // le formulaire sera envoyé si tout est rempli
//      })
//  }

// // function testEmail(){
// //     const email = document.querySelector("#email").value
// //     const regex = /^[A-Za-z0-9+_.-]+@(.+)$/  // le format accepté pour un email
// //     if (regex.test(email) === false) {
// //         alert("Veuillez saisir un email valide") // le formulaire ne sera pas envoyé si le mail n'est pas d'un bon format
// //         return true
              
// //         }
// //         return false // le formulaire sera envoyé si l'email est ok 
// //     }


//  function makeRequestBody() {
//      const form = document.querySelector(".cart__order__form")
//      const firstName = form.elements.firstName.value
//      const lastName = form.elements.lastName.value
//      const address = form.elements.address.value
//      const city = form.elements.city.value
//      const email = form.elements.email.value


//      const body = { contact : {
//          firstName: firstName,
//          lastName : lastName,
//          address: address,
//          city : city,
//          email : email

//      },
//      products: getIdsFromLocalStorage()

//      }
//  return body
//  }


//  function getIdsFromLocalStorage () {
//      const numberOfProducts = localStorage.length
//      const ids = []
//      for (let i = 0; i < numberOfProducts; i++) {
//          const key = localStorage.key(i)
//          const id = key.split("-")[0]
//          ids.push(id)
//      }
//      return ids
//  }







// let valuePrenom, valueNom, valueMail, valueAdresse, valueVille;




// ////////////   P R E N O M


// firstName.addEventListener("input", function (e) {
//     const errorPrenom = document.getElementById("firstNameErrorMsg")
//     valuePrenom
//     if(e.target.value.length == 0) {
//         console.log("rien") 
//         errorPrenom.innerHTML = ""
//         valuePrenom = null
//         console.log(valuePrenom)
//     }
//     if (e.target.value.match(/^[a-z A-Z]{1,50}$/)){
//         errorPrenom.innerHTML = ""
//         valuePrenom = e.target.value
//         console.log("success")
//         console.log(valuePrenom)
//     }

//      if (!e.target.value.match(/^[a-z A-Z]{1,50}$/)){
//          errorPrenom.innerHTML = "Votre prénom ne doit pas contenir de chiffres ou caractères spéciaux"
//          valuePrenom = null
//          console.log("fail")
//      }
// })


// ////////////   N O M

// lastName.addEventListener("input", function (e) {
//     const errorNom = document.getElementById("lastNameErrorMsg")
    
//     if(e.target.value.length == 0) {
//         console.log("rien") 
//         errorNom.innerHTML = ""
//         valueNom = null
//         console.log(valueNom)
//     }
//     if (e.target.value.match(/^[a-z A-Z]{1,50}$/)){
//         errorNom.innerHTML = ""
//         valueNom = e.target.value
//         console.log("success")
//         console.log(valueNom)
//     }

//      if (!e.target.value.match(/^[a-z A-Z]{1,50}$/)){
//         errorNom.innerHTML = "Votre nom ne doit pas contenir de chiffres ou caractères spéciaux"
//         valueNom = null
//          console.log("fail")
//      }
// })


// ////////////   A D R E S S E 

// address.addEventListener("input", function (e) {
//     const errorAdresse = document.getElementById("addressErrorMsg")
    
//     if(e.target.value.length == 0) {
//         console.log("rien") 
//         errorAdresse.innerHTML = ""
//         valueAdresse = null
//         console.log(valueAdresse)
//     }
//     if (e.target.value.match(/^[0-9]{1,4}[a-z A-Z]{1,50}$/)){
//         errorAdresse.innerHTML = ""
//         valueAdresse = e.target.value
//         console.log("success")
//         console.log(valueAdresse)
//     }

//      if (!e.target.value.match(/^[0-9]{1,4}[a-z A-Z]{1,50}$/)){
//         errorAdresse.innerHTML = "Votre adresse doit commencer par un chiffre et ne pas contenir de caractères spéciaux"
//         valueAdresse = null
//          console.log("fail")
//      }
// })



// ////////////   V I L L E 


// city.addEventListener("input", function (e) {
//     const errorVille = document.getElementById("cityErrorMsg")
    
//     if(e.target.value.length == 0) {
//         console.log("rien") 
//         errorVille.innerHTML = ""
//         valueVille = null
//         console.log(valueVille)
//     }
//     if (e.target.value.match(/^[a-z A-Z]{1,50}$/)){
//         errorVille.innerHTML = ""
//         valueVille = e.target.value
//         console.log("success")
//         console.log(valueVille)
//     }

//      if (!e.target.value.match(/^[a-z A-Z]{1,50}$/)){
//         errorVille.innerHTML = "Votre nom de ville ne doit pas contenir de chiffres ou caractères spéciaux"
//         valueVille = null
//          console.log("fail")
//      }
// })



// ////////////   E M A I L 

// email.addEventListener("input", function (e) {
//     const errorMail = document.getElementById("emailErrorMsg")

//     if(e.target.value.length == 0) {
//         errorMail.innerHTML = ""
//         valueMail = null
//         console.log(valueMail)

//     } else if (e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
//         errorMail.innerHTML = ""
//         valueMail = e.target.value
//         console.log(valueMail)
//     }
//     if (!e.target.value.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/) && !e.target.value.length == 0){
//         errorMail.innerHTML = "Email incorrect ex: canape@gmail.com"
//         valueMail = null
//     }


// })


