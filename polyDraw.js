import { fabric } from "fabric";

export default class PolyDraw {
    canvas = null;
    isDrawMode = false;
    isDragging = false;
    lines = [];
    points = [];
    polygons = [];
    polygonPoints = [];

    constructor(canvasId) {
        this.initCanvas(canvasId);
        this.bindEvents();
    }

    initCanvas(canvasId) {
        this.canvas = new fabric.Canvas(canvasId, {
            backgroundColor: '#fff',
            width: 600,
            height: 800,
        });
        fabric.Image.fromURL('/wall.jpeg', (img) => {
            this.canvas.setBackgroundImage(img, () => this.canvas.renderAll(), {
                scaleX: this.canvas.width / img.width,
                scaleY: this.canvas.height / img.height,
            });
        });
    }

    bindEvents() {
        this.canvas.on('mouse:wheel', (options) => this.onMouseWheel(options));
        this.canvas.on('mouse:down', (options) => this.onMouseDown(options));
        this.canvas.on('mouse:move', (options) => this.onMouseMove(options));
        this.canvas.on('mouse:up', (options) => this.onMouseUp(options));

        document.addEventListener('keydown', (e) => {
            if (e.key === 'd') {
                this.toggleDrawMode();
            }
            if (e.key === 'Backspace' || e.key === 'Delete') {
                this.removeActiveObject();
            }
        });
    }

    onMouseWheel(options) {
        const delta = options.e.deltaY;
        const zoomStep = 0.2;
        let zoom = this.canvas.getZoom();

        if (delta < 0) {
            zoom += zoomStep;
        } else {
            if (zoom > 1) {
                zoom -= zoomStep;
            }
        }

        this.canvas.zoomToPoint(options.pointer, zoom);
    }

    onMouseDown(options) {
        if (this.isDrawMode) {
            if (this.isStartPoint(options.target)) {
                this.createPolygon();
            } else {
                this.createPolygonPoint(options);
            }
        }

        if (options.e.altKey) {
            this.isDragging = true;
            this.canvas.selection = false;
            this.canvas.lastPosX = options.e.clientX;
            this.canvas.lastPosY = options.e.clientY;
        };
    }

    onMouseMove(options) {
        const pointer = options.absolutePointer;
        if (this.isDrawMode) {
            const linesLength = this.lines.length;
            if (linesLength > 0) {
                const activeLine = this.lines[linesLength - 1];
                activeLine.set({
                    x2: pointer.x,
                    y2: pointer.y,
                });
                this.canvas.renderAll();
            }
        }

        if (this.isDragging) {
            var e = options.e;
            var vpt = this.canvas.viewportTransform;
            vpt[4] += e.clientX - this.canvas.lastPosX;
            vpt[5] += e.clientY - this.canvas.lastPosY;
            this.canvas.requestRenderAll();
            this.canvas.lastPosX = e.clientX;
            this.canvas.lastPosY = e.clientY;
        }
    }

    onMouseUp() {
        this.isDragging = false;
        if (!this.isDrawMode) {
            this.canvas.selection = true;
        }
    }

    createPolygon() {
        const polygon = new fabric.Polygon(this.polygonPoints, {
            opacity: 0.3,
            fill: '#fff',
            stroke: '#000',
        });

        this.polygons.push(polygon);
        this.canvas.add(polygon);

        this.onPolygonCreated();
    }

    onPolygonCreated() {
        this.points.forEach((point) => this.canvas.remove(point));
        this.lines.forEach((line) => this.canvas.remove(line));

        this.points = [];
        this.lines = [];
        this.polygonPoints = [];
        this.toggleDrawMode();
    }

    createPolygonPoint(options) {
        const pointer = options.absolutePointer;
        const isFirstPoint = this.polygonPoints.length == 0;
        const point = new fabric.Circle({
            id: Math.floor(Math.random() * 10000),
            radius: 2,
            fill: isFirstPoint ? 'red' : '#fff',
            stroke: '#333',
            left: pointer.x,
            top: pointer.y,
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: isFirstPoint,
        });

        this.points.push(point);
        this.polygonPoints.push(pointer);

        this.createPolygonLine(options);
        this.canvas.add(point);
    }

    createPolygonLine(options) {
        const pointer = options.absolutePointer;
        const line = new fabric.Line([
            pointer.x, 
            pointer.y,
            pointer.x, 
            pointer.y,
        ], {
            stroke: '#333',
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
        });
        
        this.lines.push(line);
        this.canvas.add(line);
    }

    isStartPoint(point) {
        if (!this.polygonPoints.length) {
            return false;
        }

        return point?.id === this.points[0]?.id;
    }

    toggleDrawMode() {
        this.isDrawMode = !this.isDrawMode;
        this.canvas.selection = !this.canvas.selection;

        this.canvas.defaultCursor = this.isDrawMode ? 'crosshair' : 'default';

        this.polygons.forEach((polygon) => {
            polygon.selectable = !this.isDrawMode;
            polygon.hasControls = !this.isDrawMode;
            polygon.evented = !this.isDrawMode;
        });
    }

    removeActiveObject() {
        const activeObject = this.canvas.getActiveObject();
        this.canvas.remove(activeObject);
        this.polygons.splice(this.polygons.indexOf(activeObject), 1);
    }
}