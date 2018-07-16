
import { sha256, sha224 } from 'js-sha256';
import { Injectable } from '@angular/core';
import { projectKey, sign_version, secretId } from './app.constant';

@Injectable()
export class SignService {

    createShaString(key, countryCode, sign_version, private_key) {
        let baseString = '';
        baseString = 'country_code=' + countryCode + 'key=' + key + 'sign_version=' + sign_version + private_key;
        return baseString;
    }

    hashString(baseString) {
        var hash = sha256.create();
        hash = hash.update(baseString);
        return hash.hex();
        //return crypto.MD5(baseString).hex()
    }

    getSignToken(countryCode) {
        let baseStr = this.createShaString(projectKey, countryCode, sign_version, secretId);
        return this.hashString(baseStr);
    }

}