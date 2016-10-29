const danger_list = [
    "truck",
    "human"
]

module.exports = (text) => {
  var isDanger = false
  danger_list.forEach(
    item => {
      if(item == text){ 
        isDanger = true;
        return;
      }
    })
    return isDanger;
}
