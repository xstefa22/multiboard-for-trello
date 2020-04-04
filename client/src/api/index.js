export const findPosition = (sourceIndex, destinationIndex, list, differentList = true) => {
    if (destinationIndex === 0) {
        return (list.length === 0) ? Math.random() * 100000 : list[destinationIndex].pos / 2;
    } else if (destinationIndex === list.length) {
        return list[destinationIndex - 1].pos + 16384;
    } else if (destinationIndex > 0 && destinationIndex < list.length) {
        if (differentList || sourceIndex > destinationIndex) {
            return (list[destinationIndex].pos + list[destinationIndex - 1].pos) / 2;
        } else {
            return (list[destinationIndex].pos + list[destinationIndex + 1].pos) / 2;
        }
    }
}

// Sorts cards by theirs position, used when rendering cards in list or when trying to find new card's position after move
export const sortCards = (cards) => {
    const cardsToSort = [...cards];

    const sorted = cardsToSort.sort((a, b) => {
        return a.pos > b.pos ? 1 : -1;
    });

    return sorted;
}

// Sorts array of items by theirs ids, which are strings
export const sortById = (arrayToBeSorted) => {
    const newArray = [...arrayToBeSorted];

    const sorted = newArray.sort((a, b) => {
        return ('' + a.id).localeCompare(b.id);
    });

    return sorted;
}
