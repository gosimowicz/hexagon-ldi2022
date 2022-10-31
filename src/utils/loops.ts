const loops = {
    mapN: <T>(n: number, callback: (index: number, currentResponse: ReadonlyArray<T>) => T): Array<T> => {
        const response: Array<T> = [];

        for (let i = 0; i < n; i++) {
            response.push(callback(i, response));
        }

        return response;
    }
};

export default loops;