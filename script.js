var board = ChessBoard('#board1', {
  draggable: true,  // Habilitar piezas arrastrables
  dropOffBoard: 'trash',  // Las piezas fuera del tablero irán a la "basura"
  sparePieces: true  // Mostrar piezas de repuesto
});

// Iniciar el tablero con las piezas en su posición inicial
board.position('start');