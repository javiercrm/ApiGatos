//Url de donde cogemos los 50 gatos
var urlGatos;

//Url de donde cojemos las categorias
var urlCategorias = "https://my-json-server.typicode.com/javiercrm/CategoriasGatos/Categorias/";

//Pagina actual
var page;

//Categoria
var Categoria;

//Numero total de paginas
var totalPage;

//Fotos por paginas
var totalPerPage;

//Evento onchange de los dos select
document.getElementById('SeleccionCategoria').onchange = cambiarCategoria;
document.getElementById('tamPagina').onchange = cambiarTamPorPagina;


//ObtenerTotalGatos
function totalGatos() {
    obtenerDatos("https://api.thecatapi.com/v1/images/search?limit=50&category_ids="+categoria+"&order=Desc&api_key=22216bca-bbcc-4a82-aa98-39dc74e7a458").then(function(array) {
    
        mostrarGatos();
        anadirPagination();
        eventoClick();
        
    }, function(status) {
    alert('Algo fue mal.');
    });
}

//Obtenemos datos mediante una promesa
function obtenerDatos(url) {
    return new Promise(function(resolve, reject) {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'json';
        xhr.onload = function() {

            if (xhr.status == 200) {
                resolve(xhr.response);
                if (url.indexOf('api.thecatapi.com') != -1) {
                    if(xhr.getResponseHeader("Pagination-Count") > 0){
                            if(xhr.getResponseHeader("Pagination-Count") > 50){
                                totalPage = Math.ceil((50 / totalPerPage));
                            } else {
                                totalPage = Math.ceil(((xhr.getResponseHeader("Pagination-Count")) / totalPerPage));
                            }
                    } else {
                        totalPage = 0;
                    }
                }
                
            } else {
                reject(xhr.status);
            }
        };

        xhr.send();

    });
}

function updateUrl(totalPerPages, pages, categorias) {
    let aux = totalPerPages;
    if (totalPage === pages) {
        totalPerPages = parseInt((50 - (totalPerPages*(pages-1))));
    }
    if (totalPerPages > totalPerPage) {
        totalPerPages = totalPerPage;
    }
    urlGatos = "https://api.thecatapi.com/v1/images/search?limit="+totalPerPages+"&page=" + (pages-1) + "&category_ids="+categorias+"&order=Desc&api_key=22216bca-bbcc-4a82-aa98-39dc74e7a458";
    page = parseInt(pages);
    totalPerPage = parseInt(aux);
    categoria = parseInt(categorias);
}

function cambiarCategoria() {
    categoria = document.getElementById('opciones').value;
    updateUrl(totalPerPage, 1, categoria);
    limpiarFotos();
    limpiarPagination();
    totalGatos();
}

//Cambiar el total de imagenes por pagina
function cambiarTamPorPagina() {
    totalPerPage = document.getElementById('tamPagina').value;
    updateUrl(totalPerPage, 1, categoria);
    limpiarFotos();
    limpiarPagination();
    totalGatos();
}

function limpiarFotos() {
    if (document.getElementById('photos') != null) {
        document.getElementById('photos').remove(); 
     }
}

function limpiarPagination() {
    if (document.getElementById('center') != null) {
       document.getElementById('center').remove();
    }
    
}

//Mostramos el select de categorias
function mostrarCategorias(){
    obtenerDatos(urlCategorias).then(function(array) {
        array.forEach(function (currentValue, index, array) {
            let despegable = document.getElementById('opciones');
            let opcion = document.createElement('OPTION');

            opcion.value = currentValue.id;
            opcion.textContent = currentValue.name;

            despegable.appendChild(opcion);
        });        
        
    }, function(status) {
    alert('Algo fue mal.');
    });
}

//Mostarmos las imagenes
function mostrarGatos() {

    obtenerDatos(urlGatos).then(function(array) {

        document.getElementById('titlePaginas').textContent = page + " / " + totalPage;

        if (totalPage == 0) {
            limpiarPagination();
            let div = document.getElementById('photos');
            let error = document.createElement('H1');
            error.textContent = 'No Se han encontrado Imagenes en esta categoria';
            div.appendChild(error);
        } else {
            array.forEach(function(currentValue, index, array){
                
                    let div = document.getElementById('photos');
                    let li = document.createElement('LI');
                    let img = document.createElement('IMG');
        
                    li.setAttribute('class', 'grid-25 tablet-grid-50');
        
                    img.setAttribute('class', 'image');
                    img.setAttribute('src', currentValue.url);
        
                    li.appendChild(img);
                    div.appendChild(li);
        
            });
        }
        
        
    }, function(status) {
    alert('Algo fue mal.');
    });
    
}

function anadirPagination() {

    let caja = document.getElementById('contained');
    let cajaPadre = document.getElementById('grid-100');
    let divCentrado = document.createElement('DIV');
    let divPagination = document.createElement('DIV');
    let TotalPaginas = document.createElement('H2');

    let fotos = document.createElement('UL');
    fotos.id = 'photos';

    caja.appendChild(fotos);

    divCentrado.setAttribute('id', 'center');
    divPagination.setAttribute('id', 'pagination');

    cajaPadre.appendChild(divCentrado);

    //TotalPaginas.textContent = page + " / " + totalPage;
    TotalPaginas.id = 'titlePaginas';
    divCentrado.appendChild(TotalPaginas);

    divCentrado.appendChild(divPagination);


    if (page === 1) {

        for (let i = 0; i < 3; i++) {
            
            let button = document.createElement('BUTTON');
            button.id = (page + i);
            button.textContent = (page + i);
            if ((page+i) == page ) {
                button.setAttribute('class', 'active');
            }
            divPagination.appendChild(button);
            
        }

        let button = document.createElement('BUTTON');
        button.id = (page+1);
        button.textContent = '>';
        divPagination.appendChild(button);

        let buttondos = document.createElement('BUTTON');
        buttondos.id = totalPage;
        buttondos.textContent = '>>';
        divPagination.appendChild(buttondos);

        
    } else if (page === totalPage) {

        let pos = totalPage - 2;

        let button = document.createElement('BUTTON');
        button.id = (page-1);
        button.textContent = '<';
        divPagination.appendChild(button);

        let button2 = document.createElement('BUTTON');
        button2.id = '1';
        button2.textContent = '<<';
        divPagination.appendChild(button2);

        for (let i = 0; i < 3; i++) {
            
            let button = document.createElement('BUTTON');
            button.id = pos;
            button.textContent = pos;
            if (pos == page ) {
                button.setAttribute('class', 'active');
            }
            divPagination.appendChild(button);
            pos++;
            
        }
        
    } else {

        let pos = page - 1;

        let button2 = document.createElement('BUTTON');
        button2.id = '1';
        button2.textContent = '<<';
        divPagination.appendChild(button2);

        let button = document.createElement('BUTTON');
        button.id = (page-1);
        button.textContent = '<';
        divPagination.appendChild(button);

        for (let i = 0; i < 3; i++) {
            
            let button = document.createElement('BUTTON');
            button.id = pos;
            button.textContent = pos;
            if (pos == page ) {
                button.setAttribute('class', 'active');
            }
            divPagination.appendChild(button);
            pos++;
            
        }

        button = document.createElement('BUTTON');
        button.id = (page+1);
        button.textContent = '>';
        divPagination.appendChild(button);

        button2 = document.createElement('BUTTON');
        button2.id = totalPage;
        button2.textContent = '>>';
        divPagination.appendChild(button2);
        
    }
    
}

//Evento al hacer click en la paginacion
function eventoClick(){
    document.getElementById('pagination').addEventListener('click', (event) =>{
        updateUrl(totalPerPage, parseInt(event.target.id), categoria);
        limpiarPagination();
        limpiarFotos();
        mostrarGatos();
        anadirPagination();
        eventoClick();
        
    });
}

updateUrl(5, 1, 5);
mostrarCategorias();
totalGatos();
