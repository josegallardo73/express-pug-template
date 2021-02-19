interface Producto  {
    title: string;
    price: number;
    thumbnail: string;
    id: number;
}

export class Productos {
    
    productos:Producto[];

    constructor() {
        this.productos = [];
    }
    setId = (newProducto:Producto) => {
        if(this.getProductos().length === 0) {
            newProducto.id = 1;
        } else {
            const max = Math.max(...this.getProductos().map(producto => producto.id),0);
            newProducto.id = max + 1;
        }
        return newProducto;
    }
    getProductos = () => this.productos;

    setProductos = (newProducto:Producto) => {
        const producto = this.setId(newProducto)
        this.getProductos().push(producto);
    }

    updateProducto = (producto:Producto) => {
        this.getProductos().forEach(prod => {
            if(prod.id === producto.id) {
                prod.title = producto.title;
                prod.price = producto.price;
                prod.thumbnail = producto.thumbnail;
            }
        })
    }

    deleteProducto = (id:number) => this.productos = this.getProductos().filter(producto => producto.id !== id);  

    findProducto = (id:number) => this.getProductos().find(producto => producto.id === id)
}