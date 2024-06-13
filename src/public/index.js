const socket = io()

let username = null

if (!username) {
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
  action.innerHTML = ''
  const chatRender = data.map((msg) => {
    return `<p><strong>${msg.username}</strong>: ${msg.message}</p>`
  }).join(' ')

  output.innerHTML = chatRender
})

socket.on('newUser', (username) => {
  Toastify({
    text: `${username} is loged in`,
    duration: 3000
  }).showToast()
})

message.addEventListener('keypress', () => {
  socket.emit('chat:typing', username)
})

socket.on('chat:typing', (data) => {
  action.innerHTML = `<p><strong>${data} is writing a message...</strong></p>`
})
