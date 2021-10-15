/* Récupère un produit donné
 * @param { String } id - L'identifiant de l'objet à récupérer
 * @return { Object } product - le produit au format json
*/
function getProduct(id) {
    fetch("http://localhost:3000/api/products/" + id)
        .then(function (res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function (value) {
            displayProduct(value)
        })
        .catch(function (err) {
            //une erreur est survenue
            console.log("Une erreur est survenue", err.message);
        })
}

/* Affiche le produit obtenu via l'api 
 * @param {Product} product - objet obtenu via la fonction getProduct
 */
function displayProduct(product){
    document.getElementsByClassName('item__img')[0].innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
    document.getElementById('title').innerHTML = product.name;
    document.getElementById('price').innerHTML = product.price;
    document.getElementById('description').innerHTML = product.description;
    
    product.colors.forEach(color => {
        const selectColor = document.getElementById("colors")
        selectColor.innerHTML +=
            `<option value="${color}">${color}</option>`
    });
}

/* 
 * stocke dans le localStorage sous une clé de la forme index_couleur la quantité d'un produit d'une couleur définie.
 */
function addToCart(){
    var color = document.getElementById('colors').value;
    var quantity = document.getElementById('quantity').value;
    if(color !== ""){
        index = idProduct + '_' + color;
        if(localStorage[index]){
            localStorage[index] = parseInt(localStorage[index],10) + parseInt(quantity,10);
        }else{
            localStorage[index] = parseInt(quantity, 10);
        }
    }else{
        console.error('la couleur n\'est pas définie.');
    }
    
}


/* début du script */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const idProduct = urlParams.has("id")?urlParams.get("id"):-1;
document.addEventListener('DOMContentLoaded', getProduct(idProduct));

document.getElementById('addToCart').addEventListener('click', addToCart);

