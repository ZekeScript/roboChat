// eslint-disable-next-line no-undef
const socket = io()

let username = null

if (!username) {
  // eslint-disable-next-line no-undef
  Swal.fire({
    title: 'Welcome to chat',
    inputLabel: 'Insert your username:',
    input: 'text',
    inputPlaceholder: 'Robert',
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return 'Your username is required'
      }
    }
  }).then((input) => {
    username = input.value
    socket.emit('newUser', username)
  })
}

const message = document.getElementById('message')
const btn = document.getElementById('send')
const output = document.getElementById('output')
const action = document.getElementById('action')

btn.addEventListener('click', () => {
  socket.emit('chat:message', {
    username,
    message: message.value
  })
  message.value = ''
})

socket.on('messages', (data) => {
  const chatRender = data.map((msg) => {
    return `<p><string>${msg.username}</strong>: ${msg.message}</p>`
  }).join(' ')

  output.innerHTML = chatRender
})
