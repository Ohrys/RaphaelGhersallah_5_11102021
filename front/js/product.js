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
        let selectColor = document.getElementById("colors")
        selectColor.innerHTML +=
            `<option value="${color}">${color}</option>`
    });
}

/* stocke dans le localStorage sous une clé de la forme index_couleur la quantité d'un produit d'une couleur définie.
 * 
 */
function addToCart(){
    let color = document.getElementById('colors').value;
    let quantity = document.getElementById('quantity').value;
    if(color !== ""){
        let index = idProduct + '_' + color;
        if(localStorage[index]){
            let newQuantity = parseInt(localStorage[index], 10) + parseInt(quantity, 10);
            localStorage[index] = (newQuantity >100)?100:newQuantity;
            addConfirmation();
        }else{
            if(quantity > 100 || quantity <= 0){
                alert('La quantité doit être comprise entre 1 et 100.');
            }else{
                localStorage[index] = parseInt(quantity, 10);
                addConfirmation();
            }
        }
    }else{
        alert('Attention : la couleur n\'est pas définie.');
    }
    
}

/* Crée un bandeau qui s'efface indiquant que le produit a été ajouté au panier. 
 *
 */
function addConfirmation(){
    let banner = document.createElement('div');
    banner.innerHTML = "Article ajouté au panier";
    banner.id = "confirmation";
    banner.style =    `background-color: var(--main-color);\
                                position: absolute;\
                                left: 0;\
                                top: ${window.scrollY}px;\
                                width: 100%;\
                                height: 3em;\
                                font-size: 2em;\
                                box-shadow: 1px 1px 5px black;\
                                display: flex;\
                                justify-content: center;\
                                align-items: center;\
                                opacity: 1;`;
    const header = document.getElementsByTagName('header')[0];
    document.body.insertBefore(banner,header);
    fadeOut(document.getElementById('confirmation'));
}

/* Crée une pause durant ms milliseconde
 * @param { number } ms - Nombre de milliseconde.
 * @return { Promise } 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* Fait disparaître l'élément par un effet de fondu
 * @param { Node } element - element dont l'opacité doit être réduite
 */
async function fadeOut(element){
    await sleep(1000);
    while(element.style.opacity>0){
        element.style.opacity-=.1;
        await sleep(25);
    }
    document.body.removeChild(element);
}



/* début du script */
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let idProduct = urlParams.has("id")?urlParams.get("id"):-1;
document.addEventListener('DOMContentLoaded', getProduct(idProduct));

document.getElementById('addToCart').addEventListener('click', addToCart);

