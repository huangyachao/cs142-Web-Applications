"use strict";

function cs142MakeMultiFilter(originalArray) {
  const currentArray = [...originalArray];
  function arrayFilterer(filterCriteria, callback) {
    if (typeof filterCriteria === "function") {
      for (let i = 0; i < currentArray.length; ++i) {
        if (!filterCriteria(currentArray[i])) {
          currentArray.splice(i, 1);
        }
      }
    } else {
      return currentArray;
    }
    if (typeof callback === "function") {
      callback.call(originalArray, currentArray);
    }
    return arrayFilterer;
  }
  return arrayFilterer;
}
