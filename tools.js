const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const previewCanvas = document.getElementById("previewCanvas")
const previewContext = previewCanvas.getContext("2d")

function clearCanvas(context) {
    const canvas = context.canvas
    context.clearRect(0, 0, canvas.width, canvas.height)
}
function resizeCanvas() {
    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight
    previewCanvas.width  = window.innerWidth
    previewCanvas.height = window.innerHeight
}
let elements = []
function redrawElements(context) {
    clearCanvas(context)
    elements.forEach(function(element) {
        element.draw(context)
    })
}
window.onresize = function() {
    resizeCanvas()
    redrawElements(context)
}
resizeCanvas()

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
        return `#${this._hexFromValue(this._red)}${this._hexFromValue(this._green)}${this._hexFromValue(this._blue)}`
    }
    set hex(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
          return r + r + g + g + b + b;
        });
      
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
            this.red = parseInt(result[1], 16)
            this.green = parseInt(result[2], 16)
            this.blue = parseInt(result[3], 16)
        }
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
        return `rgba(${this._red},${this._green},${this._blue},${this._alpha})` 
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
    // helpers
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
    // constructors
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
        const color = new Color()
        color.hex = hex
        return color
    }
    static fromRGB(rgb) {
        const color = new Color()
        color.rgb = rgb
        return color
    }
    static fromRGBA(rgba) {
        const color = new Color()
        color.rgba = rgba
        return color
    }
}

class Tools {
    static Tool = class {
        static name = "linetool"
        static defaultThickness = 10
        static defaultColor = Color.Black
        static set thickness(value) { this._thickness = value }
        static get thickness() {
            if (this._thickness == null) {
                return this.defaultThickness
            }
            return this._thickness
        }
        static set color(value) { this._color = value }
        static get color() {
            if (this._color == null) {
                return this.defaultColor
            }
            return this._color
        }
    
        static startPoint = null
        static element = null
        
        static start(event, mobile) {
            event = this.Point.fromEvent(event, mobile)
            this.startPoint = event
        }
        static stop(event, mobile) {
            this.element.draw(context)
            elements.push(this.element)
            this.element = null
            clearCanvas(previewContext)
        }
        static update(event, mobile) {
            event = this.Point.fromEvent(event, mobile)
            clearCanvas(previewContext)
            this.element = new this.Element(
                [this.startPoint, event],
                this.thickness,
                this.color
            )
            this.element.draw(previewContext)
        }
        static Element = class {
            constructor(points, thickness, color) {
                this.points = points
                this.thickness = thickness
                this.color = color
            }
            draw(context) {
                const startPoint = this.points[0]
                context.beginPath()
                context.strokeStyle = this.color.rgba
                context.lineWidth = this.thickness
                context.lineCap = "round"
                context.moveTo(startPoint.x, startPoint.y)
                this.points.slice(1, this.points.length).forEach(function(point) {
                    context.lineTo(point.x, point.y)
                })
                context.stroke()
            }
        }
        static Point = class {
            constructor(x, y) {
                this.x = x
                this.y = y
            }
            static fromEvent(event, mobile) {
                if (!mobile) {
                    return new this(event.clientX, event.clientY)
                } else {
                    return new this(event.touches[0].clientX, event.touches[0].clientY)
                }
            }
        }
    }
    static ScribbleTool = class extends Tools.Tool {
        static name = "scribbletool"
        static defaultSkip = 3
        static set skip(value) { this.Skip = value }
        static get skip() {
            if (this.Skip == null) {
                return this.defaultSkip
            }
            return this.Skip
        }

        static start(event, mobile) {
            super.start(event, mobile)
            this.element = new this.Element(
                [this.startPoint, this.startPoint],
                this.thickness,
                this.color
            )
        }
        static update(event, mobile) {
            event = this.Point.fromEvent(event, mobile)
            const skipped = Math.sqrt(Math.abs(event.x - this.startX)+Math.abs(event.y - this.startY))
            if (skipped >= this.skip) {
                this.element.points.push(this.Point.fromEvent(event))
            } else {
                clearCanvas(previewContext)
                this.element.points[this.element.points.length] = event
                this.element.draw(previewContext)
            }
        }
        static Element = class {
            constructor(points, thickness, color) {
                this.points = points
                this.thickness = thickness
                this.color = color
            }
            draw(context) {
                const startPoint = this.points[0]
                context.beginPath()
                context.strokeStyle = this.color.rgba
                context.lineWidth = this.thickness
                context.lineCap = "round"
                context.lineJoin = "round"
                context.moveTo(startPoint.x, startPoint.y)
                this.points.slice(1, this.points.length).forEach(function(point) {
                    context.lineTo(point.x, point.y)
                })
                context.stroke()
            }
        }
    }
    static LineTool = Tools.Tool
    static SquareTool = class extends Tools.Tool {
        static name = "squaretool"

        static update(event, mobile) {
            let PressedShift = pressedShift
            if (mobile) {
                PressedShift = event.touches.length > 1
            }
            event = this.Point.fromEvent(event, mobile)
            clearCanvas(previewContext)
            this.element = new this.Element(
                [this.startPoint, event],
                this.thickness,
                this.color,
                PressedShift
            )
            this.element.draw(previewContext)
        }
        static Element = class {
            constructor(points, thickness, color, square) {
                this.points = points
                this.thickness = thickness
                this.color = color
                this.square = square
            }
            draw(context) {
                const startPoint = this.points[0]
                const endPoint = this.points[1]
                context.beginPath()
                context.strokeStyle = this.color.rgba
                context.lineWidth = this.thickness
                context.lineCap = "round"
                if (this.square) {
                    const size = Math.abs(endPoint.x - startPoint.x)
                    if (endPoint.y < startPoint.y) {
                        if (endPoint.x < startPoint.x) {
                            context.rect(startPoint.x, startPoint.y, -size, -size)
                        } else {
                            context.rect(endPoint.x, startPoint.y, -size, -size)
                        }
                    } else {
                        if (endPoint.x < startPoint.x) {
                            context.rect(endPoint.x, startPoint.y, size, size)
                        } else {
                            context.rect(startPoint.x, startPoint.y, size, size)
                        }
                    }
                } else {
                    const sizeX = endPoint.x - startPoint.x
                    const sizeY = endPoint.y - startPoint.y
                    context.rect(startPoint.x, startPoint.y, sizeX, sizeY)
                }
                context.stroke()
            }
        }
    }
    static CircleTool = class extends Tools.SquareTool {
        static name = "circle"

        static Element = class {
            constructor(points, thickness, color, circle) {
                this.points = points
                this.thickness = thickness
                this.color = color
                this.circle = circle
            }
            draw(context) {
                const startPoint = this.points[0]
                const endPoint = this.points[1]
                context.beginPath()
                context.strokeStyle = this.color.rgba
                context.lineWidth = this.thickness
                context.lineCap = "round"
                if (this.circle) {
                        const radius = Math.abs((endPoint.x - startPoint.x) / 2)
                        if (endPoint.y < startPoint.y) {
                            if (endPoint.x < startPoint.x) {
                                context.arc(
                                    startPoint.x - radius, startPoint.y - radius,
                                    radius, 0, 2*Math.PI
                                )
                            } else {
                                context.arc(
                                    endPoint.x - radius, startPoint.y - radius,
                                    radius, 0, 2*Math.PI
                                )
                            }
                        } else {
                            if (endPoint.x < startPoint.x) {
                                context.arc(
                                    endPoint.x + radius, startPoint.y + radius,
                                    radius, 0, 2*Math.PI
                                )
                            } else {
                                context.arc(
                                    startPoint.x + radius, startPoint.y + radius,
                                    radius, 0, 2*Math.PI
                                )
                            }
                        }
                } else {
                    const radiusX = (endPoint.x - startPoint.x) / 2
                    const radiusY = (endPoint.y - startPoint.y) / 2
                    context.ellipse(
                        startPoint.x + radiusX,
                        startPoint.y + radiusY,
                        Math.abs(radiusX), Math.abs(radiusY),
                        0, 2*Math.PI, false
                    );
                }
                context.stroke()
            }
        }
    }
    static defaultTool = Tools.ScribbleTool
    static set currentTool(value) { Tools._currentTool = value }
    static get currentTool() {
        if (Tools._currentTool == null) {
            return Tools.defaultTool
        }
        return Tools._currentTool
    }
}