# tetris-javascript

issue: pieces clipping when rotating

solution: copy vertical/horizontal collision check idea
 - create copy of tetromino
 - rotate it into potential new position
 - check if it actually fits
 - if so, tell original piece to rotate
 - else, do not allow rotation