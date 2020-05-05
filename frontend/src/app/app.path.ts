export const END_POINT = {
    USER: {
        GET_DETAIL: '/users/',
        UPDATE: '/users/',
        CREATE: '/users',
        GET: '/users',
        DELETE: '/users/'

    },
    ROLE: {
        GET_ROLES: '/groupPermissions',
        GET_DETAIL: '/groupPermissions/',

    },
    DEPARMENT: {
        GET: '/departments',
        GET_DETAIL: '/departments/',
    },
    DOCUMENT: {
        GET: '/documents',
        CREATE: '/documents',
        UPDATE: '/documents/',
        DELETE: '/documents/',
        GET_DETAIL: '/documents/'
    },

    COMMENT: {
        GET: '/comments',
        CREATE: '/comments',
        UPDATE: '/comments/',
        DELETE: '/comments/',
        GET_DETAIL: '/comments/'
    },
    STATIC_PATH: 'http://api.com1640.tk/static/'
};

export const METHOD_TYPE = {
    GET: 'GET',
    DELETE: 'DELETE',
    POST: 'POST',
    PUT: 'PUT',
}
