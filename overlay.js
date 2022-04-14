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
const eraseTool = document.getElementById("settings-tools-erasetool")
const colorTool = document.getElementById("settings-tools-colortool")
// let lastTool = null
// function changeTool(name) {
    // lastTool = Tools.selected
//     const tool = Tools.fromName(name)
//     Tools.selected = tool
//     updateTool()
// }
pencilTool.onclick = function() {
    // if (Tools.selected === Tools.ColorTool) {
    //     Tools.PencilTool.color = Tools.ColorTool.color
    // }
    // changeTool("penciltool")
    Tools.selected = Tools.PencilTool
    updateTool()
}
lineTool.onclick = function() {
    // if (Tools.selected === Tools.ColorTool) {
    //     Tools.LineTool.color = Tools.ColorTool.color
    // }
    // changeTool("linetool")
    Tools.selected = Tools.LineTool
    updateTool()
}
squareTool.onclick = function() {
    // if (Tools.selected === Tools.ColorTool) {
    //     Tools.SquareTool.color = Tools.ColorTool.color
    // }
    // changeTool("squaretool")
    Tools.selected = Tools.SquareTool
    updateTool()
}
circleTool.onclick = function() {
    // if (Tools.selected === Tools.ColorTool) {
    //     Tools.CircleTool.color = Tools.ColorTool.color
    // }
    // changeTool("circletool")
    Tools.selected = Tools.CircleTool
    updateTool()
}
eraseTool.onclick = function() {
    // changeTool("erasetool")
    Tools.selected = Tools.EraseTool
    updateTool()
}
// colorTool.onclick = function() {
//     changeTool("colortool")
// }
// Color
const colorPicker = document.getElementById("settings-linecolor-value")
const alphaSlider = document.getElementById("settings-linecolor-avalue")
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
    document.getElementById("settings-linewidth-add")
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
    document.getElementById("settings-linewidth-minus")
)

// Undo Redo
removedElements = []
HoldAction(
    function() {
        if (element = elements.pop()) {
            removedElements.push(element)
            redrawElements(context, elements)
        }
    },
    document.getElementById("settings-undoredo-undo")
)
HoldAction(
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
    const color = Tools.selected.color
    colorPicker.value = color.hex
    alphaSlider.valueAsNumber = color.alpha * 100
    thicknessInput.valueAsNumber = Tools.selected.thickness
}

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
    updateTool()

    Cursor.use = true
    if (newUseCursor = localStorage.getItem("cursor")) {
        Cursor.use = newUseCursor === "true" ? true : false
    }
}
window.addEventListener("load", loadSettings)