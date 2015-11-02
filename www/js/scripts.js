
document.addEventListener("deviceready",onDeviceReady,false);

var pictureSource;
var destinationType;

function onDeviceReady() {
	pictureSource=navigator.camera.PictureSourceType;
	destinationType=navigator.camera.DestinationType;
}