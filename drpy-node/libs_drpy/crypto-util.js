import './crypto-js.js';

function window_b64() {
    let b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

    function btoa(str) {
        var out, i, len;
        var c1, c2, c3;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            c1 = str.charCodeAt(i++) & 0xff;
            if (i == len) {
                out += b64map.charAt(c1 >> 2);
                out += b64map.charAt((c1 & 0x3) << 4);
                out += "==";
                break;
            }
            c2 = str.charCodeAt(i++);
            if (i == len) {
                out += b64map.charAt(c1 >> 2);
                out += b64map.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                out += b64map.charAt((c2 & 0xF) << 2);
                out += "=";
                break;
            }
            c3 = str.charCodeAt(i++);
            out += b64map.charAt(c1 >> 2);
            out += b64map.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += b64map.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
            out += b64map.charAt(c3 & 0x3F);
        }
        return out;
    }

    function atob(str) {
        var c1, c2, c3, c4;
        var i, len, out;
        len = str.length;
        i = 0;
        out = "";
        while (i < len) {
            do {
                c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c1 == -1);
            if (c1 == -1) break;
            do {
                c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
            } while (i < len && c2 == -1);
            if (c2 == -1) break;
            out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));
            do {
                c3 = str.charCodeAt(i++) & 0xff;
                if (c3 == 61) return out;
                c3 = base64DecodeChars[c3];
            } while (i < len && c3 == -1);
            if (c3 == -1) break;
            out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));
            do {
                c4 = str.charCodeAt(i++) & 0xff;
                if (c4 == 61) return out;
                c4 = base64DecodeChars[c4];
            } while (i < len && c4 == -1);
            if (c4 == -1) break;
            out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
        }
        return out;
    }

    return {
        atob,
        btoa
    }
}

export const {atob, btoa} = window_b64();

export function base64Encode(text) {
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(text));
    // return text
}

export function base64Decode(text) {
    return CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(text));
    // return text
}

export function md5(text) {
    return CryptoJS.MD5(text).toString();
}

export function rc4Encrypt(word, key) {
    return CryptoJS.RC4.encrypt(word, CryptoJS.enc.Utf8.parse(key)).toString()
}

export function rc4Decrypt(word, key) {
    const ciphertext = CryptoJS.enc.Hex.parse(word);
    const key_data = CryptoJS.enc.Utf8.parse(key)
    const decrypted = CryptoJS.RC4.decrypt({ciphertext: ciphertext}, key_data, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
}

export function rc4_decode(data, key, t) {
    let pwd = key || 'ffsirllq';
    let cipher = '';
    key = [];
    let box = [];
    let pwd_length = pwd.length;
    if (t === 1) {
        data = atob(data);
    } else {
        data = encodeURIComponent(data);
    }
    let data_length = data.length;
    for (let i = 0; i < 256; i++) {
        key[i] = pwd[i % pwd_length].charCodeAt();
        box[i] = i;
    }
    for (let j = 0, i = 0; i < 256; i++) {
        j = (j + box[i] + key[i]) % 256;
        let tmp = box[i];
        box[i] = box[j];
        box[j] = tmp;
    }
    for (let a = 0, j = 0, i = 0; i < data_length; i++) {
        a = (a + 1) % 256;
        j = (j + box[a]) % 256;
        let tmp = box[a];
        box[a] = box[j];
        box[j] = tmp;
        let k = box[((box[a] + box[j]) % 256)];
        cipher += String.fromCharCode(data[i].charCodeAt() ^ k);
    }
    if (t === 1) {
        return decodeURIComponent(cipher);
    } else {
        return btoa(cipher);
    }
}

// https://github.com/Hiram-Wong/ZyPlayer/blob/main/src/renderer/src/utils/crypto.ts
const hex = {
    decode: function (val) {
        return Buffer.from(val, 'hex').toString('utf-8');
    },
    encode: function (val) {
        return Buffer.from(val, 'utf-8').toString('hex');
    },
};

const parseEncode = function (value, encoding) {
    switch (encoding) {
        case 'base64':
            return CryptoJS.enc.Base64.parse(value);
        case 'hex':
            return CryptoJS.enc.Hex.parse(value);
        case 'latin1':
            return CryptoJS.enc.Latin1.parse(value);
        case 'utf8':
            return CryptoJS.enc.Utf8.parse(value);
        default:
            return CryptoJS.enc.Utf8.parse(value);
    }
};

const formatEncode = function (value, encoding) {
    switch (encoding.toLowerCase()) {
        case 'base64':
            return value.toString(); // 整个CipherParams对象(含原数据), 默认输出 Base64
        case 'hex':
            return value.ciphertext.toString(); // ciphertext属性(仅密文), 默认输出 Hex
    }
};

const formatDecode = function (value, encoding) {
    switch (encoding.toLowerCase()) {
        case 'utf8':
            return value.toString(CryptoJS.enc.Utf8);
        case 'base64':
            return value.toString(CryptoJS.enc.Base64);
        case 'hex':
            return value.toString(CryptoJS.enc.Hex);
        default:
            return value.toString(CryptoJS.enc.Utf8);
    }
};

const getMode = function (mode) {
    switch (mode.toLowerCase()) {
        case 'cbc':
            return CryptoJS.mode.CBC;
        case 'cfb':
            return CryptoJS.mode.CFB;
        case 'ofb':
            return CryptoJS.mode.OFB;
        case 'ctr':
            return CryptoJS.mode.CTR;
        case 'ecb':
            return CryptoJS.mode.ECB;
        default:
            return CryptoJS.mode.CBC;
    }
};

const getPad = function (padding) {
    switch (padding.toLowerCase()) {
        case 'zeropadding':
            return CryptoJS.pad.ZeroPadding;
        case 'pkcs5padding':
        case 'pkcs7padding':
            return CryptoJS.pad.Pkcs7;
        case 'ansix923':
            return CryptoJS.pad.AnsiX923;
        case 'iso10126':
            return CryptoJS.pad.Iso10126;
        case 'iso97971':
            return CryptoJS.pad.Iso97971;
        case 'nopadding':
            return CryptoJS.pad.NoPadding;
        default:
            return CryptoJS.pad.ZeroPadding;
    }
};

export const rc4 = {
    encode: function (val, key, encoding = 'utf8', keyEncoding = 'utf8', outputEncode = 'base64') {
        if (!['base64', 'hex'].includes(outputEncode.toLowerCase())) return '';
        if (!key || !val) return '';

        const plaintext = parseEncode(val, encoding);
        const v = parseEncode(key, keyEncoding);

        return formatEncode(CryptoJS.RC4.encrypt(plaintext, v), outputEncode);
    },
    decode: function (val, key, encoding = 'utf8', keyEncoding = 'utf8', outputEncode = 'base64') {
        if (!['base64', 'hex'].includes(encoding.toLowerCase())) return '';
        if (!key || !val) return '';

        const plaintext = parseEncode(val, encoding);
        const v = parseEncode(key, keyEncoding);

        return formatDecode(CryptoJS.RC4.toString(plaintext, v), outputEncode);
    },
};
