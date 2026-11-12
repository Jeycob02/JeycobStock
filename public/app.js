
console.log('JeycobStock está funcionando');

// Consultar productos
async function cargarProductos() {

    const lista = document.getElementById('lista-productos');

    try {
        const respuesta = await fetch('/api/productos');

        if (!respuesta.ok) {
            throw new Error('No se pudieron consultar los productos');
        }

        const productos = await respuesta.json();

        console.log('Productos recibidos:', productos);
        console.log('Cantidad de productos:', productos.length);

        // Mostrar cantidad de productos
        const totalProductos = document.getElementById('total-productos');
        totalProductos.textContent = productos.length;

        lista.innerHTML = '';

        productos.forEach((producto) => {

            const tarjeta = document.createElement('article');
            tarjeta.classList.add('tarjeta');

            const nombre = document.createElement('h3');
            nombre.textContent = producto.nombre;

            const codigo = document.createElement('p');
            codigo.textContent = 'Código: ' + producto.codigo_producto;

            const precio = document.createElement('p');
            precio.textContent = 'Precio de venta: $' + producto.precio_venta;


tarjeta.appendChild(nombre);
tarjeta.appendChild(codigo);
tarjeta.appendChild(precio);

// Botón para eliminar
const botonEliminar = document.createElement('button');
botonEliminar.textContent = 'Eliminar';

botonEliminar.addEventListener('click', async () => {
    const confirmar = confirm('¿Seguro que deseas eliminar este producto?');

    if (!confirmar) return;

    try {
        const respuesta = await fetch('/api/productos/' + producto.id, {
            method: 'DELETE'
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje);
        }

        alert(resultado.mensaje);
        cargarProductos();

    } catch (error) {
        alert(error.message);
    }
});

tarjeta.appendChild(botonEliminar);
lista.appendChild(tarjeta);

        });

        if (productos.length === 0) {
            lista.textContent = 'No hay productos registrados.';
        }

    } catch (error) {
        console.error('Error:', error.message);
        lista.textContent = 'No fue posible cargar los productos.';
    }
}


// Registrar productos
const formulario = document.getElementById('formulario-producto');

formulario.addEventListener('submit', async (evento) => {

    evento.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const codigo_producto = document.getElementById('codigo_producto').value;
    const precio_venta = document.getElementById('precio_venta').value;

    try {

        const respuesta = await fetch('/api/productos', {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                nombre: nombre,
                codigo_producto: codigo_producto,
                precio_venta: precio_venta
            })

        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje);
        }

        alert('Producto registrado correctamente');

        formulario.reset();

        cargarProductos();

    } catch (error) {

        console.error('Error:', error.message);

        alert('No fue posible registrar el producto: ' + error.message);

    }

});



cargarProductos();
