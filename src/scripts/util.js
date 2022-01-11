export function roundToX(num, X) {
    return +(Math.round(num + "e+"+X)  + "e-"+X);
}

export function getPrettyNumber(num, type="") {
    let number = num;
    if (type === "percent") {
        number *= 100;
    }
    const roundedNumber = number.toLocaleString("de-ch", {minimumFractionDigits: 2, maximumFractionDigits: 2})
    if (type === "percent") {
        return `${roundedNumber} %`;
    }

    return roundedNumber;
}

export function sortData(data, sortBy, direction = "ascending") {
    const ascendingSort = (a, b) => {
        if (a[sortBy] < b[sortBy]) {
            return -1;
        } else if (a[sortBy] > b[sortBy]) {
            return 1;
        }
        return 0;
    };

    const descendingSort = (a, b) => {
        if (a[sortBy] < b[sortBy]) {
            return 1;
        } else if (a[sortBy] > b[sortBy]) {
            return -1;
        }
        return 0;
    }

    if (direction === "ascending") {
        return data.sort(ascendingSort);
    }
    return data.sort(descendingSort);
}
