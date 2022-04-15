// TODO Implement export as image button
// TODO Implement save as project button
let pressedShift = false
let transparentSettings = false

window.onkeydown = function() {
    const key = window.event.key
    if (key === "Shift") {
        pressedShift = true
    } else if (key === "Escape") {
        settings.style.opacity = settings.style.opacity === "0.25" ? "1" : "0.25"
        transparentSettings = settings.style.opacity === "0.25"
    } else if (key === "l") {
        Tools.selected = Tools.LineTool
        updateTool()
    } else if (key === "p") {
        Tools.selected = Tools.PencilTool
        updateTool()
    } else if (key === "r") {
        Tools.selected = Tools.SquareTool
        updateTool()
    } else if (key === "c") {
        Tools.selected = Tools.CircleTool
        updateTool()
    } else if (key === "e") {
        Tools.selected = Tools.EraseTool
        updateTool()
    } else if (key === "=") {
        thicknessInput.valueAsNumber += 1
    } else if (key === "-") {
        thicknessInput.valueAsNumber -= 1
    }
}
window.onkeyup = function() {
    const key = window.event.key
    if (key === "Shift") {
        pressedShift = false
    }
}

window.addEventListener("load", Tools.Handle)
canvas.addEventListener("mousedown", function() {
    settings.style.opacity = "0.25"
})
canvas.addEventListener("mouseup", function() {
    if (!transparentSettings) {
        settings.style.opacity = "1"
    }
})