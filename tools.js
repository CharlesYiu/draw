function clearCanvas(context) {
    const canvas = context.canvas
    context.clearRect(0, 0, canvas.width, canvas.height)
}
function resizeCanvas(context) {
    context.canvas.width  = window.innerWidth
    context.canvas.height = window.innerHeight
}
let elements = []
function drawBackground(context, color = Color.White) {
    context.fillStyle = color.rgba
    context.fillRect(0, 0, context.canvas.width, context.canvas.height)
}
function redrawElements(context, elements) {
    clearCanvas(context)
    drawBackground(context)
    elements.forEach(function(element) {
        element.draw(context)
    })
}

const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
window.addEventListener("resize", function() {
    resizeCanvas(context)
    redrawElements(context, elements)
})
resizeCanvas(context)

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
drawBackground(context)
function randomId(prefix = "")
{
    return Math.random().toString(36).replace('0.',prefix || '');
}
class Tools {
    static Handle() {
        let pointers = []
        canvas.addEventListener("touchstart", function(event) {
            event.preventDefault()
            for(let index = 0; index < event.touches.length; index++) {
                const touch = event.touches[index]
                if (!pointers.some(pointer => pointer.identifier === touch.identifier)) {
                    const pointerIndex = pointers.push({
                        tool: new Tools.selected(),
                        identifier: touch.identifier,
                        event: touch
                    }) - 1
                    pointers[pointerIndex].tool.start(touch, false)
                }
            }
        })
        canvas.addEventListener("touchmove", function(event) {
            event.preventDefault()
            for(let index = 0; index < event.touches.length; index++) {
                const touch = event.touches[index]
                for(let index = 0; index < pointers.length; index++) {
                    const pointer = pointers[index]
                    if (pointer.identifier == touch.identifier) {
                        pointer.event = touch
                        pointer.tool.update(touch, true)
                        console.log(pointer)
                        break
                    }
                }
            }
        })
        canvas.addEventListener("touchend", function(event) {
            event.preventDefault()
            pointers.forEach(function(pointer) {
                let hasEnded = true
                for(let index = 0; index < event.touches.length; index++) {
                    const touch = event.touches[index]
                    if (touch.identifier == pointer.identifier) {
                        hasEnded = false
                        break
                    }
                }
                if (hasEnded) {
                    pointer.tool.stop(pointer.event, true)
                    pointers.splice(pointers.indexOf(pointer))
                }
            })
        })
        let mouseDown = false
        canvas.addEventListener("mousedown", function(event) {
            mouseDown = true
            const pointerIndex = pointers.push({
                tool: new Tools.selected(),
                identifier: "mouse",
                event: event
            }) - 1
            pointers[pointerIndex].tool.start(event, false)
        })
        canvas.addEventListener("mousemove", function(event) {
            if (!mouseDown) { return }
            pointers.some(function(pointer) {
                if (pointer.identifier == "mouse") {
                    pointer.tool.update(event, false)
                    return true
                }
                return false
            })
        })
        function mouseDone(event) {
            mouseDown = false
            pointers.some(function(pointer) {
                if (pointer.identifier == "mouse") {
                    pointer.tool.stop(event, false)
                    pointers.splice(pointers.indexOf(pointer))
                    return true
                }
                return false
            })
        }
        canvas.addEventListener("mouseup", mouseDone)
        canvas.addEventListener("mouseleave", mouseDone)
    }
    static Point = class {
        constructor(x, y) {
            this.x = x
            this.y = y
        }
        static fromEvent(event) {
            return new this(event.clientX, event.clientY)
        }
    }
    static Tool = class {
        static name = "linetool"
        name = "linetool"
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
        get tool() { return Tools.fromName(this.name) }

        startPoint = null
        element = null
        previewContext = null

        onResize() {
            resizeCanvas(this.previewContext)
            redrawElements(this.previewContext, [this.element])
        }
        start(event, mobile) {
            const previewCanvas = document.createElement("canvas")
            previewCanvas.id = randomId("preview-")
            previewCanvas.classList.add("previewCanvas")
            document.body.insertBefore(previewCanvas, Cursor.element)

            this.previewContext = previewCanvas.getContext("2d")

            window.addEventListener("resize", this.onResize)
            resizeCanvas(this.previewContext)

            event = Tools.Point.fromEvent(event)
            this.startPoint = event
        }
        stop(event, mobile) {
            this.element.draw(context)
            elements.push(this.element)
            this.element = null

            document.body.removeChild(this.previewContext.canvas)
            window.removeEventListener("resize", this.onResize)
        }
        update(event, mobile) {
            event = Tools.Point.fromEvent(event)
            clearCanvas(this.previewContext)
            this.element = new this.tool.Element(
                [this.startPoint, event],
                this.tool.thickness,
                this.tool.color
            )
            this.element.draw(this.previewContext)
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
    }
    static PencilTool = class extends Tools.Tool {
        static name = "penciltool"
        name = "penciltool"
        static defaultSkip = 3
        static set skip(value) { this.Skip = value }
        static get skip() {
            if (this.Skip == null) {
                return this.defaultSkip
            }
            return this.Skip
        }

        start(event, mobile) {
            super.start(event, mobile)
            this.element = new this.tool.Element(
                [this.startPoint, this.startPoint],
                this.tool.thickness,
                this.tool.color
            )
        }
        update(event, mobile) {
            event = Tools.Point.fromEvent(event)
            const skipped = Math.sqrt(Math.abs(event.x - this.startX)+Math.abs(event.y - this.startY))
            if (skipped >= this.skip) {
                this.element.points.push(Tools.Point.fromEvent(event))
            } else {
                clearCanvas(this.previewContext)
                this.element.points[this.element.points.length] = event
                this.element.draw(this.previewContext)
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
        name = "squaretool"

        update(event, mobile) {
            // let PressedShift = pressedShift
            // if (mobile) {
            //     PressedShift = event.touches.length > 1
            // }
            event = Tools.Point.fromEvent(event, mobile)
            clearCanvas(this.previewContext)
            console.log(this.tool)
            this.element = new this.tool.Element(
                [this.startPoint, event],
                this.tool.thickness,
                this.tool.color,
                pressedShift
            )
            console.log(new this.tool.Element(
                [this.startPoint, event],
                this.tool.thickness,
                this.tool.color,
                pressedShift
            ))
            this.element.draw(this.previewContext)
        }
        static Element = class {
            constructor(points, thickness, color, equalWidth) {
                this.points = points
                this.thickness = thickness
                this.color = color
                this.equalWidth = equalWidth
            }
            draw(context) {
                const startPoint = this.points[0]
                const endPoint = this.points[1]
                context.beginPath()
                context.strokeStyle = this.color.rgba
                context.lineWidth = this.thickness
                context.lineCap = "round"
                context.lineJoin = "round"
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
        static name = "circletool"
        name = "circletool"

        static Element = class extends Tools.SquareTool.Element {
            draw(context, mobile) {
                const startPoint = this.points[0]
                const endPoint = this.points[1]
                context.beginPath()
                context.strokeStyle = this.color.rgba
                context.lineWidth = this.thickness
                context.lineCap = "round"
                context.lineJoin = "round"
                if (this.equalWidth) {
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
    static EraseTool = class extends Tools.PencilTool {
        static name = "erasetool"
        name = "erasetool"

        static defaultColor = Color.White
        // The tool's color will always be white
        static set color(value) { }
        static get color() { return this.defaultColor }
    }
    // static ColorTool = class extends Tools.Tool {
    //     static name = "linetool"
    //     name = "linetool"
        
    //     static defaultColor = Color.White

    //     start(event, mobile) { }
    //     stop(event, mobile) {
    //         const rgb = context.getImageData(event.clientX, event.clientY, 1, 1).data
    //         Tools.ColorTool.color = new Color(rgb[0], rgb[1], rgb[2])
    //     }
    //     update(event, mobile) {
    //     }
    // }
    static fromName(name) {
        switch(name) {
            case "linetool":
                return this.LineTool
            case "penciltool":
                return this.PencilTool
            case "squaretool":
                return this.SquareTool
            case "circletool":
                return this.CircleTool
            case "erasetool":
                return this.EraseTool
            // case "colortool":
            //     return this.ColorTool
        }
    }
    static defaultTool = Tools.PencilTool
    static set selected(value) { this._selected = value }
    static get selected() {
        if (this._selected == null) {
            return this.defaultTool
        }
        return this._selected
    }
}