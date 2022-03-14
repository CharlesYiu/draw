// TODO Implement the ability to change shapes when using the shape tool
// TODO Implement the ability to hold to add/minus the thickness repeatedly
// TODO Implement the ability to change colors and opacity
// TODO Implement a custom cursor
// TODO Implement undo and redo actions
// TODO Make settings save to local storage when modified
// TODO Remove save settings and reset settings button
// TODO Add keyboard shortcuts for changing the settings quickly
let pressedShift = false
let transparentSettings = false

window.onkeydown = function() {
    const key = window.event.key
    if (key === "Shift") {
        pressedShift = true
    } else if (key === "Escape") {
        settings.style.opacity = settings.style.opacity === "0.25" ? "1" : "0.25"
        transparentSettings = settings.style.opacity === "0.25"
    }
}
window.onkeyup = function() {
    const key = window.event.key
    if (key === "Shift") {
        pressedShift = false
    }
}

window.onload = () => {
    let cursorDown = false
    previewCanvas.onmousedown = function() {
        cursorDown = true
        settings.style.opacity = "0.25"
        Tools.getCurrentTool().start(window.event)
    }
    window.onmouseup = function() {
        if (cursorDown) {
            cursorDown = false
            if (!transparentSettings) {
                settings.style.opacity = "1"
            }
            Tools.getCurrentTool().stop(window.event)
        }
    }
    window.onmousemove = function() {
        if (cursorDown) {
            Tools.getCurrentTool().update(window.event)
        }
    }    
}