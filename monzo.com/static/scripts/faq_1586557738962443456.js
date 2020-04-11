$(function() {
  var grid = $(".grid");
  var gridBoxes = grid.children(".gridBox");
  var gridWidth = grid.width();
  var activeGridBoxIndex;
  function shaveAllGridText() {
    $(".gridBox .gridText .excerpt").shave(65);
  }
  function refreshGridBox() {
    var gridWidth = grid.width;
    var tmpActiveGridBoxIndex = activeGridBoxIndex;
    closeGridBox();
    openGridBox(tmpActiveGridBoxIndex);
  }
  function closeGridBox() {
    $(gridBoxes[activeGridBoxIndex]).removeClass("active");
    $(".expandedGridBox").remove();
    activeGridBoxIndex = null;
  }
  function trunc(val) {
    return val < 0 ? Math.ceil(val) : Math.floor(val);
  }
  function openGridBox(index) {
    var gridWidth = grid.width();
    var rowSize = gridWidth === 972 ? 3 : gridWidth === 648 ? 2 : 1;
    var row = trunc(index / rowSize);
    var rowLastElem =
      gridBoxes[row * rowSize + rowSize - 1] || gridBoxes.last();
    closeGridBox();
    $(gridBoxes[index]).addClass("active");
    activeGridBoxIndex = index;
    var expandedElem = $(gridBoxes[index])
      .clone()
      .removeClass("gridBox active")
      .addClass("expandedGridBox");
    expandedElem.find(".excerpt").unshave();
    $(rowLastElem).after(expandedElem);
  }
  gridBoxes.on("click", function(event) {
    var element = $(event.currentTarget);
    var elemIndex = gridBoxes.index(element);
    if (elemIndex === activeGridBoxIndex) closeGridBox(elemIndex);
    else openGridBox(elemIndex);
  });
  $(window).on("resize", function() {
    if (grid.width() !== gridWidth) {
      gridWidth = grid.width();
      refreshGridBox();
      shaveAllGridText();
    }
  });
  shaveAllGridText();
});
