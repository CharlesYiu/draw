// TODO Implement save as project button
// FIXME Preview layers are not removed sometimes (Requires more testing to find the cause)
// FIXME delete 'let pressedShift...' and replace it with something better
// FIXME rewrite/reorganize style.css
// TODO Implement color picker
// TODO Implement color bucket
// TODO use a dictionary instead of an array in 'let pointers...' (Optional)
// TODO Smooth pencil tool's lines (Not important)
// TODO cursor support for mobile
// TODO implement option to change cursor size so people can see where their drawing in touchscreen/mobile
//  

let pressedShift = false
let transparentPanel = false

// shortcuts
window.onkeydown = function(event) {
    switch (event.key) {
        default:
            break
        case "Shift":
            pressedShift = true
            break
        case "Tab":
            panel.style.opacity = panel.style.opacity === "0.25" ? "1" : "0.25"
            panel.style.pointerEvents = panel.style.opacity === "0.25" ? "none" : "auto"
            transparentPanel = panel.style.opacity === "0.25"
            break
        case "l":
            Tools.selected = Tools.LineTool
            updateTool()
            break
        case "p":
            Tools.selected = Tools.PencilTool
            updateTool()
            break
        case "r":
            Tools.selected = Tools.SquareTool
            updateTool()
            break
        case "c":
            Tools.selected = Tools.CircleTool
            updateTool()
            break
        case "e":
            Tools.selected = Tools.EraseTool
            updateTool()
            break
        case "=":
            thicknessInput.valueAsNumber += 1
            break
        case "-":
            thicknessInput.valueAsNumber -= 1
            break
    }
}

window.onkeyup = function() {
    const key = window.event.key
    if (key === "Shift") pressedShift = false
}

window.addEventListener("load", Tools.Handle)
canvas.addEventListener("mousedown", function() {
    panel.style.opacity = "0.25"
    panel.style.pointerEvents = "none"
})
canvas.addEventListener("mouseup", function() {
    if (!transparentPanel) {
        panel.style.opacity = "1"
        panel.style.pointerEvents = "auto"
    }
})