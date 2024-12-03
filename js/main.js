import { TiendaWayuu } from './tienda.js';
import { productos } from './productos.js';

document.addEventListener("DOMContentLoaded", () => {
    const tienda = new TiendaWayuu(productos);
    tienda.inicializar();
});

// Funciones globales para compatibilidad con HTML
window.mostrarCarrito = () => {
    const tienda = window.tiendaWayuu;
    if (tienda) tienda.mostrarCarrito();
};

window.mostrarListaDeseos = () => {
    const tienda = window.tiendaWayuu;
    if (tienda) tienda.mostrarListaDeseos();
};

window.cerrarModal = (modalId) => {
    const tienda = window.tiendaWayuu;
    if (tienda) tienda.cerrarModal(modalId);
};
