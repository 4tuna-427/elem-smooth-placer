import ElemSmoothPlacer from './elem-smooth-placer.js'

const newItem = document.createElement('div')
newItem.classList.add('item')
newItem.innerText = 'added 1'

const items = Array.from(<HTMLCollectionOf<HTMLElement>> document.getElementsByClassName('item'))

ElemSmoothPlacer.swap({
    from: items[3],
    to: items[4],
    duration: 2000
})
setTimeout(() => {
    ElemSmoothPlacer.insert({
        from: items[4],
        to: items[2],
        position: 'before',
        duration: 500
    })
}, 500)

const lists = Array.from(<HTMLCollectionOf<HTMLElement>> document.getElementsByClassName('list'))

// ElemSmoothPlacer.insert({
//     from: newItem,
//     to: lists[1],
//     position: 'end',
//     duration: 1500
// })
