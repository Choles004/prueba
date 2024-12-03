import { StorageManager } from './storage.js';

export class TiendaWayuu {
    constructor(productos) {
        this.storageManager = new StorageManager();
        this.productos = productos;
        this.carrito = this.storageManager.cargarCarrito();
        this.listaDeseos = this.storageManager.cargarListaDeseos();
        this.inicializarElementosDOM();
    }

    inicializarElementosDOM() {
        this.carritoModal = document.getElementById("modal-carrito");
        this.listaDeseosModal = document.getElementById("modal-lista-deseos");
        this.carritoCount = document.getElementById("carrito-count");
        this.listaDeseosCount = document.getElementById("lista-deseos-count");
        this.carritoContenido = document.getElementById("carrito-contenido");
        this.carritoTotal = document.getElementById("carrito-total");
    }

    inicializar() {
        this.configurarEventos();
        this.actualizarUI();
        this.inicializarPagina();
    }

    configurarEventos() {
        // Configurar eventos de botones y elementos interactivos
        document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.agregarAlCarrito(id);
            });
        });

        document.querySelectorAll('.btn-lista-deseos').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.toggleListaDeseos(id);
            });
        });

        // Configurar eventos de filtros si estamos en la página de tienda
        const filtroCategorias = document.getElementById('filtro-categoria');
        if (filtroCategorias) {
            filtroCategorias.addEventListener('change', () => this.aplicarFiltros());
        }
    }

    inicializarPagina() {
        const loader = document.getElementById("loader-container");
        if (loader) {
            setTimeout(() => {
                loader.classList.add('fade-out');
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 500);
            }, 2000);
        }

        if (window.location.pathname.includes('tienda.html')) {
            this.renderizarProductos(this.productos);
        } else {
            this.renderizarCarrusel();
            this.renderizarPromociones();
        }
    }

    renderizarProductos(productos) {
        const contenedor = document.getElementById('productos');
        if (!contenedor) return;

        contenedor.innerHTML = productos.map(producto => `
            <div class="producto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p class="precio">$${producto.precio.toLocaleString()} COP</p>
                    <p class="stock">Stock: ${producto.stock}</p>
                    <div class="producto-acciones">
                        <button class="btn-agregar-carrito" data-id="${producto.id}">
                            Agregar al Carrito
                        </button>
                        <button class="btn-lista-deseos" data-id="${producto.id}">
                            ♡ Lista de Deseos
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        this.configurarEventos();
    }

    renderizarCarrusel() {
        const carrusel = document.querySelector('.carrusel-container');
        if (!carrusel) return;

        let indiceActual = 0;
        const productosDestacados = this.productos.slice(0, 3);

        const mostrarSlide = () => {
            carrusel.innerHTML = `
                <div class="carrusel-slide">
                    <img src="${productosDestacados[indiceActual].imagen}" 
                         alt="${productosDestacados[indiceActual].nombre}">
                    <div class="carrusel-info">
                        <h2>${productosDestacados[indiceActual].nombre}</h2>
                        <p>${productosDestacados[indiceActual].descripcion}</p>
                    </div>
                </div>
            `;
        };

        mostrarSlide();
        setInterval(() => {
            indiceActual = (indiceActual + 1) % productosDestacados.length;
            mostrarSlide();
        }, 5000);
    }

    renderizarPromociones() {
        const contenedor = document.getElementById('productos-promocion');
        if (!contenedor) return;

        const promociones = this.productos.filter(p => p.stock <= 5).slice(0, 4);
        contenedor.innerHTML = promociones.map(producto => `
            <div class="producto-promocion">
                <div class="banner-promocion">¡Últimas unidades!</div>
                <img src="${producto.imagen}" alt="${producto.nombre}">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p class="precio">$${producto.precio.toLocaleString()} COP</p>
                    <button class="btn-comprar-ya" data-id="${producto.id}">
                        Comprar Ahora
                    </button>
                </div>
            </div>
        `).join('');
    }

    agregarAlCarrito(productoId) {
        const producto = this.productos.find(p => p.id === productoId);
        if (!producto || producto.stock === 0) return;

        const itemCarrito = this.carrito.find(item => item.id === productoId);
        if (itemCarrito) {
            itemCarrito.cantidad++;
        } else {
            this.carrito.push({ ...producto, cantidad: 1 });
        }

        producto.stock--;
        this.storageManager.guardarCarrito(this.carrito);
        this.actualizarUI();
    }

    toggleListaDeseos(productoId) {
        const indice = this.listaDeseos.findIndex(p => p.id === productoId);
        if (indice !== -1) {
            this.listaDeseos.splice(indice, 1);
        } else {
            const producto = this.productos.find(p => p.id === productoId);
            if (producto) {
                this.listaDeseos.push(producto);
            }
        }

        this.storageManager.guardarListaDeseos(this.listaDeseos);
        this.actualizarUI();
    }

    actualizarUI() {
        // Actualizar contador del carrito
        if (this.carritoCount) {
            this.carritoCount.textContent = this.carrito.reduce((total, item) => total + item.cantidad, 0);
        }

        // Actualizar contador de lista de deseos
        if (this.listaDeseosCount) {
            this.listaDeseosCount.textContent = this.listaDeseos.length;
        }

        // Actualizar contenido del carrito
        if (this.carritoContenido) {
            this.actualizarContenidoCarrito();
        }

        // Actualizar total del carrito
        if (this.carritoTotal) {
            const total = this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
            this.carritoTotal.textContent = total.toLocaleString();
        }
    }

    actualizarContenidoCarrito() {
        this.carritoContenido.innerHTML = this.carrito.map(item => `
            <div class="item-carrito">
                <img src="${item.imagen}" alt="${item.nombre}">
                <div class="item-info">
                    <h4>${item.nombre}</h4>
                    <p>$${item.precio.toLocaleString()} COP</p>
                    <div class="cantidad-control">
                        <button class="btn-cantidad" data-id="${item.id}" data-action="decrementar">-</button>
                        <span>${item.cantidad}</span>
                        <button class="btn-cantidad" data-id="${item.id}" data-action="incrementar">+</button>
                    </div>
                </div>
                <button class="btn-eliminar" data-id="${item.id}">×</button>
            </div>
        `).join('');

        this.configurarEventosCarrito();
    }

    configurarEventosCarrito() {
        this.carritoContenido.querySelectorAll('.btn-cantidad').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                const accion = e.target.dataset.action;
                
                if (accion === 'incrementar') {
                    this.agregarAlCarrito(id);
                } else {
                    this.decrementarCarrito(id);
                }
            });
        });

        this.carritoContenido.querySelectorAll('.btn-eliminar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                this.eliminarDelCarrito(id);
            });
        });
    }

    eliminarDelCarrito(productoId) {
        const item = this.carrito.find(p => p.id === productoId);
        if (item) {
            const producto = this.productos.find(p => p.id === productoId);
            if (producto) {
                producto.stock += item.cantidad;
            }
            this.carrito = this.carrito.filter(p => p.id !== productoId);
            this.storageManager.guardarCarrito(this.carrito);
            this.actualizarUI();
        }
    }

    mostrarCarrito() {
        if (this.carritoModal) {
            this.carritoModal.style.display = 'block';
        }
    }

    mostrarListaDeseos() {
        if (this.listaDeseosModal) {
            this.listaDeseosModal.style.display = 'block';
        }
    }

    cerrarModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    }

    aplicarFiltros() {
        const categoria = document.getElementById('filtro-categoria').value;
        const precioRango = document.getElementById('filtro-precio').value;
        const disponibilidad = document.getElementById('filtro-disponibilidad').value;

        let productosFiltrados = [...this.productos];

        if (categoria) {
            productosFiltrados = productosFiltrados.filter(p => p.categoria === categoria);
        }

        if (precioRango) {
            const [min, max] = precioRango.split('-').map(Number);
            productosFiltrados = productosFiltrados.filter(p => 
                p.precio >= min && (!max || p.precio <= max)
            );
        }

        if (disponibilidad === 'disponible') {
            productosFiltrados = productosFiltrados.filter(p => p.stock > 5);
        } else if (disponibilidad === 'ultimas-unidades') {
            productosFiltrados = productosFiltrados.filter(p => p.stock <= 5 && p.stock > 0);
        }

        this.renderizarProductos(productosFiltrados);
    }
}