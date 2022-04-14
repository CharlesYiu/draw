class Cursor {
    static element = document.getElementById("cursor")
    static childElement = document.getElementById("cursor-dot")
    static _update(event) {
        Cursor.element.hidden = false

        const dividedThickness = Tools.selected.thickness / 2
        const cursorElementSize = `${Tools.selected.thickness + 2}px`
        Cursor.element.style.width = cursorElementSize
        Cursor.element.style.height = cursorElementSize
    
        const leftStyle = `${(Math.round(event.clientX - dividedThickness - 2))}px`
        const topStyle = `${(Math.round(event.clientY - dividedThickness - 2))}px`
        Cursor.element.style.left = leftStyle
        Cursor.element.style.top = topStyle
    
        const cursorDotElementOffset = `${dividedThickness - 1}px`
        Cursor.childElement.style.left = cursorDotElementOffset
        Cursor.childElement.style.top = cursorDotElementOffset
    
        setTimeout(() => {
            if (Cursor.element.style.left == leftStyle && Cursor.element.style.top == topStyle) {
                Cursor.element.hidden = true
            }
        }, 2500)
    }
    static _use = false
    static get use() { return this._use }
    static set use(value) {
        if (this._use == value) { return }

        if (!value) {
            this.element.hidden = true
            canvas.style.cursor = "pointer"
            toggleCursor.textContent = "Use Custom Cursor"

            window.removeEventListener("mousemove", this._update)
        } else {
            canvas.style.cursor = "none"
            toggleCursor.textContent = "Use Default Cursor"

            window.addEventListener("mousemove", this._update)
        }
        this._use = value
    }
}