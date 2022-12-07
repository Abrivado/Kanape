const urlParams = new URLSearchParams (window.location.search)
// URLsearchParams créé un objet pour avoir accès au données récup par document.location.search
// document.location.search permet de récupérer l'id dans l'url après le "?"

const id = urlParams.get("id")
// const "id" permet de récupérer la valeur de la clé "id"


fetch(`http://localhost:3000/api/products/${id}`)  // recup du produit grâce à l'id depuis l'API
.then((res) => res.json())                         // pour transformer la réponse en json
.then((res) => displayProduct(res))                    // appel de la fonction displayProduct pour afficher le produit


function displayProduct(produit) {   // fonction pour afficher les infos d'un kanap selectionné
    const image = document.querySelector(".item__img");
    const title = document.querySelector("#title");
    const price = document.querySelector("#price");     //  création des const correspondants aux "#id" de chaque élément
    const description = document.querySelector("#description");
    const colors = document.querySelector("#colors");
  
    let img = document.createElement("img");  // creation de <img>
    img.src = produit.imageUrl;               
    img.alt = "Photographie d'un canapé"      // creation de l'alt
  
    image.appendChild(img);   // pour que l'image soit dans la div "item__img"
    title.textContent = produit.name;
    price.textContent = produit.price;
    description.textContent = produit.description;
  
    produit.colors.forEach((color) => {  // creation d'une boucle pour que ça s'applique a toutes les couleurs pour chaque produit
      let option = document.createElement("option");  // creation de la div "option"
      option.value = color;   // pour pouvoir relever la valeur de la couleur
      option.textContent += color;  // pour que les couleurs apparaissent dans le menu défilant
      colors.appendChild(option);  // pour que les couleurs soient dans la div "#colors"
    });
  }



//                           A J O U T  A U  P A N I E R 



let produitClient = {};  // cette variable vide correspond au produit avant qu'il soit choisi et qu'il ai sa couleur et sa quantité
produitClient._id = id;  // pour mettre l'id du produit sélectionné


let colorChoice = document.querySelector("#colors"); // selectionner la div des couleurs 
colorChoice.addEventListener("input", (ec) => {   // pour écouter le choix de la quantité
    let colorProduct = ec.target.value;     //recup de la couleur (value) de la cible (target) dans (ec : event-couleur) #color
    produitClient.color = colorProduct;     //ajout de la couleur dans objet produitClient
});


// on applique le même principe que la couleur à la quantité
let quantityChoice = document.querySelector('input[id="quantity"]');  // on précise [id="quantity"] car il y a plusieurs id dans l'input
quantityChoice.addEventListener("input", (eq) => {
    let quantityProduct = eq.target.value;
    produitClient.quantity = quantityProduct;
})


let productChoice = document.querySelector("#addToCart");  // on selectionne #addToCart qui correspond au bouton ajout au panier
productChoice.addEventListener("click", () => {  // on va écouter lorsqu'on clique sur ce bouton

    if (
        produitClient.quantity < 1 ||
        produitClient.quantity > 100 ||
        produitClient.quantity === undefined ||      // pour pouvoir etre ajouté au panier, le produit ne doit pas avoir une de ces conditions
        produitClient.color === "" ||
        produitClient.color === undefined
    ) {
        // si une condition est réalisé il recevra cette alerte 
        alert("Veuillez renseigner une couleur et une quantité (min 1 / max 100).");

    } else {
        // sinon cela signifie que tout est ok, l'alerte suivante apparaitra
        alert("Votre produit a bien été ajouté au panier !")
        // on appelle la function addToCart qui permet d'ajouter un nouvel article au panier
        addToCart(produitClient);

        window.location.href = "cart.html"
    }
});


function addToCart(produitClient) {
    let productInLocalStorage = localStorage.getItem("savedBasket");

    if (!productInLocalStorage) {     // si pas de produit dans productInLocalStorage,
        localStorage.setItem("savedBasket", JSON.stringify([])); // création d'un tableau savedBasket avec ses données en stringify
        productInLocalStorage = localStorage.getItem("savedBasket");
    }

    // constante pour mettre les données du cart en objet
    const cartJSON = JSON.parse(productInLocalStorage);

    // .find permet de vérifier si un article d'une meme couleur est déjà dans le local storage, si c'est le cas l'alert apparait et MaJ de la nouvelle quantité du produit 
    if (cartJSON.find(i => produitClient._id === i._id && produitClient.color === i.color)) {
        alert("Article déjà choisi, mise à jour de la quantité");

        // findIndex permet de trouver a quelle place se trouve ce même produit dans le panier
        const productIndex = cartJSON.findIndex(i => produitClient._id === i._id && produitClient.color === i.color)
        console.log(productIndex)

        // pour ajouter la quantité au produit en question et la sauvegarder dans le localStorage grâce à setItem
        const addQuantity = parseInt(produitClient.quantity) + parseInt(cartJSON[productIndex].quantity);
        cartJSON[productIndex].quantity = addQuantity
        localStorage.setItem("savedBasket", JSON.stringify(cartJSON));

        // sinon on ajoute l'article sans message d'alert dans le panier du localStorage
    } else {
        const newProduct = [...cartJSON, produitClient];
        localStorage.setItem("savedBasket", JSON.stringify(newProduct));
    }
}
