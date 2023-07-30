/**!
 * elem-smooth-placer
 * @author 4tuna
 * @license MIT
 */

type FuncName = 'insert' | 'swap' | 'remove'
type ShortInsertPosition = 'before' | 'begin' | 'end' | 'after'
type Option = {
    from: HTMLElement,
    to?: HTMLElement,
    position?: ShortInsertPosition,
    duration?: number,
    fromClass?: string,
    toClass?: string,
    slideClass?: string
}
type Point = {
    x: number,
    y: number
}

export default class ElemSmoothPlacer {
    static transitioningClass = 'placer-transitioning'
    static defaultOption = {
        duration: 150
    }

    static #transition(func: FuncName, option: Option) {
        const inputValidation = (func: FuncName, option: Option) => {
            const isFuncRangeValid = (['insert', 'swap', 'remove'].includes(func))
            if (!isFuncRangeValid) {
                throw new RangeError('funcで使用可能な文字列は "insert", "swap", "remove" です。')
            }

            if (func === 'remove') {
                const isFromReferenceValid = (option.from.parentNode !== null)
                if (!isFromReferenceValid) {
                    throw new ReferenceError('fromが存在しません。')
                }
            }

            if (['insert', 'swap'].includes(func)) {
                const isToReferenceValid = (option.to != undefined)
                if (!isToReferenceValid) {
                    throw new ReferenceError('toが未定義です。')
                }
            }

            if (func === 'insert') {
                const isPositionRangeValid = (['before', 'after', 'begin', 'end'].includes(option.position!))
                if (!isPositionRangeValid) {
                    throw new RangeError('option.positionで使用可能な文字列は "before", "after", "begin", "end" です。')
                }
            }

            if (option.duration != undefined) {
                const isDurationRangeValid = (option.duration >= 0)
                if (!isDurationRangeValid) {
                    throw new RangeError('option.durationの有効な範囲は 0以上の数値 です。')
                }
            }
        }
        inputValidation(func, option)

        const sanitizing = (func: FuncName, option: Option) => {
            if (option.duration == undefined) {
                option.duration = ElemSmoothPlacer.defaultOption.duration
            }

            if (option.fromClass != undefined) {
                option.fromClass = option.fromClass?.replace(/^\./, '')
            }

            if (option.toClass != undefined) {
                option.toClass = option.toClass?.replace(/^\./, '')
            }

            if (option.slideClass != undefined) {
                option.slideClass = option.slideClass?.replace(/^\./, '')
            }
        }
        sanitizing(func, option)

        const prevElemParams: { elem: HTMLElement, position: Point }[] = (() => {
            let params: { elem: HTMLElement, position: Point }[] = []
            const displayedFrom = (option.from.parentNode !== null)
            if (displayedFrom) {
                const fromChildren = Array.from(option.from.parentNode!.children)
                fromChildren.forEach(elem => {
                    const rect = elem.getBoundingClientRect()
                    params.push({
                        elem: <HTMLElement>elem,
                        position: {
                            x: rect.x,
                            y: rect.y
                        }
                    })
                })
            }
            if (['insert', 'swap'].includes(func)) {
                const toChildren = (() => {
                    let children: HTMLElement[] = []
                    if (func === 'insert') {
                        if (['before', 'after'].includes(option.position!)) {
                            children = Array.from(<HTMLCollectionOf<HTMLElement>>option.to!.parentNode!.children)
                        }
                        else if (['begin', 'end'].includes(option.position!)) {
                            children = Array.from(<HTMLCollectionOf<HTMLElement>>option.to!.children)
                        }
                    }
                    else if (func === 'swap') {
                        children = Array.from(<HTMLCollectionOf<HTMLElement>>option.to!.parentNode!.children)
                    }
                    return children
                })()
                toChildren!.forEach(elem => {
                    const rect = elem.getBoundingClientRect()
                    params.push({
                        elem: <HTMLElement>elem,
                        position: {
                            x: rect.x,
                            y: rect.y
                        }
                    })
                })
            }
            return params
        })()

        const setPosition = () => {
            if (func === 'insert') {
                const sip2ip = (sip: ShortInsertPosition) => {
                    return <InsertPosition>{
                        before: 'beforebegin',
                        begin: 'afterbegin',
                        end: 'beforeend',
                        after: 'afterend'
                    }[sip]
                }
                option.to!.insertAdjacentElement(sip2ip(option.position!), option.from)
            }
            else if (func === 'swap') {
                const dummy = document.createElement('div')
                option.from.insertAdjacentElement('afterend', dummy)
                option.to!.insertAdjacentElement('afterend', option.from)
                dummy.insertAdjacentElement('afterend', option.to!)
                dummy.remove()
            }
            else if (func === 'remove') {
                option.from.remove()
            }

            prevElemParams.forEach(param => {
                param.elem.style.transition = ''
                param.elem.style.transform = ''
            })
        }
        setPosition()

        const nextElemParams: { elem: HTMLElement, prevPosition: Point, position: Point }[] = (() => {
            let params: { elem: HTMLElement, prevPosition: Point, position: Point }[] = []
            prevElemParams.forEach(prevElemParam => {
                const rect = prevElemParam.elem.getBoundingClientRect()
                params.push({
                    elem: prevElemParam.elem,
                    prevPosition: {
                        x: prevElemParam.position.x,
                        y: prevElemParam.position.y
                    },
                    position: {
                        x: rect.x,
                        y: rect.y
                    }
                })
            })
            return params
        })()

        const startTransition = () => {
            if (['insert', 'swap'].includes(func)) {
                if (option.fromClass != undefined) {
                    option.from.classList.add(option.fromClass!)
                }
                if (option.toClass != undefined) {
                    option.to!.classList.add(option.toClass!)
                }
            }

            let isFirst = true
            const f = () => {
                if (isFirst) {
                    nextElemParams.forEach(param => {
                        const startX = param.prevPosition.x - param.position.x
                        const startY = param.prevPosition.y - param.position.y
                        if (startX !== 0 || startY !== 0) {
                            param.elem.style.transform = `translate(${startX}px, ${startY}px)`
                            if (option.slideClass != undefined) {
                                param.elem.classList.add(option.slideClass!)
                            }
                        }
                    })
                    isFirst = false
                    requestAnimationFrame(f)
                }
                else {
                    nextElemParams.forEach(param => {
                        const startX = param.prevPosition.x - param.position.x
                        const startY = param.prevPosition.y - param.position.y
                        if (startX !== 0 || startY !== 0) {
                            param.elem.style.transition = `transform ${option.duration}ms`
                            param.elem.style.transform = `translate(0px, 0px)`
                            param.elem.addEventListener('transitionend', () => {
                                param.elem.style.transition = ''
                                param.elem.style.transform = ''
                                if (option.slideClass != undefined) {
                                    param.elem.classList.remove(option.slideClass!)
                                }
                            }, { once: true })
                        }
                    })

                    if (option.fromClass != undefined) {
                        option.from.addEventListener('transitioncancel', () => {
                            option.from.classList.remove(option.fromClass!)
                        }, { once: true })
                        option.from.addEventListener('transitionend', () => {
                            option.from.classList.remove(option.fromClass!)
                        }, { once: true })
                    }
                    if (option.toClass != undefined) {
                        option.to!.addEventListener('transitioncancel', () => {
                            option.to!.classList.remove(option.toClass!)
                        }, { once: true })
                        option.to!.addEventListener('transitionend', () => {
                            option.to!.classList.remove(option.toClass!)
                        }, { once: true })
                    }
                }
            }
            requestAnimationFrame(f)
        }
        startTransition()
    }

    static insert(option: Option) {
        this.#transition('insert', option)
    }

    static swap(option: Option) {
        this.#transition('swap', option)
    }

    static remove(option: Option) {
        this.#transition('remove', option)
    }
}
