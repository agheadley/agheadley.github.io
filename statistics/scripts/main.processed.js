main();

function main() {
  var stats = new Stats();
  var t = stats.tValue([10, 14, 12, 8, 6, 11, 18, 14, null]);
  console.log(t);
}