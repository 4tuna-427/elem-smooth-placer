import ElemSmoothPlacer from './elem-smooth-placer.js';
const newItem = document.createElement('div');
newItem.classList.add('item');
newItem.innerText = 'added 1';
const items = Array.from(document.getElementsByClassName('item'));
const lists = Array.from(document.getElementsByClassName('list'));
// insert test
const insertTest = () => {
    ElemSmoothPlacer.insert({
        from: newItem,
        to: items[0],
        position: 'before',
        duration: 1000
    });
    setTimeout(() => {
        ElemSmoothPlacer.insert({
            from: items[0],
            to: items[3],
            position: 'after',
            duration: 1000,
            fromClass: 'placer-from',
            toClass: 'placer-to'
        });
    }, 2000);
    setTimeout(() => {
        ElemSmoothPlacer.insert({
            from: items[1],
            to: lists[1],
            position: 'begin',
            duration: 1000,
            fromClass: 'placer-from',
            toClass: 'placer-to'
        });
    }, 3000);
    setTimeout(() => {
        ElemSmoothPlacer.insert({
            from: items[2],
            to: lists[1],
            position: 'end',
            duration: 1000,
            fromClass: 'placer-from',
            toClass: 'placer-to'
        });
    }, 4000);
};
// insertTest()
const insertTest2 = () => {
    ElemSmoothPlacer.insert({
        from: items[1],
        to: items[5],
        position: 'after',
        duration: 1000
    });
    setTimeout(() => {
        ElemSmoothPlacer.insert({
            from: items[2],
            to: items[1],
            position: 'after',
            duration: 1000
        });
    }, 500);
};
insertTest2();
// swap test
const swapTest = () => {
    ElemSmoothPlacer.swap({
        from: items[0],
        to: items[4],
        duration: 1000,
        fromClass: 'placer-from',
        toClass: '.placer-to'
    });
    setTimeout(() => {
        ElemSmoothPlacer.swap({
            from: items[2],
            to: items[5],
            duration: 1000,
            fromClass: 'placer-from',
            toClass: '.placer-to'
        });
    }, 1000);
    setTimeout(() => {
        ElemSmoothPlacer.swap({
            from: items[2],
            to: items[4],
            duration: 1000,
            fromClass: 'placer-from',
            toClass: '.placer-to'
        });
    }, 2000);
};
// swapTest()
// remove test
const removeTest = () => {
    ElemSmoothPlacer.remove({
        from: items[0],
        duration: 2000
    });
    setTimeout(() => {
        ElemSmoothPlacer.remove({
            from: items[2],
            duration: 2000
        });
    }, 1800);
    // setTim
    // setTimeout(() => {
    //     ElemSmoothPlacer.remove({
    //         from: items[3],
    //         duration: 1000
    //     })
    // }, 2000)
};
// removeTest()
//# sourceMappingURL=index.js.map