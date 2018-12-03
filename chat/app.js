// archivo del lado del servidor
'use strict'

var express = require('express'),
	// inicializamos nuestra aplicación express
	app = express(),
	// para levantar el servidor, y la aplicación de express
	http = require('http').createServer(app),
	io = require('socket.io')(http),
	// asignamos de manera formal el puerto de la aplicación
 	// va a ser igual al puerto que me envíe el proceso
	port = process.env.PORT || 3000,
	// definimos al directorio público
	publicDir = express.static(`${__dirname}/public`)

app
	.use(publicDir)
	// definimos la ruta home
	.get('/', (req, res) => {
		res.sendFile(`${publicDir}/index.html`)
	})

http.listen(port, () => {
	console.log('Iniciando servidor:%d', port)
})

io.on('connection', (socket) => {
	// definimos un evento para que, cuando se conecta un usuario, todos los demás reciban el mensaje de usuario nuevo 
	socket.broadcast.emit('new user', {message : 'Ha entrado un usuario al Chat'})

	socket.on('new message', (message) => {
		// cuando un usuario envía un mensaje, lo tienen que recibir todos
 		// envía el objeto completo, que es el valor del input
		io.emit('user says', message)
	})

	//
	socket.on('disconnect', () => {
		console.log('Ha salido un usuario del Chat')
		socket.broadcast.emit('bye bye user', {message : 'Ha salido un usuario del Chat'})
	})
})