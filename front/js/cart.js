let productInLocalStorage = JSON.parse(localStorage.getItem('savedBasket'));
console.log(productInLocalStorage);


 fetch("http://localhost:3000/api/products")
 .then((res) => res.json()) 
 .then((data) => {
     if (productInLocalStorage){
         for (p of productInLocalStorage){
             const product = data.find(d=> d._id === d.idProduit)
             console.log(data)
             if (product) {
                d.price = product.price
                

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


