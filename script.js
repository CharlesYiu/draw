// TODO Add keyboard shortcuts for changing the settings quickly
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
    onStart(canvas, function(mobile) {
        settings.style.opacity = "0.25"
        Tools.currentTool.start(window.event, mobile)
        cursorDown = true
    })
    onEnd(window, function(mobile) {
        if (cursorDown) {
            cursorDown = false
            if (!transparentSettings) {
                settings.style.opacity = "1"
            }
            Tools.currentTool.stop(window.event, mobile)
        }
    })
    onMove(window, function(mobile) {
        if (useCursor) {
            updateCursor()
        }
        if (cursorDown) {
            Tools.currentTool.update(window.event, mobile)
        }
    })
}