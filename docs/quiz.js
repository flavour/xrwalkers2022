// If you have another AudioContext class use that one, as some browsers have a limit
var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);

// All arguments are optional:
// - duration of the tone in milliseconds. Default is 500
// - frequency of the tone in hertz. default is 440
// - volume of the tone. Default is 1, off is 0.
// - type of tone. Possible values are sine, square, sawtooth, triangle, and custom. Default is sine.
//callback to use on end of tone
function beep(duration, frequency, volume, type, callback) {
    var oscillator = audioCtx.createOscillator();
    var gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    if (volume){gainNode.gain.value = volume;}
    if (frequency){oscillator.frequency.value = frequency;}
    if (type){oscillator.type = type;}
    if (callback){oscillator.onended = callback;}
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
};

let dingBuffer;

window.fetch('ding.mp3')
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
  .then(audioBuffer => {
    dingBuffer = audioBuffer;
  });
    
window.fetch('tada.mp3')
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
  .then(audioBuffer => {
    tadaBuffer = audioBuffer;
  });

  function play(audioBuffer) {
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioCtx.destination);
  source.start();
}

$(function() {
  $('.draggable').draggable();
  $('.droppable').droppable({
    drop: function(event, ui) {
      var walk_id = $(this).attr('id').split('-')[1];
      var img_id = ui.draggable.attr('id').split('-')[1];
      if (img_id == walk_id) {
        $(this).removeClass('na').removeClass('bad').addClass('good');
        if (($('.droppable.na').length == 0) && ($('.droppable.bad').length == 0)) {
          // Complete
          play(tadaBuffer);
        } else {
          play(dingBuffer);
        }
      } else {
        $(this).removeClass('na').removeClass('good').addClass('bad');
        beep(400, 120, 1, 'sawtooth');
      }
    }
  });
} );