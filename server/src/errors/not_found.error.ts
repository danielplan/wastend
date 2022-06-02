export default class NotFoundError extends Error {
    constructor(public element?: string) {
        super('label.' + element + '_not_found');
    }
}