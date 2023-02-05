const app = {
    categories : [],
    categorieTemplate : document.getElementById('categorieTemplate'),
    drinkTemplate : document.getElementById('drinkTemplate'),
    modal : document.querySelector('.modal'),
    btnCloseModal : document.querySelector('.modal__close'),
    bgModal : document.querySelector('.modal__background'),
    main : document.querySelector('main'),

    init : async () => {
        console.log("🚀 let's go");
        app.categories = await app.getCategories();
        app.btnCloseModal.addEventListener('click', app.closeModal);
        app.bgModal.addEventListener('click', app.closeModal);
        app.displayCategories();
    },

    getCategories : async () => {
        const response = await fetch('http://localhost:4100/categories/drinks');
        const categories = await response.json();
        return categories;
    },

    displayCategories : () => {
        for (const categorie of app.categories) {
            const clone = document.importNode(app.categorieTemplate.content, true);
            const drinkList = clone.querySelector('.drinkList');

            clone.querySelector('h2').textContent = categorie.name;
            
            for (const drink of categorie.drinks) {
                app.displayDrinks(drink, drinkList);
            }
            app.main.append(clone);
        }
    },

    displayDrinks : (drink, list) => {
        const clone = document.importNode(app.drinkTemplate.content, true);
        clone.querySelector('a').addEventListener('click', app.displayModal);
        clone.querySelector('a').dataset.id = drink.id;
        clone.querySelector('.drink__name').textContent = drink.name;
        clone.querySelector('.drink__maker').textContent = drink.maker;
        clone.querySelector('.drink__infos').textContent = drink.infos;
        if (drink.averagerate > 0) {
            let rateStr = '';
            for (let i = 0; i < 5; i++) {
                i < drink.averagerate ? rateStr +='★' : rateStr +='☆' ;
            }
            clone.querySelector('.drink__rate').textContent = rateStr;
        }
        list.append(clone);
    },

    displayModal : async (event) => {
        const response = await fetch(`http://localhost:4100/drinks/${event.currentTarget.dataset.id}/reviews`);
        const drink = await response.json();
        console.log(drink);
        app.modal.classList.remove('hidden');
        document.querySelector('body').classList.add('noScroll');
    },
    
    closeModal : () => {
        app.modal.classList.add('hidden');
        document.querySelector('body').classList.remove('noScroll');
    }

}

document.addEventListener('DOMContentLoaded', app.init);