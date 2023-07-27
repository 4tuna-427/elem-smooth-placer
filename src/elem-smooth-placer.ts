/**!
 * elem-smooth-placer
 * @author 4tuna
 * @license MIT
 */

type ShortInsertPosition = 'before' | 'begin' | 'end' | 'after'
type FuncName = 'insert' | 'swap' | 'remove'
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
                    if (func === 'insert') {
                        if (['before', 'after'].includes(option.position!)) {
                            return Array.from(<HTMLCollectionOf<HTMLElement>>option.to!.parentNode!.children)
                        }
                        else {
                            return Array.from(<HTMLCollectionOf<HTMLElement>>option.to!.children)
                        }
                    }
                    else { // swap
                        return Array.from(<HTMLCollectionOf<HTMLElement>>option.to!.parentNode!.children)
                    }
                })()
                toChildren.forEach(elem => {
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

            if (['insert', 'swap'].includes(func)) {
                option.from.style.transition = ''
                option.from.style.transform = ''
                option.to!.style.transition = ''
                option.to!.style.transform = ''
            }
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
                const addClass = () => {
                    if (option.fromClass != undefined) {
                        option.from.classList.add(option.fromClass!)
                    }
                    if (option.toClass != undefined) {
                        option.to!.classList.add(option.toClass!)
                    }
                }
                addClass()
            }

            let isFirst = true
            const f = () => {
                if (isFirst) {
                    nextElemParams.forEach(nextElemParam => {
                        const startX = nextElemParam.prevPosition.x - nextElemParam.position.x
                        const startY = nextElemParam.prevPosition.y - nextElemParam.position.y
                        if (startX !== 0 || startY !== 0) {
                            nextElemParam.elem.style.transform = `translate(${startX}px, ${startY}px)`
                            if (option.slideClass != undefined) {
                                nextElemParam.elem.classList.add(option.slideClass!)
                            }
                        }
                    })
                    isFirst = false
                    requestAnimationFrame(f)
                }
                else {
                    nextElemParams.forEach(nextElemParam => {
                        const startX = nextElemParam.prevPosition.x - nextElemParam.position.x
                        const startY = nextElemParam.prevPosition.y - nextElemParam.position.y
                        if (startX !== 0 || startY !== 0) {
                            nextElemParam.elem.style.transition = `transform ${option.duration}ms`
                            nextElemParam.elem.style.transform = `translate(0px, 0px)`
                            nextElemParam.elem.addEventListener('transitionend', () => {
                                nextElemParam.elem.style.transition = ''
                                nextElemParam.elem.style.transform = ''
                                if (option.slideClass != undefined) {
                                    nextElemParam.elem.classList.remove(option.slideClass!)
                                }
                            }, { once: true })
                        }
                    })

                    const removeClass = () => {
                        if (option.fromClass != undefined) {
                            option.from.addEventListener('transitionend', () => {
                                option.from.classList.remove(option.fromClass!)
                            }, { once: true })
                        }
                        if (option.toClass != undefined) {
                            option.to!.addEventListener('transitionend', () => {
                                option.to!.classList.remove(option.toClass!)
                            }, { once: true })
                        }
                    }
                    removeClass()
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
