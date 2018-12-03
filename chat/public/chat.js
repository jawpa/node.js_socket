// archivo del lado del cliente

// función autoejecutable anónima
// en el primer paréntesis tenemos una función
// el segundo implica la ejecución de esa función
// ventajas:
// se aisla y es independiente de los scripts invocados en el index
// puedo determinar a que le doy acceso de lo de afuera (en este caso, le paso el documento de la página, el objeto io y el objeto jQuery)
// en la función le puedo poner otros nombres: mantenemos io, cambiamos jQuery por $ y d por document
(function (d, io, $){
	'use strict'

	var io = io()
	// le paso el evento
	$('#chat-form').on('submit', function (e){
		// desactivamos la función por default del formularios, para que no se procese
		e.preventDefault()
		// emitimos un mensaje nuevo, que será el input del formulario
		io.emit( 'new message', $('#message-text').val() )
		// lo ponemos en cero
		$('#message-text').val(null)
		return false
	})

	// capturamos al evento nuevo usuario proveniente del servidor
 	// y creamos un alerta
	io.on('new user', function (newUser){
		alert(newUser.message)
	})

	// capturamos al evento "user says" del servidor
 	// este recibe el input del cliente y lo escribimos en la página de inicio
	io.on('user says', function (userSays){
		$('#chat').append('<li>' + userSays + '</li>')
	})

	// cuando socket.io escuche al evento bye bye user ejecuta la función anónima
	io.on('bye bye user', function (byeByeUser){
		alert(byeByeUser.message)
	})
})(document, io, jQuery)