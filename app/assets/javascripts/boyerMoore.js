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
