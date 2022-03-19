let useCursor = true
function updateCursor() {
    const cursorPosition = [window.event]
    if (cursorPosition[0] === undefined) { return }

    const cursorElement = document.getElementById("cursor")
    const cursorDotElement = document.getElementById("cursor-dot")

    cursorElement.hidden = false

    const dividedThickness = Tools.currentTool.thickness / 2
    const cursorElementSize = `${Tools.currentTool.thickness + 2}px`
    cursorElement.style.width = cursorElementSize
    cursorElement.style.height = cursorElementSize

    const leftStyle = `${(Math.round(cursorPosition[0].clientX - dividedThickness - 2))}px`
    const topStyle = `${(Math.round(cursorPosition[0].clientY - dividedThickness - 2))}px`
    cursorElement.style.left = leftStyle
    cursorElement.style.top = topStyle

    const cursorDotElementOffset = `${dividedThickness - 1}px`
    cursorDotElement.style.left = cursorDotElementOffset
    cursorDotElement.style.top = cursorDotElementOffset

    setTimeout(() => {
        if (cursorElement.style.left == leftStyle && cursorElement.style.top == topStyle) { cursorElement.hidden = true }
    }, 2500)
}
function setUseCursor() {
    const cursorElement = document.getElementById("cursor")
    if (!useCursor) {
        cursorElement.hidden = true
        previewPreviewCanvas.style.cursor = "default"
        toggleCursor.textContent = "Use Custom Cursor"
    } else {
        cursorElement.hidden = false
        previewPreviewCanvas.style.cursor = "none"
        toggleCursor.textContent = "Use Default Cursor"
    }
}