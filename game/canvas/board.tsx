import { generateBoard } from '../util/boardGen.ts';
import { Coord } from '../models.ts';
import { adjustSelection } from '../util/boxUtil.ts';

export class Board {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private left: number;
  private top: number;
  // private lastOver: { x: number; y: number } | null = null;
  private selected: Coord[] | null = null;
  private letters = generateBoard();

  constructor(canvas: HTMLCanvasElement) {
    console.log('init board');

    this.ctx = canvas.getContext('2d')!;
    this.width = canvas.width;
    this.height = canvas.height;
    this.left = canvas.offsetLeft + canvas.clientLeft;
    this.top = canvas.offsetTop + canvas.clientTop;

    canvas.addEventListener('mousedown', (e) => {
      const ex = e.x - this.left;
      const ey = e.y - this.top;
      // find box
      const x = Math.floor((ex - 5) / 50);
      const y = Math.floor((ey - 5) / 50);
      this.selected = [{ x, y }];
      console.log('down', x, y);
      this.draw();
    });

    canvas.addEventListener('mousemove', (e) => {

      if (this.selected && this.selected.length > 0) {
        const ex = e.x - this.left;
        const ey = e.y - this.top;
        const x = Math.floor(ex / 50);
        const y = Math.floor(ey / 50);
        const paddingX = ex % 50;
        if (paddingX < 5 || paddingX > 45) return;
        const paddingY = ey % 50;
        if (paddingY < 5 || paddingY > 45) return;
        this.selected = adjustSelection(this.selected, { x, y });

        // const x = Math.floor((ex - 5) / 50);
        // const y = Math.floor((ey - 5) / 50);
        // if (x !== this.selected.at(-1)!.x || y !== this.selected.at(-1)!.y) {
        //   this.selected.push({ x, y });
        //   console.log('over', x, y);
        //   this.draw();
        // }
        this.draw();
      }
    });

    canvas.addEventListener('mouseup', (e) => {
      this.selected = null;
      this.draw();
    });
  }

  draw() {
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.letters.forEach((row, i) => {
      row.forEach((letter, j) => {
        if (this.selected && this.selected.some(({ x, y }) => x === i && y === j)) {
          this.ctx.fillStyle = '#444';
        } else {
          this.ctx.fillStyle = '#222';
        }
        this.ctx.beginPath();
        this.ctx.roundRect(5 + i * 50, 5 + j * 50, 40, 40, 8);
        this.ctx.fill();

        this.ctx.font = '24px sans-serif';
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = 'white';
        this.ctx.fillText(letter, 25 + i * 50, 25 + j * 50);
      });
    });
  }
}
