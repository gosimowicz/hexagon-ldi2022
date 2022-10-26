export const chunk = <T>(array: ReadonlyArray<T>, chunkSize: number): Array<Array<T>> => {
    const response: Array<Array<T>> = [];

    for (let i = 0; i < array.length; i += chunkSize) {
        response.push(array.slice(i, i + chunkSize));
    }

    return response;
};