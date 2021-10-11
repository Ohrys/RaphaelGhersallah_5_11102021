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

function displayProduct(product){
    const containerProduct = document.getElementsByTagName("article")[0];
    
    containerProduct.innerHTML =
    `
        <div class="item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
        </div>
        <div class="item__content">

            <div class="item__content__titlePrice">
                <h1 id="title">${product.name}</h1>
                <p>Prix : <span id="price">${product.price}</span>€</p>
            </div>

            <div class="item__content__description">
                <p class="item__content__description__title">Description :</p>
                <p id="description">${product.description}</p>
            </div>

            <div class="item__content__settings">
                <div class="item__content__settings__color">
                    <label for="color-select">Choisir une taille :</label>
                        <select name="color-select" id="colors">
                            <!-- va falloir se creuser un peu la tête pour les options -->
                        </select>
                </div>

                <div class="item__content__settings__quantity">
                    <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
                    <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
                </div>
            </div>

            <div class="item__content__addButton">
                <button id="addToCart">Ajouter au panier</button>
            </div>

        </div>
    `  

    product.colors.forEach(color => {
        const selectColor = document.getElementById("colors")
        selectColor.innerHTML +=
        `<option value="${color}">${color}</option>`
    });
}

/* début du script */
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
id = urlParams.has("id")?urlParams.get("id"):-1;
getProduct(id);