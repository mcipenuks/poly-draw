import { useEffect } from 'react'
import PolyDraw from './lib/polyDraw';
import './App.css'

function App() {
    let polyDraw;

    function onToggleDraw() {
        polyDraw.toggleDrawMode();
    }

    function onExport() {
        polyDraw.exportPolygonPoints();
    };

    function onImport() {
        const points = JSON.parse(`[
        [
            {
            "x": 329.05408480408494,
            "y": 244.3261193570791
            },
            {
            "x": 316.55408480408494,
            "y": 259.0761193570791
            },
            {
            "x": 329.05408480408494,
            "y": 289.0761193570791
            },
            {
            "x": 351.55408480408494,
            "y": 276.0761193570791
            },
            {
            "x": 343.55408480408494,
            "y": 256.8261193570791
            }
        ],
        [
            {
            "x": 371.80408480408494,
            "y": 227.5761193570791
            },
            {
            "x": 352.80408480408494,
            "y": 255.0761193570791
            },
            {
            "x": 396.05408480408494,
            "y": 252.8261193570791
            }
        ],
        [
            {
            "x": 350.05408480408494,
            "y": 322.0761193570791
            },
            {
            "x": 361.30408480408494,
            "y": 298.8261193570791
            },
            {
            "x": 397.05408480408494,
            "y": 307.3261193570791
            },
            {
            "x": 366.30408480408494,
            "y": 309.5761193570791
            },
            {
            "x": 362.05408480408494,
            "y": 326.0761193570791
            }
        ]
        ]`);

        polyDraw.importPolygons(points);
    };

    useEffect(() => {
        polyDraw = new PolyDraw('c');
    });

    return (
        <>
            <div className="parent">
                <div>
                    <canvas id="c"></canvas>
                </div>
                <div className="controls">
                    <button id="drawToggle" onClick={onToggleDraw}>Toggle Draw Mode</button>
                    <button id="export" onClick={onExport}>Export</button>
                    <button id="import" onClick={onImport}>Import</button>
                </div>
            </div>
        </>
    )
}

export default App;
