/* Récupère tout les produits et les affiche à l'aide de productsDisplay()
 * @return { Object[] } product
*/
function getAllProducts(){
    fetch("http://localhost:3000/api/products")
    .then(function(res){
        if(res.ok){
            return res.json();
        }else{
            throw new Error("données non collectées");
        }
    })
    .then(function(values){
        productsDisplay(values);
    })
    .catch(function(err){
        //une erreur est survenue
        console.error("une erreur est survenue", err.message);
    })
}

/* Affiche la listes des produits obtenus via l'api.
 * @param {Products []} products - Renvoie l'array d'objet products issu de getAllProducts
 */
function productsDisplay(products){
    const containerProduct = document.getElementById("items");
    
    
    products.forEach(product => {
        containerProduct.innerHTML += 
            `
            <a href="./product.html?id=${product._id}">
                <article>
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                    <h3 class="productName">${product.name}</h3>
                    <p class="productDescription">${product.description}</p>
                </article>
            </a>
            `
    });    
}


/* début du script */
document.addEventListener('DOMContentLoaded',getAllProducts());