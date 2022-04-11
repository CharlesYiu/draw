function onMove(element, action) {
    element.ontouchmove = function() { action(true) }
    element.onmousemove = function() { action(false) }
}
function onStart(element, action) {
    element.ontouchstart = function() { action(true) }
    element.onmousedown = function() { action(false) }
}
function onEnd(element, action) {
    element.ontouchend = function() { action(true) }
    element.onmouseup = function() { action(false) }
}
// Helper for add thickness, minus thickness, undo action and redo action
function holdAction(action, element) {
    let pressing = false
    onStart(element, function() {
        if (pressing) { return }
        pressing = true
        function stopAction() {
            pressing = false
            element.onmouseup = null
            element.ontouchend = null
        }
        function repeatAction() {
            if (!pressing) { return }
            action()
            setTimeout(repeatAction, 125)
        }
        onEnd(element, stopAction)
        action()
        setTimeout(function() { if (pressing) {repeatAction()} }, 1000)
    })
}
const settings = document.getElementById("settings")

// Hide and show settings
const showSettings = document.getElementById("showsettings")
showSettings.onclick = function() {
    settings.hidden = false
    showSettings.hidden = true
}
const hideSettings = document.getElementById("hidesettings")
hideSettings.onclick = function() {
    showSettings.hidden = false
    settings.hidden = true
}

// Hide and show advanced settings
const advancedSettings = document.getElementById("settings-advanced")
const showAdvanced = document.getElementById("settings-showadvanced")
showAdvanced.onclick = function() {
    advancedSettings.hidden = !advancedSettings.hidden
    showAdvanced.textContent = advancedSettings.hidden ? "Show Settings" : "Hide Settings"
}
// Tools
const pencilTool = document.getElementById("settings-tools-penciltool")
const lineTool = document.getElementById("settings-tools-linetool")
const squareTool = document.getElementById("settings-tools-squaretool")
const circleTool = document.getElementById("settings-tools-circletool")
pencilTool.onclick = function() {
    Tools.selected = Tools.PencilTool
    updateTool()
}
lineTool.onclick = function() {
    Tools.selected = Tools.LineTool
    updateTool()
}
squareTool.onclick = function() {
    Tools.selected = Tools.SquareTool
    updateTool()
}
circleTool.onclick = function() {
    Tools.selected = Tools.CircleTool
    updateTool()
}
// Color
const colorPicker = document.getElementById("settings-linecolor-value")
const alphaSlider = document.getElementById("settings-linecolor-avalue")
colorPicker.oninput = function() {
    const hex = colorPicker.value
    Tools.selected.color.hex = hex
    const color = Tools.selected.color
    const name = Tools.selected.name
    localStorage.setItem(name+"-hex", color.hex)
}
alphaSlider.oninput = function() {
    const color = Tools.selected.color
    color.alpha = alphaSlider.valueAsNumber / 100
    const name = Tools.selected.name
    localStorage.setItem(name+"-alpha", alphaSlider.valueAsNumber.toString())
}

// Cursor
const toggleCursor = document.getElementById("settings-advanced-cursor")
toggleCursor.onclick = function() {
    Cursor.use = !Cursor.use
    localStorage.setItem("cursor", Cursor.use.toString())
}
// Thickness input
const thicknessInput = document.getElementById("settings-linewidth-value")
thicknessInput.onblur = function() {
    if (thicknessInput.valueAsNumber > 250) {
        thicknessInput.valueAsNumber = 250
    } else if (thicknessInput.valueAsNumber < 1) {
        thicknessInput.valueAsNumber = 1
    }
    Tools.selected.thickness = thicknessInput.valueAsNumber
    localStorage.setItem(Tools.selected.name+"-thickness", thicknessInput.value)
}

// thickness buttons
holdAction(
    function() {
        if (thicknessInput.valueAsNumber < 250) {
            thicknessInput.valueAsNumber += 1
        } else {
            thicknessInput.valueAsNumber = 250
        }
        Tools.selected.thickness = thicknessInput.valueAsNumber
        const name = Tools.selected.name
        localStorage.setItem(name+"-thickness", thicknessInput.value)
    },
    document.getElementById("settings-linewidth-add")
)
holdAction(
    function() {
        if (thicknessInput.valueAsNumber > 1) {
            thicknessInput.valueAsNumber -= 1
        } else {
            thicknessInput.valueAsNumber = 1
        }
        Tools.selected.thickness = thicknessInput.valueAsNumber
        const name = Tools.selected.name
        localStorage.setItem(name+"-thickness", thicknessInput.value)
    },
    document.getElementById("settings-linewidth-minus")
)

// Undo Redo
removedElements = []
holdAction(
    function() {
        if (element = elements.pop()) {
            removedElements.push(element)
            redrawElements(context, elements)
        }
    },
    document.getElementById("settings-undoredo-undo")
)
holdAction(
    function() {
        if (removedElement = removedElements.pop()) {
            elements.push(removedElement)
            redrawElements(context, elements)
        }
    },
    document.getElementById("settings-undoredo-redo")
)
// Clear canvas
let clearCanvasPressed = false
const clearCanvasButton = document.getElementById("settings-clear")
function resetClearCanvasButton() {
    clearCanvasButton.textContent = "Clear Canvas"
    clearCanvasButton.onclick = clearCanvasComfirm
}
function clearCanvasComfirm() {
    clearCanvasPressed = false
    clearCanvasButton.textContent = "Click To Comfirm"
    clearCanvasButton.onclick = clearCanvasAction
    setTimeout(function() { if (!clearCanvasPressed) { resetClearCanvasButton() } }, 2500)
}
function clearCanvasAction() {
    clearCanvasPressed = true
    resetClearCanvasButton()
    clearCanvas(context)
    elements = []
    removedElements = []
}
clearCanvasButton.onclick = clearCanvasComfirm

function updateTool() {
    lineTool.classList.remove("highlighted")
    pencilTool.classList.remove("highlighted")
    squareTool.classList.remove("highlighted")
    circleTool.classList.remove("highlighted")
    if (Tools.selected === Tools.LineTool) {
        lineTool.classList.add("highlighted")
    } else if (Tools.selected === Tools.PencilTool) {
        pencilTool.classList.add("highlighted")
    } else if (Tools.selected === Tools.SquareTool) {
        squareTool.classList.add("highlighted")
    } else if (Tools.selected === Tools.CircleTool) {
        circleTool.classList.add("highlighted")
    }
    const color = Tools.selected.color
    colorPicker.value = color.hex
    alphaSlider.valueAsNumber = color.alpha * 100
    thicknessInput.valueAsNumber = Tools.selected.thickness
}

function loadSettings() {
    if (newHex = localStorage.getItem("linetool-hex")) {
        Tools.LineTool.color = Color.fromHex(newHex)
    }
    if (newAlpha = localStorage.getItem("linetool-alpha")) {
        Tools.LineTool.color.alpha = parseInt(newAlpha, 10) / 100
    }
    if (newThickness = localStorage.getItem("linetool-thickness")) {
        Tools.LineTool.thickness = parseInt(newThickness, 10)
    }
    if (newHex = localStorage.getItem("penciltool-hex")) {
        Tools.PencilTool.color = Color.fromHex(newHex)
    }
    if (newAlpha = localStorage.getItem("penciltool-alpha")) {
        Tools.PencilTool.color.alpha = parseInt(newAlpha, 10) / 100
    }
    if (newThickness = localStorage.getItem("penciltool-thickness")) {
        Tools.PencilTool.thickness = parseInt(newThickness, 10)
    }
    if (newHex = localStorage.getItem("squaretool-hex")) {
        Tools.SquareTool.color = Color.fromHex(newHex)
    }
    if (newAlpha = localStorage.getItem("squaretool-alpha")) {
        Tools.SquareTool.color.alpha = parseInt(newAlpha, 10) / 100
    }
    if (newThickness = localStorage.getItem("squaretool-thickness")) {
        Tools.SquareTool.thickness = parseInt(newThickness, 10)
    }
    if (newHex = localStorage.getItem("circletool-hex")) {
        Tools.CircleTool.color = Color.fromHex(newHex)
    }
    if (newAlpha = localStorage.getItem("circletool-alpha")) {
        Tools.CircleTool.color.alpha = parseInt(newAlpha, 10) / 100
    }
    if (newThickness = localStorage.getItem("circletool-thickness")) {
        Tools.CircleTool.thickness = parseInt(newThickness, 10)
    }
    updateTool()
    Cursor.use = true
    if (newUseCursor = localStorage.getItem("cursor")) {
        Cursor.use = newUseCursor === "true" ? true : false
    }
}
loadSettings()