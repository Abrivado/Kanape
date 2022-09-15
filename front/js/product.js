const queryString = window.location.search  // // ces lignes permettent de récupérer l'id de chaque produit lorsqu'on clique sur un canapé
const urlParams = new URLSearchParams (queryString) // recup les infos id de la barre d'adresse de la page d'accueil
const id = urlParams.get("id")
//if (id != null) {
//   let itemPrice = 0}     // création d'une variable 
//    let imgUrl, altText, articleName


fetch(`http://localhost:3000/api/products/${id}`)  // rajout de `` (backticks) autour de l'adresse pour pouvoir y inclure ${id}
.then((res) => res.json())                         // ces lignes vont servir à récupérer les infos de l'id
.then((res) => handleData(res))

function handleData(canape){   
    const { altTxt, colors, description, imageUrl, name, price} = canape // pour intégrer les infos récupéré de l'id
    itemPrice = price  // cela permet de récupérer le prix auprès de l'API pour ensuite le coller à la variable "let" en haut
    imgUrl = imageUrl
    articleName = name
    altText = altTxt
    makeImageDiv(imageUrl, altTxt)
    makeTitle (name)
    makePrice (price)
    makeCartContent (description)
    makeColors (colors)
}

function makeImageDiv (imageUrl, altTxt){  
    const image = document.createElement("img") //pour créer <img> avec une source et un alt
    image.src = imageUrl
    image.alt = altTxt
    const parent = document.querySelector(".item__img")
    if (parent != null) parent.appendChild(image) // obligé d'appendChild car 2 constantes
}

function makeTitle (name){
    const h1 = document.querySelector("#title")
    if (h1 != null) h1.textContent = name
}

function makePrice (price){
    const span = document.querySelector("#price")
    if (span != null) span.textContent = price
}

function makeCartContent (description){
    const p = document.querySelector("#description")
    if (p != null) p.textContent = description
}

function makeColors (colors){
    const select = document.querySelector("#colors")
    if (select != null) {
        colors.forEach((color) => {
            const option = document.createElement("option")  // création des <options> pour les couleurs
            option.value = color  // ajout des valeurs couleurs dans les options
            option.textContent = color // ajout du contenu texte des couleurs
            select.appendChild(option) // ajout des couleurs au menu select
        })
    }

}

//                           A J O U T  A U  P A N I E R 



const button = document.querySelector("#addToCart")
button.addEventListener("click", handleClick)  // pour voir ce qui se passe quand l'utilisateur clic
 

function handleClick(){
    const color = document.querySelector("#colors").value
    const quantity = document.querySelector("#quantity").value // pour récup les données de la couleur et de la quantité



    if (isOrderInvalid(color, quantity)) return  // pour empecher la redirection au panier si il manque les infos

    saveOrder(color, quantity) 


    window.location.href = "cart.html" // puis redirection vers panier

}


function saveOrder(color, quantity){
    const key = `${id}-${color}` // cette constant key sert à rajouter la couleur à l'id pour pouvoir différencier un même produit de couleurs différentes

    const data = {            // j'ai crée cet objet afin que toutes ces données soient récup dans le localStorage sur une seule ligne
        id: `${id}-${color}`,
        color: color,
        quantity: Number(quantity),
        price: itemPrice,
        imageUrl : imgUrl,
        name: articleName,
        altTxt : altText,
        
    }


    localStorage.setItem(key, JSON.stringify(data),
   alert ("Votre produit a bien été ajouté au panier")) }


   /////////////   S O L U T I O N    M E N T O R    V E R I F    P A N I E R 


 //   let productInLocalStorage = JSON.parse(localStorage.getItem("product"))

    //  if (productInLocalStorage){
    //      const findResult = productInLocalStorage.find(data)

    //          if(findResult) {
    //              let newQuantity =
    //              parseInt(data.quantity)+parseInt(findResult.quantity)
    //              findResult.quantity = newQuantity
    //              localStorage.setItem("products", JSON.stringify(productInLocalStorage, data))
    //              console.log(productInLocalStorage)
    //              alert ("Votre produit a bien été ajouté au panier")
    //          } else {
    //              productInLocalStorage.push(data)
    //              localStorage.setItem("products", JSON.stringify(productInLocalStorage, data))
    //              console.log(productInLocalStorage)
    //              alert ("Votre produit a bien été ajouté au panier")
    //          }
    //      }else{

        //       productInLocalStorage = []
        //        productInLocalStorage.push(data)
        //        localStorage.setItem("product", JSON.stringify(productInLocalStorage))
        //        console.log(productInLocalStorage)
        //        alert ("Votre produit a bien été ajouté au panier")

        //    }
        
    
    


/////////////   A U T R E      S O L U T I O N    T E S T E E



    // let tabProduct = JSON.parse(localStorage.getItem("produit", key))
    // if (tabProduct != null){
    // for (i = 0; i < tabProduct.length; i++) {
    //     console.log("test");


 //       if (
  //          tabProduct[i]._id == key._id 
  //      ) {
   //       return (
     //       tabProduct[i].quantite++,
       //     console.log("quantite++"),
         //   localStorage.setItem("produit", JSON.stringify(tabProduct)),
           // (tabProduct = JSON.parse(localStorage.getItem("produit"))),
           // (spanQuantite.textContent = addQuantity(tabProduct))
         // );
      //  }
//       }

//     }

 //}



   
 //   const productInLocalStorage = tabProduct
 //       if (productInLocalStorage){
 //           let newQuantity =  localStorage.getItem("product", JSON.stringify(productInLocalStorage))
  //          newQuantity.quantity = Number(productInLocalStorage)
    //    }
            
    //}
    
    
    // JSON ne peut pas stocker des objets, mais seulement des string. C'est pour ça qu'il faut les stringify pour qu'elles puissent être interprétées
    // le locaStorage sert a enregistrer les données pour chaque utilisateur sur le site (tel des cookies)

  //  if (productInLocalStorage){
    //const findResult = productInLocalStorage.find(color, id)
    //}



function isOrderInvalid(color, quantity){
    if (color == null || color === "" || quantity == null || quantity == "0" || quantity > 100 || quantity < 0) { // si color ou quantity = null et/ou 0, envoyer le message d'erreur
        alert("Veuillez sélectionner une couleur et une quantité entre 1 et 100")
        return true  // si "true" apparait c'est qu'une des conditions de "if" est validée et donc pas de redirection au panier 
    }
    
}








