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
                let children = [];
                if (func === 'insert') {
                    if (['before', 'after'].includes(option.position)) {
                        children = Array.from(option.to.parentNode.children);
                    }
                    else if (['begin', 'end'].includes(option.position)) {
                        children = Array.from(option.to.children);
                    }
                }
                else if (func === 'swap') {
                    children = Array.from(option.to.parentNode.children);
                }
                return children;
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
        prevElemParams.forEach(param => {
            param.elem.style.transition = '';
            param.elem.style.transform = '';
        });
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
            if (option.fromClass != undefined) {
                option.from.classList.add(option.fromClass);
            }
            if (option.toClass != undefined) {
                option.to.classList.add(option.toClass);
            }
        }
        let isFirst = true;
        const f = () => {
            if (isFirst) {
                nextElemParams.forEach(param => {
                    const startX = param.prevPosition.x - param.position.x;
                    const startY = param.prevPosition.y - param.position.y;
                    if (startX !== 0 || startY !== 0) {
                        param.elem.style.transform = `translate(${startX}px, ${startY}px)`;
                        if (option.slideClass != undefined) {
                            param.elem.classList.add(option.slideClass);
                        }
                    }
                });
                isFirst = false;
                requestAnimationFrame(f);
            }
            else {
                nextElemParams.forEach(param => {
                    const startX = param.prevPosition.x - param.position.x;
                    const startY = param.prevPosition.y - param.position.y;
                    if (startX !== 0 || startY !== 0) {
                        param.elem.style.transition = `transform ${option.duration}ms`;
                        param.elem.style.transform = `translate(0px, 0px)`;
                        param.elem.addEventListener('transitionend', () => {
                            param.elem.style.transition = '';
                            param.elem.style.transform = '';
                            if (option.slideClass != undefined) {
                                param.elem.classList.remove(option.slideClass);
                            }
                        }, { once: true });
                    }
                });
                if (option.fromClass != undefined) {
                    option.from.addEventListener('transitioncancel', () => {
                        option.from.classList.remove(option.fromClass);
                    }, { once: true });
                    option.from.addEventListener('transitionend', () => {
                        option.from.classList.remove(option.fromClass);
                    }, { once: true });
                }
                if (option.toClass != undefined) {
                    option.to.addEventListener('transitioncancel', () => {
                        option.to.classList.remove(option.toClass);
                    }, { once: true });
                    option.to.addEventListener('transitionend', () => {
                        option.to.classList.remove(option.toClass);
                    }, { once: true });
                }
            }
        };
        requestAnimationFrame(f);
    };
    startTransition();
};
ElemSmoothPlacer.transitioningClass = 'placer-transitioning';
ElemSmoothPlacer.defaultOption = {
    duration: 150
};
export default ElemSmoothPlacer;
//# sourceMappingURL=elem-smooth-placer.js.map