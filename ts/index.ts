import express from 'express';
const router = express.Router();
import { Productos } from './Productos';

const PORT = '8080'
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

const consolas = new Productos();

app.use('/api/productos', router);

app.use('/',express.static(__dirname + '/public'));


app.get('/api', (req, res) => {
    res.send('Punto de entrada de la aplicación');
});

router.get('/list', async(req, res) => {
    try {
        await res.render('index.pug',{
            products: consolas.getProductos()
        });
    }catch(err) {
        console.log(err)
    }
});

router.get('/', (req, res) => {
    try{
        if(consolas.getProductos().length > 0) res.json(consolas.getProductos());
        else res.json({msg: 'No hay productos'});
    }catch(err){
        console.log(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = await req.params.id;
        const producto = consolas.findProducto(parseInt(id));
        if(!producto) res.json({error: 'Producto no encontrado'})
        else res.json(producto);
    }catch(err) {
        console.log(err);
    }
    
});

function validar (req:any, res:any, next:any):void {
    if(req.body.title === '' 
    || req.body.price === '' 
    || req.body.thumbnail === '') {
        res.send('No se completaron todos los campos del formulario');
        
    } else {
        req.body.price = parseInt(req.body.price);
        next();
    }
}

app.post('/producto', validar , async (req, res) => {
    try {
        const producto = await req.body;
        consolas.setProductos(producto);
        res.writeHead(301,
            {Location: 'http://localhost:8080/'});
        res.end();
    }catch(err) {
        console.log(err)
    }   
})


router.put('/:id', async (req, res) => {
    try {
        const id = parseInt(await req.params.id);
        const producto = consolas.findProducto(id);
        if(!producto) res.sendStatus(404);
        else {
            const productoUpdated = {
                id: id,
                title: req.body.title,
                price: req.body.price,
                thumbnail: req.body.thumbnail
            }
            consolas.updateProducto(productoUpdated);
            res.json({
                "title": req.body.title,
                "price": req.body.price,
                "thumbnail": req.body.thumbnail,
                "id": id
            });
        }
    }catch(err) {
        console.log(err)
    }
})

router.delete('/:id', async(req, res) => {
    try {
        const id = await req.params.id;
        const producto = consolas.findProducto(parseInt(id));
        if(!producto) res.sendStatus(404);
        else {
            consolas.deleteProducto(parseInt(id));
            res.json({
                message: 'Producto eliminado',
                producto: producto});
        } 
    }catch(err) {
        console.log(err);
    }
})

app
    .listen(PORT, () => console.log('Server listening in port ', PORT))
    .on("error", (err) => console.log(`Se ha producido el siguiente error: ${err}`));