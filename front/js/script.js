fetch('http://localhost:3000/api/products')  // fetch va permettre de récup les données de l'api
.then((res) => res.json()) 
.then((data) => addProducts(data))


function addProducts(data) {

    data.forEach((canape)  => {  // cette ligne permets de répéter toutes les infos chaque canard

        
    const _id = canape._id    // ces lignes permettent de récup les données de fetch et des les envoyer vers chacunes des class
    const imageUrl = canape.imageUrl
    const altTxt = canape.altTxt      // on prends data[0] , car on s'occupe de la première ligne 
    const name = canape.name
    const description = canape.description

    // const {_id, imageUrl, altTxt, name, decription} = data[0] // écriture possible aussi


    const anchor = makeAnchor(_id)     // ces lignes permettent de créer les class <anchor> <article> <img> <h3> et <p>
    const article = document.createElement("article")  
    const image = makeImage(imageUrl, altTxt)
    const h3 = makeH3(name)
    const p = makeParagraphe(description)

    appendElementsToArticle (article, image, h3, p)     // ces lignes servent à relier les class entre elles
    appendArticleToAnchor (anchor, article)

  })
}

function makeAnchor(id){ // pour créer <a>
    const anchor = document.createElement("a")
    anchor.href = "./product.html?id=" + id 
    return anchor                                // ces données vont être envoyé vers addProducts
}

function appendElementsToArticle(article, image, h3, p){
    article.appendChild(image) // ces lignes signifient que l'image sera dans <articles> <img> <h3> <p>
    article.appendChild(h3)
    article.appendChild(p)
 }



function appendArticleToAnchor(anchor, article) {
    const items = document.querySelector('#items') //creation class <items>
    if (items != null) {
        items.appendChild(anchor)
        anchor.appendChild(article)
    }
}


function makeImage (imageUrl, altTxt){  //pour créer <image>
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    return image
}

function makeH3 (name){
    const h3 = document.createElement("h3")  // pour créer un h3
    h3.textContent = name  // pour relier le h3 à l'api
    h3.classList.add("productName")  // pour ajouter une classe "productName" au h3
    return h3
    
}

function makeParagraphe(description){
    const p = document.createElement("p")
    p.textContent = description
    p.classList.add("productDescription")
    return p


}





