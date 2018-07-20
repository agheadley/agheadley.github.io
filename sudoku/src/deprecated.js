/* https://stackoverflow.com/questions/294250/how-do-i-retrieve-an-html-elements-actual-width-and-height */
let getBoundingRect = elID => {
  let element = document.getElementById(elID);
  let positionInfo = element.getBoundingClientRect();
  return {
    width: Math.round(positionInfo.width),
    height: Math.round(positionInfo.height)
  };
};
