export class StorageManager {
    constructor() {
        this.keyCarrito = 'carrito';
        this.keyListaDeseos = 'listaDeseos';
    }

    guardarCarrito(carrito) {
        localStorage.setItem(this.keyCarrito, JSON.stringify(carrito));
    }

    cargarCarrito() {
        const carritoGuardado = localStorage.getItem(this.keyCarrito);
        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    }

    guardarListaDeseos(listaDeseos) {
        localStorage.setItem(this.keyListaDeseos, JSON.stringify(listaDeseos));
    }

    cargarListaDeseos() {
        const listaDeseosGuardada = localStorage.getItem(this.keyListaDeseos);
        return listaDeseosGuardada ? JSON.parse(listaDeseosGuardada) : [];
    }

    limpiarStorage() {
        localStorage.removeItem(this.keyCarrito);
        localStorage.removeItem(this.keyListaDeseos);
    }
}