
// URLsearchParams créé un objet pour avoir accès au données récup par document.location.search
// document.location.search permet de récupérer l'id dans l'url après le "?"

const urlParams = new URLSearchParams (window.location.search)

// const "id" permet de récupérer la valeur de la clé "id"

const id = urlParams.get("id")


// je vérifie si les params match un ID de l'api :

if (urlParams.has('id')) {
     fetch('http://localhost:3000/api/products/' + id)
     .then(response => response.json())
     .then(data => {
        console.log(data);
        // pour envoyer les datas vers la fonction displayProduct
        displayProduct(data);
     })
} else {
    console.error("Un id est obligatoire !");
}

// function pour afficher le produit

function displayProduct(produit) {
       
    let itemImg = document.querySelector('.item__img');  // selectionner .item__img

    let img = document.createElement('img'); // création de l'élément + indiquer la src et alt des data de l'api
    img.src = produit.imageUrl;
    img.alt = produit.altTxt;
    itemImg.appendChild(img);  // pour que l'img soient dans la div ".item__img"

    let name = document.getElementById('title');     // recup l'id title du html
    name.textContent = produit.name;   // remplir avec le name du produit via les datas api

    let price = document.getElementById('price'); // recup l'id price du html
    price.textContent = produit.price; // remplir avec le prix du produit via les datas api

    let description = document.getElementById('description');
    description.textContent = produit.description;

    let select = document.getElementById('colors'); // recup l'id colors du html
    // faire une boucle pour check les couleurs du produit pour remplir les options du <select>
    for (let i = 0; i < produit.colors.length; i++) {
        let color = produit.colors[i];

        let option = document.createElement('option');     // création de l'élément <option>
        option.value = color;        // remplir la valeur de l'option par la couleur.
        option.textContent = color;
        select.appendChild(option);      // pour que <option> soit dans <select>
    }
}


                            ////////  CLICK ADD TO CART



let button = document.getElementById('addToCart'); // selection du button
button.addEventListener('click', function() {   // écouter l'évènement lors du clic sur le bouton ajout au panier
    console.log('Click sur button');
    let title = document.getElementById('title');
    // Récupérer le nom du produit depuis le title.
    let name = title.textContent;
    console.log(name)

    let elementQuantity = document.getElementById('quantity');
    let quantity = Number(elementQuantity.value); // recup valeur quantité + etre sur que ça soit un nombre

    let elementColors = document.getElementById('colors');
    let color = elementColors.value;  // recup la couleur

    if (!color) {       // si aucune couleur selectionnée => une alerte.
        alert ('Veuillez choisir une couleur svp')
        return; // return pour ne pas aller plus loin
    }

    if (quantity < 1 || quantity > 100) {  // si la quantité est inférieure à 1 ou supérieur à 100 => une alerte.
        alert ('Veuillez choisir une quantité entre 1 et 100 svp')
        return; // return pour ne pas aller plus loin
    }

    // création de l'objet produit contenant (id, name, color et quantity) => données qui seront sauvegardé dans le localStorage
    let produit = { id: id, name: name, color: color, quantity: quantity };

    addProduct(produit); // appel de la function addProduct qui aura pour bu d'ajouter une fonction dans le localStorage
    // elle ne pourra être appelé si les conditions plus haut sont respectés
});


                            ////////  GESTION LOCALSTORAGE


// fonction pour sauvegarder un produit

function saveProduct(produits) {  
    localStorage.setItem("savedBasket", JSON.stringify(produits)); // setItem permet d'ajouter des produits dans le localStorage
} // .stringify permet de convertir le tableau en chaîne de caractère (obligé pour localStorage)



 // fonction pour recup les produits sauvegardés dans le localStorage.

function getAllProduct() {
    let produits = localStorage.getItem("savedBasket");    // getItem sert à recup les produits du localStorage avec le clé "savedBasket"
    if (produits == null) { // si pas de produit on retourne un tableau vide.
        return [];
    } else { // sinon on a de produit on convertir la chaîne JSON en tableau de produit.
        return JSON.parse(produits);
    }
}

// fonction pour verifier si le produit existe dans le localStorage avant de l'ajouter

function addProduct(produit) {

    // recup les produits sauvegardés dans le localStorage grâce à notre fonction
    let produits = getAllProduct();

    // .find permet de rechercher un produit est deja dans le panier grâce à id et coulor.
    // si le produit n'existe pas on retourne undefined
    let rechercheProduit = produits.find(p => p.id == produit.id && p.color == produit.color);

    if (rechercheProduit != undefined) { // Si le produit existe (pas undefined) on modifie sa quantité 

        if(rechercheProduit.quantity + produit.quantity > 100) { 
            alert('Veuillez choisir une quantité entre 1 et 100 svp')
            return; // Si la somme de l'ancien quantité et la nouvelle quantité est supérieur à 100 on affiche une erreur.

        } else { // si le total est valide, MaJ de la quantité du produit dans le panier.
            rechercheProduit.quantity = rechercheProduit.quantity + produit.quantity;
        }
    } else { 
        produits.push(produit); // si le produit n'est pas deja dans le panier on le push normalement
    }

    saveProduct(produits); // fonction pour sauvegarder un produit dans le localStorage, elle sera appelé uniquement si tout est ok
    alert ('Votre produit a bien été ajouté au panier');
    window.location.href = "cart.html" // produit bien ajouté => redirection page panier
}


