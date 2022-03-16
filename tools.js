const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const previewCanvas = document.getElementById("previewCanvas")
const previewContext = previewCanvas.getContext("2d")
const previewPreviewCanvas = document.getElementById("previewPreviewCanvas")
const previewPreviewContext = previewPreviewCanvas.getContext("2d")
function clearCanvas(context) {
    const canvas = context.canvas
    context.clearRect(0, 0, canvas.width, canvas.height)
}
function resizeCanvas() {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    previewCanvas.width  = window.innerWidth
    previewCanvas.height = window.innerHeight
    previewPreviewCanvas.width  = window.innerWidth
    previewPreviewCanvas.height = window.innerHeight
}
window.onresize = () => {
    resizeCanvas()
}
resizeCanvas()
let actions = []

class Color {
    static White = new Color(255, 255, 255, 1)
    static Black = new Color(0, 0, 0, 1)
    static Red = new Color(255, 0, 0, 1)
    static Orange = new Color(255, 128, 0, 1)
    static Yellow = new Color(255, 255, 0, 1)
    static Green = new Color(0, 255, 0, 1)
    static Blue = new Color(0, 0, 255, 1)
    static Purple = new Color(128, 0, 128, 1)
    
    get hex() {
        return `#${this._numberToHex(this._red)}${this._numberToHex(this._green)}${this._numberToHex(this._blue)}`
    }
    set hex(hex) {
        this.red = parseInt(hex.substring(1,2), 16)
        this.green = parseInt(hex.substring(3,2), 16)
        this.blue = parseInt(hex.substring(5,2), 16)
    }
    get rgb() {
        return `rgb(${this._red},${this._green},${this._blue})`
    }
    set rgb(rgb) {
        rgb = rgb.substring(rgb.indexOf("(") + 1, rgb.indexOf(")"))
        const values = rgb.split(",")
        this.red = parseInt(values[0], 10)
        this.green = parseInt(values[1], 10)
        this.blue = parseInt(values[2], 10)
    }
    get rgba() {
        return `rgb(${this._red},${this._green},${this._blue}),${this._alpha})` 
    }
    set rgba(rgba) {
        rgba = rgba.substring(rgba.indexOf("(") + 1, rgba.indexOf(")"))
        const values = rgba.split(",")
        this.red = parseInt(values[0], 10)
        this.green = parseInt(values[1], 10)
        this.blue = parseInt(values[2], 10)
        this.alpha = parseInt(values[3], 10)
    }

    get red() { return this._red }
    set red(value) {
        this._red = this._formatValue(value)
        return this._red
    }
    get green() { return this._green }
    set green(value) {
        this._green = this._formatValue(value)
        return this._green
    }
    get blue() { return this._blue }
    set blue(value) {
        this._blue = this._formatValue(value)
        return this._blue
    }
    get alpha() { return this._alpha }
    set alpha(value) {
        this._alpha = this._formatValue(value, true)
        return this._alpha
    }
    constructor(
        red = 0,
        green = 0,
        blue = 0,
        alpha = 1
    ) {
        this.red = red
        this.green = green
        this.blue = blue
        this.alpha = alpha
    }

    _formatValue(value, isAlpha = false) {
        if (isNaN(value)) {
            value = 0
        }
        if (!isAlpha) {
            if (value < 0) {
                value = 0
            } else if (value > 255) {
                value = 255
            }
            value = Math.round(value)
        } else {
            if (value < 0) { 
                value = 0
            } else if (value > 1) {
                value = 1
            }
        }
        return value
    }
    _hexFromValue(number) {
        const hex = number.toString(16)
        return hex.length === 1 ? "0" + hex : hex
    }
}

class Tools {
    static Tool = class {
        static defaultThickness = 10
        static defaultColor = Color.ColorBlack
        static set thickness(value) { this.Thickness = value }
        static get thickness() {
            if (this.Thickness == null) {
                return this.defaultThickness
            }
            return this.Thickness
        }
        static set color(value) { this.Color = value }
        static get color() {
            if (this.Color == null) {
                return this.defaultColor
            }
            return this.Color
        }
    
        static startX = undefined
        static startY = undefined
        
        static start(cursorEvent) {
            this.startX = cursorEvent.clientX
            this.startY = cursorEvent.clientY
        }
        static stop(cursorEvent) {
            context.beginPath()
            context.moveTo(this.startX, this.startY)
            context.lineTo(
                cursorEvent.clientX,
                cursorEvent.clientY
            )
            context.lineWidth = this.thickness
            context.strokeStyle = this.color.toRGBA()
            context.lineCap = "round"
            context.stroke()
            actions.push(new this.Action(
                "line",
                {
                    a: {
                        x: this.startX, 
                        y: this.startY
                    },
                    b: {
                        x: cursorEvent.clientX,
                        y: cursorEvent.clientY
                    }
                },
                this.thickness,
                this.color
            ))
            clearCanvas(previewContext)
        }
        static update(cursorEvent) {
            clearCanvas(previewContext)
            previewContext.beginPath()
            previewContext.moveTo(this.startX, this.startY)
            previewContext.lineTo(
                cursorEvent.clientX,
                cursorEvent.clientY
            )
            previewContext.lineWidth = this.thickness
            previewContext.strokeStyle = this.color.rgba
            previewContext.lineCap = "round"
            previewContext.stroke()
        }
        static Action = class {
            constructor(type, points, thickness, color) {
                this.type = type
                this.points = points
                this.thickness = thickness
                this.color = color
            }
        }
    }
    static ScribbleTool = class extends Tools.Tool {
        static defaultSkip = 3
        static set skip(value) { this.Skip = value }
        static get skip() {
            if (this.Skip == null) {
                return this.defaultSkip
            }
            return this.Skip
        }
        
        static previewX = undefined
        static previewY = undefined
        static points = []

        static start(cursorEvent) {
            this.startX = cursorEvent.clientX
            this.startY = cursorEvent.clientY
            this.previewX = this.startX
            this.previewY = this.startY
            this.points.push({x: this.startX, y: this.startY})
            context.beginPath()
            context.moveTo(this.startX, this.startY)
        }
        static stop(cursorEvent) {
            context.lineWidth = this.thickness
            context.strokeStyle = this.color.rgba
            context.lineCap = "round"
            context.stroke()
            actions.push(new this.Action(
                "scribble",
                this.points,
                this.thickness,
                this.color
            ))
            clearCanvas(previewContext)
            clearCanvas(previewPreviewContext)
        }
        static update(cursorEvent) {
            const skipped = Math.sqrt(Math.abs(cursorEvent.clientX - this.startX)+Math.abs(cursorEvent.clientY - this.startY))
            if (skipped >= this.skip) {
                context.lineTo(
                    cursorEvent.clientX,
                    cursorEvent.clientY
                )
                previewContext.beginPath()
                previewContext.moveTo(this.previewX, this.previewY)
                previewContext.lineTo(
                    cursorEvent.clientX,
                    cursorEvent.clientY
                )
                previewContext.lineWidth = this.thickness
                previewContext.strokeStyle = this.color.rgb
                previewContext.lineCap = "round"
                previewContext.stroke()
                points.push({x: cursorEvent.clientX, y: cursorEvent.clientY})
                this.previewX = cursorEvent.clientX
                this.previewY = cursorEvent.clientY

            }
            clearCanvas(previewPreviewContext)
            previewPreviewContext.beginPath()
            previewPreviewContext.moveTo(this.previewX, this.previewY)
            previewPreviewContext.lineTo(
                cursorEvent.clientX,
                cursorEvent.clientY
            )
            previewPreviewContext.lineWidth = this.thickness
            previewPreviewContext.strokeStyle = this.color.rgb
            previewPreviewContext.lineCap = "round"
            previewPreviewContext.stroke()
        }
    }
    static LineTool = Tools.Tool
    static ShapeTool = class extends Tools.Tool {
        static defaultShape = "rectangle"
        static set shape(value) { this.Shape = value }
        static get shape() {
            if (this.Shape == null) {
                return this.defaultShape
            }
            return this.Shape
        }

        static start(cursorEvent) {
            this.startX = cursorEvent.clientX
            this.startY = cursorEvent.clientY
        }
        static stop(cursorEvent) {
            context.beginPath()
            if (this.shape === "circle") {
                if (pressedShift) {
                    const radius = Math.abs((cursorEvent.clientX - this.startX) / 2)
                    if (cursorEvent.clientY < this.startY) {
                        if (cursorEvent.clientX < this.startX) {
                            previewContext.arc(
                                this.startX - radius, this.startY - radius,
                                radius, 0, 2*Math.PI
                            )
                        } else {
                            previewContext.arc(
                                cursorEvent.clientX - radius, this.startY - radius,
                                radius, 0, 2*Math.PI
                            )
                        }
                    } else {
                        if (cursorEvent.clientX < this.startX) {
                            previewContext.arc(
                                cursorEvent.clientX + radius, this.startY + radius,
                                radius, 0, 2*Math.PI
                            )
                        } else {
                            previewContext.arc(
                                this.startX + radius, this.startY + radius,
                                radius, 0, 2*Math.PI
                            )
                        }
                    }
                } else {
                    const radiusX = (cursorEvent.clientX - this.startX) / 2
                    const radiusY = (cursorEvent.clientY - this.startY) / 2
                    context.ellipse(
                        this.startX + radiusX,
                        this.startY + radiusY,
                        Math.abs(radiusX), Math.abs(radiusY),
                        0, 2*Math.PI, false
                    );
                }
            } else if (this.shape === "rectangle") {
                if (pressedShift) {
                    const size = Math.abs(cursorEvent.clientX - this.startX)
                    if (cursorEvent.clientY < this.startY) {
                        if (cursorEvent.clientX < this.startX) {
                            context.rect(this.startX, this.startY, -size, -size)
                        } else {
                            context.rect(cursorEvent.clientX, this.startY, -size, -size)
                        }
                    } else {
                        if (cursorEvent.clientX < this.startX) {
                            context.rect(cursorEvent.clientX, this.startY, size, size)
                        } else {
                            context.rect(this.startX, this.startY, size, size)
                        }
                    }
                } else {
                    const sizeX = cursorEvent.clientX - this.startX
                    const sizeY = cursorEvent.clientY - this.startY
                    context.rect(this.startX, this.startY, sizeX, sizeY)
                }
            }
            context.lineWidth = this.thickness
            context.strokeStyle = this.color.toRGBA()
            context.stroke()
            actions.push(new this.Action(
                this.shape === "circle" ? (pressedShift ? "circle" : "ellipse") : (pressedShift ? "square" : "rectangle"),
                {
                    a: {
                        x: this.startX,
                        y: this.startY
                    },
                    b: {
                        x: cursorEvent.clientX,
                        y: cursorEvent.clientY
                    }
                },
                this.thickness,
                this.color
            ))
            clearCanvas(previewContext)
        }
        static update(cursorEvent) {
            clearCanvas(previewContext)
            previewContext.beginPath()
            if (this.shape === "circle") {
                if (pressedShift) {
                    const radius = Math.abs((cursorEvent.clientX - this.startX) / 2)
                    if (cursorEvent.clientY < this.startY) {
                        if (cursorEvent.clientX < this.startX) {
                            previewContext.arc(
                                this.startX - radius, this.startY - radius,
                                radius, 0, 2*Math.PI
                            )
                        } else {
                            previewContext.arc(
                                cursorEvent.clientX - radius, this.startY - radius,
                                radius, 0, 2*Math.PI
                            )
                        }
                    } else {
                        if (cursorEvent.clientX < this.startX) {
                            previewContext.arc(
                                cursorEvent.clientX + radius, this.startY + radius,
                                radius, 0, 2*Math.PI
                            )
                        } else {
                            previewContext.arc(
                                this.startX + radius, this.startY + radius,
                                radius, 0, 2*Math.PI
                            )
                        }
                    }
                } else {
                    const radiusX = (cursorEvent.clientX - this.startX) / 2
                    const radiusY = (cursorEvent.clientY - this.startY) / 2
                    previewContext.ellipse(
                        this.startX + radiusX,
                        this.startY + radiusY,
                        Math.abs(radiusX), Math.abs(radiusY),
                        0, 2*Math.PI, false
                    );
                }
            } else if (this.shape === "rectangle") {
                if (pressedShift) {
                    const size = Math.abs(cursorEvent.clientX - this.startX)
                    if (cursorEvent.clientY < this.startY) {
                        if (cursorEvent.clientX < this.startX) {
                            previewContext.rect(this.startX, this.startY, -size, -size)
                        } else {
                            previewContext.rect(cursorEvent.clientX, this.startY, -size, -size)
                        }
                    } else {
                        if (cursorEvent.clientX < this.startX) {
                            previewContext.rect(cursorEvent.clientX, this.startY, size, size)
                        } else {
                            previewContext.rect(this.startX, this.startY, size, size)
                        }
                    }
                } else {
                    const sizeX = cursorEvent.clientX - this.startX
                    const sizeY = cursorEvent.clientY - this.startY
                    previewContext.rect(this.startX, this.startY, sizeX, sizeY)
                }
            }
            previewContext.lineWidth = this.thickness
            previewContext.strokeStyle = this.color.rgba
            previewContext.stroke()
        }
    }
    static defaultTool = Tools.ScribbleTool
    static set currentTool(value) { Tools.CurrentTool = value }
    static get currentTool() {
        if (Tools.CurrentTool == null) {
            return Tools.defaultTool
        }
        return Tools.CurrentTool
    }
}