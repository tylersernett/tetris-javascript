# tetris-javascript

## issues

### pieces clipping when rotating

solution: copy vertical/horizontal collision check idea
 - create copy of tetromino
 - rotate it into potential new position
 - check if it actually fits
 - if so, tell original piece to rotate
 - else, do not allow rotation

 ### original line clear algo only checked consecutive lines
 #### but you could have a gap!

 solution:
 - check lines individually
 - if line needs clear, zero out array, then unshift it up to top of gameboard
 - then redraw gameboard


 ### Key 'hold' not registered

 solution: 
 - use game loop

 issue: keys are rapid-firing
 solution: frameCount