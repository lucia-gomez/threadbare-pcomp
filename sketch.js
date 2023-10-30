let rows = [];
let isDrawing = true;
let isLocked = false;
let prevMouseY = 0;

let HEIGHT, WIDTH;

function genRow(r, numSegments = numSegmentsSlider.value()) {
	const row = [];
	let prev = null;
	for (let c = 0; c <= numSegments; c++) {
		const newSegment = new Segment(r, c, prev);
		row.push(newSegment);
		prev = newSegment;
	}
	return row;
}

function resetDrawing() {
	background(color(colorPickerBg.value()));
	rows = [];
	for (let r = 0; r < numRowsSlider.value(); r++) {
		rows[r] = genRow(r);
	}
}

function setup() {
	HEIGHT = document.body.clientHeight;
	WIDTH = document.body.clientWidth;

	const canvas = createCanvas(WIDTH, HEIGHT);
	createControls();
	strokeWeight(strokeWeightSlider.value());
	noFill();
	resetDrawing();

	canvas.mousePressed(canvasMousePressed);
	canvas.mouseReleased(canvasMouseReleased);
	canvas.touchStarted(saveTouch);

	// can draw under the menu nub, but not the expanded menu
	const menuElement = select("#menu");
	menuElement.mouseOver(() => {
		isDrawing = !menuOpen;
	});
	menuElement.mouseOut(() => {
		isDrawing = true;
	});
}

function draw() {
	background(color(colorPickerBg.value()));
	strokeWeight(strokeWeightSlider.value());

	const distortion = distortionSlider.value() / 100;
	updateRows();
	updateSegments();

	let newHasDrawn = false;
	let prevRows = JSON.stringify(rows);
	rows.forEach((row) => {
		row.slice(1).forEach((segment) => {
			if (isDrawing && !isLocked && segment.isTouching(mouseX, mouseY)) {
				let yDiff = prevMouseY - mouseY;
				newHasDrawn = yDiff !== 0;
				segment.move(-1 * yDiff * distortion);
			}
			segment.draw();
		});
	});

	if (geometryCheckbox.checked()) {
		rows.forEach((row) => {
			row.slice(1).forEach((segment) => segment.drawGeometry());
		});
	}

	prevMouseY = mouseY;
	if (!isTouchScreen() && !hasDrawn && newHasDrawn) {
		saveState(prevRows);
	}
	hasDrawn = newHasDrawn;
}

function updateRows() {
	const newNumRows = numRowsSlider.value();
	if (newNumRows === rows.length) {
		return;
	}

	if (newNumRows < rows.length) {
		rows = rows.slice(0, newNumRows);
	} else {
		for (let r = rows.length; r < newNumRows; r++) {
			rows[r] = genRow(r);
		}
	}
	rows.forEach((row) => row.forEach((segment) => segment.updateRow()));
}

function updateSegments() {
	const newNumSegments = numSegmentsSlider.value();
	if (newNumSegments === rows[0].length - 1) {
		return;
	}

	for (let r = 0; r < rows.length; r++) {
		let row = rows[r];
		if (newNumSegments < row.length - 1) {
			rows[r] = row.slice(0, newNumSegments + 1);
		} else {
			for (let c = row.length; c <= newNumSegments; c++) {
				let newSegment = new Segment(r, c, row[row.length - 1]);
				row.push(newSegment);
			}
		}
		rows[r].forEach((segment) => segment.updateCol());
	}
}

function isTouchScreen() {
	return (
		"ontouchstart" in window ||
		navigator.maxTouchPoints > 0 ||
		navigator.msMaxTouchPoints > 0
	);
}

function canvasMousePressed() {
	if (!isTouchScreen()) isDrawing = false;
}

function canvasMouseReleased() {
	if (!isTouchScreen()) isDrawing = true;
}
