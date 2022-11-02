
export const arrayIsEmpty = (array, index) => {
    if(Array.isArray(array) && typeof array[index] !== "undefined")
        return false;
    return true;
};
