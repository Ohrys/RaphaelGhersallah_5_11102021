/* Récupère tout les produits et les affiche à l'aide de productsDisplay()
 * @return { Object[] } product
*/
function getAllProducts(){
    fetch("http://localhost:3000/api/products")
    .then(function(res){
        if(res.ok){
            return res.json();
        }
    })
    .then(function(values){
        productsDisplay(values);
    })
    .catch(function(err){
        //une erreur est survenue
        console.log("une erreur est survenue", err.message);
    })
}

/*
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
getAllProducts();