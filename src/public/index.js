const socket = io()

let username = null

if (!username) {
  Swal.fire({
    title: 'Welcome to robochat',
    inputLabel: 'Insert your username:',
    input: 'text',
    inputPlaceholder: 'Robert',
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return 'You need to write something!'
      }
    }
  }).then((input) => {
    username = input.value
    socket.emit('newUser', username)
  })
}
