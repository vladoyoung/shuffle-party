// Mix arrays together evenly, one object from each array at a time. Used to mix two users songs together.
export default function arrayMixer(arr1: Array<any>, arr2: Array<any>) {
    let mixedArray = []
    let i = 0
    while (i < arr1.length || i < arr2.length) {
        if (i < arr1.length) {
            mixedArray.push(arr1[i])
        }
        if (i < arr2.length) {
            mixedArray.push(arr2[i])
        }
        i++
    }
    return mixedArray
}
