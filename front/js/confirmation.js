const orderId = getOrderId()
displayOrderId(orderId)
//cleanLocalStorage()

function getOrderId() {

const queryString = window.location.search  
const urlParams = new URLSearchParams (queryString) // recup les params de la page panier
const orderId = urlParams.get("orderId") // recup le numéro de commande "orderId" 
return orderId

}

function displayOrderId(orderId) {
    const orderIdElement = document.getElementById("orderId")   // pour selectionner l'endroit où va etre affiché l'orderId
    orderIdElement.textContent = orderId  // pour afficher le num de l'orderId
}

function cleanLocalStorage() {
    const localStorage = window.localStorage
    localStorage.clear()
}



