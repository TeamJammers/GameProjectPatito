generateMap = function(size) {
  let ans = [];
  for (let i = 0; i < size * size; i++) {
    ans.push(0);
  }
  const ground1 = 1,
  ground2 = 2,
  drugstore = 4,
  shop = 5,
  house1 = 3,
  house2 = 6;
  const dx = [-2, -1, 0, 1, 2, -2, -1, 0, 1, 2, -2, -1, 1, 2, -2, -1, 0, 1, 2, -2, -1, 0, 1, 2];
  const dy = [ 2,  2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, -1, -1, -1, -1, -1, -2, -2, -2, -2, -2];
  let t = 0;
  for (let i = 0; i < size; i++) {
    let drawHouse = false;
    if (i === t) {
      t += 4;
      drawHouse = true;
    }
    for (let j = 0; j < size; j++) {
      if (ans[i + j * size] || !drawHouse) {
        continue;
      }
      for (let k = j; (k < j + 5 && k < size); k++) {
        ans[i + k * size] = (parseInt(Math.random() * 2) % 2 ? house1: house2);
      }
      j += 7;
    }
  }
  ans = ans.map((ele) => {
    if (ele === house1 || ele === house2) {
      return ele;
    }
    return ground1;
  })
  return ans;
}

export default generateMap;