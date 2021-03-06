// calculates offsets relative to document
// add as many offsets you need
function calculateOffsets(el) {
  const absoluteOffsetTop = el.getBoundingClientRect().top;
  let top = 0;

  top = window.pageYOffset > absoluteOffsetTop ?
    window.pageYOffset + absoluteOffsetTop : window.pageYOffset + Math.abs(absoluteOffsetTop);

  return {
    top
  };
}

function scrollDocument (el, offsets, cutOffsets) {
  const scrollTop = window.pageYOffset;
  const elemHeight = el.getBoundingClientRect().height;
  const cutTopPoint = cutOffsets.cutTopOffsets.top;
  const cutBottomPoint = cutOffsets.cutBottomOffsets.top - elemHeight;

  el.classList.toggle('is-fixed', scrollTop >= cutTopPoint && scrollTop <= cutBottomPoint);
  el.classList.toggle('-bottom', scrollTop > cutBottomPoint);
}

export { calculateOffsets, scrollDocument };
