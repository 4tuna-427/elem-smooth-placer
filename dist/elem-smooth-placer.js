/**!
 * elem-smooth-placer
 * @author 4tuna
 * @license MIT
 */
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _ElemSmoothPlacer_transition;
class ElemSmoothPlacer {
    static insert(option) {
        __classPrivateFieldGet(this, _a, "m", _ElemSmoothPlacer_transition).call(this, 'insert', option);
    }
    static swap(option) {
        __classPrivateFieldGet(this, _a, "m", _ElemSmoothPlacer_transition).call(this, 'swap', option);
    }
    static remove(option) {
        __classPrivateFieldGet(this, _a, "m", _ElemSmoothPlacer_transition).call(this, 'remove', option);
    }
}
_a = ElemSmoothPlacer, _ElemSmoothPlacer_transition = function _ElemSmoothPlacer_transition(func, option) {
    const inputValidation = (func, option) => {
        const isFuncRangeValid = (['insert', 'swap', 'remove'].includes(func));
        if (!isFuncRangeValid) {
            throw new RangeError('funcで使用可能な文字列は "insert", "swap", "remove" です。');
        }
        if (func === 'remove') {
            const isFromReferenceValid = (option.from.parentNode !== null);
            if (!isFromReferenceValid) {
                throw new ReferenceError('fromが存在しません。');
            }
        }
        if (['insert', 'swap'].includes(func)) {
            const isToReferenceValid = (option.to != undefined);
            if (!isToReferenceValid) {
                throw new ReferenceError('toが未定義です。');
            }
        }
        if (func === 'insert') {
            const isPositionRangeValid = (['before', 'after', 'begin', 'end'].includes(option.position));
            if (!isPositionRangeValid) {
                throw new RangeError('option.positionで使用可能な文字列は "before", "after", "begin", "end" です。');
            }
        }
        if (option.duration != undefined) {
            const isDurationRangeValid = (option.duration >= 0);
            if (!isDurationRangeValid) {
                throw new RangeError('option.durationの有効な範囲は 0以上の数値 です。');
            }
        }
    };
    inputValidation(func, option);
    const sanitizing = (func, option) => {
        if (option.duration == undefined) {
            option.duration = ElemSmoothPlacer.defaultOption.duration;
        }
        if (option.fromClass != undefined) {
            option.fromClass = option.fromClass?.replace(/^\./, '');
        }
        if (option.toClass != undefined) {
            option.toClass = option.toClass?.replace(/^\./, '');
        }
        if (option.slideClass != undefined) {
            option.slideClass = option.slideClass?.replace(/^\./, '');
        }
    };
    sanitizing(func, option);
    const prevElemParams = (() => {
        let params = [];
        const displayedFrom = (option.from.parentNode !== null);
        if (displayedFrom) {
            const fromChildren = Array.from(option.from.parentNode.children);
            fromChildren.forEach(elem => {
                const rect = elem.getBoundingClientRect();
                params.push({
                    elem: elem,
                    position: {
                        x: rect.x,
                        y: rect.y
                    }
                });
            });
        }
        if (['insert', 'swap'].includes(func)) {
            const toChildren = (() => {
                if (func === 'insert') {
                    if (['before', 'after'].includes(option.position)) {
                        return Array.from(option.to.parentNode.children);
                    }
                    else {
                        return Array.from(option.to.children);
                    }
                }
                else { // swap
                    return Array.from(option.to.parentNode.children);
                }
            })();
            toChildren.forEach(elem => {
                const rect = elem.getBoundingClientRect();
                params.push({
                    elem: elem,
                    position: {
                        x: rect.x,
                        y: rect.y
                    }
                });
            });
        }
        return params;
    })();
    const setPosition = () => {
        if (func === 'insert') {
            const sip2ip = (sip) => {
                return {
                    before: 'beforebegin',
                    begin: 'afterbegin',
                    end: 'beforeend',
                    after: 'afterend'
                }[sip];
            };
            option.to.insertAdjacentElement(sip2ip(option.position), option.from);
        }
        else if (func === 'swap') {
            const dummy = document.createElement('div');
            option.from.insertAdjacentElement('afterend', dummy);
            option.to.insertAdjacentElement('afterend', option.from);
            dummy.insertAdjacentElement('afterend', option.to);
            dummy.remove();
        }
        else if (func === 'remove') {
            option.from.remove();
        }
        if (['insert', 'swap'].includes(func)) {
            option.from.style.transition = '';
            option.from.style.transform = '';
            option.to.style.transition = '';
            option.to.style.transform = '';
        }
    };
    setPosition();
    const nextElemParams = (() => {
        let params = [];
        prevElemParams.forEach(prevElemParam => {
            const rect = prevElemParam.elem.getBoundingClientRect();
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
            });
        });
        return params;
    })();
    const startTransition = () => {
        if (['insert', 'swap'].includes(func)) {
            const addClass = () => {
                if (option.fromClass != undefined) {
                    option.from.classList.add(option.fromClass);
                }
                if (option.toClass != undefined) {
                    option.to.classList.add(option.toClass);
                }
            };
            addClass();
        }
        let isFirst = true;
        const f = () => {
            if (isFirst) {
                nextElemParams.forEach(nextElemParam => {
                    const startX = nextElemParam.prevPosition.x - nextElemParam.position.x;
                    const startY = nextElemParam.prevPosition.y - nextElemParam.position.y;
                    if (startX !== 0 || startY !== 0) {
                        nextElemParam.elem.style.transform = `translate(${startX}px, ${startY}px)`;
                        if (option.slideClass != undefined) {
                            nextElemParam.elem.classList.add(option.slideClass);
                        }
                    }
                });
                isFirst = false;
                requestAnimationFrame(f);
            }
            else {
                nextElemParams.forEach(nextElemParam => {
                    const startX = nextElemParam.prevPosition.x - nextElemParam.position.x;
                    const startY = nextElemParam.prevPosition.y - nextElemParam.position.y;
                    if (startX !== 0 || startY !== 0) {
                        nextElemParam.elem.style.transition = `transform ${option.duration}ms`;
                        nextElemParam.elem.style.transform = `translate(0px, 0px)`;
                        nextElemParam.elem.addEventListener('transitionend', () => {
                            nextElemParam.elem.style.transition = '';
                            nextElemParam.elem.style.transform = '';
                            if (option.slideClass != undefined) {
                                nextElemParam.elem.classList.remove(option.slideClass);
                            }
                        }, { once: true });
                    }
                });
                const removeClass = () => {
                    if (option.fromClass != undefined) {
                        option.from.addEventListener('transitionend', () => {
                            option.from.classList.remove(option.fromClass);
                        }, { once: true });
                    }
                    if (option.toClass != undefined) {
                        option.to.addEventListener('transitionend', () => {
                            option.to.classList.remove(option.toClass);
                        }, { once: true });
                    }
                };
                removeClass();
            }
        };
        requestAnimationFrame(f);
    };
    startTransition();
};
ElemSmoothPlacer.defaultOption = {
    duration: 150
};
export default ElemSmoothPlacer;
//# sourceMappingURL=elem-smooth-placer.js.map