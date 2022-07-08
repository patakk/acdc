var dd = {};
var dd1 = {};
var dd2 = {};
var dd3 = {};
//for(var k = 0; k < 303; k++){
let canvas;
var pg;
var mask;
var bgpg;
var blurpass1;
var blurpass2;
var effectpass;

let effect;
let blurH;
let blurV;

var cl1, cl2, cl3, cl4;

var mm;
var WW, HH;
var resx = 1400;
var resy = 1400;
var res = 1400;
var zoom = 1.0;
var globalseed = Math.floor(fxrand()*1000000);

var hasmargin = 1.0 * (fxrand()*100 < 50);

var isdark = fxrand() < 1.5;

var waa = map(fxrand(), 0, 1, .7, 2);

var twodpos = [];

var detmin = 6;
var detmax = 9;
var detu = Math.round(map(power(fxrand(), 3.), 0, 1, detmin, detmax));
////////////

var numobjects = -1;
var option = Math.floor(map(fxrand(), 0, 1, 0, 2));
option = 0;
var ismono = fxrand() < .08;
var hasmonolith = fxrand() < .25;
var hasgradientlines = fxrand() < .5;
var flipbw = fxrand() < .5;
var infill = fxrand() < .75;
var hasparallels = fxrand() < .5;
var allareparallels = fxrand() < .5;
var hasshiftedlines = fxrand() < -1.5 && !hasparallels && !allareparallels;
var hashollow = fxrand() < .5;
var afew = fxrand() < .25;
var uniform = fxrand() < 1.5;
var disintegrated = fxrand() <  .08 && !ismono;
var wdisint = map(fxrand(), 0, 1, 5, 25);
var arrangement = 0;
if(fxrand() < .03){
    arrangement = 1;
    //console.log(arrangement)
} 

var hastallspread = !afew && arrangement == 0 && !ismono && fxrand() < .06;
var tallspreadx = map(fxrand(), 0, 1, .15, .5);
var tallspready = map(fxrand(), 0, 1, .15, .5);


var usemask = (option == 0) && fxrand() < .1;

if(afew)
    uniform = true;
if(uniform){
    detu = Math.round(map(fxrand(), 0, 1, detmin, detmin+2));
}

var haswarp = (fxrand() < .5) && (option == 0) && uniform;
haswarp = false;
haswarp = true;
waa = 1.1;
if(ismono){
    haswarp = true;
    waa = 1.1;
    uniform = true;
    option = 0;
}

var crazy = fxrand() < -1.25;
if(crazy && !ismono && !afew){
    waa = -map(fxrand(), 0, 1, .5, 2);
    detu = Math.round(map(fxrand(), 0, 1, detmin/2, detmin/2+1));
}
if(!haswarp || ismono)
    crazy = false;

var orth = 1.*(fxrand() < -.2);
if(crazy){
    orth = 0.;
    afew = false;
}

var neocolor = false;
if(infill && !afew){
    if(fxrand() < -2.15){
        neocolor = true;
    }
}

if(afew)
    orth = 0.;


var yang = (Math.floor(map(fxrand(), 0, 1, 0, 2))*90-45*(1-orth) + 0*map(fxrand(), 0, 1, 0, 3)) / 180 * 3.14159;
var shouldRotate = fxrand() < .1 && !hastallspread;


function getArrangementString() {
    if(arrangement == 0 && hastallspread){
        return 'mess'
    }
    if(arrangement == 0 && hasmonolith){
        return 'dominated'
    }
    if(arrangement == 0){
        return 'loose'
    }
    if(arrangement == 1){
        return 'array'
    }
}

function getIntegrityString() {
    if(disintegrated && usemask){
        return 'fragmented cutout'
    }
    if(disintegrated){
        return 'fragmented'
    }
    if(usemask){
        return 'cutout'
    }
    return 'solid'
}

function getPaletteString() {
    if (ismono){
        return "grayscale";
    }
    else{
        if(infill){
            return "color";
        }
        else{
            return "darkened"
        }
    }
}
/*
var kk = getPaletteString()+'_'+getArrangementString()+'_'+getIntegrityString();
if(kk in dd){
    dd[kk] += 1;
}
else{
    dd[kk] = 1;
}

if(getPaletteString() in dd1){
    dd1[getPaletteString()] += 1;
}
else{
    dd1[getPaletteString()] = 1;
}

if(getArrangementString() in dd2){
    dd2[getArrangementString()] += 1;
}
else{
    dd2[getArrangementString()] = 1;
}

if(getIntegrityString() in dd3){
    dd3[getIntegrityString()] += 1;
}
else{
    dd3[getIntegrityString()] = 1;
}
}

console.log(dd1);
console.log(dd2);
console.log(dd3);*/


window.$fxhashFeatures = {
    "palette": getPaletteString(),
    "arrangement": getArrangementString(),
    "integrity": getIntegrityString(),
}



///////

console.log('hello');
//console.log(window.$fxhashFeatures)




var palettes1 = [
    ['f46036-5b85aa-414770-372248', 0],
   
]

var palettes0 = [
    'f46036-5b85aa-414770-372248',
    'f55d3e-878e88-f7cb15-76bed0',
    '121212-F05454-30475E-F5F5F5',
    'F39189-BB8082-6E7582-046582',
    '084c61-db504a-e3b505-4f6d7a-56a3a6',
    '177e89-084c61-db3a34-ffc857-323031',
    '32373b-4a5859-f4d6cc-f4b860-c83e4d',
    'de6b48-e5b181-f4b9b2-daedbd-7dbbc3',
    'ffbc42-df1129-bf2d16-218380-73d2de',
    'fa8334-fffd77-ffe882-388697-54405f',
    'ed6a5a-f4f1bb-9bc1bc-e6ebe0-36c9c6',
    '3e5641-a24936-d36135-282b28-83bca9',
    '664c43-873d48-dc758f-e3d3e4-00ffcd',
    '304d7d-db995a-bbbbbb-222222-fdc300',
    '8789c0-45f0df-c2cae8-8380b6-111d4a',
    '5fad56-f2c14e-f78154-4d9078-b4431c',
    '2FC4B2-12947F-E71414-F17808-Ff4828',
    '4C3A51-774360-B25068-FACB79-dddddd',
    '1B2430-51557E-816797-D6D5A8-ff2222',
    '087e8b-ff5a5f-3c3c3c-f5f5f5-c1839f',
    'EB5353-394359-F9D923-36AE7C-368E7C-187498',
    '4C3F61-B958A5-9145B6-FF5677-65799B-C98B70',
    '006466-065a60-fb525b-144552-1b3a4b-212f45-272640-fb525b-312244-3e1f47-4d194d',
    '283d3b-197278-edddd4-c44536-772e25-0d3b66-faf0ca-f4d35e-ee964b-f95738-fe5d26-f2c078-faedca-c1dbb3-7ebc89-3d5a80-98c1d9-e0fbfc-ee6c4d-293241',
    '99e2b4-99d4e2-f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1',
    '080708-3772ff-df2935-fdca40-e6e8e6-d8dbe2-a9bcd0-58a4b0-373f51-1b1b1e',
    'ea8c55-e27e52-d96f4e-cd5c46-ba4035-dddddd-972320-81171b-540804-3c0000-006868',
]


palettes0 = [
    'f46036-5b85aa-414770-372248-f55d3e-878e88-f7cb15-76bed0-9cfffa-acf39d-b0c592-a97c73-af3e4d',
    '121212-F05454-30475E-F5F5F5-F39189-BB8082-6E7582-046582',
    '084c61-db504a-e3b505-4f6d7a-56a3a6-177e89-084c61-db3a34-ffc857-323031',
    '32373b-4a5859-f4d6cc-f4b860-c83e4d-de6b48-e5b181-f4b9b2-daedbd-7dbbc3',
    'fa8334-fffd77-ffe882-388697-54405f-ffbc42-df1129-bf2d16-218380-73d2de',
    '3e5641-a24936-d36135-282b28-83bca9-ed6a5a-f4f1bb-9bc1bc-e6ebe0-36c9c6',
    '304d7d-db995a-bbbbbb-222222-fdc300-664c43-873d48-dc758f-e3d3e4-00ffcd',
    '5fad56-f2c14e-f78154-4d9078-b4431c-8789c0-45f0df-c2cae8-8380b6-111d4a',
    '4C3A51-774360-B25068-FACB79-dddddd-2FC4B2-12947F-E71414-F17808-Ff4828',
    '087e8b-ff5a5f-3c3c3c-f5f5f5-c1839f-1B2430-51557E-816797-D6D5A8-ff2222',
    '4C3F61-B958A5-9145B6-FF5677-65799B-C98B70-EB5353-394359-F9D923-36AE7C-368E7C-187498',
    '283d3b-197278-edddd4-c44536-772e25-0d3b66-faf0ca-f4d35e-ee964b-f95738-fe5d26-f2c078-faedca-c1dbb3-7ebc89-3d5a80-98c1d9-e0fbfc-ee6c4d-293241',
    '99e2b4-99d4e2-f94144-f3722c-f8961e-f9844a-f9c74f-90be6d-43aa8b-4d908e-577590-277da1',
    '080708-3772ff-df2935-fdca40-e6e8e6-d8dbe2-a9bcd0-58a4b0-373f51-1b1b1e',
]

if(neocolor){
    palettes0 = [
        'ff0000-ff8700-ffd300-deff0a-a1ff0a-0aff99-0aefff-147df5-580aff-be0aff'
    ]
}

var pall = '';
palettes0.forEach((element, ind) => {
    if(ind < palettes0.length-1)
        pall = pall + element + '-';
    else
        pall = pall + element
});
palettes0 = [pall]

var palettes = [];
palettes0.forEach(element => {
    palettes.push(element);
});


function hex2rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16)/255.,
      parseInt(result[2], 16)/255.,
      parseInt(result[3], 16)/255.
    ] : null;
}

function hsl2rgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    var ltns = .299*r + .587*g + .114*b;
    r = min(1., max(0., r * l / ltns));
    g = min(1., max(0., g * l / ltns));
    b = min(1., max(0., b * l / ltns));

    return [r, g, b];
}

function hsv2rgb(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [r, g, b];
}

function rgb2hsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, l];
}

function rgb2hsv(r, g, b) {
    let rabs, gabs, babs, rr, gg, bb, h, s, v, diff, diffc;
    rabs = r;
    gabs = g;
    babs = b;
    v = Math.max(rabs, gabs, babs),
    diff = v - Math.min(rabs, gabs, babs);
    diffc = c => (v - c) / 6 / diff + 1 / 2;
    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(rabs);
        gg = diffc(gabs);
        bb = diffc(babs);

        if (rabs === v) {
            h = bb - gg;
        } else if (gabs === v) {
            h = (1 / 3) + rr - bb;
        } else if (babs === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return [h, s, v];
}

var palette;
var thidx;


function preload() {
    effect = loadShader('assets/effect.vert', 'assets/effect.frag');
    blurH = loadShader('assets/blur.vert', 'assets/blur.frag');
    blurV = loadShader('assets/blur.vert', 'assets/blur.frag');
}

function setup(){
    mm = min(windowWidth, windowHeight);
    pixelDensity(2);
    canvas = createCanvas(round(mm*resx/resy), mm, WEBGL);
    canvas.id('maincanvas');
    imageMode(CENTER);
    
    randomSeed(globalseed);
    noiseSeed(globalseed+123.1341);

    
    thidx = Math.floor(map(fxrand(), 0, 1, 0, palettes.length));
    for(var k = 0; k < palettes.length; k++){
        let text = palettes[k];
        let cols = text.split('-')
        let caca = [];
        var darkenr = .6;
        var darkeng = .6;
        var darkenb = .6;
        if(isdark){
            darkenr = 1;
            darkeng = 1;
            darkenb = 1;
        }
        else{
            var rrr = floor(random(3));
            if(rrr == 0){
                darkenr = 1.;
            }
        }
        cols.forEach((e)=>{
            var hhh = hex2rgb(e);
            var gg = 0.3*hhh[0] + 0.59*hhh[1] + 0.11*hhh[2];
            if(gg < .3){
                hhh[0] *= .3/gg;
                hhh[1] *= .3/gg;
                hhh[2] *= .3/gg;
            }
            caca.push(hhh);
        });
        //shuffle(caca)
        var coco = [];
        caca.forEach((e, i)=>{coco.push([(1.*caca[i][0]+.01*map(fxrand(), 0, 1, -.2, .2)), (1.*caca[i][1]+.01*map(fxrand(), 0, 1, -.2, .2)), (1.*caca[i][2]+.01*map(fxrand(), 0, 1, -.2, .2))])});
        palettes[k] = coco;
    }

    palette = palettes[thidx]

    pg = createGraphics(resx, resy, WEBGL);
    pg.noStroke();
    //pg.strokeJoin(ROUND);
    pg.ortho(-resx/2, resx/2, -resy/2, resy/2, 0, 4444);
    mask = createGraphics(resx, resy, WEBGL);
    mask.noStroke();
    mask.ortho(-resx/2, resx/2, -resy/2, resy/2, 0, 4444);
    mask.clear();
    mask.background(0);
    mask.noStroke();
    mask.fill(255);
    
    bgpg = createGraphics(res, res, WEBGL);
    bgpg.noStroke();
    bgpg.ortho(-resx/2, resx/2, -resy/2, resy/2, 0, 4444);
    bgpg.clear();
    bgpg.background(0);
    bgpg.noStroke();
    bgpg.fill(255);
    //mask.strokeJoin(ROUND);

    blurpass1 = createGraphics(resx, resy, WEBGL);
    blurpass2 = createGraphics(resx, resy, WEBGL);
    effectpass = createGraphics(resx, resy, WEBGL);
    blurpass1.noStroke();
    blurpass2.noStroke();
    effectpass.noStroke();
    imageMode(CENTER);
    //noCursor();

    //envelope.play(osc);
    colorMode(RGB, 255);


    //generateHeads(20, 31114);
    //frameRate(5);
    
    background(100);
    pg.clear();

    cl1 = color(200, 200, 200);
    cl2 = color(30, 30, 30);
    cl3 = color(222, 222, 222);
    cl4 = color(30, 30, 30);

    var sshf = 0;
    if(!usemask)
        sshf = 8;
    bgidx = floor(fxrand()*(palette.length));
    var cou = 4;
    var rrr = rgb2hsv(palette[(bgidx+sshf)%palette.length][0], palette[(bgidx+sshf)%palette.length][1], palette[(bgidx+sshf)%palette.length][2]);
    while(rrr[1] > .8 && cou < 4){
        bgidx = floor(fxrand()*(palette.length));
        rrr = rgb2hsv(palette[(bgidx+sshf)%palette.length][0], palette[(bgidx+sshf)%palette.length][1], palette[(bgidx+sshf)%palette.length][2])
        cou++;
    }


    pg.background(palette[(bgidx+8)%palette.length][0]*255, palette[(bgidx+8)%palette.length][1]*255, palette[(bgidx+8)%palette.length][2]*255);
    //if(usemask)
    //    pg.background(222);

    bgpg.background(palette[(bgidx+0)%palette.length][0]*255, palette[(bgidx+0)%palette.length][1]*255, palette[(bgidx+0)%palette.length][2]*255);
    
    //pg.background(127);
    //bgpg.background(188);

    if(ismono){
        if(fxrand() < .5){
            pg.background(cl2);
            bgpg.background(red(cl2)+7, green(cl2)+7, blue(cl2)+7);
        }
        else{
            pg.background(cl1);
            bgpg.background(red(cl1)+9, green(cl1)+9, blue(cl1)+9);
        }
    }

    /*var h1 = fxrand();
    var h2 = fxrand();
    var hcou = 0;
    while(abs(h2-h1) < .1 && hcou++ < 4){
        h2 = fxrand();
    }
    
    var vv1 = fxrand()*.15 + .65;
    var vv2 = fxrand();
    var hcou = 0;
    while(abs(vv2-vv1) < .1 && hcou++ < 4){
        h2 = fxrand();
    }
    
    var coll1 = hsl2rgb(h1, .3, vv1);
    var coll2 = hsl2rgb(h2, .3, vv1/2);
    
    //pg.background(127);
    //bgpg.background(188);

    if(ismono){
        if(fxrand() < .5){
            pg.background(cl2);
            bgpg.background(red(cl2)+7, green(cl2)+7, blue(cl2)+7);
        }
        else{
            pg.background(cl1);
            bgpg.background(red(cl1)+9, green(cl1)+9, blue(cl1)+9);
        }
    }
    else{
        pg.background(coll1[0]*255, coll1[1]*255, coll1[2]*255);
        bgpg.background(coll2[0]*255, coll2[1]*255, coll2[2]*255);
    }*/

    drawShapes();    

    showall();
    showall();
    fxpreview();
    //savepost();
}

/*function savepost(){
    var dataimg = document.getElementById('maincanvas');
    var imgURL = dataimg.toDataURL();
    console.log(imgURL);
    $.ajax({
      type: "POST",
      url: "http://url/take_pic", //I have doubt about this url, not sure if something specific must come before "/take_pic"
      data: imgURL,
      success: function(data) {
        if (data.success) {
          alert('Your file was successfully uploaded!');
        } else {
          alert('There was an error uploading your file!');
        }
      },
      error: function(data) {
        alert('There was an error uploading your file!');
      }
    }).done(function() {
      console.log("Sent");
    });
}*/


var s = "HELLO";
var binsum = 0;
var timer = -1;
var num = 20;

function generateBoxes1(){
    numobjects = Math.round(map(fxrand(), 0, 1, 25, 45))
    if(hastallspread)
        numobjects = Math.round(map(fxrand(), 0, 1, 50, 100))
    if(afew){
        numobjects = Math.round(map(fxrand(), 0, 1, 5, 15))
    }
    var mix = 100100;
    var mmx = -101000;
    var miy = 100100;
    var mmy = -101000;
    var miz = 100100;
    var mmz = -101000;
    var infos = [];
    var volume = 200*200*200 * .1;
    for(var k = 0; k < numobjects; k++){
        var bx = random(-222, 222)*(1.7 + 2.*hastallspread*tallspreadx);
        var by = random(-222, 222)*(1 + 2.7*hastallspread*tallspready);
        var bz = random(-222, 222)*1;
        var wx = map(pow(fxrand(), 1.6), 0, 1, 50, 400)*(.5 + random(.2, .5)*afew);
        var wy = map(pow(fxrand(), 1.6), 0, 1, 50, 400)*1.5;
        var wz = map(pow(fxrand(), 1.6), 0, 1, 50, 400)*(.5 + random(.2, .5)*afew);
        var rx = radians(floor(power(noise(wy*.01), 3)*4)*45/1 - 45);
        var ry = radians(random(-30, 30));
        var rz = radians(random(-30, 30));
        if(k < 1 && hasmonolith){
            var bx = random(-444, 444)*0;
            var by = random(-0, 0)*0;
            var bz = -random(333, 555)*0;
            var area = res * res * .4;
            var aar = sqrt(area);
            wx = random(aar*.5, aar*1/.5);
            wy = area / wx;
            wz = random(66, 77);
            rx = floor(fxrand()*4)*45/1;
            while(rx == 90){
                rx = floor(fxrand()*4)*45/1;
            }
            rx = radians(rx);
        }
        infos.push([bx, by, bz, wx, wy, wz, rx, ry, rz, k]);
        if(bx+wx/2 > mmx) mmx = bx+wx/2;
        if(bx-wx/2 < mix) mix = bx-wx/2;
        if(by+cos(rx)*wy/2 > mmy) mmy = by+cos(rx)*wy/2;
        if(by-cos(rx)*wy/2 < miy) miy = by-cos(rx)*wy/2;
        if(bz+sin(rx)*wz/2 > mmz) mmz = bz+sin(rx)*wz/2;
        if(bz-sin(rx)*wz/2 < miz) miz = bz-sin(rx)*wz/2;
        mask.push();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(+wx/2, +wy/2, +wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(+wx/2, +wy/2, -wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(+wx/2, -wy/2, -wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(+wx/2, -wy/2, +wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(-wx/2, +wy/2, +wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(-wx/2, +wy/2, -wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(-wx/2, -wy/2, -wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(-wx/2, -wy/2, +wz/2))); mask.pop();
        mask.pop();
    }

    return {'infos': infos, 'mmx': mmx, 'mix': mix, 'mmy': mmy, 'miy': miy, 'mmz': mmz, 'miz': miz}
}

function generateBoxes2(){
    numobjects = Math.round(map(pow(fxrand(), 2), 0, 1, 9, 23))
    if(afew){
        numobjects = Math.round(map(fxrand(), 0, 1, 3, 9))
    }
    var mix = 100100;
    var mmx = -101000;
    var miy = 100100;
    var mmy = -101000;
    var miz = 100100;
    var mmz = -101000;
    var infos = [];
    var raaaaa = fxrand()*10;
    var volume = 200*200*200 * .1;
    var wwx = random(400, 444);
    var wx = wwx/numobjects;
    var wy = wx * random(.9, 4.4);
    var wz = random(600, 800);
    var circs = round(map(pow(fxrand(), 3), 0, 1, .15, 1));
    var inc = map(fxrand(), 0, 1, PI/12, PI/3);
    if(fxrand() < .25)
        inc = PI/4;
    for(var k = 0; k < numobjects; k++){
        var bx = map(k, 0, numobjects, -(wwx/2+2), (wwx/2+2))
        var by = random(-222, 222);
        var bz = random(-222, 222);
        var rx = map(k, 0, numobjects-1, 0, PI/2*circs)*0 + k*inc + raaaaa;
        var ry = radians(random(-30, 30));
        var rz = radians(random(-30, 30));
        infos.push([bx, by, bz, wx, wy, wz, rx, ry, rz, k]);
        if(bx+wx/2 > mmx) mmx = bx+wx/2;
        if(bx-wx/2 < mix) mix = bx-wx/2;
        if(by+cos(rx)*wy/2 > mmy) mmy = by+cos(rx)*wy/2;
        if(by-cos(rx)*wy/2 < miy) miy = by-cos(rx)*wy/2;
        if(bz+sin(rx)*wz/2 > mmz) mmz = bz+sin(rx)*wz/2;
        if(bz-sin(rx)*wz/2 < miz) miz = bz-sin(rx)*wz/2;
        mask.push();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(+wx/2, +wy/2, +wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(+wx/2, +wy/2, -wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(+wx/2, -wy/2, -wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(+wx/2, -wy/2, +wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(-wx/2, +wy/2, +wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(-wx/2, +wy/2, -wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(-wx/2, -wy/2, -wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(-wx/2, -wy/2, +wz/2))); mask.pop();
        mask.pop();
    }

    return {'infos': infos, 'mmx': mmx, 'mix': mix, 'mmy': mmy, 'miy': miy, 'mmz': mmz, 'miz': miz}
}

function generateBoxes3(){
    numobjects = Math.round(map(fxrand(), 0, 1, 45, 55))
    if(afew){
        numobjects = Math.round(map(fxrand(), 0, 1, 5, 15))
    }
    var mix = 100100;
    var mmx = -101000;
    var miy = 100100;
    var mmy = -101000;
    var miz = 100100;
    var mmz = -101000;
    var infos = [];
    var volume = 200*200*200 * .1;
    for(var k = 0; k < numobjects; k++){
        var bx = random(-33, 33)*1.7;
        var by = random(-33, 33)*1.7;
        var bz = random(-33, 33)*1.7;
        var wx = map(pow(fxrand(), 1.6), 0, 1, 50, 400)*1.5;
        var wy = map(pow(fxrand(), 1.6), 0, 1, 50, 400)*1.5;
        var wz = map(pow(fxrand(), 1.6), 0, 1, 50, 400)*1.5;
        var rx = radians(floor(random(4))*45/1 - 45);
        var ry = radians(random(-30, 30));
        var rz = radians(random(-30, 30));
        infos.push([bx, by, bz, wx, wy, wz, rx, ry, rz, k]);
        if(bx+wx/2 > mmx) mmx = bx+wx/2;
        if(bx-wx/2 < mix) mix = bx-wx/2;
        if(by+cos(rx)*wy/2 > mmy) mmy = by+cos(rx)*wy/2;
        if(by-cos(rx)*wy/2 < miy) miy = by-cos(rx)*wy/2;
        if(bz+sin(rx)*wz/2 > mmz) mmz = bz+sin(rx)*wz/2;
        if(bz-sin(rx)*wz/2 < miz) miz = bz-sin(rx)*wz/2;
        mask.push();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(+wx/2, +wy/2, +wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(+wx/2, +wy/2, -wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(+wx/2, -wy/2, -wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(+wx/2, -wy/2, +wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(-wx/2, +wy/2, +wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(-wx/2, +wy/2, -wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(-wx/2, -wy/2, -wz/2))); mask.pop();
        mask.push(); mask.translate(bx, by, bz); mask.rotateX(rx); twodpos.push(getScreenPos(mask, createVector(-wx/2, -wy/2, +wz/2))); mask.pop();
        mask.pop();
    }

    return {'infos': infos, 'mmx': mmx, 'mix': mix, 'mmy': mmy, 'miy': miy, 'mmz': mmz, 'miz': miz}
}


function debugxyz(pg){
    pg.push();
    pg.strokeWeight(8);
    pg.stroke(255,0,0);
    pg.line(0, 0, 0, 666, 0, 0);
    pg.stroke(0,255,0);
    pg.line(0, 0, 0, 0, 666, 0);
    pg.stroke(0,0,255);
    pg.line(0, 0, 0, 0, 0, 666);

    pg.noStroke();
    pg.fill(100);
    pg.sphere(30);
    pg.pop();
}

function drawShapes(){
    

    mask.push();
    if(shouldRotate){
        mask.rotateZ(PI/2);
    }
    mask.rotateY(yang);
    //mask.rotateX(2.3*yang);
    
    if(arrangement == 0)
        bxs = generateBoxes1();
    if(arrangement == 1)
        bxs = generateBoxes2();
    mask.pop();

    pg.push();
    pg.scale(zoom);
    pg.scale(1, -1, 1);
    
    mask.push();
    mask.scale(zoom);
    mask.scale(1, -1, 1);
    
    infos = bxs.infos;
    var mix = bxs.mix;
    var mmx = bxs.mmx;
    var miy = bxs.miy;
    var mmy = bxs.mmy;
    var miz = bxs.miz;
    var mmz = bxs.mmz;

    var center = createVector(0, 0);
    for(var k = 0; k < twodpos.length; k++){
        center.add(twodpos[k]);
    }
    center.div(twodpos.length);

    var stepsa = 8;
    //debugxyz(pg);

    if(!hasmonolith) pg.translate(-center.x, -center.y);
    if(shouldRotate){
        pg.rotateZ(PI/2);
    }
    pg.rotateY(yang);
    //pg.translate(-(mix+mmx)/2, -(miy+mmy)/2, -(miz+mmz)/2);
    //pg.rotateX(random(-.1,.1));
    //pg.rotateY(random(-.1,.1));

    if(!hasmonolith) mask.translate(-center.x, -center.y);
    if(shouldRotate){
        mask.rotateZ(PI/2);
    }
    mask.rotateY(yang);
    //mask.translate(-(mix+mmx)/2, -(miy+mmy)/2, -(miz+mmz)/2);
    //mask.translate(random(-33, 33), random(-33, 33), random(-33, 33));
    //mask.scale(1.1);
    //pg.rotateY(PI/2);




    pg.noFill();
    pg.stroke(cl1);
    pg.strokeWeight(4);

    for(var k = 0; k < infos.length; k++){
        mybox(infos[k]);
    }
    

    pg.pop();
    mask.pop();
   
    for(var k = 0; k < twodpos.length; k++){
        pg.push();
        pg.scale(zoom);
        pg.scale(1, -1, 1);
        pg.translate(twodpos[k].x-center.x, twodpos[k].y-center.y, 500);
        //pg.sphere(11);
        pg.pop();
    }
}

const nonZero = function(a) {
    const FLOAT_EPS = 1.4E-45;
    return FLOAT_EPS <= Math.abs(a);
}


const m00 = 0; const m01 = 4; const m02 = 8;  const m03 = 12;
const m10 = 1; const m11 = 5; const m12 = 9;  const m13 = 13;
const m20 = 2; const m21 = 6; const m22 = 10; const m23 = 14;
const m30 = 3; const m31 = 7; const m32 = 11; const m33 = 15;



const screenXImpl_w = function(pg, x, y, z, w) {

    const projection = pg._renderer.uPMatrix.mat4;

    let ox =
      projection[m00]*x + projection[m01]*y + projection[m02]*z + projection[m03]*w;
    const ow =
      projection[m30]*x + projection[m31]*y + projection[m32]*z + projection[m33]*w;

    if (nonZero(ow)) {
      ox /= ow;
    }
    const sx = res * (1 + ox) / 2.0;
    return sx;
  }


const screenYImpl_w = function(pg, x, y, z, w) {

    const projection = pg._renderer.uPMatrix.mat4;

    let oy =
      projection[m10]*x + projection[m11]*y + projection[m12]*z + projection[m13]*w;
    const ow =
      projection[m30]*x + projection[m31]*y + projection[m32]*z + projection[m33]*w;

    if (nonZero(ow)) {
      oy /= ow;
    }
    let sy = res * (1 + oy) / 2.0;
    // Turning value upside down because of Processing's inverted Y axis.
    sy = res - sy;
    return sy;
  }


const _screenX = function(pg, x, y, z) {

    const modelview = pg._renderer.uMVMatrix.mat4;

    const ax =
      modelview[m00]*x + modelview[m01]*y + modelview[m02]*z + modelview[m03];
    const ay =
      modelview[m10]*x + modelview[m11]*y + modelview[m12]*z + modelview[m13];
    const az =
      modelview[m20]*x + modelview[m21]*y + modelview[m22]*z + modelview[m23];
    const aw =
      modelview[m30]*x + modelview[m31]*y + modelview[m32]*z + modelview[m33];
    return screenXImpl_w(pg, ax, ay, az, aw);
}




const _screenY = function(pg, x, y, z) {

    const modelview = pg._renderer.uMVMatrix.mat4;

    const ax =
      modelview[m00]*x + modelview[m01]*y + modelview[m02]*z + modelview[m03];
    const ay =
      modelview[m10]*x + modelview[m11]*y + modelview[m12]*z + modelview[m13];
    const az =
      modelview[m20]*x + modelview[m21]*y + modelview[m22]*z + modelview[m23];
    const aw =
      modelview[m30]*x + modelview[m31]*y + modelview[m32]*z + modelview[m33];
    return screenYImpl_w(pg, ax, ay, az, aw);
}


const _screenZ = function(pg, x, y, z, w) {

    const projection = pg._renderer.uPMatrix.mat4;

    let oz =
      projection[m20]*x + projection[m21]*y + projection[m22]*z + projection[m23]*w;
    const ow =
      projection[m30]*x + projection[m31]*y + projection[m32]*z + projection[m33]*w;

    if (nonZero(ow)) {
      oz /= ow;
    }
    const sz = (oz + 1) / 2.0;
    return sz;
}


function map(v, v1, v2, v3, v4){
    return (v-v1)/(v2-v1)*(v4-v3)+v3;
}

function mysimplebox(pgr, wx, wy, wz){
    var fac = 1;
    var wdisintq = wdisint * fac;
    pgr.push();
    if(disintegrated) pg.translate(wdisintq*random(-1,1), wdisintq*random(-1,1), wdisintq*random(-1,1));
    pgr.beginShape();
    pgr.vertex(-wx/2, -wy/2, -wz/2);
    pgr.vertex(-wx/2, -wy/2, +wz/2);
    pgr.vertex(-wx/2, +wy/2, +wz/2);
    pgr.vertex(-wx/2, +wy/2, -wz/2);
    pgr.endShape(CLOSE);
    if(disintegrated) pg.translate(wdisintq*random(-1,1), wdisintq*random(-1,1), wdisintq*random(-1,1));
    pgr.beginShape();
    pgr.vertex(-wx/2, +wy/2, -wz/2);
    pgr.vertex(-wx/2, +wy/2, +wz/2);
    pgr.vertex(+wx/2, +wy/2, +wz/2);
    pgr.vertex(+wx/2, +wy/2, -wz/2);
    pgr.endShape(CLOSE);
    if(disintegrated) pg.translate(wdisintq*random(-1,1), wdisintq*random(-1,1), wdisintq*random(-1,1));
    pgr.beginShape();
    pgr.vertex(-wx/2, -wy/2, +wz/2);
    pgr.vertex(-wx/2, +wy/2, +wz/2);
    pgr.vertex(+wx/2, +wy/2, +wz/2);
    pgr.vertex(+wx/2, -wy/2, +wz/2);
    pgr.endShape(CLOSE);
    if(disintegrated) pg.translate(wdisintq*random(-1,1), wdisintq*random(-1,1), wdisintq*random(-1,1));
    pgr.beginShape();
    pgr.vertex(+wx/2, -wy/2, -wz/2);
    pgr.vertex(+wx/2, -wy/2, +wz/2);
    pgr.vertex(+wx/2, +wy/2, +wz/2);
    pgr.vertex(+wx/2, +wy/2, -wz/2);
    pgr.endShape(CLOSE);
    if(disintegrated) pg.translate(wdisintq*random(-1,1), wdisintq*random(-1,1), wdisintq*random(-1,1));
    pgr.beginShape();
    pgr.vertex(-wx/2, -wy/2, -wz/2);
    pgr.vertex(-wx/2, -wy/2, +wz/2);
    pgr.vertex(+wx/2, -wy/2, +wz/2);
    pgr.vertex(+wx/2, -wy/2, -wz/2);
    pgr.endShape(CLOSE);
    if(disintegrated) pg.translate(wdisintq*random(-1,1), wdisintq*random(-1,1), wdisintq*random(-1,1));
    pgr.beginShape();
    pgr.vertex(-wx/2, -wy/2, -wz/2);
    pgr.vertex(-wx/2, +wy/2, -wz/2);
    pgr.vertex(+wx/2, +wy/2, -wz/2);
    pgr.vertex(+wx/2, -wy/2, -wz/2);
    pgr.endShape(CLOSE);
    pgr.pop();
    return;
}

function getScreenPos(pg, pos){
    var sx, sy;
    var sx = _screenX(pg, pos.x, pos.y, pos.z) - pg.width/2;
    var sy = _screenY(pg, pos.x, pos.y, pos.z) - pg.height/2;

    return createVector(sx, sy);
}

function mybox(info){
    x = info[0];
    y = info[1];
    z = info[2];
    wx = info[3];
    wy = info[4];
    wz = info[5];
    rx = info[6];
    ry = info[7];
    rz = info[8];
    ii = info[9];

    mask.fill(ii+1);
    var lineprob = 1.0;

    var raaaa1 = random(-wx/2, wx/2);
    var raaaa2 = random(-wx/2, wx/2);
    
    if(option == 0){
        raaaa1 = random(-0, 0);
        raaaa2 = random(-0, 0);
        lineprob = 1.0;
    }
    if(option == 1){
        raaaa1 = random(-wx/2, wx/2);
        raaaa2 = random(-wx/2, wx/2);
        lineprob = 1.0;
    }
    if(option == 2){
        raaaa1 = random(-0, 0);
        raaaa2 = random(-wx/2, wx/2);
        lineprob = 1.0;
    }
    if(option == 3){
        raaaa1 = random(-wx/2, wx/2);
        raaaa2 = random(-wx/2, wx/2);
        lineprob = 1.0;
    }
    //raaaa1 = 0;
    //raaaa2 = 0;

    pg.push();
    pg.translate(x, y, z);
    pg.rotateX(rx);
    mask.push();
    mask.translate(x, y, z);
    mask.rotateX(rx);
    var stepsa = 2;
    var yyang = 0*radians(floor(random(stepsa-1))*90/stepsa);
    //pg.rotateY(yyang);
    //mask.rotateY(yyang);
    mask.rotateX(random(-.05, .05));
    mask.rotateY(random(-.05, .05));
    mask.rotateZ(random(-.05, .05));
    mask.translate(random(-18, 18), random(-18, 18), random(-18, 18));
    //mask.scale(random(.9, .9));

    var rras = floor(fxrand()*palette.length)
    pg.fill(cl2);

    if(infill)
        pg.fill(palette[rras][0]*255., palette[rras][1]*255., palette[rras][2]*255.);

    if(ismono){
        if(flipbw){
            pg.fill(cl3);
        }
        else{
            pg.fill(cl4);
        }
    }
    
    var invs = fxrand() < .5 && hashollow && ii != 0;
    if(ismono)
        invs = false;
    var haslines = fxrand() < lineprob && !invs || afew;
    pg.noStroke();
    pg.push();
    mask.push();
    if(!invs || afew){
        mysimplebox(pg, wx-0.000, wy-0.000, wz-0.000);
        mysimplebox(mask, wx-0.000, wy-0.000, wz-0.000);
    }
    //pg.translate(0, 0, 0);
    //mysimplebox(pg, wx-0.000, wy-0.000, wz-0.000);
    //if(ii != 0) pg.translate(raaaa1, 0, 0);
    //pg.fill(cl1);
    if(!invs || afew){
        mysimplebox(pg, wx-0.000, wy-0.000, wz-0.000);
        mysimplebox(mask, wx-0.000, wy-0.000, wz-0.000);
    }
    mask.pop();
    pg.pop();


    pg.stroke(cl1);
    var rr = floor(random(6));
    if(rr == 0) pg.stroke(222, 66, 66);
    if(rr == 1) pg.stroke(66, 222, 66);
    if(rr == 2) pg.stroke(66, 66, 222);
    if(rr == 3) pg.stroke(222, 222, 66);
    if(rr == 4) pg.stroke(222, 66, 222);
    if(rr == 5) pg.stroke(66, 222, 222);

    var ridx1 = floor(fxrand()*palette.length)
    pg.stroke(palette[ridx1][0]*255., palette[ridx1][1]*255., palette[ridx1][2]*255.);
    if(ismono){
        if(flipbw){
            pg.stroke(cl4);
        }
        else{
            pg.stroke(cl3);
        }
    }
    pg.noFill();
    pg.push();
    if(raaaa2 != 0.0) pg.strokeWeight(5);
    //pg.translate(raaaa2, 0, 0);
    if(!ismono) pg.stroke(palette[ridx1][0]*255., palette[ridx1][1]*255., palette[ridx1][2]*255.);
    if(!hasshiftedlines) mysimplebox(pg, wx-0.000, wy-0.000, wz-0.000);
    pg.pop();

    if(haslines){
        
        lines(
            createVector(+wx/2, -wy/2, -wz/2),
            createVector(+wx/2, -wy/2, +wz/2),
            createVector(+wx/2, +wy/2, +wz/2),
            createVector(+wx/2, +wy/2, -wz/2),
            [palette[ridx1][0]*255., palette[ridx1][1]*255., palette[ridx1][2]*255.],    
            createVector(0, 1, 1),  
        );
        
        lines(
            createVector(-wx/2, +wy/2, -wz/2),
            createVector(-wx/2, +wy/2, +wz/2),
            createVector(+wx/2, +wy/2, +wz/2),
            createVector(+wx/2, +wy/2, -wz/2),
            [palette[ridx1][0]*255., palette[ridx1][1]*255., palette[ridx1][2]*255.],    
            createVector(1, 0, 1),  
        );
        
        lines(
            createVector(-wx/2, -wy/2, +wz/2),
            createVector(+wx/2, -wy/2, +wz/2),
            createVector(+wx/2, +wy/2, +wz/2),
            createVector(-wx/2, +wy/2, +wz/2),
            [palette[ridx1][0]*255., palette[ridx1][1]*255., palette[ridx1][2]*255.],    
            createVector(1, 1, 0),  
        );

        lines(
            createVector(-wx/2, -wy/2, -wz/2),
            createVector(-wx/2, -wy/2, +wz/2),
            createVector(-wx/2, +wy/2, +wz/2),
            createVector(-wx/2, +wy/2, -wz/2),
            [palette[ridx1][0]*255., palette[ridx1][1]*255., palette[ridx1][2]*255.],    
            createVector(0, 1, 1),  
        );

        lines(
            createVector(-wx/2, -wy/2, -wz/2),
            createVector(-wx/2, -wy/2, +wz/2),
            createVector(+wx/2, -wy/2, +wz/2),
            createVector(+wx/2, -wy/2, -wz/2),
            [palette[ridx1][0]*255., palette[ridx1][1]*255., palette[ridx1][2]*255.],    
            createVector(1, 0, 1),  
        );

        lines(
            createVector(-wx/2, -wy/2, -wz/2),
            createVector(+wx/2, -wy/2, -wz/2),
            createVector(+wx/2, +wy/2, -wz/2),
            createVector(-wx/2, +wy/2, -wz/2),
            [palette[ridx1][0]*255., palette[ridx1][1]*255., palette[ridx1][2]*255.],    
            createVector(1, 1, 0),  
        );
    }


    pg.pop();
    mask.pop();
}


function lines(p1, p2, p3, p4, col, vv){

    var an = radians(floor(random(4))*90);
    if(vv.x == 0){
        vv.y = 44*cos(an);
        vv.z = 44*sin(an);
    }
    if(vv.y == 0){
        vv.x = 44*cos(an);
        vv.z = 44*sin(an);
    }
    if(vv.z == 0){
        vv.y = 44*cos(an);
        vv.x = 44*sin(an);
    }

    if(hasshiftedlines){
        p1.add(vv);
        p2.add(vv);
        p3.add(vv);
        p4.add(vv);
    }

    var det = random(detmin, detmax);
    if(uniform)
        det = detu;
    //if(ismono)
    //    det = 8;
    var parts = 1 + round(p1.dist(p2) / det);

    for(var k = 0; k < 2; k++){
        var pa, pb, pc, pd;
        if(k == 0){
            pa = p1; pb = p2; pc = p4; pd = p3;
        }
        if(k == 1){
            pa = p1; pb = p4; pc = p2; pd = p3;
            if(random(10) < 5 && hasparallels || allareparallels)
                return;
            if(!uniform && fxrand() <  .5){
                det = random(detmin, detmax);
            }
            
            parts = 1 + round(p1.dist(p4) / det);
        }

        var thdir = p5.Vector.sub(pb, pa);
        thdir.normalize();
        thdir.mult(1);
        for(var pp = 0; pp < parts; pp++){
            var p = map(pp, 0, parts-1, 0, 1);
            if(haswarp)
                p = power(p, waa);

            if(!isFinite(p)){
                p = fxrand();
            }
            
            var x1 = lerp(pa.x, pb.x, p);
            var y1 = lerp(pa.y, pb.y, p);
            var z1 = lerp(pa.z, pb.z, p);
            var x2 = lerp(pc.x, pd.x, p);
            var y2 = lerp(pc.y, pd.y, p);
            var z2 = lerp(pc.z, pd.z, p);

            var col2 = [col[0], col[1], col[2]];
            var coll2 = [min(255, max(0, col2[0]*random(.8, 1.12))), min(255, max(0, col2[1]*random(.8, 1.12))), min(255, max(0, col2[2]*random(.8, 1.12)))]
            var hsv1 = rgb2hsv(...coll2);
            var rgb1 = hsv2rgb(...hsv1);
            rgb1[0] *= 255;
            rgb1[1] *= 255;
            rgb1[2] *= 255;
            pg.stroke(...coll2)

            if(ismono){
                if(flipbw){
                    pg.stroke(cl4);
                }
                else{
                    pg.stroke(cl3);
                }
            }

            if(hasgradientlines){
                pg.line(x1+thdir.x, y1+thdir.y, z1+thdir.z, x2, y2, z2);
                pg.line(x1-thdir.x, y1-thdir.y, z1-thdir.z, x2, y2, z2);
            }
            else{
                pg.line(x1, y1, z1, x2, y2, z2);
            }
        }
    }

    //if(ismono)
    //    det = 8;
    /*parts = 1 + round(p1.dist(p4) / det);
    for(var pa = 0; pa < parts; pa++){
        var p = map(pa, 0, parts-1, 0, 1);
        if(haswarp)
            p = power(p, waa);
        if(!isFinite(p)){
            p = fxrand();
        }
        var x1 = lerp(p1.x, p4.x, p);
        var y1 = lerp(p1.y, p4.y, p);
        var z1 = lerp(p1.z, p4.z, p);
        var x2 = lerp(p2.x, p3.x, p);
        var y2 = lerp(p2.y, p3.y, p);
        var z2 = lerp(p2.z, p3.z, p);

        var col2 = [col[0], col[1], col[2]];
        var coll2 = [min(255, max(0, col2[0]*random(.88, 1.12))), min(255, max(0, col2[1]*random(.88, 1.12))), min(255, max(0, col2[2]*random(.88, 1.12)))]
        var hsv1 = rgb2hsv(...coll2);
        var rgb1 = hsv2rgb(...hsv1);
        rgb1[0] *= 255;
        rgb1[1] *= 255;
        rgb1[2] *= 255;
        pg.stroke(...coll2)

        if(ismono){
            if(flipbw){
                pg.stroke(cl4);
            }
            else{
                pg.stroke(cl3);
            }
        }

        pg.line(x1, y1, z1, x2, y2, z2);
        if(vv.x == 0 && hasgradientlines)
            pg.line(x1, y1+2, z1+2, x2, y2, z2);
        if(vv.y == 0 && hasgradientlines)
            pg.line(x1+2, y1, z1+2, x2, y2, z2);
        if(vv.z == 0 && hasgradientlines)
            pg.line(x1+2, y1+2, z1, x2, y2, z2);
    }*/
}

function getStroke(x0, y0, x1, y1, w0, w1, seed, raise0=1, detail0=1, nzamp0=1){
    var strokepoints = [];
    var d = dist(x0, y0, x1, y1);
    var detail = 1*detail0;
    var parts = round(d/detail);
    var nzamp = nzamp0*.25;
    var nzfrq = .12;
    var raise = raise0*(.5 + fxrand()*.2);

    var p0 = createVector(x0, y0);
    var p1 = createVector(x1, y1);
    var v01 = p5.Vector.sub(p1, p0);
    v01.normalize();
    var pe = v01.copy();
    pe.rotate(-PI/2);

    var t0 = p5.Vector.add(p0, p5.Vector.mult(pe, +w0/2))
    var t1 = p5.Vector.add(p1, p5.Vector.mult(pe, +w1/2))
    var t2 = p5.Vector.add(p1, p5.Vector.mult(pe, -w1/2))
    var t3 = p5.Vector.add(p0, p5.Vector.mult(pe, -w0/2))
    var dd, dparts;
    
    dd = dist(t0.x, t0.y, t1.x, t1.y);
    dparts = 2 + round(dd/detail);
    for(var part = 0; part < dparts; part++){
        var p = map(part, 0, dparts, 0, 1);
        var x = lerp(t0.x, t1.x, p) + (w0+w1)/2*nzamp * (-.5 + power(noise(strokepoints.length*nzfrq, seed), 6));
        var y = lerp(t0.y, t1.y, p) + (w0+w1)/2*nzamp * (-.5 + power(noise(strokepoints.length*nzfrq+2113.13, seed), 6));
        strokepoints.push([x, y, 0]);
    }
    
    dd = dist(t1.x, t1.y, t2.x, t2.y);
    dparts = 2 + round(dd/detail);
    for(var part = 0; part < dparts; part++){
        var p = map(part, 0, dparts, 0, 1);
        var arc = p5.Vector.mult(v01, (w0+w1)/2*raise*sin(p*3.141));
        var x = lerp(t1.x, t2.x, p) + arc.x + (w0+w1)/2*nzamp * (-.5 + power(noise(strokepoints.length*nzfrq, seed), 3));
        var y = lerp(t1.y, t2.y, p) + arc.y + (w0+w1)/2*nzamp * (-.5 + power(noise(strokepoints.length*nzfrq+2113.13, seed), 3));
        strokepoints.push([x, y, 0]);
    }
    
    dd = dist(t2.x, t2.y, t3.x, t3.y);
    dparts = 2 + round(dd/detail);
    for(var part = 0; part < dparts; part++){
        var p = map(part, 0, dparts, 0, 1);
        var x = lerp(t2.x, t3.x, p) + (w0+w1)/2*nzamp * (-.5 + power(noise(strokepoints.length*nzfrq, seed), 3));
        var y = lerp(t2.y, t3.y, p) + (w0+w1)/2*nzamp * (-.5 + power(noise(strokepoints.length*nzfrq+2113.13, seed), 3));
        strokepoints.push([x, y, 0]);
    }
    
    dd = dist(t3.x, t3.y, t0.x, t0.y);
    dparts = 2 + round(dd/detail);
    for(var part = 0; part < dparts; part++){
        var p = map(part, 0, dparts, 0, 1);
        var arc = p5.Vector.mult(v01, -(w0+w1)/2*raise*sin(p*3.141));
        var x = lerp(t3.x, t0.x, p) + arc.x + (w0+w1)/2*nzamp * (-.5 + power(noise(strokepoints.length*nzfrq, seed), 3));
        var y = lerp(t3.y, t0.y, p) + arc.y + (w0+w1)/2*nzamp * (-.5 + power(noise(strokepoints.length*nzfrq+2113.13, seed), 3));
        strokepoints.push([x, y, 0]);
    }

    return strokepoints;
}

function getThings(x0, y0, x1, y1, w0, w1, seed, anchorprobleft, anchorprobright, tilt){
    var allthings = [];
    var nthings = 3 + fxrand()*6;

    var anchors = [];
    for(var k = 0; k < nthings/2; k++){
        var p = fxrand()*.5;
        var thth = 3 + fxrand()*5;
        var lx = lerp(x0, x1, p);
        var ly = lerp(y0, y1, p);
        var thingpointsl = getStroke(lx, ly, lx, ly-10, thth, thth, fxrand()*10000);
        var rx = lerp(x0, x1, 1-p);
        var ry = lerp(y0, y1, 1-p);
        var thingpointsr = getStroke(rx, ry, rx, ry-10, thth, thth, fxrand()*10000);
        allthings.push(thingpointsl);
        allthings.push(thingpointsr);

        var hasloose = 1 * (p > .4) * 0;
        if(thth < 5){
            var thingpointsl2 = getStroke(lx, ly-10, lx, ly-20, thth*1.7, thth*1.7, fxrand()*10000, 0.1);
            var thingpointsr2 = getStroke(rx, ry-10, rx, ry-20, thth*1.7, thth*1.7, fxrand()*10000, 0.1);
            allthings.push(thingpointsl2);
            allthings.push(thingpointsr2);
            if(fxrand()<anchorprobleft){
                anchors.push([lx, ly-20, hasloose]);
                anchors.push([rx, ry-20, hasloose]);
            }
        }
        else{
            if(fxrand()<anchorprobright){
                anchors.push([lx, ly-10, hasloose]);
                anchors.push([rx, ry-10, hasloose]);
            }
        }

    }
    if(fxrand() < .13){
        anchors.push([(x0+x1)/2, (y0+y1)/2, 1]);
        if(fxrand() < .5) anchors.push([(x0+x1)/2, (y0+y1)/2, 1]);
    }
    return {'allthings': allthings, 'anchors': anchors}
}

function shuffle(array) {
    let currentIndex = array.length
    var randomIndex;

  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(fxrand() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [r, g, b]
}
function showall(){
    background(222);
    pg.push();
    //pg.scale(0.8);
    pg.pop();
    //pg.line(0,0,mouseX-width/2,mouseY-height/2);

    var an = fxrand()*PI;
    var dir = [cos(an), sin(an)]
    blurH.setUniform('tex0', pg);
    blurH.setUniform('tex1', mask);
    blurH.setUniform('texelSize', [1.0/resx, 1.0/resy]);
    blurH.setUniform('direction', [dir[0], [1]]);
    blurH.setUniform('u_time', frameCount*0+globalseed*.01);
    blurH.setUniform('amp', .03);
    blurH.setUniform('seed', (globalseed*.12134)%33.);
    blurpass1.shader(blurH);
    blurpass1.quad(-1,-1,1,-1,1,1,-1,1);
    
    blurV.setUniform('tex0', blurpass1);
    blurH.setUniform('tex1', mask);
    blurV.setUniform('texelSize', [1.0/resx, 1.0/resy]);
    blurV.setUniform('direction', [-dir[1], [0]]);
    blurV.setUniform('u_time', frameCount*0+globalseed*.01);
    blurV.setUniform('amp', .03);
    blurV.setUniform('seed', (globalseed*.12134)%33.);
    blurpass2.shader(blurV);
    blurpass2.quad(-1,-1,1,-1,1,1,-1,1);

    effect.setUniform('tex0', blurpass2);
    effect.setUniform('tex1', pg);
    effect.setUniform('tex2', mask);
    effect.setUniform('tex3', bgpg);
    effect.setUniform('u_usemask', usemask*1.);
    effect.setUniform('u_resolution', [resx, resy]);
    effect.setUniform('u_mouse',[dir[0], [1]]);
    effect.setUniform('u_time', frameCount);
    effect.setUniform('incolor', [map(fxrand(), 0, 1, .99, 1.), map(fxrand(), 0, 1, .99, 1.), .99, 1.]);
    effect.setUniform('seed', globalseed);
    effect.setUniform('noiseamp', mouseX/width*0+1);
    effect.setUniform('hasmargin', hasmargin);
    //effect.setUniform('tintColor', HSVtoRGB(fxrand(), 0.2, 0.95));
    var hue1 = fxrand();
   //effect.setUniform('tintColor', HSVtoRGB(fxrand(),.3,.9));
    //effect.setUniform('tintColor2', HSVtoRGB((hue1+.45+fxrand()*.1)%1,.3,.9));
    var ridx1 = floor(fxrand()*palette.length)
    var ridx2 = floor(fxrand()*palette.length)
    effect.setUniform('tintColor', palette[ridx1]);
    effect.setUniform('tintColor2', palette[ridx2]);
    effectpass.shader(effect);
    effectpass.quad(-1,-1,1,-1,1,1,-1,1);
  
    // draw the second pass to the screen
    //image(effectpass, 0, 0, mm-18, mm-18);
    var xx = 0;
    image(effectpass, 0, 0, mm*resx/resy-xx, mm-xx);

}



function draw(){
    /*let bins = fft.analyze();
    binsum = 0;
    for (let i = bins.length-10; i < bins.length; i++) {
        let val = bins[i];
        if(val>3 && timer < 0){
            binsum += val;
        }
    }
    if(binsum>50){
        generateHeads();
        timer = frameRate();
    }
    timer--;*/
    
/*effect.setUniform('u_tex', pg);
    effect.setUniform('u_resolution', [width, height]);
    effect.setUniform('u_mouse', [width, height]);
    effect.setUniform('u_time', frameCount);

    shader(effect);
    fill(255);
    quad(-1,-1,1,-1,1,1,-1,1);*/
    
    //vectorizeHeads();

}

var wheads = [];

function rnoise(s, v1, v2){
    return v1 + (v2-v1)*((power(noise(s), 3)*1)%1.0);
}

function windowResized() {
    mm = min(windowWidth, windowHeight);
    resizeCanvas(round(mm*resx/resy), mm);
    var xx = 0;
    image(effectpass, 0, 0, mm*resx/resy-xx, mm-xx);
}

function power(p, g) {
    if (p < 0.5)
        return 0.5 * Math.pow(2*p, g);
    else
        return 1 - 0.5 * Math.pow(2*(1 - p), g);
}



/////////////////////////////////////////////////////

////// COURTESY OF Tagussan https://github.com/Tagussan/BSpline

var BSpline = function(points,degree,copy){
    if(copy){
        this.points = []
        for(var i = 0;i<points.length;i++){
            this.points.push(points[i]);
        }
    }else{
        this.points = points;
    }
    this.degree = degree;
    this.dimension = points[0].length;
    if(degree == 2){
        this.baseFunc = this.basisDeg2;
        this.baseFuncRangeInt = 2;
    }else if(degree == 3){
        this.baseFunc = this.basisDeg3;
        this.baseFuncRangeInt = 2;
    }else if(degree == 4){
        this.baseFunc = this.basisDeg4;
        this.baseFuncRangeInt = 3;
    }else if(degree == 5){
        this.baseFunc = this.basisDeg5;
        this.baseFuncRangeInt = 3;
    } 
};

BSpline.prototype.seqAt = function(dim){
    var points = this.points;
    var margin = this.degree + 1;
    return function(n){
        if(n < margin){
            return points[0][dim];
        }else if(points.length + margin <= n){
            return points[points.length-1][dim];
        }else{
            return points[n-margin][dim];
        }
    };
};

BSpline.prototype.basisDeg2 = function(x){
    if(-0.5 <= x && x < 0.5){
        return 0.75 - x*x;
    }else if(0.5 <= x && x <= 1.5){
        return 1.125 + (-1.5 + x/2.0)*x;
    }else if(-1.5 <= x && x < -0.5){
        return 1.125 + (1.5 + x/2.0)*x;
    }else{
        return 0;
    }
};

BSpline.prototype.basisDeg3 = function(x){
    if(-1 <= x && x < 0){
        return 2.0/3.0 + (-1.0 - x/2.0)*x*x;
    }else if(1 <= x && x <= 2){
        return 4.0/3.0 + x*(-2.0 + (1.0 - x/6.0)*x);
    }else if(-2 <= x && x < -1){
        return 4.0/3.0 + x*(2.0 + (1.0 + x/6.0)*x);
    }else if(0 <= x && x < 1){
        return 2.0/3.0 + (-1.0 + x/2.0)*x*x;
    }else{
        return 0;
    }
};

BSpline.prototype.basisDeg4 = function(x){
    if(-1.5 <= x && x < -0.5){
        return 55.0/96.0 + x*(-(5.0/24.0) + x*(-(5.0/4.0) + (-(5.0/6.0) - x/6.0)*x));
    }else if(0.5 <= x && x < 1.5){
        return 55.0/96.0 + x*(5.0/24.0 + x*(-(5.0/4.0) + (5.0/6.0 - x/6.0)*x));
    }else if(1.5 <= x && x <= 2.5){
        return 625.0/384.0 + x*(-(125.0/48.0) + x*(25.0/16.0 + (-(5.0/12.0) + x/24.0)*x));
    }else if(-2.5 <= x && x <= -1.5){
        return 625.0/384.0 + x*(125.0/48.0 + x*(25.0/16.0 + (5.0/12.0 + x/24.0)*x));
    }else if(-1.5 <= x && x < 1.5){
        return 115.0/192.0 + x*x*(-(5.0/8.0) + x*x/4.0);
    }else{
        return 0;
    }
};

BSpline.prototype.basisDeg5 = function(x){
    if(-2 <= x && x < -1){
        return 17.0/40.0 + x*(-(5.0/8.0) + x*(-(7.0/4.0) + x*(-(5.0/4.0) + (-(3.0/8.0) - x/24.0)*x)));
    }else if(0 <= x && x < 1){
        return 11.0/20.0 + x*x*(-(1.0/2.0) + (1.0/4.0 - x/12.0)*x*x);
    }else if(2 <= x && x <= 3){
        return 81.0/40.0 + x*(-(27.0/8.0) + x*(9.0/4.0 + x*(-(3.0/4.0) + (1.0/8.0 - x/120.0)*x)));
    }else if(-3 <= x && x < -2){
        return 81.0/40.0 + x*(27.0/8.0 + x*(9.0/4.0 + x*(3.0/4.0 + (1.0/8.0 + x/120.0)*x)));
    }else if(1 <= x && x < 2){
        return 17.0/40.0 + x*(5.0/8.0 + x*(-(7.0/4.0) + x*(5.0/4.0 + (-(3.0/8.0) + x/24.0)*x)));
    }else if(-1 <= x && x < 0){
        return 11.0/20.0 + x*x*(-(1.0/2.0) + (1.0/4.0 + x/12.0)*x*x);
    }else{
        return 0;
    }
};

BSpline.prototype.getInterpol = function(seq,t){
    var f = this.baseFunc;
    var rangeInt = this.baseFuncRangeInt;
    var tInt = Math.floor(t);
    var result = 0;
    for(var i = tInt - rangeInt;i <= tInt + rangeInt;i++){
        result += seq(i)*f(t-i);
    }
    return result;
};

BSpline.prototype.calcAt = function(t){
    t = t*((this.degree+1)*2+this.points.length);//t must be in [0,1]
    if(this.dimension == 2){
        return [this.getInterpol(this.seqAt(0),t),this.getInterpol(this.seqAt(1),t)];
    }else if(this.dimension == 3){
        return [this.getInterpol(this.seqAt(0),t),this.getInterpol(this.seqAt(1),t),this.getInterpol(this.seqAt(2),t)];
    }else{
        var res = [];
        for(var i = 0;i<this.dimension;i++){
            res.push(this.getInterpol(this.seqAt(i),t));
        }
        return res;
    }
};