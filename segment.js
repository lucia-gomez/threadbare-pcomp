class Segment {
	constructor(row, col, prev) {
		this.row = row;
		this.col = col;
		this.prev = prev; // null if initial point in row
		this.originalY = this.calculateRow();

		this.x = this.calculateCol();
		this.y = this.originalY;
		this.offsetY = 0;
	}

	static fromJSON({ col, offsetY, originalY, row, x, y }, prev) {
		const s = new Segment(row, col, prev);
		s.x = x;
		s.y = y;
		s.offsetY = offsetY;
		s.originalY = originalY;
		return s;
	}

	calculateRow() {
		return (HEIGHT / numRowsSlider.value()) * (0.5 + this.row);
	}

	calculateCol() {
		return (WIDTH / numSegmentsSlider.value()) * this.col;
	}

	updateRow() {
		this.originalY = this.calculateRow();
		this.move(0);
	}

	updateCol() {
		this.x = this.calculateCol();
	}

	draw() {
		if (this.prev == null) return;

		const strokeColor = lerpColor(
			color(colorPickerStart.value()),
			color(colorPickerEnd.value()),
			this.row / numRowsSlider.value()
		);
		stroke(strokeColor);
		line(this.prev.x, this.prev.y, this.x, this.y);
	}

	drawGeometry() {
		strokeWeight(1);
		stroke(document.documentElement.style.getPropertyValue("--text") + "99");
		line(this.prev.x, this.prev.y, this.x, this.y);
		if (this.col < numSegmentsSlider.value()) {
			circle(this.x, this.y, 5);
		}
		strokeWeight(strokeWeightSlider.value());
	}

	move(y) {
		const newY = this.originalY + this.offsetY + y;
		if (abs(this.originalY - newY) > 100) return;
		if (y !== 0 && this.col === numSegmentsSlider.value()) return;

		this.offsetY += y;
		this.y = newY;
	}

	isTouching(mouseX, mouseY) {
		const cursorSize = cursorSizeSlider.value() / 100;
		return (
			dist(mouseX, mouseY, this.x, this.y) <=
			(WIDTH * cursorSize) / numSegmentsSlider.value()
		);
	}
}
