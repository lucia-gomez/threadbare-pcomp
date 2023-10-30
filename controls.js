let distortionSlider;
let numRowsSlider;
let numSegmentsSlider;
let strokeWeightSlider;

let colorPickerStart;
let colorPickerEnd;
let colorPickerBg;

let geometryCheckbox;

let resetButton;
let menuOpen = false;

function keyTyped() {
	if (key === "s" || key === "S") {
		save();
	} else if (key === "x" || key === "X") {
		resetDrawing();
	} else if (key === "h" || key === "H") {
		toggleMenu();
	} else if (key === "l" || key === "L") {
		toggleLock();
	} else if (key === "z" || key === "Z") {
		undo();
	}
	return false;
}

function toggleMenu() {
	const menu = document.getElementById("menu");
	if (!menuOpen) {
		menu.style.width = "250px";
		menu.style.height = "310px";
	} else {
		menu.style.width = "";
		menu.style.height = "";
	}
	menuOpen = !menuOpen;
}

function save() {
	saveCanvas("png");
}

function toggleLock() {
	const lockIcon = document.getElementById("lock-icon");
	lockIcon.className = isLocked ? "fas fa-unlock" : "fas fa-lock";
	isLocked = !isLocked;
}

function createControls() {
	createSliders();
	createColorPickers();
	createCheckboxes();
}

function appendSlider(label, min, max, value) {
	const controlMenu = document.getElementById("controls");
	const sliderRow = document.createElement("div");
	sliderRow.className = "control-row";

	const labelTag = document.createElement("label");
	labelTag.setAttribute("for", label);
	labelTag.innerText = label;
	sliderRow.appendChild(labelTag);

	const slider = createSlider(min, max, value);
	slider.elt.name = label;
	sliderRow.appendChild(slider.elt);

	controlMenu.appendChild(sliderRow);
	return slider;
}

function createSliders() {
	numRowsSlider = appendSlider("Rows", 1, 100, 50);
	strokeWeightSlider = appendSlider("Thickness", 1, 6, 4);
	numSegmentsSlider = appendSlider("Detail", 2, 50, 20);
	distortionSlider = appendSlider("Amplitude", 5, 100, 50);
	cursorSizeSlider = appendSlider("Cursor", 50, 200, 50);
}

function createColorPickers() {
	const controlMenu = document.getElementById("color-controls");

	colorPickerStart = createColorPicker("#902EBD");
	controlMenu.appendChild(colorPickerStart.elt);
	colorPickerStart.elt.oninput = (e) => {
		document.documentElement.style.setProperty("--color1", e.target.value);
	};

	colorPickerEnd = createColorPicker("#BA7E17");
	controlMenu.appendChild(colorPickerEnd.elt);

	colorPickerBg = createColorPicker("#133949");
	controlMenu.appendChild(colorPickerBg.elt);
	colorPickerBg.elt.oninput = (e) => {
		const newTextColor = getTextColor(e.target.value);
		document.documentElement.style.setProperty("--text", newTextColor);
		document.documentElement.style.setProperty("--bg", e.target.value);
	};
}

// https://stackoverflow.com/a/12043228
function getTextColor(bgColor) {
	var c = bgColor.substring(1); // strip #
	var rgb = parseInt(c, 16); // convert rrggbb to decimal
	var r = (rgb >> 16) & 0xff; // extract red
	var g = (rgb >> 8) & 0xff; // extract green
	var b = (rgb >> 0) & 0xff; // extract blue

	var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
	return luma > 170 ? "#00000099" : "#ffffff99";
}

function createCheckboxes() {
	const controlMenu = document.getElementById("checkbox-controls");
	const checkboxRow = document.createElement("div");
	checkboxRow.className = "control-row";

	const labelTag = document.createElement("label");
	labelTag.setAttribute("for", "geometry");
	labelTag.innerText = "Show Geometry";
	checkboxRow.appendChild(labelTag);

	geometryCheckbox = createCheckbox(false);
	geometryCheckbox.elt.name = "geometry";
	checkboxRow.appendChild(geometryCheckbox.elt);

	controlMenu.appendChild(checkboxRow);
}
