# Infinite Tetris

A browser-based Tetris-inspired game built from scratch using HTML, CSS, and JavaScript. The project focuses on understanding the core mechanics of a falling-block game, including board representation, tetrominoes, collision detection, movement, rotation, hard dropping, piece locking, and line clearing.

> **Project Status:** Core gameplay implementation in progress.

## Features

### Implemented

* 10 × 20 game board
* Seven Tetromino pieces
* Random piece generation
* Automatic piece falling
* Left and right movement
* Hard drop
* Clockwise rotation
* Counter-clockwise rotation
* Collision detection
* Piece locking
* Line clearing
* Basic game loop

### Planned

* Game-over detection
* Score tracking
* Level progression
* Increasing drop speed
* Next-piece preview
* Hold piece
* Ghost piece
* Start / pause / restart functionality
* Animations and sound effects
* Responsive/mobile controls

## Tech Stack

* HTML5
* CSS3
* JavaScript
* DOM API
* CSS Grid

No frameworks or external libraries are currently required.

## Project Structure

```text
Infinite-Tetris/
│
├── index.html
├── style.css
├── script.js
├── LICENSE
├── README.md
│
└── docs/
    ├── ARCHITECTURE.md
    ├── IMPLEMENTATION.md
    └── DEVELOPMENT-LOG.md
```

## How It Works

The game uses a 20 × 10 two-dimensional JavaScript array as the logical game board.

```text
board[row][column]
```

The board stores the current state of locked blocks, while the HTML elements are responsible only for displaying that state.

The current Tetromino is maintained separately from the board.

```text
Game State
    │
    ├── board[][]
    │
    ├── currentPiece
    │
    └── gameOver
          │
          ▼
    Game Logic
          │
          ▼
      Renderer
          │
          ▼
       DOM Grid
```

## Controls

| Key       | Action                                         |
| --------- | ---------------------------------------------- |
| `←` / `A` | Move left                                      |
| `→` / `D` | Move right                                     |
| `↑` / `W` | Rotate clockwise                               |
| `Space`   | Hard drop                                      |
| `↓` / `S` | Currently mapped to counter-clockwise rotation |

> The keyboard mapping is still being refined. See the implementation documentation for the current state.

## Running the Project

This project currently uses plain HTML, CSS, and JavaScript, so no package installation is required.

Clone the repository:

```bash
git clone <repository-url>
```

Open the project directory and launch `index.html` in a modern browser.

For development, using a local development server such as VS Code Live Server is recommended.

## Documentation

Detailed technical documentation is available in the `docs/` directory:

* [Architecture](docs/ARCHITECTURE.md)
* [Implementation Details](docs/IMPLEMENTATION.md)
* [Development Log](docs/DEVELOPMENT-LOG.md)

## Current Development Focus

The next major development tasks are:

1. Complete rotation validation.
2. Implement game-over detection.
3. Preserve Tetromino colors when pieces are locked.
4. Implement score calculation.
5. Implement level progression.
6. Implement next-piece preview.
7. Add game controls for starting, pausing, and restarting.

## Learning Goals

This project is being developed incrementally to understand:

* JavaScript game loops
* Two-dimensional arrays
* State management
* Matrix transformations
* Collision detection
* DOM rendering
* Keyboard event handling
* Algorithmic problem solving
* Separation of game logic and presentation
* Time and space complexity

## License

See [LICENSE](LICENSE).
