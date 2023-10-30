let prevStates = [];
let hasDrawn = false;

// touch screen - save every touch gesture
function saveTouch() {
	prevStates.push(JSON.stringify(rows));
}

// desktop - save every second
const saveState = _.throttle((prevRows) => {
	if (prevRows !== prevStates[prevStates.length - 1]) {
		prevStates.push(prevRows);
	}
}, 1000);

function parseJSON(state) {
	return JSON.parse(state).map((row) => {
		let prev = null;
		return row.map((segment) => {
			let newSegment = Segment.fromJSON(segment, prev);
			prev = newSegment;
			return newSegment;
		});
	});
}

function undo() {
	if (prevStates.length > 0) {
		rows = parseJSON(prevStates.pop());
	}
}
