var KEY_ENTER = 13;
var KEY_SHIFT = 16;
var KEY_CTRL = 17;
var KEY_ALT = 18;
var KEY_SPACE = 32;
var KEY_W = 87;
var KEY_A = 65;
var KEY_C = 67;
var KEY_S = 83;
var KEY_D = 68;
var KEY_P = 80;
var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var g_mouse = {x: 400, y: 400};
var g_joy = {primary: false, secondary: false, up: 0, down:0, left:0, right:0};
var g_unit = 10; // 10 


function G_FindUser(arr, id) {
  var len = arr.length;

  while (len--) {
      if (arr[len].userData.userID === id) {
          return len;
      }
  }

  return -1;
}

function G_FindActor(arr, id) {
  var len = arr.length;

  while (len--) {
      if (arr[len].actorData.actorID === id) {
          return len;
      }
  }

  return -1;
}
