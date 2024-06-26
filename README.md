# Wordle Game Clone

This project is a web-based clone of the popular word-guessing game Wordle. It's built using HTML, CSS, and JavaScript, providing an interactive and engaging word puzzle experience right in your browser.

## Features

- Daily word challenge
- On-screen keyboard for easy input
- Visual feedback on guessed letters
- Responsive design for various screen sizes, including mobile devices
- Custom styling with a dark theme

## Getting Started

### Prerequisites

- A modern web browser (e.g., Chrome, Firefox, Safari, Edge)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/TriMPham98/wordle.git
   ```
2. Navigate to the project directory:
   ```
   cd wordle
   ```
3. Open the `index.html` file in your web browser.

## How to Play

1. The game will select a random 5-letter word each day.
2. You have 6 attempts to guess the word.
3. Type your guess using the on-screen keyboard or your physical keyboard.
4. Press 'Enter' to submit your guess.
5. The game will provide feedback:
   - Green: Letter is correct and in the right position
   - Yellow: Letter is in the word but in the wrong position
   - Grey: Letter is not in the word
6. Keep guessing until you solve the word or run out of attempts!

## File Structure

- `index.html`: The main HTML file
- `styles.css`: Contains all the styling for the game
- `script.js`: The JavaScript file with game logic
- `valid-words.txt`: List of valid 5-letter words
- `common-words.txt`: List of common 5-letter words for daily challenges

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Inspired by the original Wordle game created by Josh Wardle
- Word lists sourced from [Valid Wordle Words](https://gist.github.com/dracos/dd0668f281e685bad51479e5acaadb93)

Enjoy playing Wordle!