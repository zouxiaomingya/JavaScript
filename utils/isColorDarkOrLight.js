const REG_HEX = /(^#?[0-9A-F]{6}$)|(^#?[0-9A-F]{3}$)/i;

/*
 * rgb字符串解析
 * accepts: #333 #accded (without # is also fine)
 * not accept yet: rgb(), rgba()
 */
function parseRGB(str) {
  if (typeof str === "string" && REG_HEX.test(str)) {
    str = str.replace("#", "");
    let arr;
    if (str.length === 3) {
      arr = str.split("").map((c) => c + c);
    } else if (str.length === 6) {
      arr = str.match(/[a-zA-Z0-9]{2}/g);
    } else {
      throw new Error("wrong color format");
    }
    return arr.map((c) => parseInt(c, 16));
  }
  throw new Error("color should be string");
}

/*
 * rgb value to hsl 色相(H)、饱和度(S)、明度(L)
 */
function rgbToHsl(rgbStr) {
  let [r, g, b] = parseRGB(rgbStr);
  (r /= 255), (g /= 255), (b /= 255);
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return [h, s, l];
}

/*
 * 判断颜色属于深色还是浅色
 */
function isColorDarkOrLight(rgbStr) {
  let [h, s, l] = rgbToHsl(rgbStr);
  return l > 0.5 ? "light" : "dark";
}
