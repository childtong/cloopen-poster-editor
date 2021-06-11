import store from '@/store'
import { saveAs } from 'file-saver'
import { createDom, domToImg, base64ToBlob } from 'poster/utils'

/**
 * @returns {WidgetItem[]}
 */
function getAllWidgets() {
    return store.state.poster.posterItems
}

const htmlTemplate = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Document</title><style>*{ padding:0;margin:0;}#container{overflow:hidden;width:100%;height:0;position:absolute;padding-top:#{containerPaddingTop}#}</style></head>
<body><div id="container">#{containerInnerHtml}#</div></body></html>`

export default class ExportService {
    static exportH5() {
        const allWidgets = getAllWidgets()
        const background = store.state.poster.background
        const backgroundHtml = background._codeGen(background)
        const canvasSize = store.state.poster.canvasSize
        let bodyInnerHtml = ''
        allWidgets.forEach(item => {
            if (!item.visible) {
                return
            }
            if (item._codeGen) {
                bodyInnerHtml += item._codeGen(item, 'h5') || ''
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`类型为${item.type}的组件的构造函数未实现"_codeGen"方法`)
            }
        })
        const finalHtmlCode = htmlTemplate
            .replace(
                '#{containerPaddingTop}#',
                `${canvasSize.height * 100 / canvasSize.width}%`
            )
            .replace(
                '#{containerInnerHtml}#',
                backgroundHtml + bodyInnerHtml
            )
        const htmlBolb = new Blob([finalHtmlCode], { type: 'text/html' })
        saveAs(htmlBolb, 'index.html')
    }
    static exportPoster() {
        const allWidgets = getAllWidgets()
        const background = store.state.poster.background
        const backgroundHtml = background._codeGen(background, 'poster')
        const canvasSize = store.state.poster.canvasSize
        let bodyInnerHtml = ''
        allWidgets.forEach(item => {
            if (!item.visible) {
                return
            }
            if (item._codeGen) {
                bodyInnerHtml += item._codeGen(item) || ''
            } else if (process.env.NODE_ENV !== 'production') {
                console.warn(`类型为${item.type}的组件的构造函数未实现"_codeGen"方法`)
            }
        })
        const containerNode = createDom({
            tag: 'div',
            style: {
                position: 'absolute',
                width: canvasSize.width + 'px',
                height: canvasSize.height + 'px'
            }
        })
        const backgroundNode = document.createElement('div')
        const bodyInnerNode = document.createElement('div')
        backgroundNode.innerHTML = backgroundHtml
        bodyInnerNode.innerHTML = bodyInnerHtml
        containerNode.appendChild(backgroundNode)
        containerNode.appendChild(bodyInnerNode)
        // document.body.appendChild(containerNode)
        domToImg(containerNode, { width: canvasSize.width, height: canvasSize.height }).then(res => {
            saveAs(base64ToBlob(res.src), 'poster.png')
        })
    }
}
