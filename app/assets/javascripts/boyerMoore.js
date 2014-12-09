// 0 1 2 3 4 5 6 7 8 9 10 11 12 13 14
// A V E S S G E R D S E  R  S  V  D
// Z Z Z Z
function badChar(pattern, word, shift) {
  var badChar, newShift;
  var badIndex = diffIndex(pattern, word, shift);
  var patternMatch = -1;

  if (badIndex === -1) return -1;

  badChar = word[badIndex + shift];
  patternMatch = pattern.slice(0, badIndex).indexOf(badChar); // 0

  if (patternMatch === -1) {
    newShift = pattern.length + shift;
  } else {
    newShift = badIndex - patternMatch + shift;
  }

  return newShift;
};

function goodSuffix(pattern, word, shift) {
  var badIndex = diffIndex(pattern, word, shift);
  var patternSuffix, unexplored, subShift, goodIndex, newShift;

  if (badIndex === -1) return -1;
  patternSuffix = pattern.slice(badIndex);
  unexplored = pattern.slice(0, badIndex);
  subShift = patternSuffix.length - unexplored.length;

  for (var i = unexplored.length - 1; i >= 0; i--) {
    if (unexplored[i] !== patternSuffix[i + subShift]) break;
    goodIndex = i;
  }

  if (goodIndex) {
    goodIndex = goodIndices.pop();
    newShift = goodIndex + shift;
  } else {
    newShift = pattern.length + shift;
  }

  return newShift;
};

function diffIndex(pattern, word, shift) {
  var badIndex = -1;

  for (var i = pattern.length - 1; i >= 0; i--) {
    if (pattern[i] !== word[i + shift]) {
      badIndex = i;
      break;
    }
  }

  return badIndex;
};

function findSuffix(unexplored, patternSuffix, shift) {
  var index, suffixIndex;

  for (var i = 0; i < unexplored.length; i++) {
    if (!index || index + 1 === patternSuffix.indexOf(unexplored[i])) {
      index = patternSuffix.indexOf(unexplored[i]);
      if (index === -1) break;
      suffixIndex = i;
    } else {
      break;
    }
  }

  if (!suffixIndex) {
    return;
  } else if (suffixIndex !== patternSuffix.length - 1) {
    findSuffix(unexplored, patternSuffix.slice(suffixIndex))
  }
}
