'use strict'

// creamos un servidor
var http = require('http').createServer(server),
	fs = require('fs'),
	// a la variable que requiere socket se la denomina io
	// y se ejecuta la variable que contiene el servidor
	io = require('socket.io')(http),
	conexiones = 0


function server(req,res){
	fs.readFile('index.html',(err,data) => {
		if (err) {
			// errores 500 son errores en el servidor
			res.writeHead(500,{'Content-Type' : 'text/html'})
			return res.end('<h1>Error interno del servidor</h1>')
		}
		else{
			// enviamos un ok en formato html
			res.writeHead(200,{'Content-Type' : 'text/html'})
			// devuelve los daros de index.html en formato utf-8
			return res.end(data,'utf-8')
		}
	})
}

http.listen(3000)
console.log('servidor corriendo')

// inicializamos el socket con el evento predefinido connection
// para iniciar la comunicación bidireccional
io.on('connection',(socket) => {
	// el servidor va a emitir un evento llamado o mensaje llamado hello
	// al que le pasamos un objeto javascript
	socket.emit('hello',{message : 'hola mundo socket'})

	// recibe el mensaje del cliente
	socket.on('evento emitido por el cliente',(data) => {
		console.log(data)
	})
})