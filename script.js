// Get DOM elements
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const peerIdInput = document.getElementById('peerIdInput');
const callButton = document.getElementById('callButton');
const endCallButton = document.getElementById('endCallButton');
const peerIdDisplay = document.createElement('p'); // Create a paragraph to display Peer ID

// Add the Peer ID display to the page
document.body.appendChild(peerIdDisplay);

let localStream;
let peer;
let currentCall;

// Function to initialize PeerJS with a custom ID
const initializePeer = (customId) => {
    peer = new Peer(customId); // Use the custom ID

    peer.on('open', (id) => {
        console.log('My peer ID is: ' + id);
        peerIdDisplay.textContent = 'Your Peer ID: ' + id; // Display Peer ID on the page
    });

    peer.on('call', (call) => {
        // Answer the call and send local stream
        call.answer(localStream);
        call.on('stream', (remoteStream) => {
            remoteVideo.srcObject = remoteStream;
        });
        currentCall = call;
    });
};

// Get local video stream
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then((stream) => {
        localVideo.srcObject = stream;
        localStream = stream;

        // Prompt the user for a custom Peer ID
        const customId = prompt('Enter a custom Peer ID (e.g., your name):');
        if (customId) {
            initializePeer(customId); // Initialize PeerJS with the custom ID
        } else {
            alert('Peer ID is required. Please refresh the page and try again.');
        }
    })
    .catch((error) => {
        console.error('Error accessing media devices:', error);
    });

// Call another peer
callButton.addEventListener('click', () => {
    const peerId = peerIdInput.value;
    if (!peerId) return alert('Please enter a Peer ID');
    const call = peer.call(peerId, localStream);
    call.on('stream', (remoteStream) => {
        remoteVideo.srcObject = remoteStream;
    });
    currentCall = call;
});

// End the call
endCallButton.addEventListener('click', () => {
    if (currentCall) {
        currentCall.close();
        remoteVideo.srcObject = null;
    }
});