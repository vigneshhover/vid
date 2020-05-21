let Peer = require('simple-peer')

let socket = io()

const video = document.querySelector('video')

let client = {}

let currentFilter

let userId = new Date().getUTCMilliseconds();

let userType = ''

let MediaStream;

/**

 *

 * Get User type

*/

document.getElementById('userTypeSubmit').onclick = function() {

    userType = JSON.parse(sessionStorage.getItem("UserDetails")).ugroup;
    userId = JSON.parse(sessionStorage.getItem("UserDetails")).userid;
    console.log(`UserType:: ${userType} and UserId: ${userId}`);
    if (userType == 'client') {

        remoteVideo('client')

    }

    socket.emit('connectUser', userId);


    showUserId(userId)

};



/**

 * User List

*/

socket.on('userList', function(userList) {

    if (userType == 'client') {

        for (let id of userList) {

            if (userId != id) {

                var btn = document.createElement("BUTTON");

                btn.innerHTML = `Request Consultation`;

                btn.className = "btn btn-primary";

                btn.onclick = function() {

                    if (userType == 'client' && userId != id) {

                        // request to doctor

                        let obj = {

                            doctorId: id,

                            clientId: userId

                        }

                        socket.emit('requestToDoctor', obj);

                    } else if (userType == 'client' && userId != id) {

                        alert("Please choose doctor")

                    } else {

                        alert("Not Allowed")

                    }

                    // MakePeerUser(id)


                };

                document.getElementById("requestButton").append(btn);

            }

        }

    }


})


function showUserId(userId) {

    var btn = document.createElement("H3");

    btn.innerHTML = userId;

    document.getElementById("showUserId").appendChild(btn);

}


// /**

//  * requestFromClient

// */

// socket.on('requestFromClient', function (userList) {

//   if(userType == 'doctor' && userId == userList.doctorId){

//     var btn = document.createElement("BUTTON");

//     btn.innerHTML = 'accept from'+userList.clientId;

//     btn.onclick = function () {

//       // socket.emit('requestAccept', userList);

//     }

//     document.getElementById("user-list").appendChild(btn);

//   }

// })


/**

 * local video strem

*/

function localSteam() {

    navigator.mediaDevices

        .getUserMedia({ video: true, audio: true })

    .then(stream => {

        video.srcObject = stream

        video.play()

    })

    .catch(err => document.write(err))

}


/**

 * requestFromClient

*/

socket.on('requestFromClient', function(userList) {

    if (userType == 'doctor' && userId == userList.doctorId) {

        var btn = document.createElement("BUTTON");

        btn.innerHTML = 'accept from' + userList.clientId;

        btn.onclick = function() {

            remoteVideo('doctor', userList)

            remoteSteamDisconnet()


        }

        document.getElementById("user-list").appendChild(btn);

    }

})


function remoteSteamDisconnet() {

    var btn = document.createElement("BUTTON");

    btn.innerHTML = 'disconnet';

    btn.onclick = function() {

        RemovePeer();

    };

    document.getElementById("disconnet").appendChild(btn);

}



function RemovePeer() {

    // document.getElementById("peerVideo").remove();

    //   var videoElement = document.getElementById('peerVideo');


    // videoElement.removeAttribute('src'); // empty source

    // document.getElementById("peerVideo").style.display = "none";


    document.getElementById("peerVideo").remove();

    document.getElementById("muteText").remove();

    //   document.getElementById("peerDiv").style.display = "none";

    // const tracks = stream.getTracks();


    MediaStream.forEach(function(track) {

        track.stop();

    });



    if (client.peer) {

        client.peer.destroy()

    }

}


/**

 * Remote video

*/

function remoteVideo(type, connectedUser) {

    navigator.mediaDevices

        .getUserMedia({ video: true, audio: true })

    .then(stream => {

        video.srcObject = stream

        video.play()


        MediaStream = stream.getTracks(); // create the stream tracker


        if (type == 'doctor') {

            MakePeerUser(connectedUser)

        }

        //for peer of type init (MakePeerUser by doctor)

        function MakePeerUser(connectionData) {

            client.gotAnswer = false

            let peer = InitPeer('init')

            peer.on('signal', function(data) {

                if (!client.gotAnswer) {

                    socket.emit('doctorAccepted', data, connectionData)

                }

            })

            client.peer = peer

        }



        //used to initialize a peer

        function InitPeer(type) {

            let peer = new Peer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false })

            peer.on('stream', function(stream) {

                CreateVideo(stream)

            })


            return peer

        }


        function CreateVideo(stream) {

            CreateDiv()

            let video = document.createElement('video')

            video.id = 'peerVideo'

            video.srcObject = stream

            video.setAttribute('class', 'embed-responsive-item')


            document.querySelector('#peerDiv').appendChild(video)



            video.play()



            video.addEventListener('click', () => {

                if (video.volume != 0)

                    video.volume = 0

                else

                    video.volume = 1

            })

        }



        /**

         * show doctorScreen on client side

        */

        socket.on('doctorScreen', function(doctorStream, connectionData) {

            let peer = InitPeer('notInit');

            peer.on('signal', (data) => {

                socket.emit('clientSharing', data, connectionData)

            })

            peer.signal(doctorStream)

            client.peer = peer

        })



        /**

         * show clientScreen on doctor side

        */

        socket.on('clientScreen', function(clientStream, connectionData) {

            client.gotAnswer = true;

            let peer = client.peer

            peer.signal(clientStream)

        })


    })

    .catch(err => {

        document.write(err)

    })

}


function CreateDiv() {

    let div = document.createElement('div')

    div.setAttribute('class', "centered")

    div.id = "muteText"

    div.innerHTML = "Click to Mute/Unmute"

    document.querySelector('#peerDiv').appendChild(div)

}
