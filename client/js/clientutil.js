
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

function G_FindIndex(arr, id) {
  var len = arr.length;

  while (len--) {
      if (arr[len].id === id) {
          return len;
      }
  }

  return -1;
}