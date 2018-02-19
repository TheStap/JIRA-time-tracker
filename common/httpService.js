const axios = require('axios');
const Exception = require("./errors").Exception;

const URLRegex = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/;

const http = axios.create({
    headers: {"Content-Type": "application/json"}
});

class HttpService {
    static async sendGetRequest(baseUrl, params, routes, sid) {
        const url = HttpService.generateUrl(baseUrl, routes);
        const headers = {};
        if (sid) {
            headers.cookie = sid;
        }
        console.log(url);
        try {
            return await http.get(url, {
                params,
                headers
            })
        }
        catch (e) {
            throw HttpService.getError(e);
        }
    }

    static async sendPostRequest(baseUrl, params, routes, sid) {
        const url = HttpService.generateUrl(baseUrl, routes);
        const headers = {};
        if (sid) {
            headers.cookie = sid;
        }
        try {
            return await http.post(url, params, {
                headers
            });
        }
        catch (e) {
            throw HttpService.getError(e);
        }

    }

    static generateUrl(url, routes) {
        let correctUrl = url;
        const route = routes.join('/');
        if (url[url.length - 1] !== '/') {
            correctUrl = `${url}/`;
        }
        return `${correctUrl}rest/${route}`;
    }

    static getError(e) {
        let error;
        if (e.response && e.response.status) {
            error = new Exception(e.response.status, e.message);
        }
        else {
            error = new Error(e.message);
        }
        return error;
    }
}

module.exports = {HttpService, URLRegex};
