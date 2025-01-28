const messages = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

// Creiamo due peer: uno per l'iniziatore e uno per il ricevitore
let peer1, peer2;

// Funzione per creare un peer iniziatore
function createInitiator() {
    peer1 = new SimplePeer({ initiator: true, trickle: false });

    peer1.on('signal', data => {
        // Invia il segnale al peer2
        peer2.signal(data);
    });

    peer1.on('data', data => {
        appendMessage(`Peer 2: ${data}`);
    });
}

// Funzione per creare un peer ricevitore
function createReceiver() {
    peer2 = new SimplePeer({ trickle: false });

    peer2.on('signal', data => {
        // Invia il segnale al peer1
        peer1.signal(data);
    });

    peer2.on('data', data => {
        appendMessage(`Peer 1: ${data}`);
    });
}

// Funzione per inviare un messaggio
function sendMessage(message) {
    if (peer1 && peer2) {
        peer1.send(message);
        peer2.send(message);
        appendMessage(`Tu: ${message}`);
    }
}

// Funzione per aggiungere un messaggio alla chat
function appendMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
}

// Inizializza i peer
createInitiator();
createReceiver();

// Gestione dell'invio del messaggio
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    if (message) {
        sendMessage(message);
        messageInput.value = '';
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const message = messageInput.value;
        if (message) {
            sendMessage(message);
            messageInput.value = '';
        }
    }
});
