// getItem pour recup les produits du localStorage  
let produits = JSON.parse(localStorage.getItem("savedBasket")) || [];
console.log(produits);

let totaleQuantity = 0; // mettre une quantity et un price de 0 par défaut
let totalePrice = 0;
let idTotaleQuantity = document.getElementById('totalQuantity');
let idTotalePrice = document.getElementById('totalPrice');

// recuperer l'image ,prix  grace au fetch de l'API: 
function recupererProduit(produit) {
    fetch('http://localhost:3000/api/products/' + produit.id)
    .then(response => response.json())
    .then(data => {
         console.log(data);
         displayPanier(produit, data);

         // calculer et afficher la quantité totale et le prix (afficher dans le HTML)
         totalePrice = totalePrice + (produit.quantity * data.price); // quantity du localStorage * prix prod(api)
         totaleQuantity = totaleQuantity + produit.quantity
         idTotaleQuantity.textContent = totaleQuantity;
         idTotalePrice.textContent=totalePrice;         
    });
}
// cette boucle permets parcourir tous les produits de localStorage
for (let i = 0; i < produits.length ; i++) {
    recupererProduit(produits[i]); // on appelle cette fonction pour pouvoir calculer les totales de tous les produits trouvés dans le panier
}


                           ////////  AFFICHAGE ELEMENTS PANIERS

// fonction displayPanier contient en paramètre => produit : les données savedBasket du localStorage
                                             // => data : les données de produit de l'API 
function displayPanier(produit, data) {
    let article = document.createElement('article');
    article.className = 'cart__item';
    article.setAttribute('data-id', produit.id);  // pour ajouter l'id produit à <article> depuis le localStorage
    article.setAttribute('data-color', produit.color);  // pour ajouter la color produit depuis le localStorage
   
    // création <div class="cart__item__img">
    let divImg = document.createElement('div');
    divImg.className = 'cart__item__img';
    let img = document.createElement('img');
    img.src = data.imageUrl;  // pour ajouter la source de l'img du produit depuis les data api
    img.alt = data.altTxt; // pour ajouter l'alt de l'img du produit depuis les data api
    divImg.appendChild(img);
   
    // ajouter le div.cart__item__img sous article
    article.appendChild(divImg);
   
    // création <div class="cart__item__content">
    let divContent = document.createElement('div');
    divContent.className = 'cart__item__content';
    
    // création <div class="cart__item__content__description">
    let divDescription = document.createElement('div');
    divDescription.className = 'cart__item__content__description';
    
    // ajouter les éléments <h2> et les deux <p> sous divDescription
    let h2 = document.createElement('h2');
    h2.textContent = produit.name;   // pour ajouter le name 
    let pColor = document.createElement('p');
    pColor.textContent = produit.color;  // pour ajouter la couleur 
    let pPrice = document.createElement('p');
    pPrice.textContent = data.price + ' €'; // pour ajouter le prix + rajout du signe €
    divDescription.appendChild(h2);
    divDescription.appendChild(pColor);
    divDescription.appendChild(pPrice);
    
    // création <div class="cart__item__content__settings">
    let divSettings = document.createElement('div');
    divSettings.className = 'cart__item__content__settings';
    
    // création <div class="cart__item__content__settings__quantity">
    let divSettingsQuantity = document.createElement('div');
    divSettingsQuantity.className = 'cart__item__content__settings__quantity';
    
    // création <div class="cart__item__content__settings__delete">
    let divSettingsDelete = document.createElement('div');
    divSettingsDelete.className = 'cart__item__content__settings__delete';
    
    // ajouter les différents éléments du div.cart__item__content__settings__quantity
    let pQuantity = document.createElement('p');
    pQuantity.textContent = 'Qté : ';
    
    // création l'élément input
    let input = document.createElement('input');
    input.addEventListener('change', function(event) {  // écouter l'evenement "changement" sur l'input (quantité)

        let nouvelleQuantity = event.target.value;  // event.target sert à récup l'element de evenement
        if (nouvelleQuantity < 1 ) {
            alert('La quantité minimale est 1!');  // condition qté min
            modifierProduit(produit, 1, data.price); // appel de la fonction modifierProduit lors d'un
        } else if (nouvelleQuantity > 100) { // condition qté max
            alert('La quantité maximale est 100!');
            modifierProduit(produit, 100, data.price);
        } else {
            modifierProduit(produit, nouvelleQuantity, data.price); 
        }
    });
    input.setAttribute('type', 'number');
    input.setAttribute('name', 'itemQuantity');
    input.setAttribute('class', 'itemQuantity');
    input.setAttribute('value', produit.quantity);
    input.setAttribute('min', 1);
    divSettingsQuantity.appendChild(pQuantity);
    divSettingsQuantity.appendChild(input);
    
    // Ajouter les différents éléments du div.cart__item__content__settings__delete
    let pDeleteItem = document.createElement('p');
    pDeleteItem.className = 'deleteItem';


    //                          S U P P R I M E R    U N    P R O D U I T


    pDeleteItem.textContent = 'Supprimer';
    divSettingsDelete.appendChild(pDeleteItem);
    pDeleteItem.addEventListener("click" , function(event){ //  écouter lors du clic sur supprimer

        //event.target :séléctionner l'element qui est à l'origine de l'événement.
        let supprimer = event.target;
        // closest selectionner l'element parent de l'element qui nous mis en paramétre 
        let article = supprimer.closest('.cart__item');
        //getAttribute va nous permettre de recup la valeur de l'id et la couleur du produit à supprimer
        let dataId = article.getAttribute('data-id')
        let datacolor = article.getAttribute('data-color')

        // on va chercher dans le localStorage si un produit correspond à l'id+couleur
        let removeproduct = produits.find(prod => prod.id == dataId && prod.color == datacolor);
        totaleQuantity -= removeproduct.quantity
        idTotaleQuantity.textContent = totaleQuantity  // calcul du nb total de produit sans l'id à supprimer
        totalePrice -= removeproduct.quantity * data.price;
        idTotalePrice.textContent = totalePrice;  // calcul du prix total sans l'id à supprimer

        // on va enregistrer le nouveau panier avec toutes les id+color non sélectionné plus haut
        produits = produits.filter(prod => prod.id !== dataId || prod.color !== datacolor )
        localStorage.setItem("savedBasket", JSON.stringify(produits));
        article.remove(); // pour supprimer le produit voulu
    });
    
    // Ajouter les divs cart__item__content__settings__quantity et cart__item__content__settings__delete sous le div parent cart__item__content__settings
    divSettings.appendChild(divSettingsQuantity);
    divSettings.appendChild(divSettingsDelete);
    
    // Ajouter les divs cart__item__content__description et cart__item__content__settings sous le div parent cart__item__content
    divContent.appendChild(divDescription);
    divContent.appendChild(divSettings);
    
    // Ajouter le div.cart__item__content sous article
    article.appendChild(divContent);
    
    // Ajouter l'élément article sous section
    let section = document.getElementById('cart__items');
    section.appendChild(article);
}


//                                M O D I F I E R   U N   P R O D U I T


// fonction créee pour modifier la quantité et le prix sur page panier - ref input.addEventListener "change"

function modifierProduit(produit, nouvelleQuantity, price) {
    console.log(nouvelleQuantity)

    let diffQuantity = nouvelleQuantity - produit.quantity; // pour connaitre la valeur du changement de quantité
    produit.quantity = Number(nouvelleQuantity);   // Number, pour manipuler les nombres comme des objets

    totaleQuantity += diffQuantity // calcul de la nouvelle quantity
    idTotaleQuantity.textContent = totaleQuantity  // pour afficher la nouvelle quantité au niveau du total

    totalePrice += diffQuantity * price; // calcul du nouveau prix
    idTotalePrice.textContent = totalePrice; // pour afficher le nouveau prix au niveau du total

    localStorage.setItem("savedBasket", JSON.stringify(produits)); 
    // .setItem pour enregistrer ces nouvelles données dans le localStorage
 }


//                                    F O R M U L A I R E  


let commander = document.getElementById('order'); 
commander.addEventListener('click', testFormulaire); 
// appel de la fonction testFormulaire lors du clic sur le bouton commander 

function testFormulaire(event) {  // cette fonction sert à verifier puis envoyer le formulaire si tout est
    event.preventDefault();

    if (produits.length == 0 ){      // alerte si la panier est vide
        alert('Veuillez ajouter un article dans votre panier');
        return;
    }
    
    if (
        verifFirstName(event) &&
        verifLastName(event) &&    // avant d'envoyer le formulaire, appel des fonctions qui vérifient
        verifAdresse(event) &&     // que chaque champs soit bien valide
        verifVille(event) &&
        verifEmail(event)
    ) {

        let productsIds = produits.map(prod => prod.id);      // création d'un tableau des ids produit

        let contact = {                // création d'un objet contact qui contient les données du formulaire
            firstName: prenom.value,
            lastName: nom.value,
            address: adresse.value,
            city: ville.value,
            email: email.value
        };

        let data = {      // data contient les produits du panier et les infos de formulaire
            products: productsIds,
            contact: contact
        };

        // pour envoyer l'objet data (contact, products) vers l'API avec la méthode POST

        fetch ('http://localhost:3000/api/products/order', {
            method : 'POST',
            headers : {
                'content-type': 'application/json',
                'accept': 'application/json'
            },
            body : JSON.stringify(data)
        })
//l'API nous retourne le numéro de la commande orderId
        .then(response => response.json())       
        .then(data => {
            localStorage.clear();// vider localStorage une fois la commande validée
            // redirigié vers la page confirmation avec le numero de commande en paramétre sur l'URL
            location.href = 'confirmation.html?orderId='+ data.orderId;
            console.log(data);
       });
    }
}

// ces fonctions servent à valider les champs obligatoire pour le formulaire

let prenom = document.getElementById('firstName');
let prenom_error = document.getElementById('firstNameErrorMsg');
let prenom_valeur = /^[a-z A-Z]{1,50}$/; // regex : que des lettres et entre 1 et 50 caractères acceptés

function verifFirstName(event){
    if (prenom.validity.valueMissing){  // si rien n'est renseigné
        event.preventDefault();   // pour ne pas envoyer le formulaire
        prenom_error.innerHTML ='Veuillez saisir votre prénom svp'; // message d'erreur
        return false;
 
    } else if (prenom_valeur.test(prenom.value) == false) { // si le format n'est pas valide
        event.preventDefault(); 
        prenom_error.innerHTML = 'Votre prénom ne doit pas contenir de chiffres ou caractères spéciaux'
        return false;

    } else {
        prenom_error.innerHTML ='';  // si tout est ok pas de message d'erreur
        return true;
    }
}

let nom = document.getElementById('lastName');
let nom_error = document.getElementById('lastNameErrorMsg');
let nom_valeur = /^[a-z A-Z]{1,50}$/;

function verifLastName(event) {
    if (nom.validity.valueMissing){
        event.preventDefault();
        nom_error.textContent = 'Veuillez saisir votre nom svp';
        return false;

    } else if ( nom_valeur.test(nom.value)== false) {
        event.preventDefault();
        nom_error.textContent = 'Votre nom ne doit pas contenir de chiffres ou caractères spéciaux !'
        return false;

    } else {
        nom_error.textContent = '';
        return true;
    }
}

let adresse = document.getElementById('address');
let adresse_error = document.getElementById('addressErrorMsg');
let adresse_valeur =/^[0-9]{1,4}[a-z A-Z]{1,50}$/ // doit commencer par un chiffre (1 à 1000) puis lettre (1 à 50)

function verifAdresse (event){
    if (adresse.validity.valueMissing){
        event.preventDefault();
        adresse_error.textContent ='Veuillez saisir votre adresse svp'
        return false;

    } else if (adresse_valeur.test(adresse.value) == false) {
        event.preventDefault();
        adresse_error.textContent = 'Votre adresse doit commencer par un chiffre et ne pas contenir de caractères spéciaux'
        return false;

    } else {
        adresse_error.textContent ='';
        return true;
    }
}

let ville = document.getElementById('city');
let ville_error = document.getElementById('cityErrorMsg');
let ville_valeur =/^[a-z A-Z]{1,50}$/ // que des lettres de 1 à 50 caractères

function verifVille (event) {
    if (ville.validity.valueMissing) {
        event.preventDefault();
        ville_error.textContent ='Veuillez saisir votre ville svp'
        return false;

    } else if (ville_valeur.test(ville.value) == false) {
        event.preventDefault();
        ville_error.textContent = 'Votre nom de ville ne doit pas contenir de chiffres ou caractères spéciaux'
        return false;

    } else {
        ville_error.textContent ='';
        return true;
    }
}

let email = document.getElementById('email');
let email_error = document.getElementById('emailErrorMsg');
let email_valeur = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // [\w-\.] signifie tous les mots, "-" et "." // @ obligé  // ensuite [\w-\.]tous les mots, "-" et "." // 2 à 4 caractères max

function verifEmail (event){
    if (email.validity.valueMissing) {
        event.preventDefault();
        email_error.textContent ='Veuillez saisir votre email svp'
        return false;

    } else if (email_valeur.test(email.value) == false) {
        event.preventDefault();
        email_error.textContent = 'Email incorrect ex: canape@gmail.com'
        return false;

    } else {
        email_error.textContent ='';
        return true;
    }
}