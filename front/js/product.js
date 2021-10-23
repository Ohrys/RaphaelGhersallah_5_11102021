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
        selectColor = document.getElementById("colors")
        selectColor.innerHTML +=
            `<option value="${color}">${color}</option>`
    });
}

/* 
 * stocke dans le localStorage sous une clé de la forme index_couleur la quantité d'un produit d'une couleur définie.
 */
function addToCart(){
    color = document.getElementById('colors').value;
    quantity = document.getElementById('quantity').value;
    if(color !== ""){
        index = idProduct + '_' + color;
        if(localStorage[index]){
            localStorage[index] = parseInt(localStorage[index],10) + parseInt(quantity,10);
            confirmationAjout();
        }else{
            quantity = (quantity>100)?100:
                        (quantity<=0)?1:quantity;
            localStorage[index] = parseInt(quantity, 10);
            confirmationAjout();
        }
    }else{
        alert('Attention : la couleur n\'est pas définie.');
    }
    
}

function confirmationAjout(){
    bandeau = document.createElement('div');
    bandeau.innerHTML = "Article ajouté au panier";
    bandeau.id = "confirmation";
    bandeau.style =    `background-color: var(--main-color);\
                                position: absolute;\
                                left: 0;\
                                top: ${window.scrollY+100}px;\
                                width: 100%;\
                                height: 3em;\
                                font-size: 2em;\
                                box-shadow: 1px 1px 5px black;\
                                display: flex;\
                                justify-content: center;\
                                align-items: center;\
                                opacity: 1;`;
    header = document.getElementsByTagName('header')[0];
    document.body.insertBefore(bandeau,header);
    fadeOut(document.getElementById('confirmation'));
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function fadeOut(element){
    await sleep(1000);
    while(element.style.opacity>0){
        element.style.opacity-=.1;
        await sleep(25);
    }
}



/* début du script */
queryString = window.location.search;
urlParams = new URLSearchParams(queryString);
idProduct = urlParams.has("id")?urlParams.get("id"):-1;
document.addEventListener('DOMContentLoaded', getProduct(idProduct));

document.getElementById('addToCart').addEventListener('click', addToCart);

