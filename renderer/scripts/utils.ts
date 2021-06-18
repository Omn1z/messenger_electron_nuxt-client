export const phoneRegion = (value: string) => {
    if (/^\+?7(9\d{9})$/.exec(value)) {
        return 1
    } else if (/^\+?3?8?(0[5-9][0-9]\d{7})$/.exec(value)) {
        return 2
    } else if (/^\+?3?7?(5\d{9})$/.exec(value)) {
        return 3
    }
    return 0
}

export const ConvertByNumber = (value: number, words: string[]) => {
    value = Math.abs(value) % 100;
    const num = value % 10;
    if(value > 10 && value < 20) return words[2];
    if(num > 1 && num < 5) return words[1];
    if(num == 1) return words[0];
    return words[2];
}

export const LoadFileWithReader = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function (e) {
            if(!e.target!.error) {
                resolve(e.target!.result)
            } else {
                reject(e.target!.error)
            }
        };
        reader.readAsDataURL(file);
    })
};

export const moveArrayElementTo = (array: Array<any>, sourceIndex: number, destIndex: number) => {
    const placeholder = {};
    const objectToMove = array.splice(sourceIndex, 1, placeholder)[0];
    array.splice(destIndex, 0, objectToMove);
    array.splice(array.indexOf(placeholder), 1);
}