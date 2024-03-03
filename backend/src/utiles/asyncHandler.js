const asyncHandler = (handleRequest) => async (request,response,next) => {
    Promise.resolve(handleRequest(request,response,next))
        .catch((error) => {
            console.log(error);
        })
}
export {asyncHandler}