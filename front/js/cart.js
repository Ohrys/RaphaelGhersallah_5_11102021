/* Récupère la liste des product contenu dans la table et les renvoie sous forme de tableau d'objet de la forme ['key','color','quantity']
 *
 * @return {Object []} listProduct - une array de la forme [[Product,'color','quantity']]
*/
async function retrieveCart(){
    let listResult = [];
    for (i = 0 ; i < localStorage.length ; i++){
        let index = localStorage.key(i);
        let idProduct = index.split('_')[0];
        let colorProduct = index.split('_')[1];
        let quantityProduct = parseInt(localStorage.getItem(index),10);
        let product = await getProduct(idProduct);
        listResult.push([product,colorProduct,quantityProduct]);
    }

    //affiche les éléments un par un. 
    displayCart(listResult);
}

/* Retourne un objet Produit en consultant l'api
 * @param {String} id - l'id de l'objet à retourner
 * @return {Product} product - un objet product.  
 */
async function getProduct(id){
    let response = await fetch("http://localhost:3000/api/products/"+id);
    let product =  await response.json();
    return product;
}

/* Fonction affichant le panier et y attache les évènements pour chaque éléments
 * @param {Array[]} list - liste aux éléments de la forme [Product, color, quantity] issu de recupererListe()
 *
 */
function displayCart(list){
    let containerCart = document.getElementById('cart__items');
    let product = "";
    list.forEach((item) => {
        product = item[0];
        containerCart.innerHTML += 
            `<article class="cart__item" data-id="${product._id}">
                <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__titlePrice">
                        <h2>${product.name} - ${item[1]}</h2>
                        <p>${product.price * item[2]} €</p>
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
    totalCalcul();

    //Ajout de l'evenement sur la quantité
    let listQ = document.getElementsByClassName('itemQuantity');
    for(i = 0 ; i < listQ.length ; i++){
        let quantity = listQ[i].value;

        listQ[i].addEventListener('change', (event) => {
            /*On vérifie la quantité : 
             * - si la valeur est au dessus de 100 et si elle est inférieur à 1,
             *   => on restaure l'ancienne valeur et on alerte l'utilisateur que la valeur est incorrecte.
             */
            if(event.target.value>100 || event.target.value <= 0){
                alert('La quantité doit être comprise entre 1 et 100.');
                event.target.value = quantity;
            }else{
                oldQuantity = quantity;
                quantity = event.target.value;
            }

            //1. éditer la valeur de l'item. 
            event.target.setAttribute('value',quantity);

            //2. On met à jour le prix de l'objet 
            let price = event.target.closest(".cart__item__content");
            productPrice = parseInt(price.querySelector('.cart__item__content__titlePrice p').innerHTML.split(' ')[0]) / parseInt(oldQuantity,10);
            price.querySelector('.cart__item__content__titlePrice p').innerHTML = productPrice * quantity + ' €';

            //on récupère la couleur pour composer la clé de localStorage (de la forme : 'id'_'couleur')
            let color = event.target.closest('.cart__item__content');
            color = color.querySelector('h2').innerHTML.split('- ')[1];
            let index = event.target.closest('article').getAttribute('data-id')+"_"+color;
            
            //2. éditer la valeur dans le localStorage
            localStorage.setItem(index, parseInt(quantity, 10));

            //3. actualiser le prix et les quantités. 
            totalCalcul();
        });
    }
    

    //Ajout de l'evenement sur la suppression
    let listD = document.getElementsByClassName('deleteItem');

    for(i = 0; i< listD.length ; i++){
        
        listD[i].addEventListener('click', (event)=>{
            //supprimer son entrée du localStorage
            //on compose la clé localStorage
            let color = event.target.closest('.cart__item__content');
            color = color.querySelector('h2').innerHTML.split('- ')[1];
            let index = event.target.closest('article').getAttribute('data-id') + "_" + color;
            localStorage.removeItem(index);

            //supprimer l'élément visible
            event.target.closest('article').remove();

            //recalculer le prix
            totalCalcul();
        })
    }
}

/* calcul la quantité totale et le montant total du panier en parcours le panier.
 *
 */
function totalCalcul(){
    let listQ = document.getElementsByClassName('itemQuantity');
    let qTotal = 0;
    let pTotal = 0;
    for (i = 0; i < listQ.length; i++) {
        //on récupère le prix.
        let price = listQ[i].closest('.cart__item__content');
        price = parseInt(price.querySelector('p').innerHTML,10);

        let quantity = listQ[i].value;

        qTotal += parseInt(quantity,10);
        pTotal += price;
    }

    document.getElementById('totalQuantity').innerHTML = qTotal;
    document.getElementById('totalPrice').innerHTML = pTotal;

    
}

/* Vérifie les champs afin de s'assurer l'absence d'erreurs
 * @param {EventListener} event - évènement déclenché lors du click sur le bouton d'envoi du formulaire.
 * 
 */
function checkForm(event){
    let inputNames = [];
    let contact = new Object();
    let products= [];
    let error = false;
    for (i = 0; i < document.querySelectorAll('label').length;i++){
        inputNames.push(document.querySelectorAll('label')[i].getAttribute('for'));
    }
    inputNames.forEach(inputName => {
        let pattern = '';
        let errorMsg = '';
        switch (inputName) {
            case 'firstName':
                /*un prénom ne peut pas : contenir de chiffre, de symbole autre que le tiret, d'apostrophe.*/
                pattern = /^[a-zA-ZÜ-ü-\s]+$/;
                errorMsg = 'Votre prénom ne peut contenir des chiffres ou de caractères spéciaux.'
                break;
            case 'lastName':
                /*un nom peut contenir une particule (de, des, d',...), des accents, des espaces, des caractères alphabétiques minuscules et majuscules*/
                pattern = /^[a-zA-ZÜ-ü-\s']+$/;
                errorMsg = 'Votre nom sans espace, ni chiffre. Accents autorisés.'
                break;
            case 'address':
                /*Une adresse de la forme : 
                    - groupement <=3 chiffres (n° de rue)
                    - 1 ou plusieurs mots. (e.g : rue du ...)
                    - Potentiellement :
                        - groupement <=4 chiffres 
                    Ex : 123 Rue du Pont-couvert Bâtiment 5C Appartement 3
                */
                pattern = /^[0-9]{1,3}([a-zA-ZÜ-ü-\s]+([0-9]{1,4})?)+$/;
                
                errorMsg = 'Votre adresse ne peut contenir de caractère spéciaux autre qu\'un tiret'
                break;
            case 'city':
                /*Une ville de la forme : [codePostal ]nom. Où nom peut contenir accent et tiret sans espace ni chiffre.*/ 
                pattern = /^([0-9]{5}\s)?[a-zA-ZÜ-ü-]+$/;
                errorMsg = 'le nom de ville ne peut contenir d\'accent, d\'espace ou de caractères spéciaux. Le code postal peut être précisé au début séparé par un espace.'
                break;
            case 'email':
                /*match une adresse correspondant au pattern : 
                *   - contenir dans sa première partie, des mots, des chiffres, un tiret, un point ou un underscore.
                *   - l'arobase est nécessaire 
                *   - suivit d'un ou plusieurs mot séparé par des underscore ou des tiret.
                *   - suivit d'un point
                *   - suivit d'un groupement de 2 lettres minimum pour le domaine
                */ 
                pattern = /^[a-zA-Z0-9\.\-_]+@[a-zA-Z_-]+\.[a-zA-Z\.]{2,}$/;
                errorMsg = 'Votre adresse mail de la forme "john@doe.fr".'
                break;
            default:
                break;
        }
        
        let value = document.getElementById(inputName).value.trim();
        if(!pattern.test(value)){
            document.getElementById(inputName + 'ErrorMsg').innerHTML = "champ incorrect : "+ errorMsg;
            error = true;
            event.preventDefault();
        }else{
            if (document.getElementById(inputName + 'ErrorMsg').innerHTML.length>0){
                document.getElementById(inputName + 'ErrorMsg').innerHTML = '';
            }

            contact[inputName]=value;
        }
    });

    if(!error){
        //donner à la fonction d'envoi de commande(à faire) l'object contact et le tableaux de produits(à construire).
        products = retrieveProductIdCart();
        
        
        //Récupération du panier (juste les id ...)
        if(contact != null && products != null ){
            orderCart(contact,products);
            //pour montrer l'objet (temporaire)
        }
        event.preventDefault();
    }
}

/* Récupère les id des items contenus dans le panier et renvoie un talbeau les contenant
 * 
 *  @return { String[] } products - array contenant les id des produits stockés dans le panier.
 */
function retrieveProductIdCart(){
    let items = document.getElementsByClassName('cart__item');
    let products = [];
    for(i = 0 ; i < items.length ; i++){
        products.push(items[i].dataset.id);
    }

    return products;
}

/* Requête l'API afin de soumettre une commande. Si commande correctement enregistré renvoie un identifiant de commande.
 * @param {Contact} contact - un objet contact {firstName, lastName, adresse, ville, email}
 * @param {String[]} products - un tableau contenant les identifiants des produits.
 * @return {String} - un identifiant de commande effectuée.
 */
function orderCart(contact, products){
    fetch(" http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contact : contact,
            products : products
        })
    })
    .then(function (res) {
        if (res.ok) {
            return res.json();
        }
    }).then(function (value) {
        window.location.replace('file:///C:/Users/kinoa/Documents/Codage/OC/P5/front/html/confirmation.html?orderId='+value.orderId);
    });
}


/* début du script 
 * si on est sur la page cart.html on exécute la récupération du panier, sinon cela indique que nous somme sur la page confirmation.html
 */
if (window.location.href == 'file:///C:/Users/kinoa/Documents/Codage/OC/P5/front/html/cart.html'){
    document.addEventListener('DOMContentLoaded', retrieveCart());
    document.getElementById('order').addEventListener('click',checkForm);

} else {
    let queryString = window.location.search;
    let urlParams = new URLSearchParams(queryString);
    let orderId = urlParams.has("orderId") ? urlParams.get("orderId") : 'error';
    if(orderId!='error'){
        document.getElementById('orderId').innerHTML = orderId;
        localStorage.clear();
    }
    

}
