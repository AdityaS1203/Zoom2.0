const socket= io.connect("/");
const videoGrid=document.getElementById("video-grid");
const myVideo= document.createElement("video");
//myVideo.muted=true;
myVideo.play();
myVideo.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});


var peer=new Peer(undefined,{
  path:"/peerjs",
  host:'/',
  port:'3000'
});

let myVideoStream

navigator.mediaDevices.getUserMedia({
  video:true,
  audio:true
}).then(stream=>{
  myVideoStream=stream;
  addVideoStream(myVideo,stream);

  peer.on('call',call=>{
    call.answer(stream)
    const video=document.createElement('video')
    call.on('stream',userVideoStream=>{
      addVideoStream(video,userVideoStream)
    })
  })

  socket.on("user-connected",(userId)=>{
    connectToNewUser(userId,stream);
  })
  let text=$('input')

  $('html').keydown((e) =>{
    if(e.which == 13 && text.val().length !==0){
      console.log(text.val());
      socket.emit('message',text.val());
      text.val('')
    }
  });

  socket.on('createMessage',message =>{
    //console.log("create message ",message);
    $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`)
    scrollToBottom();
  })
})

peer.on('open',id=>{
  socket.emit("join-room",ROOM_ID,id);
})


const connectToNewUser=(userId,stream)=>{
  const call=peer.call(userId,stream)
  const video=document.createElement('video')
  call.on('stream',userVideoStream=>{
    addVideoStream(video,userVideoStream)
  })
  // console.log(userId);
}


const addVideoStream=(video,stream)=>{
  video.srcObject = stream;
  video.addEventListener("loadmetadata",()=>{
    video.play();
   });
  videoGrid.append(video);
};
//it will keep scrolling to bottom everytime
const scrollToBottom = ()=>{
  var d=$('.main__chat__window');
  d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () => {
  console.log('object')
  let enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    setMuteButton();
  }
}
const setMuteButton=()=>{
  const html=`
  <i class="fa-solid fa-microphone"></i>
  <span>Mute</span>
  `
  document.querySelector(".main_mute_button").innerHTML=html;
}

const setUnmuteButton=()=>{
  const html=`
  <i class="unmute fa-solid fa-microphone-slash"></i>
  <span>Unmute</span>
  `
  document.querySelector(".main_mute_button").innerHTML=html;
}




const playStop = () => {
  console.log('object')
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    myVideoStream.getVideoTracks()[0].enabled = true;
    setStopVideo();
  }
}
const setStopVideo=()=>{
  const html=`
  <i class=" fa-solid fa-video"></i>
  <span>Stop Video</span>
  `
  document.querySelector(".main_video_button").innerHTML=html;
}
const setPlayVideo=()=>{
  const html=`
  <i class="stopVideo fa-solid fa-video-slash"></i>
  <span>Play Video</span>
  `
  document.querySelector(".main_video_button").innerHTML=html;
}
