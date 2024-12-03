// Datos de productos
const productos = [
    {
        id: 1,
        nombre: "Mochila Wayuu Grande",
        categoria: "mochilas",
        precio: 150000,
        stock: 1,
        imagen: "https://d2d21jw8en5l3a.cloudfront.net/vendty2_db_28302_luis2020/imagenes_productos/MOCHILA%20WAYUU%20DISE%C3%91O%2011%201.png",
        descripcion: "Mochila Wayuu tejida a mano con diseños únicos.",
        descripcionDetallada: "Cada mochila es tejida artesanalmente por las comunidades Wayuu. Ideal para uso diario o como regalo especial.",
        origen: "La Guajira, Colombia",
        tecnica: "Tejido artesanal",
    },
    {
        id: 2,
        nombre: "Ruana Artesanal",
        categoria: "ruanas",
        precio: 200000,
        stock: 5,
        imagen: "https://www.giiveaway.com/cdn/shop/files/Ruana_Ruana_Hombre_Rayas_Artesanal_Capota_Piramides_Doble_Faz_para_Hombre_Negro_Camel_Giive_-_OMA782-1_2.webp?v=1731475964&width=416",
        descripcion: "Ruana artesanal tejida con lana de alta calidad.",
        descripcionDetallada: "Esta ruana está hecha con lana natural, perfecta para días fríos. Combina tradición y estilo.",
        origen: "Boyacá, Colombia",
        tecnica: "Tejido en telar",
    },
    {
        id: 3,
        nombre: "Mochila Wayuu Mediana",
        categoria: "mochilas",
        precio: 120000,
        stock: 20,
        imagen: "https://www.aguasaladahandmade.com/pics/productos/36816334102148419707505041623444114005557248n.jpg",
        descripcion: "Mochila mediana tejida a mano con patrones coloridos.",
        descripcionDetallada: "Con diseños exclusivos de la comunidad Wayuu, esta mochila combina funcionalidad y estilo.",
        origen: "La Guajira, Colombia",
        tecnica: "Tejido artesanal",
    },
    {
        id: 4,
        nombre: "Bufanda Tejida",
        categoria: "accesorios",
        precio: 50000,
        stock: 20,
        imagen: "https://pbs.twimg.com/profile_images/677906892732018690/Ly0nGNq0_400x400.jpg",
        descripcion: "Bufanda de lana tejida a mano con diseño único.",
        descripcionDetallada: "Suave y cálida, ideal para complementar tu outfit en invierno.",
        origen: "Nariño, Colombia",
        tecnica: "Tejido a crochet",
    }
];

// Añadiendo nuevas características al script existente con soporte de localStorage

class TiendaWayuu {
    constructor() {
        this.listaDeseos = this.cargarListaDeseos();
        this.carrito = this.cargarCarrito();
        this.productos = productos;
        this.carritoModal = null;
        this.detalleModal = null;
        this.carritoCount = null;
        this.carritoTotal = null;
        this.carritoContenido = null;
        this.barraBusqueda = null;
    }

    // Métodos de gestión de localStorage
    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.carrito));
    }

    cargarCarrito() {
        const carritoGuardado = localStorage.getItem('carrito');
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }

    guardarListaDeseos() {
        localStorage.setItem('listaDeseos', JSON.stringify(this.listaDeseos));
    }

    cargarListaDeseos() {
        const listaDeseosGuardada = localStorage.getItem('listaDeseos');
        return listaDeseosGuardada ? JSON.parse(listaDeseosGuardada) : [];
    }

    mostrarCarrito() {
        if (this.carritoModal) {
            this.carritoModal.style.display = 'block';
        }
    }

    mostrarListaDeseos() {
        const listaDeseosModal = document.getElementById("modal-lista-deseos");
        if (listaDeseosModal) {
            listaDeseosModal.style.display = 'block';
        }
    }

    cerrarModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Update the existing configurarEventos method to include modal events
    configurarEventos() {
        // Existing event configurations...

        // Cart icon event
        const carritoIcon = document.getElementById("carrito-icon");
        if (carritoIcon) {
            carritoIcon.addEventListener('click', () => this.mostrarCarrito());
        }

        // Wishlist icon event
        const listaDeseosIcon = document.getElementById("lista-deseos-icon");
        if (listaDeseosIcon) {
            listaDeseosIcon.addEventListener('click', () => this.mostrarListaDeseos());
        }

        // Close modal buttons
        document.querySelectorAll('.cerrar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const modalId = e.target.closest('.modal').id;
                this.cerrarModal(modalId);
            });
        });
    }

    inicializar() {
        this.cargarElementosDOM();
        this.configurarEventos();
        this.inicializarPagina();
        this.actualizarCarritoUI();
    }

    cargarElementosDOM() {
        this.carritoModal = document.getElementById("modal-carrito");
        this.detalleModal = document.getElementById("modal-detalle");
        this.carritoCount = document.getElementById("carrito-count");
        this.carritoTotal = document.getElementById("carrito-total");
        this.carritoContenido = document.getElementById("carrito-contenido");
        this.barraBusqueda = document.getElementById("buscador");
    }

    configurarEventos() {
        document.querySelectorAll('.cerrar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const modalId = e.target.closest('.modal').id;
                this.cerrarModal(modalId);
            });
        });

        const carritoIcon = document.getElementById("carrito-icon");
        if (carritoIcon) {
            carritoIcon.addEventListener('click', () => this.mostrarCarrito());
        }

        const botonVaciarCarrito = document.getElementById("btn-vaciar-carrito");
        if (botonVaciarCarrito) {
            botonVaciarCarrito.addEventListener('click', () => this.vaciarCarrito());
        }

        if (this.barraBusqueda) {
            this.barraBusqueda.addEventListener('input', (e) => {
                const termino = e.target.value.toLowerCase();
                const resultados = this.productos.filter(producto => 
                    producto.nombre.toLowerCase().includes(termino) ||
                    producto.descripcion.toLowerCase().includes(termino)
                );
                this.renderizarProductos(resultados);
            });
        }
    }

    inicializarPagina() {
        const loader = document.getElementById("loader");
        if (loader) {
            loader.style.display = "flex";
            setTimeout(() => {
                loader.style.display = "none";
                this.cargarContenido();
            }, 3000);
        } else {
            this.cargarContenido();
        }
    }

    cargarContenido() {
        const url = window.location.pathname;

        if (url.includes("index.html") || url === "/") {
            this.cargarInicio();
        } else if (url.includes("tienda.html")) {
            this.cargarTienda();
        }

        this.configurarFiltros();
        this.configurarEventosProductos();
        this.renderizarListaDeseos();
    }

    cargarInicio() {
        this.renderizarCarrusel();
        this.renderizarProductosPromocion();
    }

    cargarTienda() {
        this.renderizarProductos(this.productos);
    }

    renderizarCarrusel() {
        const carruselContainer = document.querySelector('.carrusel-container');
        if (!carruselContainer) return;

        const productosCarrusel = this.productos.slice(0, 3);
        let indiceActual = 0;

        // Renderizar primer producto del carrusel
        carruselContainer.innerHTML = `
            <div class="carrusel-slide">
                <img src="${productosCarrusel[indiceActual].imagen}" alt="${productosCarrusel[indiceActual].nombre}">
            </div>
        `;

        setInterval(() => {
            indiceActual = (indiceActual + 1) % productosCarrusel.length;
            carruselContainer.innerHTML = `
                <div class="carrusel-slide">
                    <img src="${productosCarrusel[indiceActual].imagen}" alt="${productosCarrusel[indiceActual].nombre}">
                </div>
            `;
        }, 3000);
    }

    renderizarProductosPromocion() {
        const productosPromocion = this.productos.filter(p => p.stock <= 5).slice(0, 4);
        const seccionPromocion = document.getElementById("productos-promocion");

        if (seccionPromocion) {
            seccionPromocion.innerHTML = productosPromocion.map(producto => `
                <div class="producto producto-promocion">
                    <div class="banner-promocion">Últimas Unidades</div>
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <div class="producto-info">
                        <h3>${producto.nombre}</h3>
                        <p>${producto.descripcion}</p>
                        <p class="producto-precio">$${producto.precio.toLocaleString()} COP</p>
                        <p class="producto-stock">Stock: ${producto.stock}</p>
                        <div class="producto-acciones">
                            <button class="btn-comprar-ya" data-id="${producto.id}">Comprar ya</button>
                            <button class="btn-lista-deseos" data-id="${producto.id}">♡ Lista de Deseos</button>
                        </div>
                    </div>
                </div>
            `).join('');

            // Configurar eventos de botones de compra y lista de deseos
            document.querySelectorAll('.btn-comprar-ya').forEach(boton => {
                boton.addEventListener('click', (e) => {
                    const productoId = parseInt(e.target.dataset.id);
                    this.agregarAlCarrito(productoId);
                });
            });

            document.querySelectorAll('.btn-lista-deseos').forEach(boton => {
                boton.addEventListener('click', (e) => {
                    const productoId = parseInt(e.target.dataset.id);
                    this.toggleListaDeseos(productoId);
                });
            });
        }
    }

    renderizarProductos(productos) {
        const contenedorProductos = document.getElementById("productos") || document.getElementById("contenedor-productos");
        if (!contenedorProductos) return;

        contenedorProductos.innerHTML = productos.map(producto => `
            <div class="producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p class="producto-precio">$${producto.precio.toLocaleString()} COP</p>
                    <p class="producto-stock">Stock: ${producto.stock}</p>
                    <div class="producto-acciones">
                        <button class="btn-agregar-carrito" data-id="${producto.id}">Agregar al Carrito</button>
                        <button class="btn-lista-deseos" data-id="${producto.id}">♡ Lista de Deseos</button>
                    </div>
                </div>
            </div>
        `).join('');

        this.configurarEventosProductos();
    }

    configurarEventosProductos() {
        document.querySelectorAll('.btn-agregar-carrito').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const productoId = parseInt(e.target.dataset.id);
                this.agregarAlCarrito(productoId);
            });
        });

        document.querySelectorAll('.btn-lista-deseos').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const productoId = parseInt(e.target.dataset.id);
                this.toggleListaDeseos(productoId);
            });
        });
    }

    agregarAlCarrito(productoId) {
        const producto = this.productos.find(p => p.id === productoId);

        if (producto && producto.stock > 0) {
            const productoExistente = this.carrito.find(p => p.id === productoId);

            if (productoExistente) {
                productoExistente.cantidad++;
            } else {
                this.carrito.push({ ...producto, cantidad: 1 });
            }

            producto.stock--;
            this.guardarCarrito();
            this.actualizarCarritoUI();
            this.renderizarProductos(this.productos);
        } else {
            alert('Producto sin stock');
        }
    }

    decrementarCarrito(productoId) {
        const producto = this.carrito.find(p => p.id === productoId);

        if (producto) {
            producto.cantidad--;
            const productoOriginal = this.productos.find(p => p.id === productoId);
            if (productoOriginal) productoOriginal.stock++;

            if (producto.cantidad === 0) {
                this.carrito = this.carrito.filter(p => p.id !== productoId);
            }

            this.guardarCarrito();
            this.actualizarCarritoUI();
            this.renderizarProductos(this.productos);
        }
    }

    toggleListaDeseos(productoId) {
        const producto = this.productos.find(p => p.id === productoId);
        const indiceExistente = this.listaDeseos.findIndex(p => p.id === productoId);

        if (indiceExistente !== -1) {
            this.listaDeseos.splice(indiceExistente, 1);
        } else if (producto) {
            this.listaDeseos.push(producto);
        }

        this.guardarListaDeseos();
        this.renderizarListaDeseos();
    }

    renderizarListaDeseos() {
        const listaDeseosCont = document.getElementById("lista-deseos");
        if (listaDeseosCont) {
            listaDeseosCont.innerHTML = this.listaDeseos.map(producto => `
                <div class="producto-deseo">
                    <h4>${producto.nombre}</h4>
                    <p>$${producto.precio.toLocaleString()} COP</p>
                    <button class="btn-eliminar-deseo" data-id="${producto.id}">Eliminar</button>
                </div>
            `).join('');

            document.querySelectorAll('.btn-eliminar-deseo').forEach(boton => {
                boton.addEventListener('click', (e) => {
                    const productoId = parseInt(e.target.dataset.id);
                    this.toggleListaDeseos(productoId);
                });
            });
        }
    }

    actualizarCarritoUI() {
        this.carritoCount.textContent = this.carrito.reduce((total, p) => total + p.cantidad, 0);
        const total = this.carrito.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
        this.carritoTotal.textContent = total.toLocaleString();

        this.carritoContenido.innerHTML = this.carrito.map(producto => `
            <div class="item-carrito">
                <h4>${producto.nombre}</h4>
                <div class="control-cantidad">
                    <button class="btn-decrementar" data-id="${producto.id}">-</button>
                    <span>${producto.cantidad}</span>
                    <button class="btn-incrementar" data-id="${producto.id}">+</button>
                </div>
                <p>$${(producto.precio * producto.cantidad).toLocaleString()} COP</p>
                <button class="btn-eliminar-item" data-id="${producto.id}">🗑️</button>
            </div>
        `).join('');

        this.configurarBotonesCarrito();
    }

    configurarBotonesCarrito() {
        document.querySelectorAll('.btn-incrementar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const productoId = parseInt(e.target.dataset.id);
                this.agregarAlCarrito(productoId);
            });
        });

        document.querySelectorAll('.btn-decrementar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const productoId = parseInt(e.target.dataset.id);
                this.decrementarCarrito(productoId);
            });
        });

        document.querySelectorAll('.btn-eliminar-item').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const productoId = parseInt(e.target.dataset.id);
                this.eliminarItemCarrito(productoId);
            });
        });
    }

    eliminarItemCarrito(productoId) {
        const producto = this.carrito.find(p => p.id === productoId);
        const productoOriginal = this.productos.find(p => p.id === productoId);

        if (producto && productoOriginal) {
            productoOriginal.stock += producto.cantidad;
            this.carrito = this.carrito.filter(p => p.id !== productoId);
            this.guardarCarrito();
            this.actualizarCarritoUI();
            this.renderizarProductos(this.productos);
        }
    }

    vaciarCarrito() {
        this.carrito.forEach(item => {
            const producto = this.productos.find(p => p.id === item.id);
            if (producto) producto.stock += item.cantidad;
        });
        this.carrito = [];
        this.guardarCarrito();
        this.actualizarCarritoUI();
        this.renderizarProductos(this.productos);
    }
}

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
    const tienda = new TiendaWayuu();
    tienda.inicializar();
});

// Inicializar la aplicación
document.addEventListener("DOMContentLoaded", () => {
    const app = new TiendaWayuu();
    app.inicializar();
});

// Funciones globales para compatibilidad con HTML existente
function mostrarCarrito() {
    const app = window.tiendaWayuu || new TiendaWayuu();
    app.mostrarCarrito();
}

function cerrarModal(modalId) {
    const app = window.tiendaWayuu || new TiendaWayuu();
    app.cerrarModal(modalId);
}

