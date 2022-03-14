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

class Color {
    static ColorWhite = new Color(255, 255, 255, 1)
    static ColorBlack = new Color(0, 0, 0, 1)
    static ColorRed = new Color(255, 0, 0, 1)
    static ColorOrange = new Color(255, 255, 0, 1)
    static ColorYellow = new Color(255, 255, 0, 1)
    static ColorGreen = new Color(0, 255, 0, 1)
    static ColorBlue = new Color(0, 0, 255, 1)
    static ColorPurple = new Color(255, 0, 255, 1)
    
    get red() { return this.Red }
    set red(value) {
        this.Red = this.formatValue(value, false)
        return this.Red
    }
    get green() { return this.Green }
    set green(value) {
        this.Green = this.formatValue(value, false)
        return this.Green
    }
    get blue() { return this.Blue }
    set blue(value) {
        this.Blue = this.formatValue(value, false)
        return this.Blue
    }
    get alpha() { return this.Alpha }
    set alpha(value) {
        this.Alpha = this.formatValue(value, true)
        return this.Alpha
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
    static fromHex(hex) {
        return new Color(
            parseInt(hex.substr(1,2), 16),
            parseInt(hex.substr(3,2), 16),
            parseInt(hex.substr(5,2), 16),
            1
        )
    }
    formatValue(value, isAlpha) {
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
    toRGB() { return `rgb(${this.red},${this.green},${this.blue})` }
    toRGBA() { return `rgba(${this.red},${this.green},${this.blue},${this.alpha})` }
    toHex() {
        function numberToHex(number) {
            const hex = number.toString(16)
            return hex.length === 1 ? "0" + hex : hex
        }
        return `#${numberToHex(this.red)}${numberToHex(this.green)}${numberToHex(this.blue)}`
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
            previewContext.strokeStyle = this.color.toRGBA()
            previewContext.lineCap = "round"
            previewContext.stroke()
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

        static start(cursorEvent) {
            this.startX = cursorEvent.clientX
            this.startY = cursorEvent.clientY
            this.previewX = this.startX
            this.previewY = this.startY
            context.beginPath()
            context.moveTo(this.startX, this.startY)
        }
        static stop(cursorEvent) {
            context.lineWidth = this.thickness
            context.strokeStyle = this.color.toRGBA()
            context.lineCap = "round"
            context.stroke()
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
                previewContext.strokeStyle = this.color.toRGB()
                previewContext.lineCap = "round"
                previewContext.stroke()
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
            previewPreviewContext.strokeStyle = this.color.toRGB()
            previewPreviewContext.lineCap = "round"
            previewPreviewContext.stroke()
        }
    }
    static LineTool = Tools.Tool
    static ShapeTool = class extends Tools.Tool {
        static defaultShape = "Rectangle"
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
            if (this.shape === "Circle") {
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
            } else if (this.shape === "Rectangle") {
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
            clearCanvas(previewContext)
        }
        static update(cursorEvent) {
            clearCanvas(previewContext)
            previewContext.beginPath()
            if (this.shape === "Circle") {
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
            } else if (this.shape === "Rectangle") {
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
            previewContext.strokeStyle = this.color.toRGBA()
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