const iconv = require('iconv-lite');
const linewrap = require('linewrap');
const {createCanvas} = require('canvas');
const Dither = require('canvas-dither');
const Flatten = require('canvas-flatten');


/**
 * Create a byte stream based on commands for ESC/POS printers
 */
class EscPosEncoder {
  /**
     * Create a new object
     *
    */
  constructor() {
    this._reset();
  }

  /**
     * Reset the state of the object
     *
    */
  _reset() {
    this._buffer = [];
    this._codepage = 'ascii';

    this._state = {
      'bold': false,
      'italic': false,
      'underline': false,
      'hanzi': false,
    };
  }

  /**
     * Encode a string with the current code page
     *
     * @param  {string}   value  String to encode
     * @return {object}          Encoded string as a ArrayBuffer
     *
    */
  _encode(value) {
    return iconv.encode(value, this._codepage);
  }

  /**
     * Add commands to the buffer
     *
     * @param  {array}   value  And array of numbers, arrays, buffers or Uint8Arrays to add to the buffer
     *
    */
  _queue(value) {
    value.forEach((item) => this._buffer.push(item));
  }

  /**
     * Initialize the printer
     *
     * @return {object}          Return the object, for easy chaining commands
     *
     */
  initialize() {
    this._queue([
      0x1b, 0x40,
    ]);

    return this;
  }

  /**
     * Change the code page
     *
     * @param  {string}   value  The codepage that we set the printer to
     * @return {object}          Return the object, for easy chaining commands
     *
     */
  codepage(value) {
    const codepages = {
      'cp437': [0x00, false],
      'cp737': [0x40, false],
      'cp850': [0x02, false],
      'cp775': [0x5f, false],
      'cp852': [0x12, false],
      'cp855': [0x3c, false],
      'cp857': [0x3d, false],
      'cp858': [0x13, false],
      'cp860': [0x03, false],
      'cp861': [0x38, false],
      'cp862': [0x3e, false],
      'cp863': [0x04, false],
      'cp864': [0x1c, false],
      'cp865': [0x05, false],
      'cp866': [0x11, false],
      'cp869': [0x42, false],
      'cp936': [0xff, true],
      'cp949': [0xfd, true],
      'cp950': [0xfe, true],
      'cp1252': [0x10, false],
      'iso88596': [0x16, false],
      'shiftjis': [0xfc, true],
      'windows874': [0x1e, false],
      'windows1250': [0x48, false],
      'windows1251': [0x49, false],
      'windows1252': [0x47, false],
      'windows1253': [0x5a, false],
      'windows1254': [0x5b, false],
      'windows1255': [0x20, false],
      'windows1256': [0x5c, false],
      'windows1257': [0x19, false],
      'windows1258': [0x5e, false],
    };

    let codepage;

    if (!iconv.encodingExists(value)) {
      throw new Error('Unknown codepage');
    }

    if (value in iconv.encodings) {
      if (typeof iconv.encodings[value] === 'string') {
        codepage = iconv.encodings[value];
      } else {
        codepage = value;
      }
    } else {
      throw new Error('Unknown codepage');
    }

    if (typeof codepages[codepage] !== 'undefined') {
      this._codepage = codepage;
      this._state.hanzi = codepages[codepage][1];

      this._queue([
        0x1b, 0x74, codepages[codepage][0],
      ]);
    } else {
      throw new Error('Codepage not supported by printer');
    }

    return this;
  }

  /**
     * Print text
     *
     * @param  {string}   value  Text that needs to be printed
     * @param  {number}   wrap   Wrap text after this many positions
     * @return {object}          Return the object, for easy chaining commands
     *
     */
  text(value, wrap) {
    if (wrap) {
      const w = linewrap(wrap, {lineBreak: '\r\n'});
      value = w(value);
    }

    const bytes = this._encode(value);

    if (this._state.hanzi) {
      this._queue([
        0x1c, 0x26, bytes, 0x1c, 0x2e,
      ]);
    } else {
      this._queue([
        bytes,
      ]);
    }

    return this;
  }

  /**
     * Print a newline
     *
     * @return {object}          Return the object, for easy chaining commands
     *
     */
  newline(value) {
      
    if (typeof value === 'undefined') {
      value = 0;
    }
    
    for (let i = 0; i <= value; i++) {
        this._queue([
            0x0a, 0x0d,
        ]);
    } 

    return this;
  }

  /**
     * Print text, followed by a newline
     *
     * @param  {string}   value  Text that needs to be printed
     * @param  {number}   wrap   Wrap text after this many positions
     * @return {object}          Return the object, for easy chaining commands
     *
     */
  line(value, wrap) {
    this.text(value, wrap);
    this.newline();

    return this;
  }

  /**
     * Underline text
     *
     * @param  {boolean|number}   value  true to turn on underline, false to turn off, or 2 for double underline
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  underline(value) {
    if (typeof value === 'undefined') {
      value = ! this._state.underline;
    }

    this._state.underline = value;

    this._queue([
      0x1b, 0x2d, Number(value),
    ]);

    return this;
  }

  /**
     * Italic text
     *
     * @param  {boolean}          value  true to turn on italic, false to turn off
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  italic(value) {
    if (typeof value === 'undefined') {
      value = ! this._state.italic;
    }

    this._state.italic = value;

    this._queue([
      0x1b, 0x34, Number(value),
    ]);

    return this;
  }

  /**
     * Bold text
     *
     * @param  {boolean}          value  true to turn on bold, false to turn off, or 2 for double underline
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  bold(value) {
    if (typeof value === 'undefined') {
      value = ! this._state.bold;
    }

    this._state.bold = value;

    this._queue([
      0x1b, 0x45, Number(value),
    ]);

    return this;
  }

/**
     * Change width of text
     *
     * @param  {number}          width    The width of the text, 1 - 8
     * @return {object}                   Return the object, for easy chaining commands
     *
     */
  width(width) {
    if (typeof width === 'undefined') {
      width = 1;
    }

    if (typeof width !== 'number') {
      throw new Error('Width must be a number');
    }

    if (width < 1 || width > 8) {
      throw new Error('Width must be between 1 and 8');
    }

    this._state.width = width;

    this._queue([
      0x1d, 0x21, (this._state.height - 1) | (this._state.width - 1) << 4,
    ]);

    return this;
  }

  /**
     * Change height of text
     *
     * @param  {number}          height  The height of the text, 1 - 8
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  height(height) {
    if (typeof height === 'undefined') {
      height = 1;
    }

    if (typeof height !== 'number') {
      throw new Error('Height must be a number');
    }

    if (height < 1 || height > 8) {
      throw new Error('Height must be between 1 and 8');
    }

    this._state.height = height;

    this._queue([
      0x1d, 0x21, (this._state.height - 1) | (this._state.width - 1) << 4,
    ]);

    return this;
  }

  /**
     * Invert text
     *
     * @param  {boolean}          value  true to turn on white text on black, false to turn off
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  invert(value) {
    if (typeof value === 'undefined') {
      value = ! this._state.invert;
    }

    this._state.invert = value;

    this._queue([
      0x1d, 0x42, Number(value),
    ]);

    return this;
  }
  
  /**
     * Change text size
     *
     * @param  {string}          value   small or normal
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  size(value) {
    if (value === 'small') {
      value = 0x01;
    } else {
      value = 0x00;
    }

    this._queue([
      0x1b, 0x4d, value,
    ]);

    return this;
  }

  /**
     * Change text alignment
     *
     * @param  {string}          value   left, center or right
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  align(value) {
    const alignments = {
      'left': 0x00,
      'center': 0x01,
      'right': 0x02,
    };

    if (value in alignments) {
      this._queue([
        0x1b, 0x61, alignments[value],
      ]);
    } else {
      throw new Error('Unknown alignment');
    }

    return this;
  }
  
  /**
     * Insert a table
     *
     * @param  {array}           columns  The column definitions
     * @param  {array}           data     Array containing rows. Each row is an array containing cells.
     *                                    Each cell can be a string value, or a callback function.
     *                                    The first parameter of the callback is the encoder object on
     *                                    which the function can call its methods.
     * @return {object}                   Return the object, for easy chaining commands
     *
     */
  table(columns, data) {
    if (this._cursor != 0) {
      this.newline();
    }

    for (let r = 0; r < data.length; r++) {
      const lines = [];
      let maxLines = 0;

      for (let c = 0; c < columns.length; c++) {
        const cell = [];

        if (typeof data[r][c] === 'string') {
          const w = linewrap(columns[c].width, {lineBreak: '\n'});
          const fragments = w(data[r][c]).split('\n');

          for (let f = 0; f < fragments.length; f++) {
            if (columns[c].align == 'right') {
              cell[f] = this._encode(fragments[f].padStart(columns[c].width));
            } else {
              cell[f] = this._encode(fragments[f].padEnd(columns[c].width));
            }
          }
        }

        if (typeof data[r][c] === 'function') {
          const columnEncoder = new EscPosEncoder(Object.assign({}, this._options, {
            width: columns[c].width,
            embedded: true,
          }));

          columnEncoder._codepage = this._codepage;
          columnEncoder.align(columns[c].align);
          data[r][c](columnEncoder);
          const encoded = columnEncoder.encode();

          let fragment = [];

          for (let e = 0; e < encoded.byteLength; e++) {
            if (e < encoded.byteLength - 1) {
              if (encoded[e] === 0x0a && encoded[e + 1] === 0x0d) {
                cell.push(fragment);
                fragment = [];

                e++;
                continue;
              }
            }

            fragment.push(encoded[e]);
          }

          if (fragment.length) {
            cell.push(fragment);
          }
        }

        maxLines = Math.max(maxLines, cell.length);
        lines[c] = cell;
      }

      for (let c = 0; c < columns.length; c++) {
        if (lines[c].length < maxLines) {
          for (let p = lines[c].length; p < maxLines; p++) {
            let verticalAlign = 'top';
            if (typeof columns[c].verticalAlign !== 'undefined') {
              verticalAlign = columns[c].verticalAlign;
            }

            if (verticalAlign == 'bottom') {
              lines[c].unshift((new Array(columns[c].width)).fill(0x20));
            } else {
              lines[c].push((new Array(columns[c].width)).fill(0x20));
            }
          }
        }
      }

      for (let l = 0; l < maxLines; l++) {
        for (let c = 0; c < columns.length; c++) {
          if (typeof columns[c].marginLeft !== 'undefined') {
            this.raw((new Array(columns[c].marginLeft)).fill(0x20));
          }

          this.raw(lines[c][l]);

          if (typeof columns[c].marginRight !== 'undefined') {
            this.raw((new Array(columns[c].marginRight)).fill(0x20));
          }
        }

        this.newline();
      }
    }

    return this;
  }

  /**
     * Insert a horizontal rule
     *
     * @param  {object}          options  And object with the following properties:
     *                                    - style: The style of the line, either single or double
     *                                    - width: The width of the line, by default the width of the paper
     * @return {object}                   Return the object, for easy chaining commands
     *
     */
  rule(options) {
    options = Object.assign({
      style: 'single',
      width: options.width || 10,
    }, options || {});

    this._queue([
      0x1b, 0x74, this._getCodepageIdentifier('cp437'),
      (new Array(options.width)).fill(options.style === 'double' ? 0xcd : 0xc4),
    ]);

    this._queue([
      0x1b, 0x74, this._state.codepage,
    ]);

    this.newline();

    return this;
  }

  /**
     * Insert a horizontal rule
     *
     * @param  {object}           options   And object with the following properties:
     *                                      - style: The style of the border, either single or double
     *                                      - width: The width of the box, by default the width of the paper, if specified
     *                                      - marginLeft: Space between the left border and the left side of the paper
     *                                      - marginRight: Space between the right border and the right side of the paper
     *                                      - paddingLeft: Space between the contents and the left border of the box
     *                                      - paddingRight: Space between the contents and the right border of the box
     * @param  {string|function}  contents  A string value, or a callback function.
     *                                      The first parameter of the callback is the encoder object on
     *                                      which the function can call its methods.
     * @return {object}                     Return the object, for easy chaining commands
     *
     */
  box(options, contents) {
    options = Object.assign({
      style: 'single',
      width: options.width || 30,
      marginLeft: 0,
      marginRight: 0,
      paddingLeft: 0,
      paddingRight: 0,
    }, options || {});

    let elements;

    if (options.style == 'double') {
      elements = [0xc9, 0xbb, 0xc8, 0xbc, 0xcd, 0xba]; // ╔╗╚╝═║
    } else {
      elements = [0xda, 0xbf, 0xc0, 0xd9, 0xc4, 0xb3]; // ┌┐└┘─│
    }

    if (this._cursor != 0) {
      this.newline();
    }

    this._restoreState();

    this._queue([
      0x1b, 0x74, this._getCodepageIdentifier('cp437'),
    ]);

    this._queue([
      new Array(options.marginLeft).fill(0x20),
      elements[0],
      new Array(options.width - 2).fill(elements[4]),
      elements[1],
      new Array(options.marginRight).fill(0x20),
    ]);

    this.newline();

    const cell = [];

    if (typeof contents === 'string') {
      const w = linewrap(options.width - 2 - options.paddingLeft - options.paddingRight, {lineBreak: '\n'});
      const fragments = w(contents).split('\n');

      for (let f = 0; f < fragments.length; f++) {
        if (options.align == 'right') {
          cell[f] = this._encode(fragments[f].padStart(options.width - 2 - options.paddingLeft - options.paddingRight));
        } else {
          cell[f] = this._encode(fragments[f].padEnd(options.width - 2 - options.paddingLeft - options.paddingRight));
        }
      }
    }

    if (typeof contents === 'function') {
      const columnEncoder = new EscPosEncoder(Object.assign({}, this._options, {
        width: options.width - 2 - options.paddingLeft - options.paddingRight,
        embedded: true,
      }));

      columnEncoder._codepage = this._codepage;
      columnEncoder.align(options.align);
      contents(columnEncoder);
      const encoded = columnEncoder.encode();

      let fragment = [];

      for (let e = 0; e < encoded.byteLength; e++) {
        if (e < encoded.byteLength - 1) {
          if (encoded[e] === 0x0a && encoded[e + 1] === 0x0d) {
            cell.push(fragment);
            fragment = [];

            e++;
            continue;
          }
        }

        fragment.push(encoded[e]);
      }

      if (fragment.length) {
        cell.push(fragment);
      }
    }

    for (let c = 0; c < cell.length; c++) {
      this._queue([
        new Array(options.marginLeft).fill(0x20),
        elements[5],
        new Array(options.paddingLeft).fill(0x20),
      ]);

      this._queue([
        cell[c],
      ]);

      this._restoreState();

      this._queue([
        0x1b, 0x74, this._getCodepageIdentifier('cp437'),
      ]);

      this._queue([
        new Array(options.paddingRight).fill(0x20),
        elements[5],
        new Array(options.marginRight).fill(0x20),
      ]);

      this.newline();
    }

    this._queue([
      new Array(options.marginLeft).fill(0x20),
      elements[2],
      new Array(options.width - 2).fill(elements[4]),
      elements[3],
      new Array(options.marginRight).fill(0x20),
    ]);

    this._restoreState();

    this.newline();

    return this;
  }


  /**
     * Barcode
     *
     * @param  {string}           value  the value of the barcode
     * @param  {string}           symbology  the type of the barcode
     * @param  {number}           height  height of the barcode
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  barcode(value, symbology, height) {
    const symbologies = {
      'upca': 0x00,
      'upce': 0x01,
      'ean13': 0x02,
      'ean8': 0x03,
      'code39': 0x04,
      'coda39': 0x04, /* typo, leave here for backwards compatibility */
      'itf': 0x05,
      'codabar': 0x06,
      'code93': 0x48,
      'code128': 0x49,
      'gs1-128': 0x50,
      'gs1-databar-omni': 0x51,
      'gs1-databar-truncated': 0x52,
      'gs1-databar-limited': 0x53,
      'gs1-databar-expanded': 0x54,
      'code128-auto': 0x55,
    };

    if (symbology in symbologies) {
      const bytes = iconv.encode(value, 'ascii');

      this._queue([
        0x1d, 0x68, height,
        0x1d, 0x77, symbology === 'code39' ? 0x02 : 0x03,
      ]);

      if (symbology == 'code128' && bytes[0] !== 0x7b) {
        /* Not yet encodeded Code 128, assume data is Code B, which is similar to ASCII without control chars */

        this._queue([
          0x1d, 0x6b, symbologies[symbology],
          bytes.length + 2,
          0x7b, 0x42,
          bytes,
        ]);
      } else if (symbologies[symbology] > 0x40) {
        /* Function B symbologies */

        this._queue([
          0x1d, 0x6b, symbologies[symbology],
          bytes.length,
          bytes,
        ]);
      } else {
        /* Function A symbologies */

        this._queue([
          0x1d, 0x6b, symbologies[symbology],
          bytes,
          0x00,
        ]);
      }
    } else {
      throw new Error('Symbology not supported by printer');
    }

    return this;
  }

  /**
     * QR code
     *
     * @param  {string}           value  the value of the qr code
     * @param  {number}           model  model of the qrcode, either 1 or 2
     * @param  {number}           size   size of the qrcode, a value between 1 and 8
     * @param  {string}           errorlevel  the amount of error correction used, either 'l', 'm', 'q', 'h'
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  qrcode(value, model, size, errorlevel) {
    /* Force printing the print buffer and moving to a new line */

    this._queue([
      0x0a,
    ]);

    /* Model */

    const models = {
      1: 0x31,
      2: 0x32,
    };

    if (typeof model === 'undefined') {
      model = 2;
    }

    if (model in models) {
      this._queue([
        0x1d, 0x28, 0x6b, 0x04, 0x00, 0x31, 0x41, models[model], 0x00,
      ]);
    } else {
      throw new Error('Model must be 1 or 2');
    }

    /* Size */

    if (typeof size === 'undefined') {
      size = 6;
    }

    if (typeof size !== 'number') {
      throw new Error('Size must be a number');
    }

    if (size < 1 || size > 8) {
      throw new Error('Size must be between 1 and 8');
    }

    this._queue([
      0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x43, size,
    ]);

    /* Error level */

    const errorlevels = {
      'l': 0x30,
      'm': 0x31,
      'q': 0x32,
      'h': 0x33,
    };

    if (typeof errorlevel === 'undefined') {
      errorlevel = 'm';
    }

    if (errorlevel in errorlevels) {
      this._queue([
        0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x45, errorlevels[errorlevel],
      ]);
    } else {
      throw new Error('Error level must be l, m, q or h');
    }

    /* Data */

    const bytes = iconv.encode(value, 'iso88591');
    const length = bytes.length + 3;

    this._queue([
      0x1d, 0x28, 0x6b, length % 0xff, length / 0xff, 0x31, 0x50, 0x30, bytes,
    ]);

    /* Print QR code */

    this._queue([
      0x1d, 0x28, 0x6b, 0x03, 0x00, 0x31, 0x51, 0x30,
    ]);

    return this;
  }

  /**
     * Image
     *
     * @param  {object}         element  an element, like a canvas or image that needs to be printed
     * @param  {number}         width  width of the image on the printer
     * @param  {number}         height  height of the image on the printer
     * @param  {string}         algorithm  the dithering algorithm for making the image black and white
     * @param  {number}         threshold  threshold for the dithering algorithm
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  image(element, width, height, algorithm, threshold) {
    if (width % 8 !== 0) {
      throw new Error('Width must be a multiple of 8');
    }

    if (height % 8 !== 0) {
      throw new Error('Height must be a multiple of 8');
    }

    if (typeof algorithm === 'undefined') {
      algorithm = 'threshold';
    }

    if (typeof threshold === 'undefined') {
      threshold = 128;
    }

    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    context.drawImage(element, 0, 0, width, height);
    let image = context.getImageData(0, 0, width, height);

    image = Flatten.flatten(image, [0xff, 0xff, 0xff]);

    switch (algorithm) {
      case 'threshold': image = Dither.threshold(image, threshold); break;
      case 'bayer': image = Dither.bayer(image, threshold); break;
      case 'floydsteinberg': image = Dither.floydsteinberg(image); break;
      case 'atkinson': image = Dither.atkinson(image); break;
    }

    const getPixel = (x, y) => image.data[((width * y) + x) * 4] > 0 ? 0 : 1;

    const bytes = new Uint8Array((width * height) >> 3);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x = x + 8) {
        const i = (y * (width >> 3)) + (x >> 3);
        bytes[i] =
                    getPixel(x + 0, y) << 7 |
                    getPixel(x + 1, y) << 6 |
                    getPixel(x + 2, y) << 5 |
                    getPixel(x + 3, y) << 4 |
                    getPixel(x + 4, y) << 3 |
                    getPixel(x + 5, y) << 2 |
                    getPixel(x + 6, y) << 1 |
                    getPixel(x + 7, y);
      }
    }

    this._queue([
      0x1d, 0x76, 0x30, 0x00,
      (width >> 3) & 0xff, (((width >> 3) >> 8) & 0xff),
      height & 0xff, ((height >> 8) & 0xff),
      bytes,
    ]);

    return this;
  }

/**
     * Image
     *
     * @param  {object}         element  an element, like a canvas or image that needs to be printed
     * @param  {number}         width  width of the image on the printer
     * @param  {number}         height  height of the image on the printer
     * @param  {string}         algorithm  the dithering algorithm for making the image black and white
     * @param  {number}         threshold  threshold for the dithering algorithm
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  rawImageData(image, width, height, algorithm, threshold) {
    if (width % 8 !== 0) {
      throw new Error('Width must be a multiple of 8');
    }

    if (height % 8 !== 0) {
      throw new Error('Height must be a multiple of 8');
    }

    if (typeof algorithm === 'undefined') {
      algorithm = 'threshold';
    }

    if (typeof threshold === 'undefined') {
      threshold = 128;
    }
    
    image = Flatten.flatten(image, [0xff, 0xff, 0xff]);

    switch (algorithm) {
      case 'threshold': image = Dither.threshold(image, threshold); break;
      case 'bayer': image = Dither.bayer(image, threshold); break;
      case 'floydsteinberg': image = Dither.floydsteinberg(image); break;
      case 'atkinson': image = Dither.atkinson(image); break;
    }

    const getPixel = (x, y) => image.data[((width * y) + x) * 4] > 0 ? 0 : 1;

    const bytes = new Uint8Array((width * height) >> 3);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x = x + 8) {
        const i = (y * (width >> 3)) + (x >> 3);
        bytes[i] =
                    getPixel(x + 0, y) << 7 |
                    getPixel(x + 1, y) << 6 |
                    getPixel(x + 2, y) << 5 |
                    getPixel(x + 3, y) << 4 |
                    getPixel(x + 4, y) << 3 |
                    getPixel(x + 5, y) << 2 |
                    getPixel(x + 6, y) << 1 |
                    getPixel(x + 7, y);
      }
    }

    this._queue([
      0x1d, 0x76, 0x30, 0x00,
      (width >> 3) & 0xff, (((width >> 3) >> 8) & 0xff),
      height & 0xff, ((height >> 8) & 0xff),
      bytes,
    ]);

    return this;
  }
  
  /**
     * Cut paper
     *
     * @param  {string}          value   full or partial. When not specified a full cut will be assumed
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  cut(value) {
    let data = 0x00;

    if (value == 'partial') {
      data = 0x01;
    }

    this._queue([
      0x1d, 0x56, data,
    ]);

    return this;
  }

  /**
     * Pulse
     *
     * @param  {number}          device  0 or 1 for on which pin the device is connected, default of 0
     * @param  {number}          on      Time the pulse is on in milliseconds, default of 100
     * @param  {number}          off     Time the pulse is off in milliseconds, default of 500
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  pulse(device, on, off) {
    if (this._embedded) {
      throw new Error('Pulse is not supported in table cells or boxes');
    }

    if (typeof device === 'undefined') {
      device = 0;
    }

    if (typeof on === 'undefined') {
      on = 100;
    }

    if (typeof off === 'undefined') {
      off = 500;
    }

    on = Math.min(500, Math.round(on / 2));
    off = Math.min(500, Math.round(off / 2));

    this._queue([
      0x1b, 0x70, device ? 1 : 0, on & 0xff, off & 0xff,
    ]);

    return this;
  }
  
  /**
     * Beep
     *
     * @return {object}                  Return the object, for easy chaining commands
     *
     */
  beep() {
      
      this._queue([
        0x1b, 0x42, 0x3, 0x2  
      ]);
    
      return this;
  }
  
  /**
     * Add raw printer commands
     *
     * @param  {array}           data   raw bytes to be included
     * @return {object}          Return the object, for easy chaining commands
     *
     */
  raw(data) {
    this._queue(data);

    return this;
  }

  /**
     * Encode all previous commands
     *
     * @return {Uint8Array}         Return the encoded bytes
     *
     */
  encode() {
    let length = 0;

    this._buffer.forEach((item) => {
      if (typeof item === 'number') {
        length++;
      } else {
        length += item.length;
      }
    });

    const result = new Uint8Array(length);

    let index = 0;

    this._buffer.forEach((item) => {
      if (typeof item === 'number') {
        result[index] = item;
        index++;
      } else {
        result.set(item, index);
        index += item.length;
      }
    });

    this._reset();

    return result;
  }
}

module.exports = EscPosEncoder;
