// Helper for add thickness, minus thickness, undo action and redo action
function HoldAction(action, element) {
    let pressing = false
    function handle() {
        if (pressing) { return }
        pressing = true
        function stopAction() {
        //     window.ontouchend = null
        //     window.onmouseup = null
        //     element.ontouchstart = null
        //     element.onmousedown = null
            pressing = false
        }
        function repeatAction() {
            if (!pressing) { return }
            action()
            setTimeout(repeatAction, 125)
        }
        window.addEventListener("touchend", stopAction, once=true)
        window.addEventListener("mouseup", stopAction, once=true)
        // window.ontouchend = stopAction
        // window.onmouseup = stopAction
        action()
        setTimeout(function() { if (pressing) {repeatAction()} }, 1000)
    }
    element.addEventListener("touchstart", handle, once=true)
    element.addEventListener("mousedown", handle, once=true)
    // element.ontouchstart = handle
    // element.onmousedown = handle
}
// Panel / settings stuff
const panel = document.getElementById("panel")
// Hide and show panel
const showPanel = document.getElementById("showpanel")
showPanel.onclick = function() {
    panel.hidden = false
    showPanel.hidden = true
}
document.getElementById("hidepanel").onclick = function() {
    showPanel.hidden = false
    panel.hidden = true
}
// Hide and show settings
const settings = document.getElementById("panel-settings")
const showSettings = document.getElementById("panel-showsettings")
showSettings.onclick = function() {
    settings.hidden = !settings.hidden
    showSettings.textContent = settings.hidden ? "Show Settings" : "Hide Settings"
}
// Tools
const pencilTool = document.getElementById("panel-tools-penciltool")
const lineTool = document.getElementById("panel-tools-linetool")
const squareTool = document.getElementById("panel-tools-squaretool")
const circleTool = document.getElementById("panel-tools-circletool")
const eraseTool = document.getElementById("panel-tools-erasetool")
const colorTool = document.getElementById("panel-tools-colortool")
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
eraseTool.onclick = function() {
    Tools.selected = Tools.EraseTool
    updateTool()
}
// Tool config
// Color slider and picker
const colorPicker = document.getElementById("panel-linecolor-value")
const alphaSlider = document.getElementById("panel-linecolor-avalue")
colorPicker.oninput = function() {
    // if (Tools.selected.name !== "erasetool" && Tools.selected.name !== "colortool") {
    if (Tools.selected.name !== "erasetool") {
        const hex = colorPicker.value
        Tools.selected.color.hex = hex
        const color = Tools.selected.color
        const name = Tools.selected.name
        localStorage.setItem(name+"-hex", color.hex)
    }
}
alphaSlider.oninput = function() {
    const color = Tools.selected.color
    color.alpha = alphaSlider.valueAsNumber / 100
    const name = Tools.selected.name
    localStorage.setItem(name+"-alpha", alphaSlider.valueAsNumber.toString())
}
// Thickness input
const thicknessInput = document.getElementById("panel-linewidth-value")
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
HoldAction(
    function() {
        if (thicknessInput.valueAsNumber < 250) {
            thicknessInput.valueAsNumber += 1
        } else {
            thicknessInput.valueAsNumber = 250
        }
        Tools.selected.thickness = thicknessInput.valueAsNumber
        localStorage.setItem(Tools.selected.name+"-thickness", thicknessInput.value)
    },
    document.getElementById("panel-linewidth-add")
)
HoldAction(
    function() {
        if (thicknessInput.valueAsNumber > 1) {
            thicknessInput.valueAsNumber -= 1
        } else {
            thicknessInput.valueAsNumber = 1
        }
        Tools.selected.thickness = thicknessInput.valueAsNumber
        localStorage.setItem(Tools.selected.name+"-thickness", thicknessInput.value)
    },
    document.getElementById("panel-linewidth-minus")
)
// Tool helper
function updateTool() {
    lineTool.classList.remove("highlighted")
    pencilTool.classList.remove("highlighted")
    squareTool.classList.remove("highlighted")
    circleTool.classList.remove("highlighted")
    eraseTool.classList.remove("highlighted")
    if (Tools.selected === Tools.LineTool) {
        lineTool.classList.add("highlighted")
    } else if (Tools.selected === Tools.PencilTool) {
        pencilTool.classList.add("highlighted")
    } else if (Tools.selected === Tools.SquareTool) {
        squareTool.classList.add("highlighted")
    } else if (Tools.selected === Tools.CircleTool) {
        circleTool.classList.add("highlighted")
    } else if (Tools.selected === Tools.EraseTool) {
        eraseTool.classList.add("highlighted")
    }
    localStorage.setItem("selected-tool", Tools.selected.name)
    const color = Tools.selected.color
    colorPicker.value = color.hex
    alphaSlider.valueAsNumber = color.alpha * 100
    thicknessInput.valueAsNumber = Tools.selected.thickness
}
// Canvas actions
// Undo Redo
removedElements = []
HoldAction(
    function() {
        if (element = elements.pop()) {
            removedElements.push(element)
            redrawElements(context, elements)
        }
    },
    document.getElementById("panel-undoredo-undo")
)
HoldAction(
    function() {
        if (removedElement = removedElements.pop()) {
            elements.push(removedElement)
            redrawElements(context, elements)
        }
    },
    document.getElementById("panel-undoredo-redo")
)
// Export canvas button
document.getElementById("panel-export").onclick = function(event) {
    const exportImageRedirect = document.createElement("a")
    exportImageRedirect.href = canvas.toDataURL("image/jpeg")
    exportImageRedirect.download = "drawing.jpeg"
    exportImageRedirect.hidden = true
    document.body.appendChild(exportImageRedirect)
    exportImageRedirect.click()
}
// Clear canvas
let clearCanvasPressed = false
const clearCanvasButton = document.getElementById("panel-clear")
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

// Other settings and buttons
// Cursor
const toggleCursor = document.getElementById("panel-settings-cursor")
toggleCursor.onclick = function() {
    Cursor.use = !Cursor.use
    localStorage.setItem("cursor", Cursor.use.toString())
}
// Change release
const changeRelease = document.getElementById("panel-settings-changerelease")
if (window.location.hostname === "charlesyiu.github.io") changeRelease.innerText = "Use stable release"
changeRelease.onclick = function() {
    if (window.location.hostname === "charlesyiu.github.io") window.location.replace("https://draw.pages.dev")
    else window.location.replace("https://charlesyiu.github.io/draw-rewrite")
}
// Go to Github repo
document.getElementById("panel-repo").onclick = function() {
    if (window.location.hostname === "draw.pages.dev") open("https://github.com/charlesyiu/draw-rewrite/tree/stable")
    else open("https://github.com/charlesyiu/draw-rewrite/tree/main")
}
// Load settings
function loadSettings() {
    const names = ["linetool", "penciltool", "squaretool", "circletool", "erasetool", "colortool"]
    names.forEach(function(name) {
        const tool = Tools.fromName(name)
        if (newAlpha = localStorage.getItem(name+"-alpha")) {
            tool.color.alpha = parseInt(newAlpha, 10) / 100
        }
        if (newThickness = localStorage.getItem(name+"-thickness")) {
           tool.thickness = parseInt(newThickness, 10)
        }
        if (newHex = localStorage.getItem(name+"-hex")) {
            tool.color = Color.fromHex(newHex)
        }
    })
    if (selectedTool = localStorage.getItem("selected-tool")) Tools.selected = Tools.fromName(selectedTool)
    updateTool()

    Cursor.use = true
    if (newUseCursor = localStorage.getItem("cursor")) {
        Cursor.use = newUseCursor === "true" ? true : false
    }
}
window.addEventListener("load", loadSettings)