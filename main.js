import './style.css'
import PolyDraw from './polyDraw';

document.querySelector('#app').innerHTML = `
    <div class="parent">
        <div>
            <canvas id="c"></canvas>
        </div>
        <div class="controls">
            <button id="drawToggle">Toggle Draw Mode</button>
        </div>
    </div>
`

const polyDraw = new PolyDraw('c');

const drawToggle = document.getElementById('drawToggle');
drawToggle.addEventListener('click', () => polyDraw.toggleDrawMode());