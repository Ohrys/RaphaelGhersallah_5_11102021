
/* Récupère la liste des product contenu dans la table et les renvoie sous forme de tableau d'objet de la forme ['key','color','quantity']
 *
 * @return {Object []} liste - une array de la forme [[Product,'color','quantity']]
*/
async function recupererPanier(){
    var listResult = [];
    for (var i = 0 ; i < localStorage.length ; i++){
        var index = localStorage.key(i);
        var idProduct = index.split('_')[0];
        var colorProduct = index.split('_')[1];
        var quantityProduct = parseInt(localStorage.getItem(index),10);
        var product = await getProduct(idProduct);
        listResult.push([product,colorProduct,quantityProduct]);
    }

    //affiche les éléments un par un. 
    displayPanier(listResult);
}

/* Retourne un objet Produit en consultant l'api
 * @param {String} id - l'id de l'objet à retourner
 * @return {Product} product - un objet product.  
 */
async function getProduct(id){
    const response = await fetch("http://localhost:3000/api/products/"+id);
    var product =  await response.json();
    return product;
}

/* Fonction affichant le panier et y attache les évènements pour chaque éléments
 * @param {Array[]} list - liste aux éléments de la forme [Product, color, quantity] issu de recupererListe()
 *
 */
function displayPanier(list){
    var containerCart = document.getElementById('cart__items');
    list.forEach((item) => {
        var product = item[0];
        containerCart.innerHTML += 
            `<article class="cart__item" data-id="${product._id}">
                <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__titlePrice">
                        <h2>${product.name} - ${item[1]}</h2>
                        <p>${product.price}</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${item[2]}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`;
    });  
    calculTotal();

    //Ajout de l'evenement sur la quantité
    listQ = document.getElementsByClassName('itemQuantity');
    for( var i = 0 ; i < listQ.length ; i++){
        listQ[i].addEventListener('change', (event) => {
            
            //1. éditer la valeur de l'item. 
            event.target.setAttribute('value',event.target.value);

            //on récupère la couleur pour composer la clé de localStorage (de la forme : 'id'_'couleur')
            color = event.target.closest('.cart__item__content');
            color = color.querySelector('h2').innerHTML.split('- ')[1];
            index = event.target.closest('article').getAttribute('data-id')+"_"+color;
            
            //2. éditer la valeur dans le localStorage
            localStorage.setItem(index, parseInt(event.target.value, 10));

            //3. actualiser le prix et les quantités. 
            calculTotal();
        });
    }
    

    //Ajout de l'evenement sur la suppression
    listD = document.getElementsByClassName('deleteItem');

    for( var i = 0; i< listD.length ; i++){
        
        listD[i].addEventListener('click', (event)=>{
            //supprimer son entrée du localStorage
            //on compose la clé localStorage
            color = event.target.closest('.cart__item__content');
            color = color.querySelector('h2').innerHTML.split('- ')[1];
            index = event.target.closest('article').getAttribute('data-id') + "_" + color;
            localStorage.removeItem(index);

            //supprimer l'élément visible
            event.target.closest('article').remove();

            //recalculer le prix
            calculTotal();
        })
    }
}


/* calcul la quantité totale et le montant total du panier en parcours le panier.
 *
 */
function calculTotal(){
    var listQ = document.getElementsByClassName('itemQuantity');
    var qTotal = 0;
    var pTotal = 0;
    for (var i = 0; i < listQ.length; i++) {
        //on récupère le prix.
        price = listQ[i].closest('.cart__item__content');
        price = parseInt(price.querySelector('p').innerHTML,10);

        qTotal += parseInt(listQ[i].value,10);
        pTotal += parseInt(listQ[i].value,10) * price;
    }

    document.getElementById('totalQuantity').innerHTML = qTotal;
    document.getElementById('totalPrice').innerHTML = pTotal;

    
}

recupererPanier();

