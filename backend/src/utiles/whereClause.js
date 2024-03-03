class WhereClause {
    #base; // model.find()
    #bigQuery;  // having all query parameters as page,limit,filter=priority/dueDate

    constructor(base,bigQuery) {
        this.#base = base;
        this.#bigQuery = bigQuery;
    }

    pagination(resultPerPage) {
        let currentPage = 1;
        if(this.#bigQuery.page) {
            currentPage = this.#bigQuery.page;
        }
        const skipValues = resultPerPage * (currentPage - 1);
        this.#base = this.#base.limit(resultPerPage).skip(skipValues);
        return this.#base;
    }
}

export default WhereClause;