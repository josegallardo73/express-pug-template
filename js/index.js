"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const Productos_1 = require("./Productos");
const PORT = '8080';
const app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
const consolas = new Productos_1.Productos();
app.use('/api/productos', router);
app.use('/', express_1.default.static(__dirname + '/public'));
app.get('/api', (req, res) => {
    res.send('Punto de entrada de la aplicación');
});
router.get('/list', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield res.render('index.pug', {
            products: consolas.getProductos()
        });
    }
    catch (err) {
        console.log(err);
    }
}));
router.get('/', (req, res) => {
    try {
        if (consolas.getProductos().length > 0)
            res.json(consolas.getProductos());
        else
            res.json({ msg: 'No hay productos' });
    }
    catch (err) {
        console.log(err);
    }
});
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield req.params.id;
        const producto = consolas.findProducto(parseInt(id));
        if (!producto)
            res.json({ error: 'Producto no encontrado' });
        else
            res.json(producto);
    }
    catch (err) {
        console.log(err);
    }
}));
function validar(req, res, next) {
    if (req.body.title === ''
        || req.body.price === ''
        || req.body.thumbnail === '') {
        res.send('No se completaron todos los campos del formulario');
    }
    else {
        req.body.price = parseInt(req.body.price);
        next();
    }
}
app.post('/producto', validar, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const producto = yield req.body;
        consolas.setProductos(producto);
        res.writeHead(301, { Location: 'http://localhost:8080/' });
        res.end();
    }
    catch (err) {
        console.log(err);
    }
}));
router.put('/productos/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(yield req.params.id);
        const producto = consolas.findProducto(id);
        if (!producto)
            res.sendStatus(404);
        else {
            const productoUpdated = {
                id: id,
                title: req.body.title,
                price: req.body.price,
                thumbnail: req.body.thumbnail
            };
            consolas.updateProducto(productoUpdated);
            res.json({
                "title": req.body.title,
                "price": req.body.price,
                "thumbnail": req.body.thumbnail,
                "id": id
            });
        }
    }
    catch (err) {
        console.log(err);
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield req.params.id;
        const producto = consolas.findProducto(parseInt(id));
        if (!producto)
            res.sendStatus(404);
        else {
            consolas.deleteProducto(parseInt(id));
            res.json({
                message: 'Producto eliminado',
                producto: producto
            });
        }
    }
    catch (err) {
        console.log(err);
    }
}));
app
    .listen(PORT, () => console.log('Server listening in port ', PORT))
    .on("error", (err) => console.log(`Se ha producido el siguiente error: ${err}`));
