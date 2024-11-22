var game = new Chess();
var board = null;
var $status = $('#status');
var $fen = $('#fen');
var $pgn = $('#pgn');

// Carga de Stockfish
var stockfish = new Worker('js/stockfish.js');

// Manejo de mensajes desde Stockfish
stockfish.onmessage = function (e) {
  console.log('Stockfish dice:', e.data);
  if (e.data.startsWith('bestmove')) {
    var bestMove = e.data.split(' ')[1];
    game.move({ from: bestMove.slice(0, 2), to: bestMove.slice(2, 4), promotion: 'q' });
    board.position(game.fen());
    updateStatus();
  }
};

function onDragStart(source, piece) {
  if (game.game_over()) return false;
  if ((game.turn() === 'w' && piece.startsWith('b')) || (game.turn() === 'b' && piece.startsWith('w'))) {
    return false;
  }
}

function onDrop(source, target) {
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q'
  });

  if (move === null) return 'snapback';

  updateStatus();

  stockfish.postMessage('position fen ' + game.fen());
  stockfish.postMessage('go depth 15');
}

function onSnapEnd() {
  board.position(game.fen());
}

function updateStatus() {
  var status = '';
  var moveColor = game.turn() === 'b' ? 'Black' : 'White';

  if (game.in_checkmate()) {
    status = `Game over, ${moveColor} is in checkmate.`;
  } else if (game.in_draw()) {
    status = 'Game over, drawn position.';
  } else {
    status = `${moveColor} to move`;
    if (game.in_check()) status += `, ${moveColor} is in check.`;
  }

  $status.html(status);
  $fen.html(game.fen());
  $pgn.html(game.pgn());
}

var config = {
  draggable: true,
  position: 'start',
  onDragStart: onDragStart,
  onDrop: onDrop,
  onSnapEnd: onSnapEnd,
  pieceTheme: 'img/chesspieces/wikipedia/{piece}.png'
};

board = Chessboard('board', config);
updateStatus();
