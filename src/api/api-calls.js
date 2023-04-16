import axios from 'axios';
import i18n from '../i18n/i18n';

export const signup = function (body) {
    return axios.post("/api/1.0/users", body, {
        headers: {
            "Accept-Language": i18n.locale
        }
    });
}