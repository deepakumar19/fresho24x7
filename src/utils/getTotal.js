export const getTotal = (items) => {
    return items.reduce((acc, curr) => {
        acc += curr.qty * curr.price
        return acc;
    }, 0)
}