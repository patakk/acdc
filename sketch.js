let canvas;
var pg;
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
var zoom = .8;
var globalseed = Math.floor(fxrand()*1000000);

var hasmargin = 1.0 * (fxrand()*100 < 50);

var isdark = fxrand() < 1.5;

var waa = map(fxrand(), 0, 1, .7, 2);

var detmin = 7;
var detmax = 16;
var detu = Math.round(map(power(fxrand(), 6.), 0, 1, detmin, detmax));
////////////

var numobjects = -1;
var option = Math.floor(map(fxrand(), 0, 1, 0, 4));
var ismono = fxrand() < .1;
var flipbw = fxrand() < .5;
var hasparallels = fxrand() < .5;

var uniform = fxrand() < .5;

if(uniform){
    detu = Math.round(map(fxrand(), 0, 1, detmin, detmin+4));
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

var crazy = fxrand() < .25;
if(crazy && !ismono)
    waa = -waa;
if(!haswarp || ismono)
    crazy = false;

var orth = 1.*(fxrand() < .5);
if(crazy)
    orth = 1.;


console.log('option:', option);
console.log('ismono:', ismono);
console.log('flipbw:', flipbw);
console.log('orth:', orth);
console.log('haswarp:', haswarp);
console.log('uniform:', uniform && (!crazy));
console.log('crazy:', crazy);
console.log('hasparallels:', hasparallels);


function getOrthoString(value) {
    if (value) return "yes";
    else return "no";
}


window.$fxhashFeatures = {
    "ortho": getOrthoString(orth),
    "exploded": getOrthoString(crazy),
    "mono": getOrthoString(ismono),
    "uniform": getOrthoString(uniform && (!crazy)),
}
///////




var palettes1 = [
    ['f46036-5b85aa-414770-372248', 0],
   
]

var palettes0 = [
    'f46036-5b85aa-414770-372248',
    '084c61-db504a-e3b505-4f6d7a-56a3a6',
    '177e89-084c61-db3a34-ffc857-323031',
    '32373b-4a5859-f4d6cc-f4b860-c83e4d',
    'de6b48-e5b181-f4b9b2-daedbd-7dbbc3',
    'f55d3e-878e88-f7cb15-76bed0',
    'ffbc42-df1129-bf2d16-218380-73d2de',
    'fa8334-fffd77-ffe882-388697-54405f',
    'ed6a5a-f4f1bb-9bc1bc-e6ebe0-36c9c6',
    '3e5641-a24936-d36135-282b28-83bca9',
    '664c43-873d48-dc758f-e3d3e4-00ffcd',
    '304d7d-db995a-bbbbbb-222222-fdc300',
    '8789c0-45f0df-c2cae8-8380b6-111d4a',
    '006466-065a60-fb525b-144552-1b3a4b-212f45-272640-fb525b-312244-3e1f47-4d194d',
    '5fad56-f2c14e-f78154-4d9078-b4431c',
]

palettes10 = [
  
    '5fad56-f2c14e-f78154-4d9078-b4431c',
]

var palettes = [];
palettes0.forEach(element => {
    palettes.push(element);
});


function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16)/255.,
      parseInt(result[2], 16)/255.,
      parseInt(result[3], 16)/255.
    ] : null;
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
            var hhh = hexToRgb(e);
            var gg = 0.3*hhh[0] + 0.59*hhh[1] + 0.11*hhh[2];
            if(gg < .5){
                hhh[0] *= .5/gg;
                hhh[1] *= .5/gg;
                hhh[2] *= .5/gg;
            }
            caca.push(hhh);
        });
        //shuffle(caca)
        var coco = [];
        caca.forEach((e, i)=>{coco.push([(1.*caca[i][0]+.01*map(fxrand(), 0, 1, -.2, .2)), (1.*caca[i][1]+.01*map(fxrand(), 0, 1, -.2, .2)), (1.*caca[i][2]+.01*map(fxrand(), 0, 1, -.2, .2))])});
        palettes[k] = coco;
    }

    palette = palettes[thidx]
    bgidx = floor(fxrand()*palette.length)
    print('palette:', palettes0[thidx])

    pg = createGraphics(resx, resy, WEBGL);
    pg.noStroke();
    //pg.strokeJoin(ROUND);
    pg.ortho(-resx/2, resx/2, -resy/2, resy/2, 0, 4444);
    mask = createGraphics(res, res, WEBGL);
    mask.noStroke();
    mask.ortho(-resx/2, resx/2, -resy/2, resy/2, 0, 4444);
    //mask.strokeJoin(ROUND);
    colorMode(HSB, 100);

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

    cl1 = color(222, 222, 222);
    cl2 = color(20, 20, 20);
    cl3 = color(244, 244, 244);
    cl4 = color(5, 5, 5);

    pg.background(palette[bgidx][0]*255., palette[bgidx][1]*255., palette[bgidx][2]*255.);
    
    if(ismono){
        if(flipbw){
            pg.background(cl2);
        }
        else{
            pg.background(cl1);
        }
    }


    drawShapes();    


    showall();
    showall();
    fxpreview();
}

var s = "HELLO";
var binsum = 0;
var timer = -1;
var num = 20;

function generateBoxes1(){
    numobjects = Math.round(map(fxrand(), 0, 1, 55, 55))
    var mix = 100100;
    var mmx = -101000;
    var miy = 100100;
    var mmy = -101000;
    var miz = 100100;
    var mmz = -101000;
    var infos = [];
    var volume = 200*200*200 * .1;
    for(var k = 0; k < numobjects; k++){
        var bx = random(-222, 222)*1.7;
        var by = random(-222, 222)*1.7;
        var bz = random(-222, 222);
        var wx = map(pow(fxrand(), 1.6), 0, 1, 50, 400)*.5;
        var wy = map(pow(fxrand(), 1.6), 0, 1, 50, 400)*1.5;
        var wz = map(pow(fxrand(), 1.6), 0, 1, 50, 400)*.5;
        var rx = radians(floor(random(3))*45/1 - 45);
        var ry = radians(random(-30, 30));
        var rz = radians(random(-30, 30));
        infos.push([bx, by, bz, wx, wy, wz, rx, ry, rz, k]);
        if(bx+wx/2 > mmx) mmx = bx+wx/2;
        if(bx-wx/2 < mix) mix = bx-wx/2;
        if(by+cos(rx)*wy/2 > mmy) mmy = by+cos(rx)*wy/2;
        if(by-cos(rx)*wy/2 < miy) miy = by-cos(rx)*wy/2;
        if(bz+sin(rx)*wz/2 > mmz) mmz = bz+sin(rx)*wz/2;
        if(bz-sin(rx)*wz/2 < miz) miz = bz-sin(rx)*wz/2;
    }

    return {'infos': infos, 'mmx': mmx, 'mix': mix, 'mmy': mmy, 'miy': miy, 'mmz': mmz, 'miz': miz}
}

function generateBoxes2(){
    numobjects = Math.round(map(fxrand(), 0, 1, 12, 13))
    var mix = 100100;
    var mmx = -101000;
    var miy = 100100;
    var mmy = -101000;
    var miz = 100100;
    var mmz = -101000;
    var infos = [];
    var volume = 200*200*200 * .1;
    var wwx = random(400, 444);
    var wx = wwx/numobjects;
    var wy = random(50, 600);
    var wz = 600*250/wy;
    var circs = round(random(1, 4));
    for(var k = 0; k < numobjects; k++){
        var bx = map(k, 0, numobjects-1, -wwx/2, wwx/2)
        var by = random(-222, 222);
        var bz = random(-222, 222);
        var rx = map(k, 0, numobjects-1, 0, PI/2*circs)*0 + k*PI/4;
        var ry = radians(random(-30, 30));
        var rz = radians(random(-30, 30));
        infos.push([bx, by, bz, wx, wy, wz, rx, ry, rz, k]);
        if(bx+wx/2 > mmx) mmx = bx+wx/2;
        if(bx-wx/2 < mix) mix = bx-wx/2;
        if(by+cos(rx)*wy/2 > mmy) mmy = by+cos(rx)*wy/2;
        if(by-cos(rx)*wy/2 < miy) miy = by-cos(rx)*wy/2;
        if(bz+sin(rx)*wz/2 > mmz) mmz = bz+sin(rx)*wz/2;
        if(bz-sin(rx)*wz/2 < miz) miz = bz-sin(rx)*wz/2;
    }

    return {'infos': infos, 'mmx': mmx, 'mix': mix, 'mmy': mmy, 'miy': miy, 'mmz': mmz, 'miz': miz}
}

function drawShapes(){
    
    pg.push();
    pg.scale(zoom);
    pg.scale(1, -1, 1);

    bxs = generateBoxes1();
    infos = bxs.infos;
    var mix = bxs.mix;
    var mmx = bxs.mmx;
    var miy = bxs.miy;
    var mmy = bxs.mmy;
    var miz = bxs.miz;
    var mmz = bxs.mmz;

    var stepsa = 8;
    //pg.rotateZ(radians(floor(random(0, 4))*90));
    pg.push();
    pg.strokeWeight(8);
    pg.stroke(255,0,0);
    //pg.line(0, 0, 0, 666, 0, 0);
    pg.stroke(0,255,0);
    //pg.line(0, 0, 0, 0, 666, 0);
    pg.stroke(0,0,255);
    //pg.line(0, 0, 0, 0, 0, 666);

    pg.noStroke();
    pg.fill(100);
    //pg.sphere(30);
    pg.pop();
    pg.rotateY(radians(floor(random(0, 2))*90+45*(1-orth)));
    pg.translate(-(mix+mmx)/2, -(miy+mmy)/2, -(miz+mmz)/2);
    //pg.rotateY(PI/2);




    pg.noFill();
    pg.stroke(cl1);
    pg.strokeWeight(4);

    for(var k = 0; k < infos.length; k++){
        mybox(infos[k]);
    }
    pg.pop();
}

function map(v, v1, v2, v3, v4){
    return (v-v1)/(v2-v1)*(v4-v3)+v3;
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
        raaaa2 = random(-0, 0);
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
    var stepsa = 2;
    pg.rotateY(radians(floor(random(stepsa-1))*90/stepsa));

    var rras = floor(fxrand()*palette.length)
    pg.fill(palette[rras][0]*255., palette[rras][1]*255., palette[rras][2]*255.);
    pg.fill(cl2);

    if(ismono){
        if(flipbw){
            pg.fill(cl3);
        }
        else{
            pg.fill(cl4);
        }
    }
    
    pg.noStroke();
    pg.push();
    pg.box(wx-0.000, wy-0.000, wz-0.000);
    pg.translate(0, 0, 0);
    pg.box(wx-0.000, wy-0.000, wz-0.000);
    pg.translate(raaaa1, 0, 0);
    //pg.fill(cl1);
    pg.box(wx-0.000, wy-0.000, wz-0.000);
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
    //pg.stroke(cl2);
    pg.noFill();
    pg.push();
    if(raaaa2 != 0.0) pg.strokeWeight(5);
    pg.translate(raaaa2, 0, 0);
    if(!ismono) pg.stroke(palette[ridx1][0]*255., palette[ridx1][1]*255., palette[ridx1][2]*255.);
    pg.box(wx-0.000, wy-0.000, wz-0.000);
    pg.pop();



    if(fxrand() < lineprob){
        lines(
            createVector(+wx/2, -wy/2, -wz/2),
            createVector(+wx/2, -wy/2, +wz/2),
            createVector(+wx/2, +wy/2, +wz/2),
            createVector(+wx/2, +wy/2, -wz/2),
        );

        lines(
            createVector(-wx/2, -wy/2, -wz/2),
            createVector(-wx/2, -wy/2, +wz/2),
            createVector(-wx/2, +wy/2, +wz/2),
            createVector(-wx/2, +wy/2, -wz/2),
        );
        
        lines(
            createVector(-wx/2, +wy/2, -wz/2),
            createVector(-wx/2, +wy/2, +wz/2),
            createVector(+wx/2, +wy/2, +wz/2),
            createVector(+wx/2, +wy/2, -wz/2),
        );

        lines(
            createVector(-wx/2, -wy/2, -wz/2),
            createVector(-wx/2, -wy/2, +wz/2),
            createVector(+wx/2, -wy/2, +wz/2),
            createVector(+wx/2, -wy/2, -wz/2),
        );
        
        lines(
            createVector(-wx/2, -wy/2, +wz/2),
            createVector(+wx/2, -wy/2, +wz/2),
            createVector(+wx/2, +wy/2, +wz/2),
            createVector(-wx/2, +wy/2, +wz/2),
        );

        lines(
            createVector(-wx/2, -wy/2, -wz/2),
            createVector(+wx/2, -wy/2, -wz/2),
            createVector(+wx/2, +wy/2, -wz/2),
            createVector(-wx/2, +wy/2, -wz/2),
        );
    }


    pg.pop();
}


function lines(p1, p2, p3, p4){

    var det = random(detmin, detmax);
    if(uniform)
        det = detu;
    //if(ismono)
    //    det = 8;
    var parts = 1 + round(p1.dist(p2) / det);

    for(var pa = 0; pa < parts; pa++){
        var p = map(pa, 0, parts-1, 0, 1);
        if(haswarp)
            p = power(p, waa);
        var x1 = lerp(p1.x, p2.x, p);
        var y1 = lerp(p1.y, p2.y, p);
        var z1 = lerp(p1.z, p2.z, p);
        var x2 = lerp(p4.x, p3.x, p);
        var y2 = lerp(p4.y, p3.y, p);
        var z2 = lerp(p4.z, p3.z, p);
        pg.line(x1, y1, z1, x2, y2, z2);
        pg.push();
        //pg.stroke(cl2);
        pg.strokeWeight(2);
        //pg.line(x1, y1, z1, x2, y2, z2);
        pg.pop();
    }
    if(random(10) < 5 && hasparallels)
        return;
    if(!uniform && fxrand() <  .5){
        det = random(detmin, detmax);
    }
    //if(ismono)
    //    det = 8;
    parts = 1 + round(p1.dist(p4) / det);
    for(var pa = 0; pa < parts; pa++){
        var p = map(pa, 0, parts-1, 0, 1);
        if(haswarp)
            p = power(p, waa);
        var x1 = lerp(p1.x, p4.x, p);
        var y1 = lerp(p1.y, p4.y, p);
        var z1 = lerp(p1.z, p4.z, p);
        var x2 = lerp(p2.x, p3.x, p);
        var y2 = lerp(p2.y, p3.y, p);
        var z2 = lerp(p2.z, p3.z, p);
        pg.line(x1, y1, z1, x2, y2, z2);
        pg.push();
        pg.stroke(cl2);
        pg.strokeWeight(2);
        //pg.line(x1, y1, z1, x2, y2, z2);
        pg.pop();
    }
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