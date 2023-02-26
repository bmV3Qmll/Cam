(() => {
  const width = 320;
  var height = 0; // scale by width and input stream
  var streaming = false;
  var video = null;
  var btn = null;
  var canvas = null;
  var photo = null;
  
  window.addEventListener("load", () => {
    window.iOS = ['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) >= 0;
    window.isMediaStreamAPISupported = navigator && navigator.mediaDevices && 'enumerateDevices' in navigator.mediaDevices;
    window.noCameraPermission = false;
    
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    btn = document.getElementById('photo-btn');
    
    if (window.isMediaStreamAPISupported) {
      // Notify user for camera permission
      navigator.mediaDevices
        .enumerateDevices().then((devices) => {
        var device = devices.filter((dev) => {
          if (dev.kind == "videoinput") return dev;
        });
        var constraints;
        // Configure video stream
        if (device.length > 0) {
          constraints = {
            video: {
              mandatory: {
                sourceId: device[device.length - 1].deviceId ? device[device.length - 1].deviceId : null
              }
            },
            audio: false
          };
          
          if (window.iOS) {
            constraints.video.facingMode = 'environment';
          }
          
          if (!constraints.video.mandatory.sourceId && !window.iOS) constraints = {video: true};
          
          navigator.mediaDevices
            .getUserMedia(constraints)
            .then((stream) => {
            video.srcObject = stream;
            video.play();
          }).catch((err) => {
            console.error(`An error occurred: ${err}`);
          });
        }
      });
    }
    
    // Configure display frames
    video.addEventListener("canplay", () => {
      if (!streaming) {
      	height = (video.videoHeight / video.videoWidth) * width;
        video.setAttribute("width", width);
        video.setAttribute("height", height);
        canvas.setAttribute("width", width);
        canvas.setAttribute("height", height);
        streaming = true;
      }
    });
    
    // Fill the photo with an indication that none has been captured
    function clearPhoto() {
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#AAA";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      const data = canvas.toDataURL("image/png");
      photo.setAttribute("src", data);
    }
    
    btn.addEventListener("click", (ev) => {
      const ctx = canvas.getContext("2d");
      if (width && height) {
        // Capture a photo by fetching the current contents of the video and drawing it into a canvas
      	canvas.width = width;
      	canvas.height = height;
      	ctx.drawImage(video, 0, 0, width, height);
      	
      	const data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);
      } else clearPhoto();
    });
    
    clearPhoto();
  });
})();
