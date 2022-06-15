let canvas;
var pg;
var blurpass1;
var blurpass2;
var effectpass;

let effect;
let blurH;
let blurV;

var cl1, cl2, cl3;

var mm;
var WW, HH;
var resx = 1400;
var resy = 1400;
var res = 1400;
var zoom = 1. + .7*fxrand();
if(fxrand() < .65)
    zoom = 1. + .2*fxrand();
zoom *= resy/resx;
var globalseed = Math.round(fxrand()*1000000);

var hasmargin = 1.0 * (fxrand() < .5);

function fxrandom(a, b){
    if(a && b){
        return a + fxrand()*(b-a);
    }
    if(a && !b){
        return fxrand()*a;
    }
    if(!a && !b){
        return fxrand();
    }
}

function preload() {
    effect = loadShader('assets/effect.vert', 'assets/effect.frag');
    blurH = loadShader('assets/blur.vert', 'assets/blur.frag');
    blurV = loadShader('assets/blur.vert', 'assets/blur.frag');
}

function setup(){
    mm = min(windowWidth, windowHeight);
    pixelDensity(2);
    canvas = createCanvas(mm*resx/resy, mm, WEBGL);
    imageMode(CENTER);
    
    randomSeed(globalseed);
    noiseSeed(globalseed+123.1341);

    pg = createGraphics(resx, resy, WEBGL);
    pg.noStroke();
    pg.colorMode(HSB, 100);
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

    cl1 = color(0, 0, 100);
    cl2 = color(0, 0, 10);

    //generateHeads(20, 31114);
    //frameRate(5);
    
    background(100);
    drawSomething();
    showall();
    showall();
    fxpreview();
}

var s = "HELLO";
var binsum = 0;
var timer = -1;
var num = 20;

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
        //strokepoints.push([x, y, 0]);
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

function getThings(x0, y0, x1, y1, w0, w1, seed, anchorprobleft, anchorprobright){
    var allthings = [];
    var nthings = 3 + fxrand()*2;

    var anchors = [];
    for(var k = 0; k < nthings; k++){
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
            if(fxrand()<anchorprobleft) anchors.push([lx, ly-20, hasloose]);
            if(fxrand()<anchorprobleft) anchors.push([rx, ry-20, hasloose]);
        }
        else{
            if(fxrand()<anchorprobright) anchors.push([lx, ly-10, hasloose]);
            if(fxrand()<anchorprobright) anchors.push([rx, ry-10, hasloose]);
        }

    }
    if(fxrand() < .13){
        anchors.push([(x0+x1)/2, (y0+y1)/2, 1]);
        if(fxrand() < .5) anchors.push([(x0+x1)/2, (y0+y1)/2, 1]);
    }
    return {'allthings': allthings, 'anchors': anchors}
}

function drawSomething(){
    pg.clear();
    pg.background(cl1);
    var sf = 1;
    pg.push();
    pg.scale(zoom);

    var allpoints = []

    var polep = map(fxrand(), 0, 1, -resx/2*.5, resx/2*.5)/zoom*resy/resx * .5;
    var poletilt = map(fxrand(), 0, 1, -.07, .07);
    var poleheight = map(fxrand(), 0, 1, resy/2*1.2, resy/2*1.82)/(zoom*1.+.0);
    var poletopwidth = map(fxrand(), 0, 1, 15, 23);
    var polebottomwidth = map(fxrand(), 0, 1, 24, 40);

    var polex0 = polep;
    var poley0 = resy/2/zoom*resx/resy;
    var polex1 = polep + poleheight*sin(poletilt);
    var poley1 = resy/2/zoom - poleheight*cos(poletilt);
    var d = dist(polex0,poley0,polex1,poley1);
    var detail = 4;
    var parts = round(d/detail);
    var poledir = [polex1-polex0, poley1-poley0];
    var ple = Math.sqrt(poledir[0]*poledir[0]+poledir[1]*poledir[1])
    poledir[0] /= ple;
    poledir[1] /= ple;
    
    var polepoints = [];
    for(var t = 0; t < parts; t++){
        var p = map(t, 0, parts-1, 0, 1);
        var y = lerp(poley0, poley1, p);
        var wnz = 1 + .24*(-.5 + power(noise(y*0.03), 3));
        var x = lerp(polex0-polebottomwidth/2*wnz, polex1-poletopwidth/2*wnz, p) + map(fxrand(), 0, 1, -.5, .5);
        polepoints.push([x, y, 0]);
    }
    var edgeraise = map(fxrand(), 0, 1, .2, .44);
    for(var t = 0; t < 10; t++){
        var env = pow(1-abs(p-.5)*2, .5);
        var p = map(t, 0, 10-1, 0, 1);
        var wnz = 1 + .24*(-.5 + power(noise(poley1*0.03), 3));
        var x = lerp(polex1-poletopwidth/2*wnz, polex1+poletopwidth/2*wnz, p);
        var y = poley1 - env*poletopwidth*edgeraise;
        polepoints.push([x, y, 0]);
    }
    for(var t = 0; t < parts; t++){
        var p = map(t, 0, parts-1, 0, 1);
        var y = lerp(poley1, poley0, p);
        var wnz = 1 + .24*(-.5 + power(noise(y*0.03, 32), 3));
        var x = lerp(polex1+poletopwidth/2*wnz, polex0+polebottomwidth/2*wnz, p) + map(fxrand(), 0, 1, -.5, .5);
        polepoints.push([x, y, 0]);
    }

    allpoints.push(polepoints);

    var crosstilt0 = -poletilt + map(fxrand(), 0, 1, -PI/3, PI/3);
    var crosstilt = crosstilt0;

    var cross1 = map(fxrand(), 0, 1, .4, .715)*.99;
    var cross2 = map(fxrand(), 0, 1, .95, .95);
    //cross1 = cross1 + (1-zoom)*(1-cross1);
    //cross2 = cross2 + (1-zoom)*(1-cross2);
    var ncrosses = round(map(fxrand(), 0, 1, 8, 10));
    var dn0 = 1;
    var dn = dn0;
    var allanchors = [];

    var crossorigins = [];
    for(var n = 0; n < ncrosses-0.01; n+=dn){
        var p = map(n, 0, ncrosses-1, 0, 1);
        var pp = lerp(cross1, cross2, p);

        var cx = lerp(polex0+(polex1-polex0)*(1.-sf), polex1, pp);
        var cy = lerp(poley0+(poley1-poley0)*(1.-sf), poley1, pp);

        print(cx, cy, polex1, poley1)

        var crosswidth = map(fxrand(), 0, 1, 160, 340);
        var crossth = map(fxrand(), 0, 1, 7, 11);
        var crosspoints = [];


        crosstilt = crosstilt0;
        if(fxrand() < .2){
            crosstilt = crosstilt0 + map(fxrand(), 0, 1, -PI/2, PI/2);
        }
        if(abs(n-(ncrosses-1))<.02 && fxrand() < .36){
            //crosstilt = crosstilt0 + PI/2;
        }


        var cx0 = cx-crosswidth/2*cos(crosstilt);
        var cy0 = cy+sin(crosstilt)*crosswidth/2*.22;
        var cx1 = cx+crosswidth/2*cos(crosstilt);
        var cy1 = cy-sin(crosstilt)*crosswidth/2*.22;
        var crosspoints = getStroke(cx0, cy0, cx1, cy1, crossth, crossth, fxrand()*10000);

        if(fxrand() < .51 || n+dn>ncrosses){
            if(abs(crosstilt - crosstilt0) < .1 || abs(n-(ncrosses-1))<.02 || true){
                crossorigins.push([cx, cy])
            }
            allpoints.push(crosspoints);
            //allpoints.push(thingpoints);
            var things = getThings(cx0, cy0, cx1, cy1, crossth, crossth, fxrand()*10000, .1+fxrand()*.6, .1+fxrand()*.6);
            var allthingpoints = things.allthings;
            var anchors = things.anchors;
            anchors.forEach(anchor => {
                allanchors.push(anchor);
            });
            allthingpoints.forEach(thingpoints => {
                allpoints.push(thingpoints);
            });
        }
        dn = dn0;
        if(fxrand() < .2){
            dn = dn0/2;
        }
    }

    var allwirepoints = [];
    var allloosewirepoints = [];
    var ooyl = map(fxrand(), 0, 1, -444, 444);
    var ooyr = map(fxrand(), 0, 1, -444, 444);
    var ooy = map(fxrand(), 0, 1, -444, 444);

    var scar = .1 + 5*pow(fxrand(), 3);
    var scal = .1 + 5*pow(fxrand(), 3);

    var alladapters = [];

    allanchors.forEach((anchor, aidx) => {
        var x0 = anchor[0];
        var y0 = anchor[1];
        var hasloose = anchor[2];

        if(aidx == 20){
            scar = 5.1-scar;
            scal = 5.1-scal;
            ooyl = map(fxrand(), 0, 1, -444, 444);
            ooyr = map(fxrand(), 0, 1, -444, 444);
        }
        for(var side = 0; side < 2; side++){
            var lx1, ly1;
            if(side == 0){
                lx1 = -resx/2/zoom - fxrand()*222-222;
                ly1 = (y0 - (resy/2/zoom-poleheight*cos(poletilt)*(cross1+cross2)/2))*scal + ooyl;
            }
            else{
                lx1 = +resx/2/zoom + fxrand()*222+222;
                ly1 = (y0 - (resy/2/zoom-poleheight*cos(poletilt)*(cross1+cross2)/2))*scar - ooyr;
            }
            var wirepointsl = [];
            var wirepointslloose = [];
            var d = dist(x0, y0, lx1, ly1);
            var detail = 2;
            var parts = round(d/detail);
            var maxraise = 90 + fxrand()*400;
            var birdfrq = .005+fxrand()*0.015;
            var bridthr = .6+fxrand()*0.2

            var adaptersize = 10 + 2*fxrand();
            var adaptersl = [];
            for(var part = 0; part < parts; part++){
                var p = map(part, 0, parts-1, 0, 1);
                var env = 1 - pow(abs(p-.5)*2, 2);
                //env = map(part, 0, parts-1, -1, 1);
                //env = abs(Math.cosh(env) - 1. - 1/1.84);
                var raise = env * maxraise;

                var lx = lerp(x0, lx1, p);
                var ly = lerp(y0, ly1, p) + raise + (490-maxraise)/490*21*pow(noise(lx*0.03, aidx), 7);
                wirepointsl.push([lx, ly, 0]);
                
                if(maxraise < 130 && part < adaptersize && part%1==0){
                    // CONNECTION AT THE BEGINNING OF THE WIRE
                    adaptersl.push([lx, ly]);
                }

                birdsize = 4 + 4*fxrand();

                if(fxrand()*1000 < 122 && power(.75*noise(birdfrq*part, 313.313+aidx), 6)>.5){
                    var offx = 12*(-.5+fxrand());
                    var bpx1 = lx;
                    var bpy1 = ly+fxrand()*2+2;
                    var bpx2 = lx+offx;
                    var bpy2 = ly-fxrand()*5-birdsize;
                    var bpw1 = 2+fxrand();
                    var bpw2 = 6+fxrand();
                    var bwx1 = bpx1 + .8*(bpx2-bpx1);
                    var bwy1 = bpy1 + .8*(bpy2-bpy1);
                    var bwx2 = bpx1-(fxrand()*4+4);
                    var bwy2 = bpy1+1;
                    var bqx1 = bpx1 + .8*(bpx2-bpx1);
                    var bqy1 = bpy1 + .8*(bpy2-bpy1);
                    var bqx2 = bpx1+(fxrand()*4+4);
                    var bqy2 = bpy1+1;
                    allpoints.push(getStroke(bpx1, bpy1, bpx2, bpy2, bpw1, bpw2, fxrand()*10000, 1));
                    //allpoints.push(getStroke(bwx1, bwy1, bwx2, bwy2, bpw2, bpw1, fxrand()*10000, 1));
                    //allpoints.push(getStroke(bqx1, bqy1, bqx2, bqy2, bpw2, bpw1, fxrand()*10000, 1));
                    allpoints.push(getStroke(lx-2, ly-(fxrand()*2+birdsize), lx+offx-(fxrand()*9), ly, 3+fxrand(), 2+fxrand(), fxrand()*10000, 1));
                    allpoints.push(getStroke(lx+2, ly-(fxrand()*2+birdsize), lx+offx+(fxrand()*9), ly, 3+fxrand(), 2+fxrand(), fxrand()*10000, 1));
                    
                    if(fxrand() < -.3){
                        var offx = 18*(-.5+fxrand());
                        var rx = map(fxrand(), 0, 1, -100, 100);
                        var ry = map(fxrand(), 0, 1, 30, 100);
                        var birdpoints = getStroke(lx+rx, ly+ry+fxrand()*2+2, lx+rx+offx, ly+ry-fxrand()*5-birdsize, 2+fxrand(), 6+fxrand(), fxrand()*10000, 1);
                        //allpoints.push(birdpoints);
                        var heady = (map(fxrand(), 0, 1, 2, 4));
                        if(fxrand()<.5)
                            heady *= -1;
                        allpoints.push(getStroke(lx+rx, ly+ry-heady, lx+rx+offx-(fxrand()*9), ly+ry, 3+fxrand(), 2+fxrand(), fxrand()*10000, 1));
                        allpoints.push(getStroke(lx+rx, ly+ry-heady, lx+rx+offx+(fxrand()*9), ly+ry, 3+fxrand(), 2+fxrand(), fxrand()*10000, 1));
                    }
                }
            }
                // BIRDS
                
            for(var part = 0; part < parts; part++){
                var p = map(part, 0, parts-1, 0, 1);
                var env = abs(1 - pow(abs(p-.5)*2, 2));
                //env = map(part, 0, parts-1, -1, 1);
                //env = abs(Math.cosh(env) - 1. - 1/1.84);
                var raise = env * maxraise;
    
                if(fxrand()*1000 < -122 && power(.75*noise(birdfrq*part, 313.313+aidx), 6)>.5){
                    var offx = 18*(-.5+fxrand());
                    var birdpoints = getStroke(lx, ly+fxrand()*2+2, lx+offx, ly-fxrand()*5-3, 2+fxrand(), 6+fxrand(), fxrand()*10000, 1);
                    allpoints.push(birdpoints);
                    //allpoints.push(getStroke(lx-2, ly-(fxrand()*2+7), lx+offx-(fxrand()*9), ly, 3+fxrand(), 2+fxrand(), fxrand()*10000, 1));
                    //allpoints.push(getStroke(lx+2, ly-(fxrand()*2+7), lx+offx+(fxrand()*9), ly, 3+fxrand(), 2+fxrand(), fxrand()*10000, 1));
                }
            }

            // LOOSE WIRES
            var looselength = round(20 + fxrand()*22);
            var loosestretch = 20 + fxrand()*120;
            var loosefrq = 0.01 + 0.01*fxrand();
            var bthr1 = .2 + .1*fxrand();
            var bthr2 = .7 + .3*fxrand();
            for(var part = 0; part < parts; part++){
                var p = map(part, 0, parts-1, 0, 1);
                var env = abs(1 - pow(abs(p-.5)*2, 2));
                //env = map(part, 0, parts-1, -1, 1);
                //env = abs(Math.cosh(env) - 1. - 1/1.84);

                var raise = env * maxraise;
                var beginenv = min(map(part, 0, looselength, 0, 1), 1);
                if(beginenv < bthr1){
                    beginenv = map(beginenv, 0, bthr1, 0, 1);
                    beginenv = power(beginenv, 2);
                }
                else{
                    beginenv = map(beginenv, bthr1, 1, 1, 0);
                    beginenv = power(beginenv, 2);
                }
                beginenv *= (1 + 0*(-.5 + power(noise(part, aidx), 3)));
                beginenv *= loosestretch * hasloose;
    
                var lx = lerp(x0, lx1, p);
                var ly = lerp(y0, ly1, p) + raise + (490-maxraise)/490*77*pow(noise(lx*loosefrq, aidx+31.31), 7) + beginenv;
                wirepointslloose.push([lx, ly, 0]);
            }
            alladapters.push(adaptersl);
            allwirepoints.push(wirepointsl);
            if(hasloose)
                allloosewirepoints.push(wirepointslloose);
            else
                allwirepoints.push(wirepointslloose);
        }
    });


    // CYLINDERS
    var hasleft = fxrand() < 1.5;
    var hasright = fxrand() < 1.5;
    var bp0 = fxrand()*0.24 + 0.6;
    var bp1 = bp0 + 0.08 + fxrand()*0.02;
    bp0 = bp0 + (1-zoom)*(1-bp0);
    bp1 = bp1 + (1-zoom)*(1-bp1);
    var bx0 = lerp(polex0, polex1, bp0);
    var by0 = lerp(poley0, poley1, bp0);
    var bx1 = lerp(polex0, polex1, bp1);
    var by1 = lerp(poley0, poley1, bp1);
    var bsc = 1.3 + .4*fxrand();
    var bw0 = lerp(polebottomwidth, poletopwidth, bp0)*bsc;
    var bw1 = lerp(polebottomwidth, poletopwidth, bp1)*bsc;
    var polep0 = createVector(polex0, poley0);
    var polep1 = createVector(polex1, poley1);
    var polev01 = p5.Vector.sub(polep1, polep0);
    polev01.normalize();
    var polepe = polev01.copy();
    polepe.rotate(+PI/2+crosstilt0+2*poletilt);
    polepe.mult(fxrand()*50);
    var oua = .3 + .3*fxrand();
    if(hasright){
        allpoints.push(getStroke(bx0+polepe.x, by0+polepe.y,  bx1+polepe.x, by1+polepe.y, bw0, bw1, fxrand()*10000, .154, 4, .14)); 
        //allpoints.push(getStroke(bx0+polepe.x, by0+polepe.y,  bx1+(bx0-bx1)*oua+polepe.x, by1+(by0-by1)*oua+polepe.y, bw0*1.27, bw1*1.27, fxrand()*10000, .154, 4, .14)); 
    }
    var bcx0 = lerp(polex0, polex1, bp0+(bp1-bp0)*.7);
    var bcy0 = lerp(poley0, poley1, bp0+(bp1-bp0)*.7);
    if(hasright) allpoints.push(getStroke(bcx0, bcy0+(by1-by0)*oua, bcx0+polepe.x, bcy0+polepe.y+33, 12, 12, fxrand()*10000, .5, 4, .14)); 
    
    polepe = polev01.copy();
    polepe.rotate(+PI/2+crosstilt0+2*poletilt);
    polepe.mult(fxrand()*50);
    polepe.rotate(PI);
    var bw0 = lerp(polebottomwidth, poletopwidth, bp0)*bsc;
    var bw1 = lerp(polebottomwidth, poletopwidth, bp1)*bsc;
    var oua = fxrand()*.5*0;
    if(hasleft) allpoints.push(getStroke(bx0+polepe.x, by0+polepe.y, bx1+polepe.x, by1+polepe.y, bw0, bw1, fxrand()*10000, .15, 4, .14));
    var bcx0 = lerp(polex0, polex1, bp0+(bp1-bp0)*.7);
    var bcy0 = lerp(poley0, poley1, bp0+(bp1-bp0)*.7);
    if(hasleft) allpoints.push(getStroke(bcx0, bcy0, bcx0+polepe.x, bcy0+polepe.y+33, 12, 12, fxrand()*10000, .5, 4, .14)); 


    allqcpoints = [];
    if(fxrand() < 1.5){
        var numqc = 5 + round(fxrand()*22);

        var wind = 3.14159/2;
        if(fxrand() < .5)
            wind = -wind;
        var maxdisp0 = 22 + fxrand()*0;
        for(var qqq = 0; qqq < numqc; qqq++){
            var qcpoints = [];
            var maxdisp = maxdisp0;
            if(fxrand() < .05)
                maxdisp *= 2;
            var cccc = [];

            var qp = fxrand()*0.16 ;
            qp = qp + (1-zoom)*(1-qp);
            var bx0 = lerp(polex0, polex1, qp);
            var by0 = lerp(poley0, poley1, qp);
            var bx1 = lerp(polex0, polex1, bp1);
            var by1 = lerp(poley0, poley1, bp1);
            if(qqq == 0){
                bx1 = lerp(polex0, polex1, 1);
                by1 = lerp(poley0, poley1, 1);
            }
            var db = dist(bx0, by0, bx1, by1);
            var dparts = db/40;
            for(var dpa = 0; dpa < dparts; dpa++){
                var bias = 33 * (-.5 + power(noise(dpa*0.1), 6));
                var dp = map(dpa, 0, dparts, 0, 1);
                var env = power(1 - 2*abs(.5-dp), 2);
                env = (env*.75 + .25*pow(dp, 2));
                if(dpa > dparts-6 && dpa < dparts-2){
                    env *= 3;
                }
                var dx = lerp(bx0, bx1, dp) + map(fxrand(), 0, 1, -maxdisp+bias, maxdisp+bias)*env+ 0* (power(noise(dpa*0.1), 6));
                var dy = lerp(by0, by1, dp) + map(fxrand(), 0, 1, -maxdisp+bias, maxdisp+bias)*0;
                if(dpa > dparts-3 && dpa < dparts-1){
                    dy += map(fxrand(), 0, 1, 0, -50);
                    dx += map(fxrand(), 0, 1, -60, 60);
                }
                cccc.push([dx, dy]);
            }

            var segle = 16 + 44*fxrand();
            var current = createVector(bx0, by0);
            var dir = createVector(poledir[0], poledir[1]);
            dir.mult(segle);

            if(qqq%2==0){
                wind *= -1;
            }

            
            //cccc.push([current.x, current.y]); current.add(dir);
            //cccc.push([current.x, current.y]); dir.rotate(wind); dir.mult(.5); current.add(dir);
            //cccc.push([current.x, current.y]); dir.rotate(wind); dir.mult(2);  current.add(dir); 
            //cccc.push([current.x, current.y]); dir.rotate(wind); dir.mult(.5); dir.mult(.95+fxrand()*.05); current.add(dir);  dir.rotate(-wind); dir.mult(fxrand()*.4+.01); current.add(dir);
            //cccc.push([current.x, current.y]); dir.mult(4); current.add(dir);
            //cccc.push([current.x, current.y]);

            var totalle = 0;
            for(var pid = 0; pid < cccc.length-1; pid++){
                totalle += dist(cccc[pid+1][0], cccc[pid+1][1], cccc[pid][0], cccc[pid][1])
            }
            var parts = totalle/2;

            var cps = [];
            var spline = new BSpline(cccc, 3); //making BSpline
            for(var part = 0; part < parts; part++){
                var t = map(part, 0, parts-1, 0, 1);
                var p = spline.calcAt(t); 
                var nzx = 8*(-.5 + power(noise(p[0]*.03, p[1]*.03, 313.31), 3));
                var nzy = 8*(-.5 + power(noise(p[0]*.03, p[1]*.03, 222.31), 3));
                qcpoints.push([p[0]+nzx, p[1]+nzy, 0])
            }

            allqcpoints.push(qcpoints);
        }
    }

    
    // DRAWING
    for(var p = 0; p < allpoints.length; p++){
        const currentpoints = allpoints[p];
        pg.fill(cl2);
        pg.noStroke();
        pg.beginShape(TESS);
        for(var t = 0; t < currentpoints.length; t++){
            var x = currentpoints[t][0];
            var y = currentpoints[t][1];
            pg.vertex(x, y, 0);
        }
        pg.endShape(CLOSE);
    }

    // QC
    for(var p = 0; p < allqcpoints.length; p++){
        const currentpoints = allqcpoints[p];
        pg.stroke(cl2);
        pg.noFill();
        pg.beginShape(TESS);
        pg.strokeWeight(2*pow(fxrand(), 6)*1+3)
        for(var t = 0; t < currentpoints.length; t++){
            var x = currentpoints[t][0];
            var y = currentpoints[t][1];
            pg.vertex(x, y, 0);
        }
        pg.endShape();

        for(var t = 0; t < currentpoints.length-1; t++){
            var x = currentpoints[t][0];
            var y = currentpoints[t][1];
            if(fxrand() < .041){
                //pg.ellipse(x, y, 2+fxrand()*4, fxrand()*2);
                //pg.ellipse(x+2, y, 2+fxrand()*4, fxrand()*1);
            }
        }
    }

    // DRAWIN WIRES
    for(var p = 0; p < allwirepoints.length; p++){
        const currentpoints = allwirepoints[p];
        pg.stroke(cl2);
        pg.noFill();
        pg.beginShape(TESS);
        pg.strokeWeight(2*pow(fxrand(), 6)*1+3)
        for(var t = 0; t < currentpoints.length; t++){
            var x = currentpoints[t][0];
            var y = currentpoints[t][1];
            pg.vertex(x, y, 0);
        }
        pg.endShape();

        pg.fill(cl2);
        pg.noStroke();
        for(var t = 0; t < currentpoints.length-1; t++){
            var x = currentpoints[t][0];
            var y = currentpoints[t][1];
            if(fxrand() < .021){
                var x1 = currentpoints[t+1][0];
                var y1 = currentpoints[t+1][1];
                var an = atan2(y1-y, x1-x);
                pg.push();
                pg.translate(x, y);
                pg.rotate(an);
                pg.ellipse(0, 0, 12+fxrand()*3, fxrand()*2+1);
                pg.ellipse(0+fxrand()*2-4, 0, 12+fxrand()*3, fxrand()*1+1);
                pg.pop();
            }
        }
    }
    
    for(var p = 0; p < allloosewirepoints.length; p++){
        const currentpoints = allloosewirepoints[p];
        pg.stroke(cl2);
        pg.noFill();
        pg.beginShape(TESS);
        pg.strokeWeight(3*pow(fxrand(), 6)*1+5)
        for(var t = 0; t < currentpoints.length; t++){
            var x = currentpoints[t][0];
            var y = currentpoints[t][1];
            pg.vertex(x, y, 0);
        }
        pg.endShape();

        pg.fill(cl2);
        pg.noStroke();
        for(var t = 0; t < currentpoints.length-1; t++){
            var x = currentpoints[t][0];
            var y = currentpoints[t][1];
            if(fxrand() < .021){
                var x1 = currentpoints[t+1][0];
                var y1 = currentpoints[t+1][1];
                var an = atan2(y1-y, x1-x);
                pg.push();
                pg.translate(x, y);
                pg.rotate(an);
                pg.ellipse(0, 0, 12+fxrand()*3, fxrand()*2+1);
                pg.ellipse(0+fxrand()*2-4, 0, 12+fxrand()*3, fxrand()*1+1);
                pg.pop();
            }
        }
    }

    // NEST
    if(crossorigins.length > 0 && fxrand() < .2){
        pg.stroke(cl2);
        pg.strokeWeight(2*pow(fxrand(), 6)*1+3)
        pg.noFill();
        for(var kk = 0; kk < 1; kk++){
            var ro = floor(fxrand()*crossorigins.length)
            var cx = crossorigins[ro][0];
            var cy = crossorigins[ro][1];
            pg.push();
            pg.translate(cx, cy);
            pg.rotate(poletilt)
            var nradius = 80+27*fxrand();
            var scan = .35*zoom;
            var nestside = fxrand() < .5;
            var heightstretch = 1.3 + .6*fxrand();
            var widthsqueeze = 1.7 + 1*fxrand();
            var notattop = cy > (poley1 + 50);
            for(var ny = 0; ny < 8; ny++){
                var offy = -ny*5;
                var rsca = map(ny, 0, 3, 0, 1) * zoom;
                rsca = pow(rsca, .5);
                rsca = map(rsca, 0, 1, .6, 1);
                for(var k = 0; k < 35*zoom; k++){
                    var a1 = radians(map(fxrand(), 0, 1, 0, 360));
                    var a2 = a1 + radians(map(fxrand(), 0, 1, 44, 70));
                    var raddp = fxrand();
                    var radd = rsca * map(raddp, 0, 1, nradius*.3, nradius);
                    var x1 = radd * cos(a1);
                    var y1 = radd * sin(a1) * .3 + fxrand()*16 + offy;
                    var x2 = radd * cos(a2);
                    var y2 = radd * sin(a2) * .3 + fxrand()*16 + offy;
                    var d = dist(x1,y1,x2,y2);
                    var parts = 2 + round(d/20);
                    pg.beginShape();
                    for(var pa = 0; pa < parts; pa++){
                        var ppa = map(pa, 0, parts-1, 0, 1);
                        var xx = lerp(x1, x2, ppa)+5*0.5*(fxrand()*5-2.5);
                        var yy = lerp(y1, y2, ppa)+5*0.9*(fxrand()*5-2.5);
                        if((nestside && xx<0 || !nestside && xx>0) && notattop){
                           xx /= widthsqueeze; 
                           yy *= heightstretch; 
                        }
                        pg.vertex(xx*scan, yy*scan);
                    }
                    pg.endShape();
                }
            }
            pg.pop();
        }
    }

    // ADAPTERS
    pg.fill(cl2);
    pg.noStroke();
    for(var oo = 0; oo < alladapters.length; oo++){
        var adapters = alladapters[oo];
        var ah = 6 + 2*fxrand();
        var change = round((.1+fxrand()*.5)*adapters.length);
        var atilt = -.2 + .4*fxrand();
        for(var k = 0; k < adapters.length; k++){
            var alt = .5 + (k%2) * .5;
            var apx = adapters[k][0];
            var apy = adapters[k][1];
            if(k == change)
                ah = ah*.6;
            pg.push();
            pg.translate(apx, apy);
            pg.rotate(atilt);
            pg.ellipse(0, 0, 3+fxrand()*2, ah*alt*(1.1 + 1.*power(noise(k*.1, oo), 3))+fxrand()*1);
            pg.pop();
        }
    }
    pg.pop();

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
    blurH.setUniform('amp', .13);
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
    effect.setUniform('incolor', [random(.99, 1.), random(.99, 1.), .99, 1.]);
    effect.setUniform('seed', globalseed);
    effect.setUniform('noiseamp', mouseX/width*0+1);
    effect.setUniform('hasmargin', hasmargin);
    effectpass.shader(effect);
    effectpass.quad(-1,-1,1,-1,1,1,-1,1);
  
    // draw the second pass to the screen
    //image(effectpass, 0, 0, mm-18, mm-18);
    var xx = 0;
    if(mouseX > width/2)
        image(effectpass, 0, 0, mm*resx/resy-xx, mm-xx);
    else
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
    resizeCanvas(mm*resx/resy, mm);
    showall();
}

function power(p, g) {
    if (p < 0.5)
        return 0.5 * pow(2*p, g);
    else
        return 1 - 0.5 * pow(2*(1 - p), g);
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