const ORDER_ASC_BY_COST = "$a";
const ORDER_DESC_BY_COST = "$b";
const ORDER_BY_PROD_REL = "Rel.";
var productsArray = [];
var filteredArray = [];
var minCost = undefined;
var maxCost = undefined;

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_COST)
    {
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_COST){
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_REL){
        result = array.sort(function(a, b) {
            if (a.soldCount > b.soldCount){ return -1; }
            if (a.soldCount < b.soldCount){ return 1; }
            return 0;
        });
    }

    return result;
}

function showProductsList(array){

    let htmlContentToAppend = "";
    for(let i = 0; i < array.length; i++){
        let product = array[i];

        if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) &&
            ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost))){

            htmlContentToAppend += `
            <a href="product-info.html" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1"><b>`+ product.name +`</b></h4>
                            <small class="text-muted">` + product.soldCount + ` vendidos</small>
                        </div>
                        <h4 class="mb-1">`+ product.currency +` `+ product.cost +`</h4>
                        <p class="mb-1">` + product.description + `</p>
                    </div>
                </div>
            </a>
            `
        }

        document.getElementById("products-cat-list-container").innerHTML = htmlContentToAppend;
    }
}   

document.addEventListener("DOMContentLoaded", function(e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if(resultObj.status === 'ok'){
            productsArray = resultObj.data;

            productsArray = sortProducts(ORDER_ASC_BY_COST, productsArray);
            filteredArray = productsArray;
            showProductsList(productsArray);
        }
    });

    

    const searchBar = document.getElementById('searchBar');
    searchBar.onkeyup = () => {
        let searchString = searchBar.value.toLowerCase();
        filteredArray = productsArray.filter(item => {
            return item.name.toLowerCase().indexOf(searchString) > -1 || item.description.toLowerCase().indexOf(searchString) > -1;
        });
        showProductsList(filteredArray);
        
    };

    document.getElementById('sortCostAsc').addEventListener('click', function(){
       let tempArray = sortProducts(ORDER_ASC_BY_COST, filteredArray);

        showProductsList(tempArray);
    });

    document.getElementById('sortCostDesc').addEventListener('click', function(){
       let tempArray = sortProducts(ORDER_DESC_BY_COST, filteredArray);

        showProductsList(tempArray);
    });

    document.getElementById('sortByRel').addEventListener('click', function(){
        let tempArray = sortProducts(ORDER_BY_PROD_REL,filteredArray);

        showProductsList(tempArray);
    });

    document.getElementById('clearRangeFilter').addEventListener('click', function(){
        document.getElementById('rangeFilterCountMin').value = '';
        document.getElementById('rangeFilterCountMax').value = '';

        minCost = undefined;
        maxCost = undefined;

        showProductsList(productsArray);
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCost = document.getElementById("rangeFilterCountMin").value;
        maxCost = document.getElementById("rangeFilterCountMax").value;

        if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0){
            minCount = parseInt(minCost);
        }
        else{
            minCost = undefined;
        }

        if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0){
            maxCount = parseInt(maxCost);
        }
        else{
            maxCount = undefined;
        }

        showProductsList(productsArray);
    });

});