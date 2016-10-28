module.exports = munge;

var encoder = {

    TYPES: ['ascii', 'utf8', 'random'],
    DEFAULT: 'random',

    ascii: function(str) {
        return str.charCodeAt();
    },

    utf8: function(str) {
        // toString(16) converts decimal (ascii) to hex
        var unicode = this.ascii(str).toString(16).toUpperCase();

        // pad with leading zeros to ensure 4 bytes
        while (unicode.length < 4)
            unicode = '0' + unicode;

        return 'x' + unicode;
    },

    random: function(str) {
        var type = this.TYPES[Math.floor(Math.random() * this.TYPES.length)];
        return this[type](str);
    }
};

/**
 * the one and only public function of this module. It takes any string and munges
 * it according to the options. By default it uses a random encoding.
 *
 *
 * @param {String} str any string to munge, for example 'spacemonkey@moon.com'
 * @param {Object} options for munging
 * @param options.encoding can be 'ascii', 'utf8' or 'random' (default)
 * @return {String} the munged string
 * @api public
 */
function munge(str, options) {

    var aMunged = [];
    var aChars, i;

    //  initialize default options
    options = options || {};

    if (options.encoding) {
        // validate encoding option

        if (encoder.TYPES.indexOf(options.encoding) < 0)
            throw Error('Invalid encoding option given: ' + options.encoding);
    } else
        options.encoding = encoder.DEFAULT;

    if (str) {

        aChars = str.split('');

        for (i in aChars)
            aMunged[i] = '&#' + encoder[options.encoding](aChars[i]) + ';';
    }

    return aMunged.join('');
}
