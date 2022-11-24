interface formatOptions {

}
export function formatNumber(value: number, options?: formatOptions) {
    const dividedValue = value / 1000;
    if(dividedValue < 1) {
        return value.toString();
    }
    const formattedThousands: string = `${String(dividedValue).substring(0, 4)}K`;
    return formattedThousands;
}

export function capitalize(word: string) {
    if(typeof word === "undefined" || word === null || word.length < 1) {
        throw new Error("");
        //return ;
    }
    return `${word.at(0)!.toUpperCase()}${word.substring(1)}`;
}
