const cards             = document.getElementById('cards')
const items             = document.getElementById('items')
const footer            = document.getElementById('footer')
const templateCard      = document.getElementById('template-card').content
const templateFooter    = document.getElementById('template-footer').content
const templateCarrito   = document.getElementById('template-carrito').content
const fragmento         = document.createDocumentFragment()

//------------- Se crea el objeto carrito vacio
let carrito = {}

//-------------
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
})

//-------------
cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})
//------------agregar los datos con json
const fetchData = async () => {
    try{
        const res = await fetch('api.json')
        const data = await res.json()
        //console.log(data)
        mostrarProductos(data)
    }catch (error) {
        console.log(error)
    }
}
//----------------------- Mostrar productos
    const mostrarProductos = data => {
        data.forEach(producto => {
            templateCard.querySelector('h5').textContent = producto.title
            templateCard.querySelector('p').textContent = producto.precio
            templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
            templateCard.querySelector('.btn-dark').dataset.id = producto.id
            const clone = templateCard.cloneNode(true)
            fragmento.appendChild(clone)
        });
        cards.appendChild(fragmento)
    }

    //----------------Dar salida al carrito

    const addCarrito = e => {
        //console.log(e.target)
        //   //-------- al hacer click solo seleccionara el boton
        // console.log(e.target.classlist.contains('btn-dark'))

        if (e.target.classList.contains('btn-dark')){
            setCarrito(e.target.parentElement)
        }
        e.stopPropagation()
    }
    
    const setCarrito = objeto =>{
        //console.log(objeto)
        const producto ={
            id: objeto.querySelector('.btn-dark').dataset.id,
            //para acceder a cada uno de los atributos de la tarjeta
            title: objeto.querySelector('h5').textContent,
            precio: objeto.querySelector('p').textContent, //probar-ver detalles
            cantidad: 1
        }
        // si existe el registro en el id
        if(carrito.hasOwnProperty(producto.id)){ //entonces
            producto.cantidad = carrito[producto.id].cantidad + 1
        }
        //agregamos producto al carrito ... spread operator
        carrito[producto.id] = {...producto}
        mostrarCarrito()

        //console.log(carrito)
    }
    const mostrarCarrito = () => {
        //console.log(carrito)
        //reset items cada vez que se compre
        items.innerHTML=''
        Object.values(carrito).forEach(producto => {
            templateCarrito.querySelector('th').textContent = producto.id
            templateCarrito.querySelectorAll('td')[0].textContent = producto.title
            templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
            templateCarrito.querySelector('.btn-info').dataset.id = producto.id
            templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
            templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

            const cloneProducto = templateCarrito.cloneNode(true)
            fragmento.appendChild(cloneProducto)
        })
        items.appendChild(fragmento)

        mostrarFooter()
    }//--------------------------------
    const mostrarFooter = () => {
        footer.innerHTML = ''
        if(Object.keys(carrito).lenght === 0) {
            footer.innerHTML = `
            <th scope="row" colspan"5">Carrito vacío - comience a comprar!</th>
            `
            return
        }
        const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
        const nPrecio   =Object.values(carrito).reduce((acc, {cantidad,precio}) => acc + cantidad * precio ,0)
        //console.log(nPrecio) // comprobacion por consola
        //ahora la salida sera por HTML
        templateFooter.querySelectorAll('td')[0].textContent = nCantidad
        templateFooter.querySelector('span').textContent = nPrecio //span contiente el precio

        const clone = templateFooter.cloneNode(true)
        fragmento.appendChild(clone)
        footer.appendChild(fragmento)

        const btnVaciar = document.getElementById('vaciar-carrito')
        btnVaciar.addEventListener('click', () => {
            carrito = {}
            mostrarCarrito()
        })
    }

    const btnAccion = e => {
        console.log(e.target)
        //Si contiene en la lista de clases btn-info ..aumentar
        if(e.target.classList.contains('btn-info')){
            console.log(carrito[e.target.dataset.id])
            //carrito[e.target.dataset.id]

            const producto = carrito [e.target.dataset.id]
            //prodcuto.cantidad = carrito[e.target.dataset.id] cantidad  + 1
            producto.cantidad++
            carrito[e.target.dataset.id] = {...producto}
            mostrarCarrito()
        }

        //si contiene en la lista de clase btn-info ..aumentar
        if(e.target.classList.contains('btn-danger')){
            const producto = carrito [e.target.dataset.id]
            //producto.cantidad = carrito[e.target.dataset.id].cantidad - 1
            producto.cantidad--
            if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
            mostrarCarrito()
            }else{
            carrito[e.target.dataset.id] = {...producto}
            }
            mostrarCarrito()
        }

        e.stopPropagation()
    }