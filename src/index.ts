import ElemSmoothPlacer from './elem-smooth-placer.js'

const newItem = document.createElement('div')
newItem.classList.add('item')
newItem.innerText = 'added 1'

const items = Array.from(<HTMLCollectionOf<HTMLElement>>document.getElementsByClassName('item'))
const lists = Array.from(<HTMLCollectionOf<HTMLElement>>document.getElementsByClassName('list'))

// insert test
const insertTest = () => {
    ElemSmoothPlacer.insert({
        from: newItem,
        to: items[0],
        position: 'before',
        duration: 1000
    })
    setTimeout(() => {
        ElemSmoothPlacer.insert({
            from: items[0],
            to: items[3],
            position: 'after',
            duration: 1000,
            class: {
                from: 'placer-from',
                to: 'placer-to'
            }
        })
    }, 1000)
    setTimeout(() => {
        ElemSmoothPlacer.insert({
            from: items[1],
            to: lists[1],
            position: 'begin',
            duration: 1000,
            class: {
                from: 'placer-from'
            }
        })
    }, 2000)
    setTimeout(() => {
        ElemSmoothPlacer.insert({
            from: items[2],
            to: lists[1],
            position: 'end',
            duration: 1000,
            class: {
                from: 'placer-from'
            }
        })
    }, 3000)
}

const insertTest2 = () => {
    ElemSmoothPlacer.insert({
        from: items[1],
        to: items[5],
        position: 'after',
        duration: 1000,
        class: {
            from: 'placer-from',
            to: 'placer-to',
            slide: 'placer-slide'
        }
    })
    setTimeout(() => {
        ElemSmoothPlacer.insert({
            from: items[2],
            to: items[1],
            position: 'before',
            duration: 1000,
            class: {
                from: 'placer-from',
                to: 'placer-to',
                slide: 'placer-slide'
            }
        })
    }, 500)
    setTimeout(() => {
        ElemSmoothPlacer.swap({
            from: items[3],
            to: items[4],
            duration: 1000,
            class: {
                from: 'placer-from',
                to: 'placer-to',
                slide: 'placer-slide'
            }
        })
    }, 1000)
    setTimeout(() => {
        ElemSmoothPlacer.swap({
            from: items[4],
            to: items[3],
            duration: 1000,
            class: {
                from: 'placer-from',
                to: 'placer-to',
                slide: 'placer-slide'
            }
        })
    }, 2000)
    setTimeout(() => {
        ElemSmoothPlacer.swap({
            from: items[3],
            to: items[4],
            duration: 1000,
            class: {
                from: 'placer-from',
                to: 'placer-to',
                slide: 'placer-slide'
            }
        })
    }, 2500)
}

// swap test
const swapTest = () => {
    ElemSmoothPlacer.swap({
        from: items[0],
        to: items[4],
        duration: 1000,
        class: {
            from: 'placer-from',
            to: 'placer-to',
            slide: 'placer-slide'
        }
    })
    setTimeout(() => {
        ElemSmoothPlacer.swap({
            from: items[2],
            to: items[5],
            duration: 1000,
            class: {
                from: 'placer-from',
                to: 'placer-to',
                slide: 'placer-slide'
            }
        })
    }, 1500)
    setTimeout(() => {
        ElemSmoothPlacer.swap({
            from: items[2],
            to: items[4],
            duration: 1000,
            class: {
                from: 'placer-from',
                to: 'placer-to',
                slide: 'placer-slide'
            }
        })
    }, 3000)
}

// remove test
const removeTest = () => {
    ElemSmoothPlacer.remove({
        from: items[0],
        duration: 1000,
        class: {
            from: 'placer-from',
            to: 'placer-to',
            slide: 'placer-slide'
        }
    })
    setTimeout(() => {
        ElemSmoothPlacer.remove({
            from: items[2],
            duration: 1000,
            class: {
                from: 'placer-from',
                to: 'placer-to',
                slide: 'placer-slide'
            }
        })
    }, 800)
}

// class test
const classTest = () => {
    ElemSmoothPlacer.insert({
        from: newItem,
        to: items[0],
        position: 'before',
        duration: 1000,
        class: {
            all: 'placer-all',
            from: 'placer-from'
        }
    })
    setTimeout(() => {
        ElemSmoothPlacer.insert({
            from: items[0],
            to: items[3],
            position: 'after',
            duration: 1000,
            class: {
                all: 'placer-all',
                from: 'placer-from'
            }
        })
    }, 1000)
    setTimeout(() => {
        ElemSmoothPlacer.swap({
            from: newItem,
            to: items[5],
            duration: 1000,
            class: {
                all: 'placer-all',
                from: 'placer-from'
            }
        })
    }, 1500)
    setTimeout(() => {
        ElemSmoothPlacer.swap({
            from: items[2],
            to: items[4],
            duration: 1000,
            class: {
                all: 'placer-all',
                from: 'placer-from'
            }
        })
    }, 2000)
}

// insertTest()
// insertTest2()
// swapTest()
// removeTest()
classTest()
