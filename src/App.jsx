import { useEffect } from 'react'
import PolyDraw from './lib/polyDraw';
import { polyMapping } from './lib/fakeMapping';
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
        const points = JSON.parse(polyMapping);
        console.log('p', points);
        polyDraw.importPolygons(points);
    };

    useEffect(() => {
        polyDraw = new PolyDraw('c');
        onImport();
    });

    return (
        <>
            <div>
                <canvas id="c"></canvas>
            </div>
            <div className="controls">
                <button id="drawToggle" onClick={onToggleDraw}>Toggle Draw Mode</button>
                <button id="export" onClick={onExport}>Export</button>
                <button id="import" onClick={onImport}>Import</button>
            </div>
        </>
    )
}

export default App;
