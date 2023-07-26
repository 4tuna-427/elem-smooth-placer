import ElemSmoothPlacer from './elem-smooth-placer.js';
const newItem = document.createElement('div');
newItem.classList.add('item');
newItem.innerText = 'added 1';
const items = Array.from(document.getElementsByClassName('item'));
ElemSmoothPlacer.swap({
    from: items[0],
    to: items[4],
    duration: 1000,
    fromClass: 'placer-from',
    toClass: '.placer-to',
    slideClass: '.placer-slide',
});
setTimeout(() => {
    ElemSmoothPlacer.insert({
        from: items[0],
        to: items[1],
        position: 'before',
        duration: 3000
    });
}, 500);
setTimeout(() => {
    ElemSmoothPlacer.insert({
        from: items[0],
        to: items[5],
        position: 'before',
        duration: 3000
    });
}, 2000);
const lists = Array.from(document.getElementsByClassName('list'));
// ElemSmoothPlacer.insert({
//     from: newItem,
//     to: lists[1],
//     position: 'end',
//     duration: 1500
// })
//# sourceMappingURL=index.js.map