//Url de donde cogemos los 50 gatos
var urlGatos = "https://api.thecatapi.com/v1/images/search?api_key=44cffd46-cdad-4e2a-85b0-07ccb3e0d953&limit=50&category_ids=";

//Url de donde cojemos las categorias
var urlCategorias = "https://my-json-server.typicode.com/javiercrm/CategoriasGatos/Categorias/";

//Pagina actual
var page = 1;

//Categoria Actual
var categoria = document.getElementById('opciones').value;

//Total de imagenes por pagina
var totalPerPage = document.getElementById('tamPagina').value;

//Primera imagen a mostrar
var inicio = (page-1) * totalPerPage;

//Numero total de paginas
var totalPage = Math.ceil(50 / totalPerPage);

//Evento onchange de los dos select
document.getElementById('SeleccionCategoria').onchange = cambiarCategoria;
document.getElementById('tamPagina').onchange = cambiarTamPorPagina;

//Añadimos la paginacion
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

    TotalPaginas.textContent = page + " / " + totalPage;
    TotalPaginas.id = 'titlePaginas';
    divCentrado.appendChild(TotalPaginas);

    divCentrado.appendChild(divPagination);


    if (page == 1) {

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
        
    } else if (page == totalPage) {

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

//Quitamos la caja de paginacion
function limpiarPagination() {
    if (document.getElementById('center') != null) {
       document.getElementById('center').remove();
    }
    
}

//Quitamos las fotos de la pagina
function limpiarFotos() {
    if (document.getElementById('photos') != null) {
        document.getElementById('photos').remove(); 
     }
}

//Cambiamos la categoria
function cambiarCategoria() {
    page = 1;
    inicio = (page-1) * totalPerPage;
    categoria = document.getElementById('opciones').value;
    limpiarFotos();
    limpiarPagination();
    mostrarGatos();
    anadirPagination();
    eventoClick();
}

//Cambiar el total de imagenes por pagina
function cambiarTamPorPagina() {
    page = 1;
    totalPerPage = document.getElementById('tamPagina').value;
    totalPage = Math.ceil(50 / totalPerPage);
    limpiarFotos();
    limpiarPagination();
    mostrarGatos();
    anadirPagination();
    eventoClick();
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
            } else {
                reject(xhr.status);
            }
        };

        xhr.send();

    });
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

    obtenerDatos(urlGatos+categoria).then(function(array) {

        totalPage = Math.ceil(array.length / totalPerPage);
        document.getElementById('titlePaginas').textContent = page + " / " + Math.ceil(array.length / totalPerPage);

        if (array.length == 0) {
            limpiarPagination();
            let div = document.getElementById('photos');
            let error = document.createElement('H1');
            error.textContent = 'No Se han encontrado Imagenes en esta categoria';
            div.appendChild(error);
        } else {
            document.getElementById('titlePaginas').textContent = page + " / " + Math.ceil(array.length / totalPerPage);
            array.forEach(function(currentValue, index, array){
    
                if (parseInt(index) >= parseInt(inicio) && parseInt(index) < parseInt(inicio)+parseInt(totalPerPage)) {
                    let div = document.getElementById('photos');
                    let li = document.createElement('LI');
                    let img = document.createElement('IMG');
        
                    li.setAttribute('class', 'grid-25 tablet-grid-50');
        
                    img.setAttribute('class', 'image');
                    img.setAttribute('src', currentValue.url);
        
                    li.appendChild(img);
                    div.appendChild(li);
                }
        
            });
        }
        
        
    }, function(status) {
    alert('Algo fue mal.');
    });
    
}

//Evento al hacer click en la paginacion
function eventoClick(){
    document.getElementById('pagination').addEventListener('click', (event) =>{
        page = parseInt(event.target.id);
        inicio = (page-1) * totalPerPage;
        limpiarPagination();
        limpiarFotos();
        mostrarGatos();
        anadirPagination();
        eventoClick();
        
    });
}

//Iniciamos la muesta de Imagenes, paginacion y categorias al iniciar la pagina
mostrarCategorias();
mostrarGatos();
anadirPagination();
eventoClick();
