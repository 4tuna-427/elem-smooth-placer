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
var _a, _ElemSmoothPlacer_validation, _ElemSmoothPlacer_transition;
class ElemSmoothPlacer {
    static insert(option) {
        __classPrivateFieldGet(this, _a, "m", _ElemSmoothPlacer_transition).call(this, 'insert', option);
    }
    static swap(option) {
        __classPrivateFieldGet(this, _a, "m", _ElemSmoothPlacer_transition).call(this, 'swap', option);
    }
}
_a = ElemSmoothPlacer, _ElemSmoothPlacer_validation = function _ElemSmoothPlacer_validation(func, option) {
    const isFuncRangeValid = (['insert', 'swap'].includes(func));
    if (!isFuncRangeValid) {
        throw new RangeError('funcで使用可能な文字列は "insert", "swap" です。');
    }
    if (func === 'insert') {
        const isPositionRangeValid = (['before', 'after', 'begin', 'end'].includes(option.position));
        if (!isPositionRangeValid) {
            throw new RangeError('option.positionで使用可能な文字列は "before", "after", "begin", "end" です。');
        }
    }
    const isDurationRangeValid = (option.duration >= 0);
    if (!isDurationRangeValid) {
        throw new RangeError('option.durationの有効な範囲は 0以上の数値 です。');
    }
}, _ElemSmoothPlacer_transition = function _ElemSmoothPlacer_transition(func, option) {
    __classPrivateFieldGet(this, _a, "m", _ElemSmoothPlacer_validation).call(this, func, option);
    const prevElemParams = (() => {
        let params = [];
        const displayedFrom = (option.from.parentNode !== null);
        if (displayedFrom) {
            Array.from(option.from.parentNode.children).forEach(elem => {
                const rect = elem.getBoundingClientRect();
                const param = {
                    elem: elem,
                    position: {
                        x: rect.x,
                        y: rect.y
                    }
                };
                params.push(param);
            });
        }
        const toChildren = (() => {
            if (func === 'insert') {
                if (['before', 'after'].includes(option.position)) {
                    return option.to.parentNode.children;
                }
                else {
                    return option.to.children;
                }
            }
            else {
                return option.to.parentNode.children;
            }
        })();
        Array.from(toChildren).forEach(elem => {
            const rect = elem.getBoundingClientRect();
            const param = {
                elem: elem,
                position: {
                    x: rect.x,
                    y: rect.y
                }
            };
            params.push(param);
        });
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
        else {
            const dummy = document.createElement('div');
            option.from.insertAdjacentElement('afterend', dummy);
            option.to.insertAdjacentElement('afterend', option.from);
            dummy.insertAdjacentElement('afterend', option.to);
            dummy.remove();
        }
        option.from.style.transition = '';
        option.from.style.transform = '';
        option.to.style.transition = '';
        option.to.style.transform = '';
    };
    setPosition();
    const nextElemParams = (() => {
        let params = [];
        prevElemParams.forEach(prevElemParam => {
            const rect = prevElemParam.elem.getBoundingClientRect();
            const param = {
                elem: prevElemParam.elem,
                prevPosition: {
                    x: prevElemParam.position.x,
                    y: prevElemParam.position.y
                },
                position: {
                    x: rect.x,
                    y: rect.y
                }
            };
            params.push(param);
        });
        return params;
    })();
    const startTransition = () => {
        let isFirst = true;
        const f = () => {
            if (isFirst) {
                nextElemParams.forEach(nextElemParam => {
                    const startX = nextElemParam.prevPosition.x - nextElemParam.position.x;
                    const startY = nextElemParam.prevPosition.y - nextElemParam.position.y;
                    if (startX !== 0 || startY !== 0) {
                        nextElemParam.elem.style.transform = `translate(${startX}px, ${startY}px)`;
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
                    }
                });
            }
        };
        requestAnimationFrame(f);
    };
    startTransition();
};
export default ElemSmoothPlacer;
//# sourceMappingURL=elem-smooth-placer.js.map