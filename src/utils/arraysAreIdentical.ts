export default function arraysAreIdentical(arr1: Array<any>, arr2: Array<any>) {
    // Check if arrays have the same length
    if (arr1.length !== arr2.length) {
        return false
    }

    // Check if each element in the arrays is identical
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false
        }
    }

    // If both conditions pass, arrays are identical
    return true
}