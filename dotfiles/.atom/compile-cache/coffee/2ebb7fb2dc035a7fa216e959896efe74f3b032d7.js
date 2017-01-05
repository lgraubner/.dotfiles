(function() {
  var ColorExpression, ExpressionsRegistry, SVGColors, colorRegexp, colors, comma, elmAngle, float, floatOrPercent, hexadecimal, insensitive, int, intOrPercent, namePrefixes, notQuote, optionalPercent, pe, percent, ps, ref, ref1, registry, strip, variables;

  ref = require('./regexes'), int = ref.int, float = ref.float, percent = ref.percent, optionalPercent = ref.optionalPercent, intOrPercent = ref.intOrPercent, floatOrPercent = ref.floatOrPercent, comma = ref.comma, notQuote = ref.notQuote, hexadecimal = ref.hexadecimal, ps = ref.ps, pe = ref.pe, variables = ref.variables, namePrefixes = ref.namePrefixes;

  ref1 = require('./utils'), strip = ref1.strip, insensitive = ref1.insensitive;

  ExpressionsRegistry = require('./expressions-registry');

  ColorExpression = require('./color-expression');

  SVGColors = require('./svg-colors');

  module.exports = registry = new ExpressionsRegistry(ColorExpression);

  registry.createExpression('pigments:css_hexa_8', "#(" + hexadecimal + "{8})(?![\\d\\w-])", 1, ['css', 'less', 'styl', 'stylus', 'sass', 'scss'], function(match, expression, context) {
    var _, hexa;
    _ = match[0], hexa = match[1];
    return this.hexRGBA = hexa;
  });

  registry.createExpression('pigments:argb_hexa_8', "#(" + hexadecimal + "{8})(?![\\d\\w-])", ['*'], function(match, expression, context) {
    var _, hexa;
    _ = match[0], hexa = match[1];
    return this.hexARGB = hexa;
  });

  registry.createExpression('pigments:css_hexa_6', "#(" + hexadecimal + "{6})(?![\\d\\w-])", ['*'], function(match, expression, context) {
    var _, hexa;
    _ = match[0], hexa = match[1];
    return this.hex = hexa;
  });

  registry.createExpression('pigments:css_hexa_4', "(?:" + namePrefixes + ")#(" + hexadecimal + "{4})(?![\\d\\w-])", ['*'], function(match, expression, context) {
    var _, colorAsInt, hexa;
    _ = match[0], hexa = match[1];
    colorAsInt = context.readInt(hexa, 16);
    this.colorExpression = "#" + hexa;
    this.red = (colorAsInt >> 12 & 0xf) * 17;
    this.green = (colorAsInt >> 8 & 0xf) * 17;
    this.blue = (colorAsInt >> 4 & 0xf) * 17;
    return this.alpha = ((colorAsInt & 0xf) * 17) / 255;
  });

  registry.createExpression('pigments:css_hexa_3', "(?:" + namePrefixes + ")#(" + hexadecimal + "{3})(?![\\d\\w-])", ['*'], function(match, expression, context) {
    var _, colorAsInt, hexa;
    _ = match[0], hexa = match[1];
    colorAsInt = context.readInt(hexa, 16);
    this.colorExpression = "#" + hexa;
    this.red = (colorAsInt >> 8 & 0xf) * 17;
    this.green = (colorAsInt >> 4 & 0xf) * 17;
    return this.blue = (colorAsInt & 0xf) * 17;
  });

  registry.createExpression('pigments:int_hexa_8', "0x(" + hexadecimal + "{8})(?!" + hexadecimal + ")", ['*'], function(match, expression, context) {
    var _, hexa;
    _ = match[0], hexa = match[1];
    return this.hexARGB = hexa;
  });

  registry.createExpression('pigments:int_hexa_6', "0x(" + hexadecimal + "{6})(?!" + hexadecimal + ")", ['*'], function(match, expression, context) {
    var _, hexa;
    _ = match[0], hexa = match[1];
    return this.hex = hexa;
  });

  registry.createExpression('pigments:css_rgb', strip("" + (insensitive('rgb')) + ps + "\\s* (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    this.red = context.readIntOrPercent(r);
    this.green = context.readIntOrPercent(g);
    this.blue = context.readIntOrPercent(b);
    return this.alpha = 1;
  });

  registry.createExpression('pigments:css_rgba', strip("" + (insensitive('rgba')) + ps + "\\s* (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, a, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
    this.red = context.readIntOrPercent(r);
    this.green = context.readIntOrPercent(g);
    this.blue = context.readIntOrPercent(b);
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:stylus_rgba', strip("rgba" + ps + "\\s* (" + notQuote + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, a, baseColor, subexpr;
    _ = match[0], subexpr = match[1], a = match[2];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:css_hsl', strip("" + (insensitive('hsl')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['css', 'sass', 'scss', 'styl', 'stylus'], function(match, expression, context) {
    var _, h, hsl, l, s;
    _ = match[0], h = match[1], s = match[2], l = match[3];
    hsl = [context.readInt(h), context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:less_hsl', strip("hsl" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['less'], function(match, expression, context) {
    var _, h, hsl, l, s;
    _ = match[0], h = match[1], s = match[2], l = match[3];
    hsl = [context.readInt(h), context.readFloatOrPercent(s) * 100, context.readFloatOrPercent(l) * 100];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:css_hsla', strip("" + (insensitive('hsla')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, a, h, hsl, l, s;
    _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
    hsl = [context.readInt(h), context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:hsv', strip("(?:" + (insensitive('hsv')) + "|" + (insensitive('hsb')) + ")" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, h, hsv, s, v;
    _ = match[0], h = match[1], s = match[2], v = match[3];
    hsv = [context.readInt(h), context.readFloat(s), context.readFloat(v)];
    if (hsv.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsv = hsv;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:hsva', strip("(?:" + (insensitive('hsva')) + "|" + (insensitive('hsba')) + ")" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, a, h, hsv, s, v;
    _ = match[0], h = match[1], s = match[2], v = match[3], a = match[4];
    hsv = [context.readInt(h), context.readFloat(s), context.readFloat(v)];
    if (hsv.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsv = hsv;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:hcg', strip("(?:" + (insensitive('hcg')) + ")" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, c, gr, h, hcg;
    _ = match[0], h = match[1], c = match[2], gr = match[3];
    hcg = [context.readInt(h), context.readFloat(c), context.readFloat(gr)];
    if (hcg.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hcg = hcg;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:hcga', strip("(?:" + (insensitive('hcga')) + ")" + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, a, c, gr, h, hcg;
    _ = match[0], h = match[1], c = match[2], gr = match[3], a = match[4];
    hcg = [context.readInt(h), context.readFloat(c), context.readFloat(gr)];
    if (hcg.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hcg = hcg;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:vec4', strip("vec4" + ps + "\\s* (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + pe), ['*'], function(match, expression, context) {
    var _, a, h, l, s;
    _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
    return this.rgba = [context.readFloat(h) * 255, context.readFloat(s) * 255, context.readFloat(l) * 255, context.readFloat(a)];
  });

  registry.createExpression('pigments:hwb', strip("" + (insensitive('hwb')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + comma + " (" + optionalPercent + "|" + variables + ") (?:" + comma + "(" + float + "|" + variables + "))? " + pe), ['*'], function(match, expression, context) {
    var _, a, b, h, w;
    _ = match[0], h = match[1], w = match[2], b = match[3], a = match[4];
    this.hwb = [context.readInt(h), context.readFloat(w), context.readFloat(b)];
    return this.alpha = a != null ? context.readFloat(a) : 1;
  });

  registry.createExpression('pigments:cmyk', strip("" + (insensitive('cmyk')) + ps + "\\s* (" + float + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + comma + " (" + float + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, c, k, m, y;
    _ = match[0], c = match[1], m = match[2], y = match[3], k = match[4];
    return this.cmyk = [context.readFloat(c), context.readFloat(m), context.readFloat(y), context.readFloat(k)];
  });

  registry.createExpression('pigments:gray', strip("" + (insensitive('gray')) + ps + "\\s* (" + optionalPercent + "|" + variables + ") (?:" + comma + "(" + float + "|" + variables + "))? " + pe), 1, ['*'], function(match, expression, context) {
    var _, a, p;
    _ = match[0], p = match[1], a = match[2];
    p = context.readFloat(p) / 100 * 255;
    this.rgb = [p, p, p];
    return this.alpha = a != null ? context.readFloat(a) : 1;
  });

  colors = Object.keys(SVGColors.allCases);

  colorRegexp = "(?:" + namePrefixes + ")(" + (colors.join('|')) + ")\\b(?![ \\t]*[-\\.:=\\(])";

  registry.createExpression('pigments:named_colors', colorRegexp, [], function(match, expression, context) {
    var _, name;
    _ = match[0], name = match[1];
    this.colorExpression = this.name = name;
    return this.hex = context.SVGColors.allCases[name].replace('#', '');
  });

  registry.createExpression('pigments:darken', strip("darken" + ps + " (" + notQuote + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [h, s, context.clampInt(l - amount)];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:lighten', strip("lighten" + ps + " (" + notQuote + ") " + comma + " (" + optionalPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [h, s, context.clampInt(l + amount)];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:fade', strip("(?:fade|alpha)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = amount;
  });

  registry.createExpression('pigments:transparentize', strip("(?:transparentize|fadeout|fade-out|fade_out)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = context.clamp(baseColor.alpha - amount);
  });

  registry.createExpression('pigments:opacify', strip("(?:opacify|fadein|fade-in|fade_in)" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    this.rgb = baseColor.rgb;
    return this.alpha = context.clamp(baseColor.alpha + amount);
  });

  registry.createExpression('pigments:stylus_component_functions', strip("(red|green|blue)" + ps + " (" + notQuote + ") " + comma + " (" + int + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, channel, subexpr;
    _ = match[0], channel = match[1], subexpr = match[2], amount = match[3];
    amount = context.readInt(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (isNaN(amount)) {
      return this.invalid = true;
    }
    return this[channel] = amount;
  });

  registry.createExpression('pigments:transparentify', strip("transparentify" + ps + " (" + notQuote + ") " + pe), ['*'], function(match, expression, context) {
    var _, alpha, bestAlpha, bottom, expr, processChannel, ref2, top;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), top = ref2[0], bottom = ref2[1], alpha = ref2[2];
    top = context.readColor(top);
    bottom = context.readColor(bottom);
    alpha = context.readFloatOrPercent(alpha);
    if (context.isInvalid(top)) {
      return this.invalid = true;
    }
    if ((bottom != null) && context.isInvalid(bottom)) {
      return this.invalid = true;
    }
    if (bottom == null) {
      bottom = new context.Color(255, 255, 255, 1);
    }
    if (isNaN(alpha)) {
      alpha = void 0;
    }
    bestAlpha = ['red', 'green', 'blue'].map(function(channel) {
      var res;
      res = (top[channel] - bottom[channel]) / ((0 < top[channel] - bottom[channel] ? 255 : 0) - bottom[channel]);
      return res;
    }).sort(function(a, b) {
      return a < b;
    })[0];
    processChannel = function(channel) {
      if (bestAlpha === 0) {
        return bottom[channel];
      } else {
        return bottom[channel] + (top[channel] - bottom[channel]) / bestAlpha;
      }
    };
    if (alpha != null) {
      bestAlpha = alpha;
    }
    bestAlpha = Math.max(Math.min(bestAlpha, 1), 0);
    this.red = processChannel('red');
    this.green = processChannel('green');
    this.blue = processChannel('blue');
    return this.alpha = Math.round(bestAlpha * 100) / 100;
  });

  registry.createExpression('pigments:hue', strip("hue" + ps + " (" + notQuote + ") " + comma + " (" + int + "deg|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (isNaN(amount)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [amount % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:stylus_sl_component_functions', strip("(saturation|lightness)" + ps + " (" + notQuote + ") " + comma + " (" + intOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, channel, subexpr;
    _ = match[0], channel = match[1], subexpr = match[2], amount = match[3];
    amount = context.readInt(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (isNaN(amount)) {
      return this.invalid = true;
    }
    baseColor[channel] = amount;
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:adjust-hue', strip("adjust-hue" + ps + " (" + notQuote + ") " + comma + " (-?" + int + "deg|" + variables + "|-?" + optionalPercent + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloat(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [(h + amount) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:mix', "mix" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var _, amount, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1], amount = ref2[2];
    if (amount != null) {
      amount = context.readFloatOrPercent(amount);
    } else {
      amount = 0.5;
    }
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = context.mixColors(baseColor1, baseColor2, amount), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:stylus_tint', strip("tint" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['styl', 'stylus', 'less'], function(match, expression, context) {
    var _, amount, baseColor, subexpr, white;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    white = new context.Color(255, 255, 255);
    return this.rgba = context.mixColors(white, baseColor, amount).rgba;
  });

  registry.createExpression('pigments:stylus_shade', strip("shade" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['styl', 'stylus', 'less'], function(match, expression, context) {
    var _, amount, baseColor, black, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    black = new context.Color(0, 0, 0);
    return this.rgba = context.mixColors(black, baseColor, amount).rgba;
  });

  registry.createExpression('pigments:compass_tint', strip("tint" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['sass:compass', 'scss:compass'], function(match, expression, context) {
    var _, amount, baseColor, subexpr, white;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    white = new context.Color(255, 255, 255);
    return this.rgba = context.mixColors(baseColor, white, amount).rgba;
  });

  registry.createExpression('pigments:compass_shade', strip("shade" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['sass:compass', 'scss:compass'], function(match, expression, context) {
    var _, amount, baseColor, black, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    black = new context.Color(0, 0, 0);
    return this.rgba = context.mixColors(baseColor, black, amount).rgba;
  });

  registry.createExpression('pigments:bourbon_tint', strip("tint" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['sass:bourbon', 'scss:bourbon'], function(match, expression, context) {
    var _, amount, baseColor, subexpr, white;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    white = new context.Color(255, 255, 255);
    return this.rgba = context.mixColors(white, baseColor, amount).rgba;
  });

  registry.createExpression('pigments:bourbon_shade', strip("shade" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['sass:bourbon', 'scss:bourbon'], function(match, expression, context) {
    var _, amount, baseColor, black, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    black = new context.Color(0, 0, 0);
    return this.rgba = context.mixColors(black, baseColor, amount).rgba;
  });

  registry.createExpression('pigments:desaturate', "desaturate" + ps + "(" + notQuote + ")" + comma + "(" + floatOrPercent + "|" + variables + ")" + pe, ['*'], function(match, expression, context) {
    var _, amount, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [h, context.clampInt(s - amount * 100), l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:saturate', strip("saturate" + ps + " (" + notQuote + ") " + comma + " (" + floatOrPercent + "|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, amount, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1], amount = match[2];
    amount = context.readFloatOrPercent(amount);
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [h, context.clampInt(s + amount * 100), l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:grayscale', "gr(?:a|e)yscale" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var _, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [h, 0, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:invert', "invert" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var _, b, baseColor, g, r, ref2, subexpr;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.rgb, r = ref2[0], g = ref2[1], b = ref2[2];
    this.rgb = [255 - r, 255 - g, 255 - b];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:complement', "complement" + ps + "(" + notQuote + ")" + pe, ['*'], function(match, expression, context) {
    var _, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [(h + 180) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:spin', strip("spin" + ps + " (" + notQuote + ") " + comma + " (-?(" + int + ")(deg)?|" + variables + ") " + pe), ['*'], function(match, expression, context) {
    var _, angle, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1], angle = match[2];
    baseColor = context.readColor(subexpr);
    angle = context.readInt(angle);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [(360 + h + angle) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:contrast_n_arguments', strip("contrast" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, base, baseColor, dark, expr, light, ref2, ref3, res, threshold;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), base = ref2[0], dark = ref2[1], light = ref2[2], threshold = ref2[3];
    baseColor = context.readColor(base);
    dark = context.readColor(dark);
    light = context.readColor(light);
    if (threshold != null) {
      threshold = context.readPercent(threshold);
    }
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    if (dark != null ? dark.invalid : void 0) {
      return this.invalid = true;
    }
    if (light != null ? light.invalid : void 0) {
      return this.invalid = true;
    }
    res = context.contrast(baseColor, dark, light);
    if (context.isInvalid(res)) {
      return this.invalid = true;
    }
    return ref3 = context.contrast(baseColor, dark, light, threshold), this.rgb = ref3.rgb, ref3;
  });

  registry.createExpression('pigments:contrast_1_argument', strip("contrast" + ps + " (" + notQuote + ") " + pe), ['*'], function(match, expression, context) {
    var _, baseColor, ref2, subexpr;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    return ref2 = context.contrast(baseColor), this.rgb = ref2.rgb, ref2;
  });

  registry.createExpression('pigments:css_color_function', "(?:" + namePrefixes + ")(" + (insensitive('color')) + ps + "(" + notQuote + ")" + pe + ")", ['css'], function(match, expression, context) {
    var _, cssColor, e, expr, k, ref2, rgba, v;
    try {
      _ = match[0], expr = match[1];
      ref2 = context.vars;
      for (k in ref2) {
        v = ref2[k];
        expr = expr.replace(RegExp("" + (k.replace(/\(/g, '\\(').replace(/\)/g, '\\)')), "g"), v.value);
      }
      cssColor = require('css-color-function');
      rgba = cssColor.convert(expr.toLowerCase());
      this.rgba = context.readColor(rgba).rgba;
      return this.colorExpression = expr;
    } catch (error) {
      e = error;
      return this.invalid = true;
    }
  });

  registry.createExpression('pigments:sass_adjust_color', "adjust-color" + ps + "(" + notQuote + ")" + pe, 1, ['*'], function(match, expression, context) {
    var _, baseColor, i, len, param, params, res, subexpr, subject;
    _ = match[0], subexpr = match[1];
    res = context.split(subexpr);
    subject = res[0];
    params = res.slice(1);
    baseColor = context.readColor(subject);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    for (i = 0, len = params.length; i < len; i++) {
      param = params[i];
      context.readParam(param, function(name, value) {
        return baseColor[name] += context.readFloat(value);
      });
    }
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:sass_scale_color', "scale-color" + ps + "(" + notQuote + ")" + pe, 1, ['*'], function(match, expression, context) {
    var MAX_PER_COMPONENT, _, baseColor, i, len, param, params, res, subexpr, subject;
    MAX_PER_COMPONENT = {
      red: 255,
      green: 255,
      blue: 255,
      alpha: 1,
      hue: 360,
      saturation: 100,
      lightness: 100
    };
    _ = match[0], subexpr = match[1];
    res = context.split(subexpr);
    subject = res[0];
    params = res.slice(1);
    baseColor = context.readColor(subject);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    for (i = 0, len = params.length; i < len; i++) {
      param = params[i];
      context.readParam(param, function(name, value) {
        var dif, result;
        value = context.readFloat(value) / 100;
        result = value > 0 ? (dif = MAX_PER_COMPONENT[name] - baseColor[name], result = baseColor[name] + dif * value) : result = baseColor[name] * (1 + value);
        return baseColor[name] = result;
      });
    }
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:sass_change_color', "change-color" + ps + "(" + notQuote + ")" + pe, 1, ['*'], function(match, expression, context) {
    var _, baseColor, i, len, param, params, res, subexpr, subject;
    _ = match[0], subexpr = match[1];
    res = context.split(subexpr);
    subject = res[0];
    params = res.slice(1);
    baseColor = context.readColor(subject);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    for (i = 0, len = params.length; i < len; i++) {
      param = params[i];
      context.readParam(param, function(name, value) {
        return baseColor[name] = context.readFloat(value);
      });
    }
    return this.rgba = baseColor.rgba;
  });

  registry.createExpression('pigments:stylus_blend', strip("blend" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return this.rgba = [baseColor1.red * baseColor1.alpha + baseColor2.red * (1 - baseColor1.alpha), baseColor1.green * baseColor1.alpha + baseColor2.green * (1 - baseColor1.alpha), baseColor1.blue * baseColor1.alpha + baseColor2.blue * (1 - baseColor1.alpha), baseColor1.alpha + baseColor2.alpha - baseColor1.alpha * baseColor2.alpha];
  });

  registry.createExpression('pigments:lua_rgba', strip("(?:" + namePrefixes + ")Color" + ps + "\\s* (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + comma + " (" + int + "|" + variables + ") " + pe), ['lua'], function(match, expression, context) {
    var _, a, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
    this.red = context.readInt(r);
    this.green = context.readInt(g);
    this.blue = context.readInt(b);
    return this.alpha = context.readInt(a) / 255;
  });

  registry.createExpression('pigments:multiply', strip("multiply" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.MULTIPLY), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:screen', strip("screen" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.SCREEN), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:overlay', strip("overlay" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.OVERLAY), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:softlight', strip("softlight" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.SOFT_LIGHT), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:hardlight', strip("hardlight" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.HARD_LIGHT), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:difference', strip("difference" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.DIFFERENCE), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:exclusion', strip("exclusion" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.EXCLUSION), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:average', strip("average" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.AVERAGE), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:negation', strip("negation" + ps + " ( " + notQuote + " " + comma + " " + notQuote + " ) " + pe), ['*'], function(match, expression, context) {
    var _, baseColor1, baseColor2, color1, color2, expr, ref2, ref3;
    _ = match[0], expr = match[1];
    ref2 = context.split(expr), color1 = ref2[0], color2 = ref2[1];
    baseColor1 = context.readColor(color1);
    baseColor2 = context.readColor(color2);
    if (context.isInvalid(baseColor1) || context.isInvalid(baseColor2)) {
      return this.invalid = true;
    }
    return ref3 = baseColor1.blend(baseColor2, context.BlendModes.NEGATION), this.rgba = ref3.rgba, ref3;
  });

  registry.createExpression('pigments:elm_rgba', strip("rgba\\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var _, a, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
    this.red = context.readInt(r);
    this.green = context.readInt(g);
    this.blue = context.readInt(b);
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:elm_rgb', strip("rgb\\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ") \\s+ (" + int + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var _, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    this.red = context.readInt(r);
    this.green = context.readInt(g);
    return this.blue = context.readInt(b);
  });

  elmAngle = "(?:" + float + "|\\(degrees\\s+(?:" + int + "|" + variables + ")\\))";

  registry.createExpression('pigments:elm_hsl', strip("hsl\\s+ (" + elmAngle + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var _, elmDegreesRegexp, h, hsl, l, m, s;
    elmDegreesRegexp = new RegExp("\\(degrees\\s+(" + context.int + "|" + context.variablesRE + ")\\)");
    _ = match[0], h = match[1], s = match[2], l = match[3];
    if (m = elmDegreesRegexp.exec(h)) {
      h = context.readInt(m[1]);
    } else {
      h = context.readFloat(h) * 180 / Math.PI;
    }
    hsl = [h, context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = 1;
  });

  registry.createExpression('pigments:elm_hsla', strip("hsla\\s+ (" + elmAngle + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ") \\s+ (" + float + "|" + variables + ")"), ['elm'], function(match, expression, context) {
    var _, a, elmDegreesRegexp, h, hsl, l, m, s;
    elmDegreesRegexp = new RegExp("\\(degrees\\s+(" + context.int + "|" + context.variablesRE + ")\\)");
    _ = match[0], h = match[1], s = match[2], l = match[3], a = match[4];
    if (m = elmDegreesRegexp.exec(h)) {
      h = context.readInt(m[1]);
    } else {
      h = context.readFloat(h) * 180 / Math.PI;
    }
    hsl = [h, context.readFloat(s), context.readFloat(l)];
    if (hsl.some(function(v) {
      return (v == null) || isNaN(v);
    })) {
      return this.invalid = true;
    }
    this.hsl = hsl;
    return this.alpha = context.readFloat(a);
  });

  registry.createExpression('pigments:elm_grayscale', "gr(?:a|e)yscale\\s+(" + float + "|" + variables + ")", ['elm'], function(match, expression, context) {
    var _, amount;
    _ = match[0], amount = match[1];
    amount = Math.floor(255 - context.readFloat(amount) * 255);
    return this.rgb = [amount, amount, amount];
  });

  registry.createExpression('pigments:elm_complement', strip("complement\\s+(" + notQuote + ")"), ['elm'], function(match, expression, context) {
    var _, baseColor, h, l, ref2, s, subexpr;
    _ = match[0], subexpr = match[1];
    baseColor = context.readColor(subexpr);
    if (context.isInvalid(baseColor)) {
      return this.invalid = true;
    }
    ref2 = baseColor.hsl, h = ref2[0], s = ref2[1], l = ref2[2];
    this.hsl = [(h + 180) % 360, s, l];
    return this.alpha = baseColor.alpha;
  });

  registry.createExpression('pigments:latex_gray', strip("\\[gray\\]\\{(" + float + ")\\}"), ['tex'], function(match, expression, context) {
    var _, amount;
    _ = match[0], amount = match[1];
    amount = context.readFloat(amount) * 255;
    return this.rgb = [amount, amount, amount];
  });

  registry.createExpression('pigments:latex_html', strip("\\[HTML\\]\\{(" + hexadecimal + "{6})\\}"), ['tex'], function(match, expression, context) {
    var _, hexa;
    _ = match[0], hexa = match[1];
    return this.hex = hexa;
  });

  registry.createExpression('pigments:latex_rgb', strip("\\[rgb\\]\\{(" + float + ")" + comma + "(" + float + ")" + comma + "(" + float + ")\\}"), ['tex'], function(match, expression, context) {
    var _, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    r = Math.floor(context.readFloat(r) * 255);
    g = Math.floor(context.readFloat(g) * 255);
    b = Math.floor(context.readFloat(b) * 255);
    return this.rgb = [r, g, b];
  });

  registry.createExpression('pigments:latex_RGB', strip("\\[RGB\\]\\{(" + int + ")" + comma + "(" + int + ")" + comma + "(" + int + ")\\}"), ['tex'], function(match, expression, context) {
    var _, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3];
    r = context.readInt(r);
    g = context.readInt(g);
    b = context.readInt(b);
    return this.rgb = [r, g, b];
  });

  registry.createExpression('pigments:latex_cmyk', strip("\\[cmyk\\]\\{(" + float + ")" + comma + "(" + float + ")" + comma + "(" + float + ")" + comma + "(" + float + ")\\}"), ['tex'], function(match, expression, context) {
    var _, c, k, m, y;
    _ = match[0], c = match[1], m = match[2], y = match[3], k = match[4];
    c = context.readFloat(c);
    m = context.readFloat(m);
    y = context.readFloat(y);
    k = context.readFloat(k);
    return this.cmyk = [c, m, y, k];
  });

  registry.createExpression('pigments:latex_predefined', strip('\\{(black|blue|brown|cyan|darkgray|gray|green|lightgray|lime|magenta|olive|orange|pink|purple|red|teal|violet|white|yellow)\\}'), ['tex'], function(match, expression, context) {
    var _, name;
    _ = match[0], name = match[1];
    return this.hex = context.SVGColors.allCases[name].replace('#', '');
  });

  registry.createExpression('pigments:latex_predefined_dvipnames', strip('\\{(Apricot|Aquamarine|Bittersweet|Black|Blue|BlueGreen|BlueViolet|BrickRed|Brown|BurntOrange|CadetBlue|CarnationPink|Cerulean|CornflowerBlue|Cyan|Dandelion|DarkOrchid|Emerald|ForestGreen|Fuchsia|Goldenrod|Gray|Green|GreenYellow|JungleGreen|Lavender|LimeGreen|Magenta|Mahogany|Maroon|Melon|MidnightBlue|Mulberry|NavyBlue|OliveGreen|Orange|OrangeRed|Orchid|Peach|Periwinkle|PineGreen|Plum|ProcessBlue|Purple|RawSienna|Red|RedOrange|RedViolet|Rhodamine|RoyalBlue|RoyalPurple|RubineRed|Salmon|SeaGreen|Sepia|SkyBlue|SpringGreen|Tan|TealBlue|Thistle|Turquoise|Violet|VioletRed|White|WildStrawberry|Yellow|YellowGreen|YellowOrange)\\}'), ['tex'], function(match, expression, context) {
    var _, name;
    _ = match[0], name = match[1];
    return this.hex = context.DVIPnames[name].replace('#', '');
  });

  registry.createExpression('pigments:latex_mix', strip('\\{([^!\\n\\}]+[!][^\\}\\n]+)\\}'), ['tex'], function(match, expression, context) {
    var _, expr, mix, nextColor, op, triplet;
    _ = match[0], expr = match[1];
    op = expr.split('!');
    mix = function(arg) {
      var a, b, colorA, colorB, p;
      a = arg[0], p = arg[1], b = arg[2];
      colorA = a instanceof context.Color ? a : context.readColor("{" + a + "}");
      colorB = b instanceof context.Color ? b : context.readColor("{" + b + "}");
      percent = context.readInt(p);
      return context.mixColors(colorA, colorB, percent / 100);
    };
    if (op.length === 2) {
      op.push(new context.Color(255, 255, 255));
    }
    nextColor = null;
    while (op.length > 0) {
      triplet = op.splice(0, 3);
      nextColor = mix(triplet);
      if (op.length > 0) {
        op.unshift(nextColor);
      }
    }
    return this.rgb = nextColor.rgb;
  });

  registry.createExpression('pigments:qt_rgba', strip("Qt\\.rgba" + ps + "\\s* (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + comma + " (" + float + ") " + pe), ['qml', 'c', 'cc', 'cpp'], 1, function(match, expression, context) {
    var _, a, b, g, r;
    _ = match[0], r = match[1], g = match[2], b = match[3], a = match[4];
    this.red = context.readFloat(r) * 255;
    this.green = context.readFloat(g) * 255;
    this.blue = context.readFloat(b) * 255;
    return this.alpha = context.readFloat(a);
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2xhcnNncmF1Ym5lci8uZG90ZmlsZXMvZG90ZmlsZXMvLmF0b20vcGFja2FnZXMvcGlnbWVudHMvbGliL2NvbG9yLWV4cHJlc3Npb25zLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsTUFjSSxPQUFBLENBQVEsV0FBUixDQWRKLEVBQ0UsYUFERixFQUVFLGlCQUZGLEVBR0UscUJBSEYsRUFJRSxxQ0FKRixFQUtFLCtCQUxGLEVBTUUsbUNBTkYsRUFPRSxpQkFQRixFQVFFLHVCQVJGLEVBU0UsNkJBVEYsRUFVRSxXQVZGLEVBV0UsV0FYRixFQVlFLHlCQVpGLEVBYUU7O0VBR0YsT0FBdUIsT0FBQSxDQUFRLFNBQVIsQ0FBdkIsRUFBQyxrQkFBRCxFQUFROztFQUVSLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSx3QkFBUjs7RUFDdEIsZUFBQSxHQUFrQixPQUFBLENBQVEsb0JBQVI7O0VBQ2xCLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUjs7RUFFWixNQUFNLENBQUMsT0FBUCxHQUNBLFFBQUEsR0FBZSxJQUFBLG1CQUFBLENBQW9CLGVBQXBCOztFQVdmLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixxQkFBMUIsRUFBaUQsSUFBQSxHQUFLLFdBQUwsR0FBaUIsbUJBQWxFLEVBQXNGLENBQXRGLEVBQXlGLENBQUMsS0FBRCxFQUFRLE1BQVIsRUFBZ0IsTUFBaEIsRUFBd0IsUUFBeEIsRUFBa0MsTUFBbEMsRUFBMEMsTUFBMUMsQ0FBekYsRUFBNEksU0FBQyxLQUFELEVBQVEsVUFBUixFQUFvQixPQUFwQjtBQUMxSSxRQUFBO0lBQUMsWUFBRCxFQUFJO1dBRUosSUFBQyxDQUFBLE9BQUQsR0FBVztFQUgrSCxDQUE1STs7RUFNQSxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsc0JBQTFCLEVBQWtELElBQUEsR0FBSyxXQUFMLEdBQWlCLG1CQUFuRSxFQUF1RixDQUFDLEdB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LEtBQUQsRUFBUSxHQUFSLEVBQWEsSUFBYixFQUFtQixLQUFuQixDQVZKLEVBVStCLENBVi9CLEVBVWtDLFNBQUMsS0FBRCxFQUFRLFVBQVIsRUFBb0IsT0FBcEI7QUFDaEMsUUFBQTtJQUFDLFlBQUQsRUFBRyxZQUFILEVBQUssWUFBTCxFQUFPLFlBQVAsRUFBUztJQUVULElBQUMsQ0FBQSxHQUFELEdBQU8sT0FBTyxDQUFDLFNBQVIsQ0FBa0IsQ0FBbEIsQ0FBQSxHQUF1QjtJQUM5QixJQUFDLENBQUEsS0FBRCxHQUFTLE9BQU8sQ0FBQyxTQUFSLENBQWtCLENBQWxCLENBQUEsR0FBdUI7SUFDaEMsSUFBQyxDQUFBLElBQUQsR0FBUSxPQUFPLENBQUMsU0FBUixDQUFrQixDQUFsQixDQUFBLEdBQXVCO1dBQy9CLElBQUMsQ0FBQSxLQUFELEdBQVMsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsQ0FBbEI7RUFOdUIsQ0FWbEM7QUF0NkNBIiwic291cmNlc0NvbnRlbnQiOlsie1xuICBpbnRcbiAgZmxvYXRcbiAgcGVyY2VudFxuICBvcHRpb25hbFBlcmNlbnRcbiAgaW50T3JQZXJjZW50XG4gIGZsb2F0T3JQZXJjZW50XG4gIGNvbW1hXG4gIG5vdFF1b3RlXG4gIGhleGFkZWNpbWFsXG4gIHBzXG4gIHBlXG4gIHZhcmlhYmxlc1xuICBuYW1lUHJlZml4ZXNcbn0gPSByZXF1aXJlICcuL3JlZ2V4ZXMnXG5cbntzdHJpcCwgaW5zZW5zaXRpdmV9ID0gcmVxdWlyZSAnLi91dGlscydcblxuRXhwcmVzc2lvbnNSZWdpc3RyeSA9IHJlcXVpcmUgJy4vZXhwcmVzc2lvbnMtcmVnaXN0cnknXG5Db2xvckV4cHJlc3Npb24gPSByZXF1aXJlICcuL2NvbG9yLWV4cHJlc3Npb24nXG5TVkdDb2xvcnMgPSByZXF1aXJlICcuL3N2Zy1jb2xvcnMnXG5cbm1vZHVsZS5leHBvcnRzID1cbnJlZ2lzdHJ5ID0gbmV3IEV4cHJlc3Npb25zUmVnaXN0cnkoQ29sb3JFeHByZXNzaW9uKVxuXG4jIyAgICAjIyAgICAgICAjIyMjICMjIyMjIyMjICMjIyMjIyMjICMjIyMjIyMjICAgICAjIyMgICAgIyNcbiMjICAgICMjICAgICAgICAjIyAgICAgIyMgICAgIyMgICAgICAgIyMgICAgICMjICAgIyMgIyMgICAjI1xuIyMgICAgIyMgICAgICAgICMjICAgICAjIyAgICAjIyAgICAgICAjIyAgICAgIyMgICMjICAgIyMgICMjXG4jIyAgICAjIyAgICAgICAgIyMgICAgICMjICAgICMjIyMjIyAgICMjIyMjIyMjICAjIyAgICAgIyMgIyNcbiMjICAgICMjICAgICAgICAjIyAgICAgIyMgICAgIyMgICAgICAgIyMgICAjIyAgICMjIyMjIyMjIyAjI1xuIyMgICAgIyMgICAgICAgICMjICAgICAjIyAgICAjIyAgICAgICAjIyAgICAjIyAgIyMgICAgICMjICMjXG4jIyAgICAjIyMjIyMjIyAjIyMjICAgICMjICAgICMjIyMjIyMjICMjICAgICAjIyAjIyAgICAgIyMgIyMjIyMjIyNcblxuIyAjNmYzNDg5ZWZcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmNzc19oZXhhXzgnLCBcIiMoI3toZXhhZGVjaW1hbH17OH0pKD8hW1xcXFxkXFxcXHctXSlcIiwgMSwgWydjc3MnLCAnbGVzcycsICdzdHlsJywgJ3N0eWx1cycsICdzYXNzJywgJ3Njc3MnXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgaGV4YV0gPSBtYXRjaFxuXG4gIEBoZXhSR0JBID0gaGV4YVxuXG4jICM2ZjM0ODllZlxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6YXJnYl9oZXhhXzgnLCBcIiMoI3toZXhhZGVjaW1hbH17OH0pKD8hW1xcXFxkXFxcXHctXSlcIiwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGhleGFdID0gbWF0Y2hcblxuICBAaGV4QVJHQiA9IGhleGFcblxuIyAjMzQ4OWVmXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpjc3NfaGV4YV82JywgXCIjKCN7aGV4YWRlY2ltYWx9ezZ9KSg/IVtcXFxcZFxcXFx3LV0pXCIsIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBoZXhhXSA9IG1hdGNoXG5cbiAgQGhleCA9IGhleGFcblxuIyAjNmYzNFxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Y3NzX2hleGFfNCcsIFwiKD86I3tuYW1lUHJlZml4ZXN9KSMoI3toZXhhZGVjaW1hbH17NH0pKD8hW1xcXFxkXFxcXHctXSlcIiwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGhleGFdID0gbWF0Y2hcbiAgY29sb3JBc0ludCA9IGNvbnRleHQucmVhZEludChoZXhhLCAxNilcblxuICBAY29sb3JFeHByZXNzaW9uID0gXCIjI3toZXhhfVwiXG4gIEByZWQgPSAoY29sb3JBc0ludCA+PiAxMiAmIDB4ZikgKiAxN1xuICBAZ3JlZW4gPSAoY29sb3JBc0ludCA+PiA4ICYgMHhmKSAqIDE3XG4gIEBibHVlID0gKGNvbG9yQXNJbnQgPj4gNCAmIDB4ZikgKiAxN1xuICBAYWxwaGEgPSAoKGNvbG9yQXNJbnQgJiAweGYpICogMTcpIC8gMjU1XG5cbiMgIzM4ZVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Y3NzX2hleGFfMycsIFwiKD86I3tuYW1lUHJlZml4ZXN9KSMoI3toZXhhZGVjaW1hbH17M30pKD8hW1xcXFxkXFxcXHctXSlcIiwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGhleGFdID0gbWF0Y2hcbiAgY29sb3JBc0ludCA9IGNvbnRleHQucmVhZEludChoZXhhLCAxNilcblxuICBAY29sb3JFeHByZXNzaW9uID0gXCIjI3toZXhhfVwiXG4gIEByZWQgPSAoY29sb3JBc0ludCA+PiA4ICYgMHhmKSAqIDE3XG4gIEBncmVlbiA9IChjb2xvckFzSW50ID4+IDQgJiAweGYpICogMTdcbiAgQGJsdWUgPSAoY29sb3JBc0ludCAmIDB4ZikgKiAxN1xuXG4jIDB4YWIzNDg5ZWZcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmludF9oZXhhXzgnLCBcIjB4KCN7aGV4YWRlY2ltYWx9ezh9KSg/ISN7aGV4YWRlY2ltYWx9KVwiLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgaGV4YV0gPSBtYXRjaFxuXG4gIEBoZXhBUkdCID0gaGV4YVxuXG4jIDB4MzQ4OWVmXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czppbnRfaGV4YV82JywgXCIweCgje2hleGFkZWNpbWFsfXs2fSkoPyEje2hleGFkZWNpbWFsfSlcIiwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGhleGFdID0gbWF0Y2hcblxuICBAaGV4ID0gaGV4YVxuXG4jIHJnYig1MCwxMjAsMjAwKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Y3NzX3JnYicsIHN0cmlwKFwiXG4gICN7aW5zZW5zaXRpdmUgJ3JnYid9I3twc31cXFxccypcbiAgICAoI3tpbnRPclBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje2ludE9yUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7aW50T3JQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLHIsZyxiXSA9IG1hdGNoXG5cbiAgQHJlZCA9IGNvbnRleHQucmVhZEludE9yUGVyY2VudChyKVxuICBAZ3JlZW4gPSBjb250ZXh0LnJlYWRJbnRPclBlcmNlbnQoZylcbiAgQGJsdWUgPSBjb250ZXh0LnJlYWRJbnRPclBlcmNlbnQoYilcbiAgQGFscGhhID0gMVxuXG4jIHJnYmEoNTAsMTIwLDIwMCwwLjcpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpjc3NfcmdiYScsIHN0cmlwKFwiXG4gICN7aW5zZW5zaXRpdmUgJ3JnYmEnfSN7cHN9XFxcXHMqXG4gICAgKCN7aW50T3JQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tpbnRPclBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje2ludE9yUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18scixnLGIsYV0gPSBtYXRjaFxuXG4gIEByZWQgPSBjb250ZXh0LnJlYWRJbnRPclBlcmNlbnQocilcbiAgQGdyZWVuID0gY29udGV4dC5yZWFkSW50T3JQZXJjZW50KGcpXG4gIEBibHVlID0gY29udGV4dC5yZWFkSW50T3JQZXJjZW50KGIpXG4gIEBhbHBoYSA9IGNvbnRleHQucmVhZEZsb2F0KGEpXG5cbiMgcmdiYShncmVlbiwwLjcpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpzdHlsdXNfcmdiYScsIHN0cmlwKFwiXG4gIHJnYmEje3BzfVxcXFxzKlxuICAgICgje25vdFF1b3RlfSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLHN1YmV4cHIsYV0gPSBtYXRjaFxuXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG5cbiAgQHJnYiA9IGJhc2VDb2xvci5yZ2JcbiAgQGFscGhhID0gY29udGV4dC5yZWFkRmxvYXQoYSlcblxuIyBoc2woMjEwLDUwJSw1MCUpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpjc3NfaHNsJywgc3RyaXAoXCJcbiAgI3tpbnNlbnNpdGl2ZSAnaHNsJ30je3BzfVxcXFxzKlxuICAgICgje2Zsb2F0fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tvcHRpb25hbFBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje29wdGlvbmFsUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJ2NzcycsICdzYXNzJywgJ3Njc3MnLCAnc3R5bCcsICdzdHlsdXMnXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXyxoLHMsbF0gPSBtYXRjaFxuXG4gIGhzbCA9IFtcbiAgICBjb250ZXh0LnJlYWRJbnQoaClcbiAgICBjb250ZXh0LnJlYWRGbG9hdChzKVxuICAgIGNvbnRleHQucmVhZEZsb2F0KGwpXG4gIF1cblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGhzbC5zb21lICh2KSAtPiBub3Qgdj8gb3IgaXNOYU4odilcblxuICBAaHNsID0gaHNsXG4gIEBhbHBoYSA9IDFcblxuIyBoc2woMjEwLDUwJSw1MCUpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpsZXNzX2hzbCcsIHN0cmlwKFwiXG4gIGhzbCN7cHN9XFxcXHMqXG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0T3JQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tmbG9hdE9yUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJ2xlc3MnXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXyxoLHMsbF0gPSBtYXRjaFxuXG4gIGhzbCA9IFtcbiAgICBjb250ZXh0LnJlYWRJbnQoaClcbiAgICBjb250ZXh0LnJlYWRGbG9hdE9yUGVyY2VudChzKSAqIDEwMFxuICAgIGNvbnRleHQucmVhZEZsb2F0T3JQZXJjZW50KGwpICogMTAwXG4gIF1cblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGhzbC5zb21lICh2KSAtPiBub3Qgdj8gb3IgaXNOYU4odilcblxuICBAaHNsID0gaHNsXG4gIEBhbHBoYSA9IDFcblxuIyBoc2xhKDIxMCw1MCUsNTAlLDAuNylcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmNzc19oc2xhJywgc3RyaXAoXCJcbiAgI3tpbnNlbnNpdGl2ZSAnaHNsYSd9I3twc31cXFxccypcbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7b3B0aW9uYWxQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tvcHRpb25hbFBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLGgscyxsLGFdID0gbWF0Y2hcblxuICBoc2wgPSBbXG4gICAgY29udGV4dC5yZWFkSW50KGgpXG4gICAgY29udGV4dC5yZWFkRmxvYXQocylcbiAgICBjb250ZXh0LnJlYWRGbG9hdChsKVxuICBdXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBoc2wuc29tZSAodikgLT4gbm90IHY/IG9yIGlzTmFOKHYpXG5cbiAgQGhzbCA9IGhzbFxuICBAYWxwaGEgPSBjb250ZXh0LnJlYWRGbG9hdChhKVxuXG4jIGhzdigyMTAsNzAlLDkwJSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmhzdicsIHN0cmlwKFwiXG4gICg/OiN7aW5zZW5zaXRpdmUgJ2hzdid9fCN7aW5zZW5zaXRpdmUgJ2hzYid9KSN7cHN9XFxcXHMqXG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje29wdGlvbmFsUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7b3B0aW9uYWxQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLGgscyx2XSA9IG1hdGNoXG5cbiAgaHN2ID0gW1xuICAgIGNvbnRleHQucmVhZEludChoKVxuICAgIGNvbnRleHQucmVhZEZsb2F0KHMpXG4gICAgY29udGV4dC5yZWFkRmxvYXQodilcbiAgXVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgaHN2LnNvbWUgKHYpIC0+IG5vdCB2PyBvciBpc05hTih2KVxuXG4gIEBoc3YgPSBoc3ZcbiAgQGFscGhhID0gMVxuXG4jIGhzdmEoMjEwLDcwJSw5MCUsMC43KVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6aHN2YScsIHN0cmlwKFwiXG4gICg/OiN7aW5zZW5zaXRpdmUgJ2hzdmEnfXwje2luc2Vuc2l0aXZlICdoc2JhJ30pI3twc31cXFxccypcbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7b3B0aW9uYWxQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tvcHRpb25hbFBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLGgscyx2LGFdID0gbWF0Y2hcblxuICBoc3YgPSBbXG4gICAgY29udGV4dC5yZWFkSW50KGgpXG4gICAgY29udGV4dC5yZWFkRmxvYXQocylcbiAgICBjb250ZXh0LnJlYWRGbG9hdCh2KVxuICBdXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBoc3Yuc29tZSAodikgLT4gbm90IHY/IG9yIGlzTmFOKHYpXG5cbiAgQGhzdiA9IGhzdlxuICBAYWxwaGEgPSBjb250ZXh0LnJlYWRGbG9hdChhKVxuXG4jIGhjZygyMTAsNjAlLDUwJSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmhjZycsIHN0cmlwKFwiXG4gICg/OiN7aW5zZW5zaXRpdmUgJ2hjZyd9KSN7cHN9XFxcXHMqXG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje29wdGlvbmFsUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7b3B0aW9uYWxQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLGgsYyxncl0gPSBtYXRjaFxuXG4gIGhjZyA9IFtcbiAgICBjb250ZXh0LnJlYWRJbnQoaClcbiAgICBjb250ZXh0LnJlYWRGbG9hdChjKVxuICAgIGNvbnRleHQucmVhZEZsb2F0KGdyKVxuICBdXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBoY2cuc29tZSAodikgLT4gbm90IHY/IG9yIGlzTmFOKHYpXG5cbiAgQGhjZyA9IGhjZ1xuICBAYWxwaGEgPSAxXG5cbiMgaGNnYSgyMTAsNjAlLDUwJSwwLjcpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpoY2dhJywgc3RyaXAoXCJcbiAgKD86I3tpbnNlbnNpdGl2ZSAnaGNnYSd9KSN7cHN9XFxcXHMqXG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje29wdGlvbmFsUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7b3B0aW9uYWxQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXyxoLGMsZ3IsYV0gPSBtYXRjaFxuXG4gIGhjZyA9IFtcbiAgICBjb250ZXh0LnJlYWRJbnQoaClcbiAgICBjb250ZXh0LnJlYWRGbG9hdChjKVxuICAgIGNvbnRleHQucmVhZEZsb2F0KGdyKVxuICBdXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBoY2cuc29tZSAodikgLT4gbm90IHY/IG9yIGlzTmFOKHYpXG5cbiAgQGhjZyA9IGhjZ1xuICBAYWxwaGEgPSBjb250ZXh0LnJlYWRGbG9hdChhKVxuXG4jIHZlYzQoMC4yLCAwLjUsIDAuOSwgMC43KVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6dmVjNCcsIHN0cmlwKFwiXG4gIHZlYzQje3BzfVxcXFxzKlxuICAgICgje2Zsb2F0fSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0fSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0fSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0fSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18saCxzLGwsYV0gPSBtYXRjaFxuXG4gIEByZ2JhID0gW1xuICAgIGNvbnRleHQucmVhZEZsb2F0KGgpICogMjU1XG4gICAgY29udGV4dC5yZWFkRmxvYXQocykgKiAyNTVcbiAgICBjb250ZXh0LnJlYWRGbG9hdChsKSAqIDI1NVxuICAgIGNvbnRleHQucmVhZEZsb2F0KGEpXG4gIF1cblxuIyBod2IoMjEwLDQwJSw0MCUpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpod2InLCBzdHJpcChcIlxuICAje2luc2Vuc2l0aXZlICdod2InfSN7cHN9XFxcXHMqXG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje29wdGlvbmFsUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7b3B0aW9uYWxQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICAgKD86I3tjb21tYX0oI3tmbG9hdH18I3t2YXJpYWJsZXN9KSk/XG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLGgsdyxiLGFdID0gbWF0Y2hcblxuICBAaHdiID0gW1xuICAgIGNvbnRleHQucmVhZEludChoKVxuICAgIGNvbnRleHQucmVhZEZsb2F0KHcpXG4gICAgY29udGV4dC5yZWFkRmxvYXQoYilcbiAgXVxuICBAYWxwaGEgPSBpZiBhPyB0aGVuIGNvbnRleHQucmVhZEZsb2F0KGEpIGVsc2UgMVxuXG4jIGNteWsoMCwwLjUsMSwwKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Y215aycsIHN0cmlwKFwiXG4gICN7aW5zZW5zaXRpdmUgJ2NteWsnfSN7cHN9XFxcXHMqXG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sYyxtLHksa10gPSBtYXRjaFxuXG4gIEBjbXlrID0gW1xuICAgIGNvbnRleHQucmVhZEZsb2F0KGMpXG4gICAgY29udGV4dC5yZWFkRmxvYXQobSlcbiAgICBjb250ZXh0LnJlYWRGbG9hdCh5KVxuICAgIGNvbnRleHQucmVhZEZsb2F0KGspXG4gIF1cblxuIyBncmF5KDUwJSlcbiMgVGhlIHByaW9yaXR5IGlzIHNldCB0byAxIHRvIG1ha2Ugc3VyZSB0aGF0IGl0IGFwcGVhcnMgYmVmb3JlIG5hbWVkIGNvbG9yc1xucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Z3JheScsIHN0cmlwKFwiXG4gICN7aW5zZW5zaXRpdmUgJ2dyYXknfSN7cHN9XFxcXHMqXG4gICAgKCN7b3B0aW9uYWxQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICAgKD86I3tjb21tYX0oI3tmbG9hdH18I3t2YXJpYWJsZXN9KSk/XG4gICN7cGV9XCIpLCAxLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuXG4gIFtfLHAsYV0gPSBtYXRjaFxuXG4gIHAgPSBjb250ZXh0LnJlYWRGbG9hdChwKSAvIDEwMCAqIDI1NVxuICBAcmdiID0gW3AsIHAsIHBdXG4gIEBhbHBoYSA9IGlmIGE/IHRoZW4gY29udGV4dC5yZWFkRmxvYXQoYSkgZWxzZSAxXG5cbiMgZG9kZ2VyYmx1ZVxuY29sb3JzID0gT2JqZWN0LmtleXMoU1ZHQ29sb3JzLmFsbENhc2VzKVxuY29sb3JSZWdleHAgPSBcIig/OiN7bmFtZVByZWZpeGVzfSkoI3tjb2xvcnMuam9pbignfCcpfSlcXFxcYig/IVsgXFxcXHRdKlstXFxcXC46PVxcXFwoXSlcIlxuXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpuYW1lZF9jb2xvcnMnLCBjb2xvclJlZ2V4cCwgW10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sbmFtZV0gPSBtYXRjaFxuXG4gIEBjb2xvckV4cHJlc3Npb24gPSBAbmFtZSA9IG5hbWVcbiAgQGhleCA9IGNvbnRleHQuU1ZHQ29sb3JzLmFsbENhc2VzW25hbWVdLnJlcGxhY2UoJyMnLCcnKVxuXG4jIyAgICAjIyMjIyMjIyAjIyAgICAgIyMgIyMgICAgIyMgICMjIyMjI1xuIyMgICAgIyMgICAgICAgIyMgICAgICMjICMjIyAgICMjICMjICAgICMjXG4jIyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMjIyAgIyMgIyNcbiMjICAgICMjIyMjIyAgICMjICAgICAjIyAjIyAjIyAjIyAjI1xuIyMgICAgIyMgICAgICAgIyMgICAgICMjICMjICAjIyMjICMjXG4jIyAgICAjIyAgICAgICAjIyAgICAgIyMgIyMgICAjIyMgIyMgICAgIyNcbiMjICAgICMjICAgICAgICAjIyMjIyMjICAjIyAgICAjIyAgIyMjIyMjXG5cbiMgZGFya2VuKCM2NjY2NjYsIDIwJSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmRhcmtlbicsIHN0cmlwKFwiXG4gIGRhcmtlbiN7cHN9XG4gICAgKCN7bm90UXVvdGV9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7b3B0aW9uYWxQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByLCBhbW91bnRdID0gbWF0Y2hcblxuICBhbW91bnQgPSBjb250ZXh0LnJlYWRGbG9hdChhbW91bnQpXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG5cbiAgW2gscyxsXSA9IGJhc2VDb2xvci5oc2xcblxuICBAaHNsID0gW2gsIHMsIGNvbnRleHQuY2xhbXBJbnQobCAtIGFtb3VudCldXG4gIEBhbHBoYSA9IGJhc2VDb2xvci5hbHBoYVxuXG4jIGxpZ2h0ZW4oIzY2NjY2NiwgMjAlKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6bGlnaHRlbicsIHN0cmlwKFwiXG4gIGxpZ2h0ZW4je3BzfVxuICAgICgje25vdFF1b3RlfSlcbiAgICAje2NvbW1hfVxuICAgICgje29wdGlvbmFsUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwciwgYW1vdW50XSA9IG1hdGNoXG5cbiAgYW1vdW50ID0gY29udGV4dC5yZWFkRmxvYXQoYW1vdW50KVxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIFtoLHMsbF0gPSBiYXNlQ29sb3IuaHNsXG5cbiAgQGhzbCA9IFtoLCBzLCBjb250ZXh0LmNsYW1wSW50KGwgKyBhbW91bnQpXVxuICBAYWxwaGEgPSBiYXNlQ29sb3IuYWxwaGFcblxuIyBmYWRlKCNmZmZmZmYsIDAuNSlcbiMgYWxwaGEoI2ZmZmZmZiwgMC41KVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6ZmFkZScsIHN0cmlwKFwiXG4gICg/OmZhZGV8YWxwaGEpI3twc31cbiAgICAoI3tub3RRdW90ZX0pXG4gICAgI3tjb21tYX1cbiAgICAoI3tmbG9hdE9yUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwciwgYW1vdW50XSA9IG1hdGNoXG5cbiAgYW1vdW50ID0gY29udGV4dC5yZWFkRmxvYXRPclBlcmNlbnQoYW1vdW50KVxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIEByZ2IgPSBiYXNlQ29sb3IucmdiXG4gIEBhbHBoYSA9IGFtb3VudFxuXG4jIHRyYW5zcGFyZW50aXplKCNmZmZmZmYsIDAuNSlcbiMgdHJhbnNwYXJlbnRpemUoI2ZmZmZmZiwgNTAlKVxuIyBmYWRlb3V0KCNmZmZmZmYsIDAuNSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnRyYW5zcGFyZW50aXplJywgc3RyaXAoXCJcbiAgKD86dHJhbnNwYXJlbnRpemV8ZmFkZW91dHxmYWRlLW91dHxmYWRlX291dCkje3BzfVxuICAgICgje25vdFF1b3RlfSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0T3JQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByLCBhbW91bnRdID0gbWF0Y2hcblxuICBhbW91bnQgPSBjb250ZXh0LnJlYWRGbG9hdE9yUGVyY2VudChhbW91bnQpXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG5cbiAgQHJnYiA9IGJhc2VDb2xvci5yZ2JcbiAgQGFscGhhID0gY29udGV4dC5jbGFtcChiYXNlQ29sb3IuYWxwaGEgLSBhbW91bnQpXG5cbiMgb3BhY2lmeSgweDc4ZmZmZmZmLCAwLjUpXG4jIG9wYWNpZnkoMHg3OGZmZmZmZiwgNTAlKVxuIyBmYWRlaW4oMHg3OGZmZmZmZiwgMC41KVxuIyBhbHBoYSgweDc4ZmZmZmZmLCAwLjUpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpvcGFjaWZ5Jywgc3RyaXAoXCJcbiAgKD86b3BhY2lmeXxmYWRlaW58ZmFkZS1pbnxmYWRlX2luKSN7cHN9XG4gICAgKCN7bm90UXVvdGV9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXRPclBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHIsIGFtb3VudF0gPSBtYXRjaFxuXG4gIGFtb3VudCA9IGNvbnRleHQucmVhZEZsb2F0T3JQZXJjZW50KGFtb3VudClcbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBAcmdiID0gYmFzZUNvbG9yLnJnYlxuICBAYWxwaGEgPSBjb250ZXh0LmNsYW1wKGJhc2VDb2xvci5hbHBoYSArIGFtb3VudClcblxuIyByZWQoIzAwMCwyNTUpXG4jIGdyZWVuKCMwMDAsMjU1KVxuIyBibHVlKCMwMDAsMjU1KVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6c3R5bHVzX2NvbXBvbmVudF9mdW5jdGlvbnMnLCBzdHJpcChcIlxuICAocmVkfGdyZWVufGJsdWUpI3twc31cbiAgICAoI3tub3RRdW90ZX0pXG4gICAgI3tjb21tYX1cbiAgICAoI3tpbnR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGNoYW5uZWwsIHN1YmV4cHIsIGFtb3VudF0gPSBtYXRjaFxuXG4gIGFtb3VudCA9IGNvbnRleHQucmVhZEludChhbW91bnQpXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgaXNOYU4oYW1vdW50KVxuXG4gIEBbY2hhbm5lbF0gPSBhbW91bnRcblxuIyB0cmFuc3BhcmVudGlmeSgjODA4MDgwKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6dHJhbnNwYXJlbnRpZnknLCBzdHJpcChcIlxuICB0cmFuc3BhcmVudGlmeSN7cHN9XG4gICgje25vdFF1b3RlfSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGV4cHJdID0gbWF0Y2hcblxuICBbdG9wLCBib3R0b20sIGFscGhhXSA9IGNvbnRleHQuc3BsaXQoZXhwcilcblxuICB0b3AgPSBjb250ZXh0LnJlYWRDb2xvcih0b3ApXG4gIGJvdHRvbSA9IGNvbnRleHQucmVhZENvbG9yKGJvdHRvbSlcbiAgYWxwaGEgPSBjb250ZXh0LnJlYWRGbG9hdE9yUGVyY2VudChhbHBoYSlcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKHRvcClcbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBib3R0b20/IGFuZCBjb250ZXh0LmlzSW52YWxpZChib3R0b20pXG5cbiAgYm90dG9tID89IG5ldyBjb250ZXh0LkNvbG9yKDI1NSwyNTUsMjU1LDEpXG4gIGFscGhhID0gdW5kZWZpbmVkIGlmIGlzTmFOKGFscGhhKVxuXG4gIGJlc3RBbHBoYSA9IFsncmVkJywnZ3JlZW4nLCdibHVlJ10ubWFwKChjaGFubmVsKSAtPlxuICAgIHJlcyA9ICh0b3BbY2hhbm5lbF0gLSAoYm90dG9tW2NoYW5uZWxdKSkgLyAoKGlmIDAgPCB0b3BbY2hhbm5lbF0gLSAoYm90dG9tW2NoYW5uZWxdKSB0aGVuIDI1NSBlbHNlIDApIC0gKGJvdHRvbVtjaGFubmVsXSkpXG4gICAgcmVzXG4gICkuc29ydCgoYSwgYikgLT4gYSA8IGIpWzBdXG5cbiAgcHJvY2Vzc0NoYW5uZWwgPSAoY2hhbm5lbCkgLT5cbiAgICBpZiBiZXN0QWxwaGEgaXMgMFxuICAgICAgYm90dG9tW2NoYW5uZWxdXG4gICAgZWxzZVxuICAgICAgYm90dG9tW2NoYW5uZWxdICsgKHRvcFtjaGFubmVsXSAtIChib3R0b21bY2hhbm5lbF0pKSAvIGJlc3RBbHBoYVxuXG4gIGJlc3RBbHBoYSA9IGFscGhhIGlmIGFscGhhP1xuICBiZXN0QWxwaGEgPSBNYXRoLm1heChNYXRoLm1pbihiZXN0QWxwaGEsIDEpLCAwKVxuXG4gIEByZWQgPSBwcm9jZXNzQ2hhbm5lbCgncmVkJylcbiAgQGdyZWVuID0gcHJvY2Vzc0NoYW5uZWwoJ2dyZWVuJylcbiAgQGJsdWUgPSBwcm9jZXNzQ2hhbm5lbCgnYmx1ZScpXG4gIEBhbHBoYSA9IE1hdGgucm91bmQoYmVzdEFscGhhICogMTAwKSAvIDEwMFxuXG4jIGh1ZSgjODU1LCA2MGRlZylcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmh1ZScsIHN0cmlwKFwiXG4gIGh1ZSN7cHN9XG4gICAgKCN7bm90UXVvdGV9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7aW50fWRlZ3wje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByLCBhbW91bnRdID0gbWF0Y2hcblxuICBhbW91bnQgPSBjb250ZXh0LnJlYWRGbG9hdChhbW91bnQpXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgaXNOYU4oYW1vdW50KVxuXG4gIFtoLHMsbF0gPSBiYXNlQ29sb3IuaHNsXG5cbiAgQGhzbCA9IFthbW91bnQgJSAzNjAsIHMsIGxdXG4gIEBhbHBoYSA9IGJhc2VDb2xvci5hbHBoYVxuXG4jIHNhdHVyYXRpb24oIzg1NSwgNjBkZWcpXG4jIGxpZ2h0bmVzcygjODU1LCA2MGRlZylcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnN0eWx1c19zbF9jb21wb25lbnRfZnVuY3Rpb25zJywgc3RyaXAoXCJcbiAgKHNhdHVyYXRpb258bGlnaHRuZXNzKSN7cHN9XG4gICAgKCN7bm90UXVvdGV9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7aW50T3JQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBjaGFubmVsLCBzdWJleHByLCBhbW91bnRdID0gbWF0Y2hcblxuICBhbW91bnQgPSBjb250ZXh0LnJlYWRJbnQoYW1vdW50KVxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGlzTmFOKGFtb3VudClcblxuICBiYXNlQ29sb3JbY2hhbm5lbF0gPSBhbW91bnRcbiAgQHJnYmEgPSBiYXNlQ29sb3IucmdiYVxuXG4jIGFkanVzdC1odWUoIzg1NSwgNjBkZWcpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czphZGp1c3QtaHVlJywgc3RyaXAoXCJcbiAgYWRqdXN0LWh1ZSN7cHN9XG4gICAgKCN7bm90UXVvdGV9KVxuICAgICN7Y29tbWF9XG4gICAgKC0/I3tpbnR9ZGVnfCN7dmFyaWFibGVzfXwtPyN7b3B0aW9uYWxQZXJjZW50fSlcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHIsIGFtb3VudF0gPSBtYXRjaFxuXG4gIGFtb3VudCA9IGNvbnRleHQucmVhZEZsb2F0KGFtb3VudClcbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBbaCxzLGxdID0gYmFzZUNvbG9yLmhzbFxuXG4gIEBoc2wgPSBbKGggKyBhbW91bnQpICUgMzYwLCBzLCBsXVxuICBAYWxwaGEgPSBiYXNlQ29sb3IuYWxwaGFcblxuIyBtaXgoI2YwMCwgIzAwRiwgMjUlKVxuIyBtaXgoI2YwMCwgIzAwRilcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOm1peCcsIFwibWl4I3twc30oI3tub3RRdW90ZX0pI3twZX1cIiwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGV4cHJdID0gbWF0Y2hcblxuICBbY29sb3IxLCBjb2xvcjIsIGFtb3VudF0gPSBjb250ZXh0LnNwbGl0KGV4cHIpXG5cbiAgaWYgYW1vdW50P1xuICAgIGFtb3VudCA9IGNvbnRleHQucmVhZEZsb2F0T3JQZXJjZW50KGFtb3VudClcbiAgZWxzZVxuICAgIGFtb3VudCA9IDAuNVxuXG4gIGJhc2VDb2xvcjEgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjEpXG4gIGJhc2VDb2xvcjIgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IxKSBvciBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IyKVxuXG4gIHtAcmdiYX0gPSBjb250ZXh0Lm1peENvbG9ycyhiYXNlQ29sb3IxLCBiYXNlQ29sb3IyLCBhbW91bnQpXG5cbiMgdGludChyZWQsIDUwJSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnN0eWx1c190aW50Jywgc3RyaXAoXCJcbiAgdGludCN7cHN9XG4gICAgKCN7bm90UXVvdGV9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXRPclBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWydzdHlsJywgJ3N0eWx1cycsICdsZXNzJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHIsIGFtb3VudF0gPSBtYXRjaFxuXG4gIGFtb3VudCA9IGNvbnRleHQucmVhZEZsb2F0T3JQZXJjZW50KGFtb3VudClcbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICB3aGl0ZSA9IG5ldyBjb250ZXh0LkNvbG9yKDI1NSwgMjU1LCAyNTUpXG5cbiAgQHJnYmEgPSBjb250ZXh0Lm1peENvbG9ycyh3aGl0ZSwgYmFzZUNvbG9yLCBhbW91bnQpLnJnYmFcblxuIyBzaGFkZShyZWQsIDUwJSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnN0eWx1c19zaGFkZScsIHN0cmlwKFwiXG4gIHNoYWRlI3twc31cbiAgICAoI3tub3RRdW90ZX0pXG4gICAgI3tjb21tYX1cbiAgICAoI3tmbG9hdE9yUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJ3N0eWwnLCAnc3R5bHVzJywgJ2xlc3MnXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwciwgYW1vdW50XSA9IG1hdGNoXG5cbiAgYW1vdW50ID0gY29udGV4dC5yZWFkRmxvYXRPclBlcmNlbnQoYW1vdW50KVxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIGJsYWNrID0gbmV3IGNvbnRleHQuQ29sb3IoMCwwLDApXG5cbiAgQHJnYmEgPSBjb250ZXh0Lm1peENvbG9ycyhibGFjaywgYmFzZUNvbG9yLCBhbW91bnQpLnJnYmFcblxuIyB0aW50KHJlZCwgNTAlKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Y29tcGFzc190aW50Jywgc3RyaXAoXCJcbiAgdGludCN7cHN9XG4gICAgKCN7bm90UXVvdGV9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXRPclBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWydzYXNzOmNvbXBhc3MnLCAnc2Nzczpjb21wYXNzJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHIsIGFtb3VudF0gPSBtYXRjaFxuXG4gIGFtb3VudCA9IGNvbnRleHQucmVhZEZsb2F0T3JQZXJjZW50KGFtb3VudClcbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICB3aGl0ZSA9IG5ldyBjb250ZXh0LkNvbG9yKDI1NSwgMjU1LCAyNTUpXG5cbiAgQHJnYmEgPSBjb250ZXh0Lm1peENvbG9ycyhiYXNlQ29sb3IsIHdoaXRlLCBhbW91bnQpLnJnYmFcblxuIyBzaGFkZShyZWQsIDUwJSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmNvbXBhc3Nfc2hhZGUnLCBzdHJpcChcIlxuICBzaGFkZSN7cHN9XG4gICAgKCN7bm90UXVvdGV9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7ZmxvYXRPclBlcmNlbnR9fCN7dmFyaWFibGVzfSlcbiAgI3twZX1cblwiKSwgWydzYXNzOmNvbXBhc3MnLCAnc2Nzczpjb21wYXNzJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHIsIGFtb3VudF0gPSBtYXRjaFxuXG4gIGFtb3VudCA9IGNvbnRleHQucmVhZEZsb2F0T3JQZXJjZW50KGFtb3VudClcbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBibGFjayA9IG5ldyBjb250ZXh0LkNvbG9yKDAsMCwwKVxuXG4gIEByZ2JhID0gY29udGV4dC5taXhDb2xvcnMoYmFzZUNvbG9yLCBibGFjaywgYW1vdW50KS5yZ2JhXG5cbiMgdGludChyZWQsIDUwJSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmJvdXJib25fdGludCcsIHN0cmlwKFwiXG4gIHRpbnQje3BzfVxuICAgICgje25vdFF1b3RlfSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0T3JQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnc2Fzczpib3VyYm9uJywgJ3Njc3M6Ym91cmJvbiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByLCBhbW91bnRdID0gbWF0Y2hcblxuICBhbW91bnQgPSBjb250ZXh0LnJlYWRGbG9hdE9yUGVyY2VudChhbW91bnQpXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG5cbiAgd2hpdGUgPSBuZXcgY29udGV4dC5Db2xvcigyNTUsIDI1NSwgMjU1KVxuXG4gIEByZ2JhID0gY29udGV4dC5taXhDb2xvcnMod2hpdGUsIGJhc2VDb2xvciwgYW1vdW50KS5yZ2JhXG5cbiMgc2hhZGUocmVkLCA1MCUpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpib3VyYm9uX3NoYWRlJywgc3RyaXAoXCJcbiAgc2hhZGUje3BzfVxuICAgICgje25vdFF1b3RlfSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0T3JQZXJjZW50fXwje3ZhcmlhYmxlc30pXG4gICN7cGV9XG5cIiksIFsnc2Fzczpib3VyYm9uJywgJ3Njc3M6Ym91cmJvbiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByLCBhbW91bnRdID0gbWF0Y2hcblxuICBhbW91bnQgPSBjb250ZXh0LnJlYWRGbG9hdE9yUGVyY2VudChhbW91bnQpXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG5cbiAgYmxhY2sgPSBuZXcgY29udGV4dC5Db2xvcigwLDAsMClcblxuICBAcmdiYSA9IGNvbnRleHQubWl4Q29sb3JzKGJsYWNrLCBiYXNlQ29sb3IsIGFtb3VudCkucmdiYVxuXG4jIGRlc2F0dXJhdGUoIzg1NSwgMjAlKVxuIyBkZXNhdHVyYXRlKCM4NTUsIDAuMilcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmRlc2F0dXJhdGUnLCBcImRlc2F0dXJhdGUje3BzfSgje25vdFF1b3RlfSkje2NvbW1hfSgje2Zsb2F0T3JQZXJjZW50fXwje3ZhcmlhYmxlc30pI3twZX1cIiwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHIsIGFtb3VudF0gPSBtYXRjaFxuXG4gIGFtb3VudCA9IGNvbnRleHQucmVhZEZsb2F0T3JQZXJjZW50KGFtb3VudClcbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBbaCxzLGxdID0gYmFzZUNvbG9yLmhzbFxuXG4gIEBoc2wgPSBbaCwgY29udGV4dC5jbGFtcEludChzIC0gYW1vdW50ICogMTAwKSwgbF1cbiAgQGFscGhhID0gYmFzZUNvbG9yLmFscGhhXG5cbiMgc2F0dXJhdGUoIzg1NSwgMjAlKVxuIyBzYXR1cmF0ZSgjODU1LCAwLjIpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpzYXR1cmF0ZScsIHN0cmlwKFwiXG4gIHNhdHVyYXRlI3twc31cbiAgICAoI3tub3RRdW90ZX0pXG4gICAgI3tjb21tYX1cbiAgICAoI3tmbG9hdE9yUGVyY2VudH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwciwgYW1vdW50XSA9IG1hdGNoXG5cbiAgYW1vdW50ID0gY29udGV4dC5yZWFkRmxvYXRPclBlcmNlbnQoYW1vdW50KVxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIFtoLHMsbF0gPSBiYXNlQ29sb3IuaHNsXG5cbiAgQGhzbCA9IFtoLCBjb250ZXh0LmNsYW1wSW50KHMgKyBhbW91bnQgKiAxMDApLCBsXVxuICBAYWxwaGEgPSBiYXNlQ29sb3IuYWxwaGFcblxuIyBncmF5c2NhbGUocmVkKVxuIyBncmV5c2NhbGUocmVkKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Z3JheXNjYWxlJywgXCJncig/OmF8ZSl5c2NhbGUje3BzfSgje25vdFF1b3RlfSkje3BlfVwiLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwcl0gPSBtYXRjaFxuXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG5cbiAgW2gscyxsXSA9IGJhc2VDb2xvci5oc2xcblxuICBAaHNsID0gW2gsIDAsIGxdXG4gIEBhbHBoYSA9IGJhc2VDb2xvci5hbHBoYVxuXG4jIGludmVydChncmVlbilcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmludmVydCcsIFwiaW52ZXJ0I3twc30oI3tub3RRdW90ZX0pI3twZX1cIiwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHJdID0gbWF0Y2hcblxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuXG4gIFtyLGcsYl0gPSBiYXNlQ29sb3IucmdiXG5cbiAgQHJnYiA9IFsyNTUgLSByLCAyNTUgLSBnLCAyNTUgLSBiXVxuICBAYWxwaGEgPSBiYXNlQ29sb3IuYWxwaGFcblxuIyBjb21wbGVtZW50KGdyZWVuKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Y29tcGxlbWVudCcsIFwiY29tcGxlbWVudCN7cHN9KCN7bm90UXVvdGV9KSN7cGV9XCIsIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByXSA9IG1hdGNoXG5cbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBbaCxzLGxdID0gYmFzZUNvbG9yLmhzbFxuXG4gIEBoc2wgPSBbKGggKyAxODApICUgMzYwLCBzLCBsXVxuICBAYWxwaGEgPSBiYXNlQ29sb3IuYWxwaGFcblxuIyBzcGluKGdyZWVuLCAyMClcbiMgc3BpbihncmVlbiwgMjBkZWcpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpzcGluJywgc3RyaXAoXCJcbiAgc3BpbiN7cHN9XG4gICAgKCN7bm90UXVvdGV9KVxuICAgICN7Y29tbWF9XG4gICAgKC0/KCN7aW50fSkoZGVnKT98I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwciwgYW5nbGVdID0gbWF0Y2hcblxuICBiYXNlQ29sb3IgPSBjb250ZXh0LnJlYWRDb2xvcihzdWJleHByKVxuICBhbmdsZSA9IGNvbnRleHQucmVhZEludChhbmdsZSlcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBbaCxzLGxdID0gYmFzZUNvbG9yLmhzbFxuXG4gIEBoc2wgPSBbKDM2MCArIGggKyBhbmdsZSkgJSAzNjAsIHMsIGxdXG4gIEBhbHBoYSA9IGJhc2VDb2xvci5hbHBoYVxuXG4jIGNvbnRyYXN0KCM2NjY2NjYsICMxMTExMTEsICM5OTk5OTksIHRocmVzaG9sZClcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmNvbnRyYXN0X25fYXJndW1lbnRzJywgc3RyaXAoXCJcbiAgY29udHJhc3Qje3BzfVxuICAgIChcbiAgICAgICN7bm90UXVvdGV9XG4gICAgICAje2NvbW1hfVxuICAgICAgI3tub3RRdW90ZX1cbiAgICApXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBleHByXSA9IG1hdGNoXG5cbiAgW2Jhc2UsIGRhcmssIGxpZ2h0LCB0aHJlc2hvbGRdID0gY29udGV4dC5zcGxpdChleHByKVxuXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKGJhc2UpXG4gIGRhcmsgPSBjb250ZXh0LnJlYWRDb2xvcihkYXJrKVxuICBsaWdodCA9IGNvbnRleHQucmVhZENvbG9yKGxpZ2h0KVxuICB0aHJlc2hvbGQgPSBjb250ZXh0LnJlYWRQZXJjZW50KHRocmVzaG9sZCkgaWYgdGhyZXNob2xkP1xuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yKVxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGRhcms/LmludmFsaWRcbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBsaWdodD8uaW52YWxpZFxuXG4gIHJlcyA9IGNvbnRleHQuY29udHJhc3QoYmFzZUNvbG9yLCBkYXJrLCBsaWdodClcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKHJlcylcblxuICB7QHJnYn0gPSBjb250ZXh0LmNvbnRyYXN0KGJhc2VDb2xvciwgZGFyaywgbGlnaHQsIHRocmVzaG9sZClcblxuIyBjb250cmFzdCgjNjY2NjY2KVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6Y29udHJhc3RfMV9hcmd1bWVudCcsIHN0cmlwKFwiXG4gIGNvbnRyYXN0I3twc31cbiAgICAoI3tub3RRdW90ZX0pXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBzdWJleHByXSA9IG1hdGNoXG5cbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViZXhwcilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICB7QHJnYn0gPSBjb250ZXh0LmNvbnRyYXN0KGJhc2VDb2xvcilcblxuIyBjb2xvcihncmVlbiB0aW50KDUwJSkpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpjc3NfY29sb3JfZnVuY3Rpb24nLCBcIig/OiN7bmFtZVByZWZpeGVzfSkoI3tpbnNlbnNpdGl2ZSAnY29sb3InfSN7cHN9KCN7bm90UXVvdGV9KSN7cGV9KVwiLCBbJ2NzcyddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIHRyeVxuICAgIFtfLGV4cHJdID0gbWF0Y2hcbiAgICBmb3Igayx2IG9mIGNvbnRleHQudmFyc1xuICAgICAgZXhwciA9IGV4cHIucmVwbGFjZSgvLy9cbiAgICAgICAgI3trLnJlcGxhY2UoL1xcKC9nLCAnXFxcXCgnKS5yZXBsYWNlKC9cXCkvZywgJ1xcXFwpJyl9XG4gICAgICAvLy9nLCB2LnZhbHVlKVxuXG4gICAgY3NzQ29sb3IgPSByZXF1aXJlICdjc3MtY29sb3ItZnVuY3Rpb24nXG4gICAgcmdiYSA9IGNzc0NvbG9yLmNvbnZlcnQoZXhwci50b0xvd2VyQ2FzZSgpKVxuICAgIEByZ2JhID0gY29udGV4dC5yZWFkQ29sb3IocmdiYSkucmdiYVxuICAgIEBjb2xvckV4cHJlc3Npb24gPSBleHByXG4gIGNhdGNoIGVcbiAgICBAaW52YWxpZCA9IHRydWVcblxuIyBhZGp1c3QtY29sb3IocmVkLCAkbGlnaHRuZXNzOiAzMCUpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpzYXNzX2FkanVzdF9jb2xvcicsIFwiYWRqdXN0LWNvbG9yI3twc30oI3tub3RRdW90ZX0pI3twZX1cIiwgMSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIHN1YmV4cHJdID0gbWF0Y2hcbiAgcmVzID0gY29udGV4dC5zcGxpdChzdWJleHByKVxuICBzdWJqZWN0ID0gcmVzWzBdXG4gIHBhcmFtcyA9IHJlcy5zbGljZSgxKVxuXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmplY3QpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG5cbiAgZm9yIHBhcmFtIGluIHBhcmFtc1xuICAgIGNvbnRleHQucmVhZFBhcmFtIHBhcmFtLCAobmFtZSwgdmFsdWUpIC0+XG4gICAgICBiYXNlQ29sb3JbbmFtZV0gKz0gY29udGV4dC5yZWFkRmxvYXQodmFsdWUpXG5cbiAgQHJnYmEgPSBiYXNlQ29sb3IucmdiYVxuXG4jIHNjYWxlLWNvbG9yKHJlZCwgJGxpZ2h0bmVzczogMzAlKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6c2Fzc19zY2FsZV9jb2xvcicsIFwic2NhbGUtY29sb3Ije3BzfSgje25vdFF1b3RlfSkje3BlfVwiLCAxLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBNQVhfUEVSX0NPTVBPTkVOVCA9XG4gICAgcmVkOiAyNTVcbiAgICBncmVlbjogMjU1XG4gICAgYmx1ZTogMjU1XG4gICAgYWxwaGE6IDFcbiAgICBodWU6IDM2MFxuICAgIHNhdHVyYXRpb246IDEwMFxuICAgIGxpZ2h0bmVzczogMTAwXG5cbiAgW18sIHN1YmV4cHJdID0gbWF0Y2hcbiAgcmVzID0gY29udGV4dC5zcGxpdChzdWJleHByKVxuICBzdWJqZWN0ID0gcmVzWzBdXG4gIHBhcmFtcyA9IHJlcy5zbGljZSgxKVxuXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmplY3QpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG5cbiAgZm9yIHBhcmFtIGluIHBhcmFtc1xuICAgIGNvbnRleHQucmVhZFBhcmFtIHBhcmFtLCAobmFtZSwgdmFsdWUpIC0+XG4gICAgICB2YWx1ZSA9IGNvbnRleHQucmVhZEZsb2F0KHZhbHVlKSAvIDEwMFxuXG4gICAgICByZXN1bHQgPSBpZiB2YWx1ZSA+IDBcbiAgICAgICAgZGlmID0gTUFYX1BFUl9DT01QT05FTlRbbmFtZV0gLSBiYXNlQ29sb3JbbmFtZV1cbiAgICAgICAgcmVzdWx0ID0gYmFzZUNvbG9yW25hbWVdICsgZGlmICogdmFsdWVcbiAgICAgIGVsc2VcbiAgICAgICAgcmVzdWx0ID0gYmFzZUNvbG9yW25hbWVdICogKDEgKyB2YWx1ZSlcblxuICAgICAgYmFzZUNvbG9yW25hbWVdID0gcmVzdWx0XG5cbiAgQHJnYmEgPSBiYXNlQ29sb3IucmdiYVxuXG4jIGNoYW5nZS1jb2xvcihyZWQsICRsaWdodG5lc3M6IDMwJSlcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnNhc3NfY2hhbmdlX2NvbG9yJywgXCJjaGFuZ2UtY29sb3Ije3BzfSgje25vdFF1b3RlfSkje3BlfVwiLCAxLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwcl0gPSBtYXRjaFxuICByZXMgPSBjb250ZXh0LnNwbGl0KHN1YmV4cHIpXG4gIHN1YmplY3QgPSByZXNbMF1cbiAgcGFyYW1zID0gcmVzLnNsaWNlKDEpXG5cbiAgYmFzZUNvbG9yID0gY29udGV4dC5yZWFkQ29sb3Ioc3ViamVjdClcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcilcblxuICBmb3IgcGFyYW0gaW4gcGFyYW1zXG4gICAgY29udGV4dC5yZWFkUGFyYW0gcGFyYW0sIChuYW1lLCB2YWx1ZSkgLT5cbiAgICAgIGJhc2VDb2xvcltuYW1lXSA9IGNvbnRleHQucmVhZEZsb2F0KHZhbHVlKVxuXG4gIEByZ2JhID0gYmFzZUNvbG9yLnJnYmFcblxuIyBibGVuZChyZ2JhKCNGRkRFMDAsLjQyKSwgMHgxOUMyNjEpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpzdHlsdXNfYmxlbmQnLCBzdHJpcChcIlxuICBibGVuZCN7cHN9XG4gICAgKFxuICAgICAgI3tub3RRdW90ZX1cbiAgICAgICN7Y29tbWF9XG4gICAgICAje25vdFF1b3RlfVxuICAgIClcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGV4cHJdID0gbWF0Y2hcblxuICBbY29sb3IxLCBjb2xvcjJdID0gY29udGV4dC5zcGxpdChleHByKVxuXG4gIGJhc2VDb2xvcjEgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjEpXG4gIGJhc2VDb2xvcjIgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IxKSBvciBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IyKVxuXG4gIEByZ2JhID0gW1xuICAgIGJhc2VDb2xvcjEucmVkICogYmFzZUNvbG9yMS5hbHBoYSArIGJhc2VDb2xvcjIucmVkICogKDEgLSBiYXNlQ29sb3IxLmFscGhhKVxuICAgIGJhc2VDb2xvcjEuZ3JlZW4gKiBiYXNlQ29sb3IxLmFscGhhICsgYmFzZUNvbG9yMi5ncmVlbiAqICgxIC0gYmFzZUNvbG9yMS5hbHBoYSlcbiAgICBiYXNlQ29sb3IxLmJsdWUgKiBiYXNlQ29sb3IxLmFscGhhICsgYmFzZUNvbG9yMi5ibHVlICogKDEgLSBiYXNlQ29sb3IxLmFscGhhKVxuICAgIGJhc2VDb2xvcjEuYWxwaGEgKyBiYXNlQ29sb3IyLmFscGhhIC0gYmFzZUNvbG9yMS5hbHBoYSAqIGJhc2VDb2xvcjIuYWxwaGFcbiAgXVxuXG4jIENvbG9yKDUwLDEyMCwyMDAsMjU1KVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6bHVhX3JnYmEnLCBzdHJpcChcIlxuICAoPzoje25hbWVQcmVmaXhlc30pQ29sb3Ije3BzfVxcXFxzKlxuICAgICgje2ludH18I3t2YXJpYWJsZXN9KVxuICAgICN7Y29tbWF9XG4gICAgKCN7aW50fXwje3ZhcmlhYmxlc30pXG4gICAgI3tjb21tYX1cbiAgICAoI3tpbnR9fCN7dmFyaWFibGVzfSlcbiAgICAje2NvbW1hfVxuICAgICgje2ludH18I3t2YXJpYWJsZXN9KVxuICAje3BlfVxuXCIpLCBbJ2x1YSddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLHIsZyxiLGFdID0gbWF0Y2hcblxuICBAcmVkID0gY29udGV4dC5yZWFkSW50KHIpXG4gIEBncmVlbiA9IGNvbnRleHQucmVhZEludChnKVxuICBAYmx1ZSA9IGNvbnRleHQucmVhZEludChiKVxuICBAYWxwaGEgPSBjb250ZXh0LnJlYWRJbnQoYSkgLyAyNTVcblxuIyMgICAgIyMjIyMjIyMgICMjICAgICAgICMjIyMjIyMjICMjICAgICMjICMjIyMjIyMjXG4jIyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICAgIyMjICAgIyMgIyMgICAgICMjXG4jIyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICAgIyMjIyAgIyMgIyMgICAgICMjXG4jIyAgICAjIyMjIyMjIyAgIyMgICAgICAgIyMjIyMjICAgIyMgIyMgIyMgIyMgICAgICMjXG4jIyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICAgIyMgICMjIyMgIyMgICAgICMjXG4jIyAgICAjIyAgICAgIyMgIyMgICAgICAgIyMgICAgICAgIyMgICAjIyMgIyMgICAgICMjXG4jIyAgICAjIyMjIyMjIyAgIyMjIyMjIyMgIyMjIyMjIyMgIyMgICAgIyMgIyMjIyMjIyNcblxuIyBtdWx0aXBseSgjZjAwLCAjMDBGKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6bXVsdGlwbHknLCBzdHJpcChcIlxuICBtdWx0aXBseSN7cHN9XG4gICAgKFxuICAgICAgI3tub3RRdW90ZX1cbiAgICAgICN7Y29tbWF9XG4gICAgICAje25vdFF1b3RlfVxuICAgIClcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGV4cHJdID0gbWF0Y2hcblxuICBbY29sb3IxLCBjb2xvcjJdID0gY29udGV4dC5zcGxpdChleHByKVxuXG4gIGJhc2VDb2xvcjEgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjEpXG4gIGJhc2VDb2xvcjIgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IxKSBvciBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IyKVxuXG4gIHtAcmdiYX0gPSBiYXNlQ29sb3IxLmJsZW5kKGJhc2VDb2xvcjIsIGNvbnRleHQuQmxlbmRNb2Rlcy5NVUxUSVBMWSlcblxuIyBzY3JlZW4oI2YwMCwgIzAwRilcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOnNjcmVlbicsIHN0cmlwKFwiXG4gIHNjcmVlbiN7cHN9XG4gICAgKFxuICAgICAgI3tub3RRdW90ZX1cbiAgICAgICN7Y29tbWF9XG4gICAgICAje25vdFF1b3RlfVxuICAgIClcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGV4cHJdID0gbWF0Y2hcblxuICBbY29sb3IxLCBjb2xvcjJdID0gY29udGV4dC5zcGxpdChleHByKVxuXG4gIGJhc2VDb2xvcjEgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjEpXG4gIGJhc2VDb2xvcjIgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IxKSBvciBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IyKVxuXG4gIHtAcmdiYX0gPSBiYXNlQ29sb3IxLmJsZW5kKGJhc2VDb2xvcjIsIGNvbnRleHQuQmxlbmRNb2Rlcy5TQ1JFRU4pXG5cblxuIyBvdmVybGF5KCNmMDAsICMwMEYpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpvdmVybGF5Jywgc3RyaXAoXCJcbiAgb3ZlcmxheSN7cHN9XG4gICAgKFxuICAgICAgI3tub3RRdW90ZX1cbiAgICAgICN7Y29tbWF9XG4gICAgICAje25vdFF1b3RlfVxuICAgIClcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGV4cHJdID0gbWF0Y2hcblxuICBbY29sb3IxLCBjb2xvcjJdID0gY29udGV4dC5zcGxpdChleHByKVxuXG4gIGJhc2VDb2xvcjEgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjEpXG4gIGJhc2VDb2xvcjIgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IxKSBvciBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IyKVxuXG4gIHtAcmdiYX0gPSBiYXNlQ29sb3IxLmJsZW5kKGJhc2VDb2xvcjIsIGNvbnRleHQuQmxlbmRNb2Rlcy5PVkVSTEFZKVxuXG5cbiMgc29mdGxpZ2h0KCNmMDAsICMwMEYpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpzb2Z0bGlnaHQnLCBzdHJpcChcIlxuICBzb2Z0bGlnaHQje3BzfVxuICAgIChcbiAgICAgICN7bm90UXVvdGV9XG4gICAgICAje2NvbW1hfVxuICAgICAgI3tub3RRdW90ZX1cbiAgICApXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBleHByXSA9IG1hdGNoXG5cbiAgW2NvbG9yMSwgY29sb3IyXSA9IGNvbnRleHQuc3BsaXQoZXhwcilcblxuICBiYXNlQ29sb3IxID0gY29udGV4dC5yZWFkQ29sb3IoY29sb3IxKVxuICBiYXNlQ29sb3IyID0gY29udGV4dC5yZWFkQ29sb3IoY29sb3IyKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yMSkgb3IgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yMilcblxuICB7QHJnYmF9ID0gYmFzZUNvbG9yMS5ibGVuZChiYXNlQ29sb3IyLCBjb250ZXh0LkJsZW5kTW9kZXMuU09GVF9MSUdIVClcblxuXG4jIGhhcmRsaWdodCgjZjAwLCAjMDBGKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6aGFyZGxpZ2h0Jywgc3RyaXAoXCJcbiAgaGFyZGxpZ2h0I3twc31cbiAgICAoXG4gICAgICAje25vdFF1b3RlfVxuICAgICAgI3tjb21tYX1cbiAgICAgICN7bm90UXVvdGV9XG4gICAgKVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgZXhwcl0gPSBtYXRjaFxuXG4gIFtjb2xvcjEsIGNvbG9yMl0gPSBjb250ZXh0LnNwbGl0KGV4cHIpXG5cbiAgYmFzZUNvbG9yMSA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMSlcbiAgYmFzZUNvbG9yMiA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjEpIG9yIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjIpXG5cbiAge0ByZ2JhfSA9IGJhc2VDb2xvcjEuYmxlbmQoYmFzZUNvbG9yMiwgY29udGV4dC5CbGVuZE1vZGVzLkhBUkRfTElHSFQpXG5cblxuIyBkaWZmZXJlbmNlKCNmMDAsICMwMEYpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpkaWZmZXJlbmNlJywgc3RyaXAoXCJcbiAgZGlmZmVyZW5jZSN7cHN9XG4gICAgKFxuICAgICAgI3tub3RRdW90ZX1cbiAgICAgICN7Y29tbWF9XG4gICAgICAje25vdFF1b3RlfVxuICAgIClcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGV4cHJdID0gbWF0Y2hcblxuICBbY29sb3IxLCBjb2xvcjJdID0gY29udGV4dC5zcGxpdChleHByKVxuXG4gIGJhc2VDb2xvcjEgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjEpXG4gIGJhc2VDb2xvcjIgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IxKSBvciBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IyKVxuXG4gIHtAcmdiYX0gPSBiYXNlQ29sb3IxLmJsZW5kKGJhc2VDb2xvcjIsIGNvbnRleHQuQmxlbmRNb2Rlcy5ESUZGRVJFTkNFKVxuXG4jIGV4Y2x1c2lvbigjZjAwLCAjMDBGKVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6ZXhjbHVzaW9uJywgc3RyaXAoXCJcbiAgZXhjbHVzaW9uI3twc31cbiAgICAoXG4gICAgICAje25vdFF1b3RlfVxuICAgICAgI3tjb21tYX1cbiAgICAgICN7bm90UXVvdGV9XG4gICAgKVxuICAje3BlfVxuXCIpLCBbJyonXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgZXhwcl0gPSBtYXRjaFxuXG4gIFtjb2xvcjEsIGNvbG9yMl0gPSBjb250ZXh0LnNwbGl0KGV4cHIpXG5cbiAgYmFzZUNvbG9yMSA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMSlcbiAgYmFzZUNvbG9yMiA9IGNvbnRleHQucmVhZENvbG9yKGNvbG9yMilcblxuICByZXR1cm4gQGludmFsaWQgPSB0cnVlIGlmIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjEpIG9yIGNvbnRleHQuaXNJbnZhbGlkKGJhc2VDb2xvcjIpXG5cbiAge0ByZ2JhfSA9IGJhc2VDb2xvcjEuYmxlbmQoYmFzZUNvbG9yMiwgY29udGV4dC5CbGVuZE1vZGVzLkVYQ0xVU0lPTilcblxuIyBhdmVyYWdlKCNmMDAsICMwMEYpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czphdmVyYWdlJywgc3RyaXAoXCJcbiAgYXZlcmFnZSN7cHN9XG4gICAgKFxuICAgICAgI3tub3RRdW90ZX1cbiAgICAgICN7Y29tbWF9XG4gICAgICAje25vdFF1b3RlfVxuICAgIClcbiAgI3twZX1cblwiKSwgWycqJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGV4cHJdID0gbWF0Y2hcblxuICBbY29sb3IxLCBjb2xvcjJdID0gY29udGV4dC5zcGxpdChleHByKVxuXG4gIGJhc2VDb2xvcjEgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjEpXG4gIGJhc2VDb2xvcjIgPSBjb250ZXh0LnJlYWRDb2xvcihjb2xvcjIpXG5cbiAgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yMSkgb3IgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yMilcbiAgICByZXR1cm4gQGludmFsaWQgPSB0cnVlXG5cbiAge0ByZ2JhfSA9IGJhc2VDb2xvcjEuYmxlbmQoYmFzZUNvbG9yMiwgY29udGV4dC5CbGVuZE1vZGVzLkFWRVJBR0UpXG5cbiMgbmVnYXRpb24oI2YwMCwgIzAwRilcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOm5lZ2F0aW9uJywgc3RyaXAoXCJcbiAgbmVnYXRpb24je3BzfVxuICAgIChcbiAgICAgICN7bm90UXVvdGV9XG4gICAgICAje2NvbW1hfVxuICAgICAgI3tub3RRdW90ZX1cbiAgICApXG4gICN7cGV9XG5cIiksIFsnKiddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCBleHByXSA9IG1hdGNoXG5cbiAgW2NvbG9yMSwgY29sb3IyXSA9IGNvbnRleHQuc3BsaXQoZXhwcilcblxuICBiYXNlQ29sb3IxID0gY29udGV4dC5yZWFkQ29sb3IoY29sb3IxKVxuICBiYXNlQ29sb3IyID0gY29udGV4dC5yZWFkQ29sb3IoY29sb3IyKVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yMSkgb3IgY29udGV4dC5pc0ludmFsaWQoYmFzZUNvbG9yMilcblxuICB7QHJnYmF9ID0gYmFzZUNvbG9yMS5ibGVuZChiYXNlQ29sb3IyLCBjb250ZXh0LkJsZW5kTW9kZXMuTkVHQVRJT04pXG5cbiMjICAgICMjIyMjIyMjICMjICAgICAgICMjICAgICAjI1xuIyMgICAgIyMgICAgICAgIyMgICAgICAgIyMjICAgIyMjXG4jIyAgICAjIyAgICAgICAjIyAgICAgICAjIyMjICMjIyNcbiMjICAgICMjIyMjIyAgICMjICAgICAgICMjICMjIyAjI1xuIyMgICAgIyMgICAgICAgIyMgICAgICAgIyMgICAgICMjXG4jIyAgICAjIyAgICAgICAjIyAgICAgICAjIyAgICAgIyNcbiMjICAgICMjIyMjIyMjICMjIyMjIyMjICMjICAgICAjI1xuXG4jIHJnYmEgNTAgMTIwIDIwMCAxXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czplbG1fcmdiYScsIHN0cmlwKFwiXG4gIHJnYmFcXFxccytcbiAgICAoI3tpbnR9fCN7dmFyaWFibGVzfSlcbiAgICBcXFxccytcbiAgICAoI3tpbnR9fCN7dmFyaWFibGVzfSlcbiAgICBcXFxccytcbiAgICAoI3tpbnR9fCN7dmFyaWFibGVzfSlcbiAgICBcXFxccytcbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuXCIpLCBbJ2VsbSddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLHIsZyxiLGFdID0gbWF0Y2hcblxuICBAcmVkID0gY29udGV4dC5yZWFkSW50KHIpXG4gIEBncmVlbiA9IGNvbnRleHQucmVhZEludChnKVxuICBAYmx1ZSA9IGNvbnRleHQucmVhZEludChiKVxuICBAYWxwaGEgPSBjb250ZXh0LnJlYWRGbG9hdChhKVxuXG4jIHJnYiA1MCAxMjAgMjAwXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czplbG1fcmdiJywgc3RyaXAoXCJcbiAgcmdiXFxcXHMrXG4gICAgKCN7aW50fXwje3ZhcmlhYmxlc30pXG4gICAgXFxcXHMrXG4gICAgKCN7aW50fXwje3ZhcmlhYmxlc30pXG4gICAgXFxcXHMrXG4gICAgKCN7aW50fXwje3ZhcmlhYmxlc30pXG5cIiksIFsnZWxtJ10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18scixnLGJdID0gbWF0Y2hcblxuICBAcmVkID0gY29udGV4dC5yZWFkSW50KHIpXG4gIEBncmVlbiA9IGNvbnRleHQucmVhZEludChnKVxuICBAYmx1ZSA9IGNvbnRleHQucmVhZEludChiKVxuXG5lbG1BbmdsZSA9IFwiKD86I3tmbG9hdH18XFxcXChkZWdyZWVzXFxcXHMrKD86I3tpbnR9fCN7dmFyaWFibGVzfSlcXFxcKSlcIlxuXG4jIGhzbCAyMTAgNTAgNTBcbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmVsbV9oc2wnLCBzdHJpcChcIlxuICBoc2xcXFxccytcbiAgICAoI3tlbG1BbmdsZX18I3t2YXJpYWJsZXN9KVxuICAgIFxcXFxzK1xuICAgICgje2Zsb2F0fXwje3ZhcmlhYmxlc30pXG4gICAgXFxcXHMrXG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcblwiKSwgWydlbG0nXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBlbG1EZWdyZWVzUmVnZXhwID0gbmV3IFJlZ0V4cChcIlxcXFwoZGVncmVlc1xcXFxzKygje2NvbnRleHQuaW50fXwje2NvbnRleHQudmFyaWFibGVzUkV9KVxcXFwpXCIpXG5cbiAgW18saCxzLGxdID0gbWF0Y2hcblxuICBpZiBtID0gZWxtRGVncmVlc1JlZ2V4cC5leGVjKGgpXG4gICAgaCA9IGNvbnRleHQucmVhZEludChtWzFdKVxuICBlbHNlXG4gICAgaCA9IGNvbnRleHQucmVhZEZsb2F0KGgpICogMTgwIC8gTWF0aC5QSVxuXG4gIGhzbCA9IFtcbiAgICBoXG4gICAgY29udGV4dC5yZWFkRmxvYXQocylcbiAgICBjb250ZXh0LnJlYWRGbG9hdChsKVxuICBdXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBoc2wuc29tZSAodikgLT4gbm90IHY/IG9yIGlzTmFOKHYpXG5cbiAgQGhzbCA9IGhzbFxuICBAYWxwaGEgPSAxXG5cbiMgaHNsYSAyMTAgNTAgNTAgMC43XG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czplbG1faHNsYScsIHN0cmlwKFwiXG4gIGhzbGFcXFxccytcbiAgICAoI3tlbG1BbmdsZX18I3t2YXJpYWJsZXN9KVxuICAgIFxcXFxzK1xuICAgICgje2Zsb2F0fXwje3ZhcmlhYmxlc30pXG4gICAgXFxcXHMrXG4gICAgKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcbiAgICBcXFxccytcbiAgICAoI3tmbG9hdH18I3t2YXJpYWJsZXN9KVxuXCIpLCBbJ2VsbSddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIGVsbURlZ3JlZXNSZWdleHAgPSBuZXcgUmVnRXhwKFwiXFxcXChkZWdyZWVzXFxcXHMrKCN7Y29udGV4dC5pbnR9fCN7Y29udGV4dC52YXJpYWJsZXNSRX0pXFxcXClcIilcblxuICBbXyxoLHMsbCxhXSA9IG1hdGNoXG5cbiAgaWYgbSA9IGVsbURlZ3JlZXNSZWdleHAuZXhlYyhoKVxuICAgIGggPSBjb250ZXh0LnJlYWRJbnQobVsxXSlcbiAgZWxzZVxuICAgIGggPSBjb250ZXh0LnJlYWRGbG9hdChoKSAqIDE4MCAvIE1hdGguUElcblxuICBoc2wgPSBbXG4gICAgaFxuICAgIGNvbnRleHQucmVhZEZsb2F0KHMpXG4gICAgY29udGV4dC5yZWFkRmxvYXQobClcbiAgXVxuXG4gIHJldHVybiBAaW52YWxpZCA9IHRydWUgaWYgaHNsLnNvbWUgKHYpIC0+IG5vdCB2PyBvciBpc05hTih2KVxuXG4gIEBoc2wgPSBoc2xcbiAgQGFscGhhID0gY29udGV4dC5yZWFkRmxvYXQoYSlcblxuIyBncmF5c2NhbGUgMVxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6ZWxtX2dyYXlzY2FsZScsIFwiZ3IoPzphfGUpeXNjYWxlXFxcXHMrKCN7ZmxvYXR9fCN7dmFyaWFibGVzfSlcIiwgWydlbG0nXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXyxhbW91bnRdID0gbWF0Y2hcbiAgYW1vdW50ID0gTWF0aC5mbG9vcigyNTUgLSBjb250ZXh0LnJlYWRGbG9hdChhbW91bnQpICogMjU1KVxuICBAcmdiID0gW2Ftb3VudCwgYW1vdW50LCBhbW91bnRdXG5cbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmVsbV9jb21wbGVtZW50Jywgc3RyaXAoXCJcbiAgY29tcGxlbWVudFxcXFxzKygje25vdFF1b3RlfSlcblwiKSwgWydlbG0nXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgc3ViZXhwcl0gPSBtYXRjaFxuXG4gIGJhc2VDb2xvciA9IGNvbnRleHQucmVhZENvbG9yKHN1YmV4cHIpXG5cbiAgcmV0dXJuIEBpbnZhbGlkID0gdHJ1ZSBpZiBjb250ZXh0LmlzSW52YWxpZChiYXNlQ29sb3IpXG5cbiAgW2gscyxsXSA9IGJhc2VDb2xvci5oc2xcblxuICBAaHNsID0gWyhoICsgMTgwKSAlIDM2MCwgcywgbF1cbiAgQGFscGhhID0gYmFzZUNvbG9yLmFscGhhXG5cbiMjICAgICMjICAgICAgICAgICMjIyAgICAjIyMjIyMjIyAjIyMjIyMjIyAjIyAgICAgIyNcbiMjICAgICMjICAgICAgICAgIyMgIyMgICAgICAjIyAgICAjIyAgICAgICAgIyMgICAjI1xuIyMgICAgIyMgICAgICAgICMjICAgIyMgICAgICMjICAgICMjICAgICAgICAgIyMgIyNcbiMjICAgICMjICAgICAgICMjICAgICAjIyAgICAjIyAgICAjIyMjIyMgICAgICAjIyNcbiMjICAgICMjICAgICAgICMjIyMjIyMjIyAgICAjIyAgICAjIyAgICAgICAgICMjICMjXG4jIyAgICAjIyAgICAgICAjIyAgICAgIyMgICAgIyMgICAgIyMgICAgICAgICMjICAgIyNcbiMjICAgICMjIyMjIyMjICMjICAgICAjIyAgICAjIyAgICAjIyMjIyMjIyAjIyAgICAgIyNcblxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6bGF0ZXhfZ3JheScsIHN0cmlwKFwiXG4gIFxcXFxbZ3JheVxcXFxdXFxcXHsoI3tmbG9hdH0pXFxcXH1cblwiKSwgWyd0ZXgnXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgYW1vdW50XSA9IG1hdGNoXG5cbiAgYW1vdW50ID0gY29udGV4dC5yZWFkRmxvYXQoYW1vdW50KSAqIDI1NVxuICBAcmdiID0gW2Ftb3VudCwgYW1vdW50LCBhbW91bnRdXG5cbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmxhdGV4X2h0bWwnLCBzdHJpcChcIlxuICBcXFxcW0hUTUxcXFxcXVxcXFx7KCN7aGV4YWRlY2ltYWx9ezZ9KVxcXFx9XG5cIiksIFsndGV4J10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIGhleGFdID0gbWF0Y2hcblxuICBAaGV4ID0gaGV4YVxuXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpsYXRleF9yZ2InLCBzdHJpcChcIlxuICBcXFxcW3JnYlxcXFxdXFxcXHsoI3tmbG9hdH0pI3tjb21tYX0oI3tmbG9hdH0pI3tjb21tYX0oI3tmbG9hdH0pXFxcXH1cblwiKSwgWyd0ZXgnXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgcixnLGJdID0gbWF0Y2hcblxuICByID0gTWF0aC5mbG9vcihjb250ZXh0LnJlYWRGbG9hdChyKSAqIDI1NSlcbiAgZyA9IE1hdGguZmxvb3IoY29udGV4dC5yZWFkRmxvYXQoZykgKiAyNTUpXG4gIGIgPSBNYXRoLmZsb29yKGNvbnRleHQucmVhZEZsb2F0KGIpICogMjU1KVxuICBAcmdiID0gW3IsIGcsIGJdXG5cbnJlZ2lzdHJ5LmNyZWF0ZUV4cHJlc3Npb24gJ3BpZ21lbnRzOmxhdGV4X1JHQicsIHN0cmlwKFwiXG4gIFxcXFxbUkdCXFxcXF1cXFxceygje2ludH0pI3tjb21tYX0oI3tpbnR9KSN7Y29tbWF9KCN7aW50fSlcXFxcfVxuXCIpLCBbJ3RleCddLCAobWF0Y2gsIGV4cHJlc3Npb24sIGNvbnRleHQpIC0+XG4gIFtfLCByLGcsYl0gPSBtYXRjaFxuXG4gIHIgPSBjb250ZXh0LnJlYWRJbnQocilcbiAgZyA9IGNvbnRleHQucmVhZEludChnKVxuICBiID0gY29udGV4dC5yZWFkSW50KGIpXG4gIEByZ2IgPSBbciwgZywgYl1cblxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6bGF0ZXhfY215aycsIHN0cmlwKFwiXG4gIFxcXFxbY215a1xcXFxdXFxcXHsoI3tmbG9hdH0pI3tjb21tYX0oI3tmbG9hdH0pI3tjb21tYX0oI3tmbG9hdH0pI3tjb21tYX0oI3tmbG9hdH0pXFxcXH1cblwiKSwgWyd0ZXgnXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgYyxtLHksa10gPSBtYXRjaFxuXG4gIGMgPSBjb250ZXh0LnJlYWRGbG9hdChjKVxuICBtID0gY29udGV4dC5yZWFkRmxvYXQobSlcbiAgeSA9IGNvbnRleHQucmVhZEZsb2F0KHkpXG4gIGsgPSBjb250ZXh0LnJlYWRGbG9hdChrKVxuICBAY215ayA9IFtjLG0seSxrXVxuXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpsYXRleF9wcmVkZWZpbmVkJywgc3RyaXAoJ1xuICBcXFxceyhibGFja3xibHVlfGJyb3dufGN5YW58ZGFya2dyYXl8Z3JheXxncmVlbnxsaWdodGdyYXl8bGltZXxtYWdlbnRhfG9saXZlfG9yYW5nZXxwaW5rfHB1cnBsZXxyZWR8dGVhbHx2aW9sZXR8d2hpdGV8eWVsbG93KVxcXFx9XG4nKSwgWyd0ZXgnXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgbmFtZV0gPSBtYXRjaFxuICBAaGV4ID0gY29udGV4dC5TVkdDb2xvcnMuYWxsQ2FzZXNbbmFtZV0ucmVwbGFjZSgnIycsJycpXG5cblxucmVnaXN0cnkuY3JlYXRlRXhwcmVzc2lvbiAncGlnbWVudHM6bGF0ZXhfcHJlZGVmaW5lZF9kdmlwbmFtZXMnLCBzdHJpcCgnXG4gIFxcXFx7KEFwcmljb3R8QXF1YW1hcmluZXxCaXR0ZXJzd2VldHxCbGFja3xCbHVlfEJsdWVHcmVlbnxCbHVlVmlvbGV0fEJyaWNrUmVkfEJyb3dufEJ1cm50T3JhbmdlfENhZGV0Qmx1ZXxDYXJuYXRpb25QaW5rfENlcnVsZWFufENvcm5mbG93ZXJCbHVlfEN5YW58RGFuZGVsaW9ufERhcmtPcmNoaWR8RW1lcmFsZHxGb3Jlc3RHcmVlbnxGdWNoc2lhfEdvbGRlbnJvZHxHcmF5fEdyZWVufEdyZWVuWWVsbG93fEp1bmdsZUdyZWVufExhdmVuZGVyfExpbWVHcmVlbnxNYWdlbnRhfE1haG9nYW55fE1hcm9vbnxNZWxvbnxNaWRuaWdodEJsdWV8TXVsYmVycnl8TmF2eUJsdWV8T2xpdmVHcmVlbnxPcmFuZ2V8T3JhbmdlUmVkfE9yY2hpZHxQZWFjaHxQZXJpd2lua2xlfFBpbmVHcmVlbnxQbHVtfFByb2Nlc3NCbHVlfFB1cnBsZXxSYXdTaWVubmF8UmVkfFJlZE9yYW5nZXxSZWRWaW9sZXR8UmhvZGFtaW5lfFJveWFsQmx1ZXxSb3lhbFB1cnBsZXxSdWJpbmVSZWR8U2FsbW9ufFNlYUdyZWVufFNlcGlhfFNreUJsdWV8U3ByaW5nR3JlZW58VGFufFRlYWxCbHVlfFRoaXN0bGV8VHVycXVvaXNlfFZpb2xldHxWaW9sZXRSZWR8V2hpdGV8V2lsZFN0cmF3YmVycnl8WWVsbG93fFllbGxvd0dyZWVufFllbGxvd09yYW5nZSlcXFxcfVxuJyksIFsndGV4J10sIChtYXRjaCwgZXhwcmVzc2lvbiwgY29udGV4dCkgLT5cbiAgW18sIG5hbWVdID0gbWF0Y2hcbiAgQGhleCA9IGNvbnRleHQuRFZJUG5hbWVzW25hbWVdLnJlcGxhY2UoJyMnLCcnKVxuXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpsYXRleF9taXgnLCBzdHJpcCgnXG4gIFxcXFx7KFteIVxcXFxuXFxcXH1dK1shXVteXFxcXH1cXFxcbl0rKVxcXFx9XG4nKSwgWyd0ZXgnXSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXywgZXhwcl0gPSBtYXRjaFxuXG4gIG9wID0gZXhwci5zcGxpdCgnIScpXG5cbiAgbWl4ID0gKFthLHAsYl0pIC0+XG4gICAgY29sb3JBID0gaWYgYSBpbnN0YW5jZW9mIGNvbnRleHQuQ29sb3IgdGhlbiBhIGVsc2UgY29udGV4dC5yZWFkQ29sb3IoXCJ7I3thfX1cIilcbiAgICBjb2xvckIgPSBpZiBiIGluc3RhbmNlb2YgY29udGV4dC5Db2xvciB0aGVuIGIgZWxzZSBjb250ZXh0LnJlYWRDb2xvcihcInsje2J9fVwiKVxuICAgIHBlcmNlbnQgPSBjb250ZXh0LnJlYWRJbnQocClcblxuICAgIGNvbnRleHQubWl4Q29sb3JzKGNvbG9yQSwgY29sb3JCLCBwZXJjZW50IC8gMTAwKVxuXG4gIG9wLnB1c2gobmV3IGNvbnRleHQuQ29sb3IoMjU1LCAyNTUsIDI1NSkpIGlmIG9wLmxlbmd0aCBpcyAyXG5cbiAgbmV4dENvbG9yID0gbnVsbFxuXG4gIHdoaWxlIG9wLmxlbmd0aCA+IDBcbiAgICB0cmlwbGV0ID0gb3Auc3BsaWNlKDAsMylcbiAgICBuZXh0Q29sb3IgPSBtaXgodHJpcGxldClcbiAgICBvcC51bnNoaWZ0KG5leHRDb2xvcikgaWYgb3AubGVuZ3RoID4gMFxuXG4gIEByZ2IgPSBuZXh0Q29sb3IucmdiXG5cbiMgICAgICMjIyMjIyMgICMjIyMjIyMjXG4jICAgICMjICAgICAjIyAgICAjI1xuIyAgICAjIyAgICAgIyMgICAgIyNcbiMgICAgIyMgICAgICMjICAgICMjXG4jICAgICMjICAjIyAjIyAgICAjI1xuIyAgICAjIyAgICAjIyAgICAgIyNcbiMgICAgICMjIyMjICMjICAgICMjXG5cbiMgUXQucmdiYSgxLjAsMC41LDAuMCwwLjcpXG5yZWdpc3RyeS5jcmVhdGVFeHByZXNzaW9uICdwaWdtZW50czpxdF9yZ2JhJywgc3RyaXAoXCJcbiAgUXRcXFxcLnJnYmEje3BzfVxcXFxzKlxuICAgICgje2Zsb2F0fSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0fSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0fSlcbiAgICAje2NvbW1hfVxuICAgICgje2Zsb2F0fSlcbiAgI3twZX1cblwiKSwgWydxbWwnLCAnYycsICdjYycsICdjcHAnXSwgMSwgKG1hdGNoLCBleHByZXNzaW9uLCBjb250ZXh0KSAtPlxuICBbXyxyLGcsYixhXSA9IG1hdGNoXG5cbiAgQHJlZCA9IGNvbnRleHQucmVhZEZsb2F0KHIpICogMjU1XG4gIEBncmVlbiA9IGNvbnRleHQucmVhZEZsb2F0KGcpICogMjU1XG4gIEBibHVlID0gY29udGV4dC5yZWFkRmxvYXQoYikgKiAyNTVcbiAgQGFscGhhID0gY29udGV4dC5yZWFkRmxvYXQoYSlcbiJdfQ==
