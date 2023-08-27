addEventListener("message", event => {
    // data should be in form [mousex, mousey, [[satx, saty, id]...]]
    let data = event.data
    findNearestId(data)
  })
  
  function findNearestId(data) {
    let min = Number.MAX_VALUE;
    let id = 0
    data[2].forEach(pos => {
        d2 = dist2(data[0], data[1], pos[0], pos[1]);
        if (d2 < min) {
            min = d2
            id = pos[2]
        }
    })
    postMessage(id);
    close()
  }

  function dist2(x1, y1, x2, y2) {
    return Math.pow(x2-x1, 2) + Math.pow(y2 - y1, 2);
  }