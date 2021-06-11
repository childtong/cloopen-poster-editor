// import html2canvas from 'html2canvas'
import html2canvas from './html2canvas.min'

/**
 * 获取随机字符串
 * @returns {String}
 */
export function getRandomStr() {
    return Math.random().toString(32).substr(2)
}

// style属性片段
const styleFragment = {
    button: {
        height: '36px',
        boxSizing: 'border-box',
        padding: '0 8px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        border: 'none'
    },
    noWrap: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        paddingTop: '1px'
    },
    _defaultStyle: {
        boxSizing: 'border-box'
    }
}

/**
 * 根据nodeObj生成dom结构
 * @param {ComponentDomNode} obj
 * @returns {HTMLDivElement}
 */
export function createDom(obj) {
    let dom = null
    try {
        let { style = {}} = obj
        const { tag = 'div', styleFragment: domStyleFragment, attrs = {}, children, text } = obj
        dom = document.createElement(tag)
        if (domStyleFragment && domStyleFragment.length > 0) {
            const _style = {}
            domStyleFragment.forEach(item => {
                Object.assign(_style, styleFragment[item] || null)
            })
            style = Object.assign({}, _style, style)
        }
        Object.keys(style).forEach(key => {
            dom.style[key] = style[key]
        })
        Object.keys(styleFragment._defaultStyle).forEach(key => {
            dom.style[key] = styleFragment._defaultStyle[key]
        })
        Object.keys(attrs).forEach(key => {
            dom.setAttribute(key, attrs[key])
        })
        if (text) {
            dom.innerText = text
        }
        if (children && children.length > 0) {
            children.forEach(item => {
                dom.appendChild(createDom(item))
            })
        }
    } catch (e) {
        console.error(e)
    }
    return dom
}

/**
 * 生成html字符串
 * @param {ComponentDomNode} nodeObj
 * @returns {ComponentHtml}
 */
export function createHtmlStr(nodeObj) {
    const result = document.createElement('div')
    result.appendChild(createDom(nodeObj))
    return result.innerHTML
}

/**
 * 把style字符串转换为style对象
 * @param {String} styleStr style字符串
 * @returns {Object} styleObj
 */
export function parseStyle(styleStr) {
    if (!styleStr) {
        return {}
    }
    const styleArr = styleStr.split(';') || []
    const styleObj = {}
    styleArr.forEach(item => {
        const [attr, val] = item.split(':')
        if (attr && val && val !== 'undefined') { // 判断"undefined"是因为某些style字符串解析出来的属性为"undefined"字符串，所以要去除这种情况
            styleObj[toCamel(attr)] = val || ''
        }
    })
    return styleObj
}

/**
 * 把style对象转换为字符串
 * @param {Object} styleObj
 * @returns {String} styleStr style字符串
 */
export function stringifyStyle(styleObj) {
    let styleStr = ''
    const styleArr = []
    Object.keys(styleObj).forEach(key => {
        styleArr.push(`${toLine(key)}:${styleObj[key] || ''}`)
    })
    styleStr = styleArr.join(';')
    return styleStr
}

/**
 * 驼峰转横线
 * @param {String} str
 */
export function toLine(str) {
    let temp = str.replace(/[A-Z]/g, function(match) {
        return '-' + match.toLowerCase()
    })
    if (temp.slice(0, 1) === '-') { // 如果首字母是大写，执行replace时会多一个_，这里需要去掉
        temp = temp.slice(1)
    }
    return temp
}

/**
 *
 * @param {String} str 横线转驼峰
 */
export function toCamel(str) {
    const [fir, ...arr] = str.split('-')
    const result = fir + arr.map(item => {
        return item.substr(0, 1).toUpperCase() + item.substr(1)
    }).join('')
    return result
}

export function domToImg(dom, options = {}) {
    return new Promise((resolve, reject) => {
        const baseOptions = {
            width: 0,
            height: 0
        }
        options = Object.assign({}, baseOptions, options)
        const { width, height } = options
        try {
            document.body.appendChild(dom)
            html2canvas(dom, {
                width: width,
                height: height,
                // dpi: 192,
                scale: 2
            })
                .then(canvas => {
                    const url = canvas.toDataURL()
                    console.log(url)
                    const _img = document.createElement('img')
                    _img.width = width
                    _img.height = height
                    _img.src = url
                    document.body.removeChild(dom)
                    resolve(_img)
                })
                .catch(err => {
                    console.log(err)
                    document.body.removeChild(dom)
                    reject()
                })
        } catch (e) {
            console.log(e)
            reject()
        }
    })
}

/**
 * 将数组中某元素移动到0位置
 * @param {Array} arr
 * @param {Number} index
 * @returns {Array}
 */
export function arrMoveTop(arr, index) {
    if (index !== 0) {
        const _arr = [...arr]
        const moveItem = _arr.splice(index, 1)
        _arr.unshift(...moveItem)
        return _arr
    } else {
        return arr
    }
}

/**
 * @param {Array} arr
 * @param {Number} index
 * @returns {Array}
 */
export function arrMoveUpper(arr, index) {
    if (index !== 0) {
        const _arr = [...arr]
        const curIdx = index
        const preIdx = index - 1;
        [_arr[curIdx], _arr[preIdx]] = [_arr[preIdx], _arr[curIdx]]
        return _arr
    } else {
        return arr
    }
}

/**
 * 将数组中某元素向下移动一个位置
 * @param {Array} arr
 * @param {Number} index
 * @returns {Array}
 */
export function arrMoveLower(arr, index) {
    if (index !== arr.length - 1) {
        const _arr = [...arr]
        const curIdx = index
        const nextIdx = index + 1;
        [_arr[curIdx], _arr[nextIdx]] = [_arr[nextIdx], _arr[curIdx]]
        return _arr
    } else {
        return arr
    }
}

/**
 * 将数组中某元素移动到末尾
 * @param {Array} arr
 * @param {Number} index
 * @returns {Array}
 */
export function arrMoveBottom(arr, index) {
    const len = arr.length - 1
    if (index !== len) {
        const _arr = [...arr]
        const moveItem = _arr.splice(index, 1)
        _arr.push(...moveItem)
        return _arr
    } else {
        return arr
    }
}

export const HoC = (WrappedComponent, options) => ({
    inheritAttrs: false,
    ...options,
    props: typeof WrappedComponent === 'function'
        ? WrappedComponent.options.props
        : WrappedComponent.props,
    created() {
        this._isHoc = true
    },
    render(h) {
        const slots = this.$slots
        const scopedSlots = {}
        Object.keys(slots).map(key => (scopedSlots[key] = () => slots[key]))
        const props = options.props
        return h(WrappedComponent, {
            attrs: this.$attrs,
            props: Object.assign({}, this.$props, props),
            on: this.$listeners,
            scopedSlots
        })
    }
})

export function base64ToBlob(base64Str) {
    var arr = base64Str.split(',')
    var mime = arr[0].match(/:(.*?);/)[1]
    var bstr = atob(arr[1])
    var n = bstr.length
    var u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
}

