const settings = document.getElementById("settings")

// Hide and show settings
const showSettings = document.getElementById("showsettings")
showSettings.onclick = () => {
    settings.hidden = false
    showSettings.hidden = true
}
const hideSettings = document.getElementById("hidesettings")
hideSettings.onclick = () => {
    showSettings.hidden = false
    settings.hidden = true
}

// Hide and show advanced settings
const advancedSettings = document.getElementById("settings-advanced")
const showAdvanced = document.getElementById("settings-showadvanced")
showAdvanced.onclick = () => {
    advancedSettings.hidden = !advancedSettings.hidden
    showAdvanced.textContent = advancedSettings.hidden ? "Show Advanced" : "Hide Advanced"
}
// Clear canvas
document.getElementById("settings-clear").onclick = () => { clearCanvas(context) }
// Tools
const scribbleTool = document.getElementById("settings-tools-scribbletool")
scribbleTool.onclick = () => {
    Tools.currentTool = Tools.ScribbleTool
    updateToolThickness()
}
const lineTool = document.getElementById("settings-tools-linetool")
lineTool.onclick = () => {
    Tools.currentTool = Tools.LineTool
    updateToolThickness()
}
const squareTool = document.getElementById("settings-tools-squaretool")
squareTool.onclick = () => {
    Tools.currentTool = Tools.ShapeTool
    updateToolThickness()
}

// Thickness
const thicknessInput = document.getElementById("settings-linewidth-value")
function updateToolThickness() {
    const currentTool = Tools.getCurrentTool()
    if (currentTool.thickness === null) {
        thicknessInput.valueAsNumber = currentTool.defaultThickness
    } else {
        thicknessInput.valueAsNumber = currentTool.thickness
    }
}
updateToolThickness()
thicknessInput.onblur = () => {
    if (thicknessInput.valueAsNumber > 250) {
        thicknessInput.valueAsNumber = 250
    } else if (thicknessInput.valueAsNumber < 1) {
        thicknessInput.valueAsNumber = 1
    }
    Tools.getCurrentTool().thickness = thicknessInput.valueAsNumber
}
document.getElementById("settings-linewidth-add").onclick = () => {
    if (thicknessInput.valueAsNumber < 250) {
        thicknessInput.valueAsNumber += 1
    } else {
        thicknessInput.valueAsNumber = 250
    }
    Tools.getCurrentTool().thickness = thicknessInput.valueAsNumber
}
document.getElementById("settings-linewidth-minus").onmousedown = () => {
    if (thicknessInput.valueAsNumber > 1) {
        thicknessInput.valueAsNumber -= 1
    } else {
        thicknessInput.valueAsNumber = 1
    }
    Tools.getCurrentTool().thickness = thicknessInput.valueAsNumber
}