import { Game } from "./game";
import "./style.css";

const canvas = document.querySelector("canvas");

const WIDTH = 1024;
const HEIGHT = 768;

canvas.width = WIDTH;
canvas.height = HEIGHT;

const game = new Game({
  canvas,
});

game.startGame();

window.game = game;
