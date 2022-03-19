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
    showAdvanced.textContent = advancedSettings.hidden ? "Show Advanced" : "Hide Advanced"
}
// Tools
const scribbleTool = document.getElementById("settings-tools-scribbletool")
const lineTool = document.getElementById("settings-tools-linetool")
const squareTool = document.getElementById("settings-tools-squaretool")
const circleTool = document.getElementById("settings-tools-circletool")
scribbleTool.onclick = function() {
    Tools.currentTool = Tools.ScribbleTool
    lineTool.classList.remove("highlighted")
    squareTool.classList.remove("highlighted")
    circleTool.classList.remove("hightlighted")
    scribbleTool.classList.add("highlighted")
    updateToolThickness()
    updateToolColor()
}
lineTool.onclick = function() {
    Tools.currentTool = Tools.LineTool
    squareTool.classList.remove("highlighted")
    scribbleTool.classList.remove("highlighted")
    circleTool.classList.remove("hightlighted")
    lineTool.classList.add("highlighted")
    updateToolThickness()
    updateToolColor()
}
squareTool.onclick = function() {
    Tools.currentTool = Tools.SquareTool
    lineTool.classList.remove("highlighted")
    scribbleTool.classList.remove("highlighted")
    circleTool.classList.remove("hightlighted")
    squareTool.classList.add("highlighted")
    updateToolThickness()
    updateToolColor()
}
circleTool.onclick = function() {
    Tools.currentTool = Tools.CircleTool
    lineTool.classList.remove("highlighted")
    scribbleTool.classList.remove("highlighted")
    squareTool.classList.remove("hightlighted")
    circleTool.classList.add("highlighted")
    updateToolThickness()
    updateToolColor()
}
// Color
const colorPicker = document.getElementById("settings-linecolor-value")
const alphaSlider = document.getElementById("settings-linecolor-avalue")
function updateToolColor() {
    const color = Tools.currentTool.color
    colorPicker.value = color.hex
    alphaSlider.valueAsNumber = color.alpha * 100
}
colorPicker.oninput = function() {
    const hex = colorPicker.value
    Tools.currentTool.color.hex = hex
    const color = Tools.currentTool.color
    const name = Tools.currentTool.name
    localStorage.setItem(name+"-hex", color.hex)
}
alphaSlider.oninput = function() {
    const color = Tools.currentTool.color
    color.alpha = alphaSlider.valueAsNumber / 100
    const name = Tools.currentTool.name
    localStorage.setItem(name+"-alpha", alphaSlider.valueAsNumber.toString())
}

// Cursor
const toggleCursor = document.getElementById("settings-advanced-cursor")
toggleCursor.onclick = function() {
    useCursor = !useCursor
    setUseCursor()
    localStorage.setItem("cursor", useCursor.toString())
}
// Thickness input
const thicknessInput = document.getElementById("settings-linewidth-value")
function updateToolThickness() {
    thicknessInput.valueAsNumber = Tools.currentTool.thickness
}
thicknessInput.onblur = function() {
    if (thicknessInput.valueAsNumber > 250) {
        thicknessInput.valueAsNumber = 250
    } else if (thicknessInput.valueAsNumber < 1) {
        thicknessInput.valueAsNumber = 1
    }
    Tools.currentTool.thickness = thicknessInput.valueAsNumber
    localStorage.setItem(Tools.currentTool.name+"-thickness", thicknessInput.value)
}

// thickness buttons
holdAction(
    function() {
        if (thicknessInput.valueAsNumber < 250) {
            thicknessInput.valueAsNumber += 1
        } else {
            thicknessInput.valueAsNumber = 250
        }
        Tools.currentTool.thickness = thicknessInput.valueAsNumber
        const name = Tools.currentTool.name
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
        Tools.currentTool.thickness = thicknessInput.valueAsNumber
        const name = Tools.currentTool.name
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
            redrawElements(context)
        }
    },
    document.getElementById("settings-undoredo-undo")
)
holdAction(
    function() {
        if (removedElement = removedElements.pop()) {
            elements.push(removedElement)
            redrawElements(context)
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
    if (newHex = localStorage.getItem("scribbletool-hex")) {
        Tools.ScribbleTool.color = Color.fromHex(newHex)
    }
    if (newAlpha = localStorage.getItem("scribbletool-alpha")) {
        Tools.ScribbleTool.color.alpha = parseInt(newAlpha, 10) / 100
    }
    if (newThickness = localStorage.getItem("scribbletool-thickness")) {
        Tools.ScribbleTool.thickness = parseInt(newThickness, 10)
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
    updateToolThickness()
    updateToolColor()
    if (newUseCursor = localStorage.getItem("cursor")) {
        useCursor = newUseCursor === "true" ? true : false
        setUseCursor()
    }
}
loadSettings()