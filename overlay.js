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
    updateToolColor()
}
const lineTool = document.getElementById("settings-tools-linetool")
lineTool.onclick = () => {
    Tools.currentTool = Tools.LineTool
    updateToolThickness()
    updateToolColor()
}
const squareTool = document.getElementById("settings-tools-squaretool")
squareTool.onclick = () => {
    Tools.currentTool = Tools.ShapeTool
    updateToolThickness()
    updateToolColor()
}

// Thickness
const thicknessInput = document.getElementById("settings-linewidth-value")
function updateToolThickness() {
    thicknessInput.valueAsNumber = Tools.currentTool.thickness
}
updateToolThickness()
thicknessInput.onblur = () => {
    if (thicknessInput.valueAsNumber > 250) {
        thicknessInput.valueAsNumber = 250
    } else if (thicknessInput.valueAsNumber < 1) {
        thicknessInput.valueAsNumber = 1
    }
    Tools.currentTool.thickness = thicknessInput.valueAsNumber
}
document.getElementById("settings-linewidth-add").onclick = () => {
    if (thicknessInput.valueAsNumber < 250) {
        thicknessInput.valueAsNumber += 1
    } else {
        thicknessInput.valueAsNumber = 250
    }
    Tools.currentTool.thickness = thicknessInput.valueAsNumber
}
document.getElementById("settings-linewidth-minus").onmousedown = () => {
    if (thicknessInput.valueAsNumber > 1) {
        thicknessInput.valueAsNumber -= 1
    } else {
        thicknessInput.valueAsNumber = 1
    }
    Tools.currentTool.thickness = thicknessInput.valueAsNumber
}

// Color
const colorPicker = document.getElementById("settings-linecolor-value")
const alphaSlider = document.getElementById("settings-linecolor-avalue")
function updateToolColor() {
    const color = Tools.currentTool.color
    function numberToHex(number) {
        const hex = number.toString(16)
        return hex.length === 1 ? "0"+hex : hex
    }
    const hex = `#${numberToHex(color.red)}${numberToHex(color.green)}${numberToHex(color.blue)}`
    colorPicker.value = hex
    alphaSlider.valueAsNumber = color.alpha * 100 
}
updateToolColor()
colorPicker.oninput = () => {
    const hex = colorPicker.value
    const color = new Color(
        parseInt(hex.substr(1,2), 16),
        parseInt(hex.substr(3,2), 16),
        parseInt(hex.substr(5,2), 16),
        alphaSlider.valueAsNumber
    )
    Tools.currentTool.color = color
}
alphaSlider.oninput = () => {
    Tools.currentTool.color.alpha = alphaSlider.valueAsNumber / 100
    console.log(alphaSlider.valueAsNumber)
}