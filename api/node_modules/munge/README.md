# munge

[![Build Status](https://travis-ci.org/binarykitchen/munge.png?branch=master)](https://travis-ci.org/binarykitchen/munge)

ummm, just a tiny node module to munge any strings. useful if wou want to obfuscate email addresses to valid, numeric html characters.

as long as spam robots are still dumb, this should significantly reduce the risk of the email address being harvested. i bet you get 60% less spam. this method is user friendlier and way easier to implement than other tricks like javascript or images. because you really can click on the link and it opens in your mail program.

## basic example

by default, munge() encodes each letter by random - either ascii or unicode - to make it more difficult for spammers.

because of the random generator the example below does not always produce the same output:


``` js
var munge = require('munge');
console.log(munge('spacemonkey@moon.com'));
```

might output something like:
```
&#x0073;&#x0070;&#x0061;&#99;&#x0065;&#x006D;&#x006F;&#x006E;&#107;&#x0065;&#x0079;&#x0040;&#x006D;&#111;&#x006F;&#110;&#46;&#99;&#x006F;&#x006D;
```

this is valid html code!

based on rfc1866, ftp://ftp.rfc-editor.org/in-notes/rfc1866.txt

## more examples

### ascii

``` js
var munge = require('munge');
console.log(munge('spacemonkey@moon.com', {encoding: 'ascii'}));
```

should encode the string with ascii like that:
```
&#115;&#112;&#97;&#99;&#101;&#109;&#111;&#110;&#107;&#101;&#121;&#64;&#109;&#111;&#111;&#110;&#46;&#99;&#111;&#109;
```

### utf8

``` js
var munge = require('munge');
console.log(munge('spacemonkey@moon.com', {encoding: 'utf8'}));
```

encodes the same blurb but in unicode:
```
&#x0073;&#x0070;&#x0061;&#x0063;&#x0065;&#x006D;&#x006F;&#x006E;&#x006B;&#x0065;&#x0079;&#x0040;&#x006D;&#x006F;&#x006F;&#x006E;&#x002E;&#x0063;&#x006F;&#x006D;
```

### jade integration

good idea. you will want to protect your email address on your contact page.

here how you can do it within express and jade. let's say in express you have a route for a contact page (routes/contact.js) like this:

``` js
var munge = require('munge');

exports.contact = function(req, res) {
  res.render('contact',
    {
      emailContact: munge('spacemonkey@moon.com')
    }
  );
};
```

then you can show the munged email address in a jade template called contact.jade with the lines like this inbetween:

``` js
...
p email:&nbsp;
    a(href!="mailto:#{emailContact}") !{emailContact}
...
```

make sure you use ! exactly like this as this won't escape the ampersand (&) into an html entity. see TJ's remark about escaped stuff at https://github.com/visionmedia/jade#code


## todo

* implement a connect middleware to automagically munge any email addresses
* have it a piped stream instead (for larger strings; not sure if it makes sense here)

## license

MIT
