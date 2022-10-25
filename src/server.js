import express from 'express';
import { optionsM } from '../options/SQLite3.js'
import { optionsP } from '../options/mysql.js'
import http from 'http';
const app = express();

import { Server } from 'socket.io';
import { engine } from 'express-handlebars';
import ContenedorM from './contenedorMens.js';
import ContenedorP from'./contenedorProds.js';

const server = http.createServer(app);
const io = new Server(server);

const contenedor = new ContenedorP(optionsP);
contenedor.crearTabla()
const chat = new ContenedorM(optionsM)
chat.crearTabla()


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.set('views', './views');
app.set('view engine', 'hbs');

app.engine('hbs', engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: './views/layouts',
    partialsDir: './views/partials'
}))

io.on('connection', async (socket) => {
    console.log('🟢 Usuario conectado')
    
    const productos = await contenedor.getAll();
    socket.emit('bienvenidoLista', productos )
    
    const mensajes =  await chat.getAll();
    socket.emit('listaMensajesBienvenida', mensajes)
    
    socket.on('nuevoMensaje', async (data) => {
        chat.save(data);
        
        const mensajes =  await chat.getAll();
        io.sockets.emit('listaMensajesActualizada', mensajes)
    })

    socket.on('productoAgregado', async (data) => {
        console.log('Alguien presionó el click')
        contenedor.save(data);
        
        const productos =  await contenedor.getAll();
        io.sockets.emit('listaActualizada', productos);
    })
    
    socket.on('disconnect', () => {
        console.log('🔴 Usuario desconectado')
    })
    
})


app.get('/productos', async (req, res) => {
    const productos =  await contenedor.getAll();
    res.render('pages/list', {productos})
})

app.post('/productos', async (req,res) => {
    const {body} = req;
    await contenedor.save(body);
    res.redirect('/');
})

app.get('/',  (req,res) => {
    res.render('pages/forms', {})
})


const PORT = process.env.PORT || 8080;
const srv = server.listen(PORT, () => { 
    console.log(`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', (err) => console.log(err))