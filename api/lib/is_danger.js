const danger_list = [
    "truck",
    "human"
]

module.exports = (text) => {
  var strText = new String(text);
  danger_list.forEach(
    item => {
      if(new String(item) == strText){ return true; }
    })
    return false;
}
