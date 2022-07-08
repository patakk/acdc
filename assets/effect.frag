precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform vec3 tintColor;
uniform vec3 tintColor2;
uniform vec4 incolor;
uniform float u_time;
uniform float u_usemask;
uniform float noiseamp;
uniform float seed;
uniform float hasmargin;
uniform sampler2D tex0;
uniform sampler2D tex1;
uniform sampler2D tex2;
uniform sampler2D tex3;
varying vec2 vTexCoord;

float randomNoise(vec2 p) {
  return fract(16791.414*sin(7.*p.x+p.y*73.41));
}

float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float noise3 (in vec2 _st, in float t) {
    vec2 i = floor(_st+t);
    vec2 f = fract(_st+t);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

#define NUM_OCTAVES 5

float fbm ( in vec2 _st) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(_st);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}

float fbm3 ( in vec2 _st, in float t) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    // Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5),
                    -sin(0.5), cos(0.50));
    for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise3(_st, t);
        _st = rot * _st * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}


float fff(vec2 st, float seed){

    vec2 q = vec2(0.);
    q.x = fbm3( st + 0.1, seed*.11);
    q.y = fbm3( st + vec2(1.0), seed*.11);
    vec2 r = vec2(0.);
    r.x = fbm3( st + 1.0*q + vec2(1.7,9.2)+ 0.15*seed*0.11, seed*.11);
    r.y = fbm3( st + 1.0*q + vec2(8.3,2.8)+ 0.126*seed*0.11, seed*.11);
    float f = fbm3(st+r, seed*.11);
    float ff = (f*f*f+0.120*f*f+.5*f);

    return ff;
}

void main() {
    vec2 uv = gl_FragCoord.xy/u_resolution.xy;
    vec2 st = uv*vec2(3.2, 13.)*195.64;
    uv = uv/2.;
    uv.y = 1. - uv.y;

    vec4 mask0 = texture2D(tex2, uv);
    vec4 maskb0 = mask0;
    vec4 mask = mask0 * u_usemask + vec4(1.) * (1.-u_usemask);
    vec4 maskb = mask;
    if(maskb.r > 0.0){
        maskb.rgb = vec3(1.);
    }
    if(maskb0.r > 0.0){
        maskb0.rgb = vec3(1.);
    }
    vec2 uv0 = uv;
    uv = uv + vec2(0.*54.)/u_resolution*vec2(-.5 + randomNoise(seed*.03+mask.rg), -.5 + randomNoise(seed*.03+mask.rg+.314));

    //st += st * abs(sin(u_time*0.002)*3.0);
    vec3 color = vec3(0.0);

    vec2 q = vec2(0.);
    q.x = fbm3( st + 0.1, u_time*0.*.08);
    q.y = fbm3( st + vec2(1.0), u_time*0.*.08);

    vec2 r = vec2(0.);
    r.x = fbm3( st + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time*0., u_time*0.*.08);
    r.y = fbm3( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time*0., u_time*0.*.08);

    float f = fbm3(st+r, u_time*.08);

    color = mix(vec3(0.101961,0.619608,0.666667),
                vec3(0.666667,0.666667,0.498039),
                clamp((f*f)*4.0,0.0,1.0));

    color = mix(color,
                vec3(0,0,0.164706),
                clamp(length(q),0.0,1.0));

    color = mix(color,
                vec3(0.666667,1,1),
                clamp(length(r.x),0.0,1.0));

    float ff = (f*f*f+0.120*f*f+.5*f);
    ff = 1.*ff;
    ff *= .002;
    
    vec2 uvr = uv - vec2(1., 0.)/u_resolution*.7*0.;
    vec2 uvg = uv;
    vec2 uvb = uv + vec2(1., 0.)/u_resolution*.7*0.;
    
    vec2 uvrd = uv - 1.61*ff*vec2(1., 0.) + 0.*333.5*ff*vec2(1., 0.)/u_resolution*2.;
    vec2 uvgd = uv - 1.61*ff*vec2(1., 0.) + 0.*ff*vec2(1., 0.)/u_resolution*2.;
    vec2 uvbd = uv - 1.61*ff*vec2(1., 0.) - 0.*333.5*ff*vec2(1., 0.)/u_resolution*2.;

    float cr = texture2D(tex0, uvr+vec2(6.,0.)/u_resolution).r;
    float cg = texture2D(tex0, uvg+vec2(6.,0.)/u_resolution).g;
    float cb = texture2D(tex0, uvb+vec2(6.,0.)/u_resolution).b;
    vec4 imgc = vec4(cr, cg, cb, 1.0);
    vec4 imgg = texture2D(tex1, uv);
    
    vec4 bgpg = texture2D(tex3, uv);

    float crd = texture2D(tex1, uvrd).r;
    float cgd = texture2D(tex1, uvgd).g;
    float cbd = texture2D(tex1, uvbd).b;
    vec4 imgd = vec4(crd, cgd, cbd, 1.0);
    //imgd.gb *= 0.;
    //imgd.r = 1. - imgd.r;

    float rndm = randomNoise(uv+seed/100000.+u_time*.000+fbm(uv));
    float p = 0.5;
    //vec4 outc = imgc*p + (1.-p)*imgd;
    vec4 outc = (1. - (1. - imgd)*imgc);
    outc = 1. - (1.-imgc)*(1.-imgd);
    outc = 1. - (1.-imgd)*(1.-imgg);

    float pp = ff*14.;
    //outc = pp*imgc + (1.-pp)*imgg;
    //outc.rgb = vec3(pp);
    outc = (imgd*.75 + imgg*.25) + .55*(-.5 + rndm);

    float bluem = pow((1.-imgd.r)*imgc.r, 3.);
    bluem = smoothstep(0.0, 0.16, bluem);
    vec4 blue = bluem*vec4(0., .0, 0.98, 1.);

    outc = blue*bluem + imgd*(1.-bluem) + .15*(-.5 + rndm);
    ff = smoothstep(0.001, 0.004, ff);
    outc = (.35 + .65*imgg)*imgd + .2427*(-.116+smoothstep(.4, .6, rndm));
    outc = imgc*.55 + imgd*.45;
    outc = (imgg*.66+(1.-.66)*imgd);
    outc = min(outc, 1.);
    if(imgc.r > .7){
        //imgc.rgb = vec3(.7 - .7*smoothstep(.7, .9, imgc.r));
    }
    else if(imgc.r < .5){
        //imgc.rgb = vec3(smoothstep(.4, .5, imgc.r));
    }
    //imgc.rgb = vec3(imgc.r+imgc.g+imgc.b)/3.;
    //outc = imgg + .2*vec4(imgc.r*1.2, imgc.r*.7, 0., 0.0) + .2427*(-.116+smoothstep(.4, .6, rndm));
    //outc = imgg + .2427*(-.116+smoothstep(.4, .6, rndm));

    float mr = -0.018;
    if(uv.x > mr && uv.x < (1.-mr) && uv.y > mr && uv.y < (1.-mr) ){
        //outc = 1. - outc;
        //outc.r *= .51;
        //outc.g *= .98;
    }
    else{
        //outc = outc*0. + .1;
    }


    float np = 1.;
    float edgesharpness = 0.98; // maximum is 1.
    edgesharpness = min(edgesharpness, 1.);
    if(hasmargin > 0.01){
        //if(uv.x < marg2) np *= smoothstep(marg2*edgesharpness, marg2, uv.x);
        //if(uv.y < marg2*u_resolution.x/u_resolution.y) np *= smoothstep(marg2*u_resolution.x/u_resolution.y*edgesharpness, marg2*u_resolution.x/u_resolution.y, uv.y);
        //if(uv.x > 1.-marg2) np *= smoothstep(1.-marg2*edgesharpness, 1.-marg2, uv.x);
        //if(uv.y > 1.-marg2*u_resolution.x/u_resolution.y) np *= smoothstep(1.-marg2*u_resolution.x/u_resolution.y*edgesharpness, 1.-marg2*u_resolution.x/u_resolution.y, uv.y);
    }
    np = 1. - np;
    outc = outc + np*(1. - outc - outc);

    outc = bgpg*(1.-maskb.r) + outc*maskb.r;
    outc.r = max(0., min(1., outc.r + .05*(-1.+2.*uv.y)));
    outc.g = max(0., min(1., outc.g + .05*(-1.+2.*uv.y)));
    outc.b = max(0., min(1., outc.b + .05*(-1.+2.*uv.y)));
    
    float marg1 = 10./u_resolution.x;
    float marg2 = .05 + .0021*(-.5 + fff(uv*82.1 + 281.3131,seed+25.61 ));
    if(uv0.x < marg1 || uv0.x > 1.-marg1 || uv0.y < marg1 || uv0.y > 1.-marg1){
        outc = vec4(.0);
    }
    if(hasmargin > 0.01){
        //outc.rgb = (1.-pow(1.-uv.y,1.))*outc.rgb * (outc.r * (1.-pow(1.-uv.y,1.)*.5)) * tintColor2 + (1.-uv.y)*outc.rgb * (outc.r * (1.-pow(1.-uv.y,3.)*.8)) * tintColor;
    }

    vec4 aaaa = texture2D(tex0, uv + vec2(3.,0.)/u_resolution);
    float bv = 1. -smoothstep(.1, .7, aaaa.r);
    vec3 bvr = bv * vec3(0., 0., 0.) + (1.-bv)*tintColor;
    //outc.rgb += bvr*.4;


    float salt = randomNoise(uv+seed/1000000.+.3143+u_time*.0000+fbm(uv)*.02);
    salt = .3*(-.15 + smoothstep(.96, .999, salt));
    outc = .026 + outc*(.97 - .026);
    outc.rgb += salt;
    
    float ssalt = randomNoise(uv+seed/1000000.+4.3+.3143+u_time*.0000+fbm(uv)*.02);
    ssalt = .06*(smoothstep(.5, .999, ssalt));
    outc.rgb += ssalt;
    
    float pepper = randomNoise(uv+seed/1000000.+1.3+.3143+u_time*.0000+fbm(uv)*.02);
    pepper = .06*(smoothstep(.5, .999, pepper));
    outc.rgb -= pepper;

    if(hasmargin > 0.4){
        outc = outc*noiseamp + (1.-noiseamp)*imgg;
    }
    else{
        outc = outc*noiseamp + (1.-noiseamp)*imgg;
    }   
     //outc.b *= 0.995;
    //outc = (.5 + .5*imgg)*imgd*imgd*imgd*imgd + .17*smoothstep(.12, .13, fff(uv*2612., seed+55.631));
    outc.a = 1.0;

    //imgc.r = smoothstep(.4, .7, imgc.r);
    //imgc.g = smoothstep(.4, .7, imgc.g);
    //imgc.b = smoothstep(.4, .7, imgc.b);
    //outc = outc + 0.2*imgc;

    float ff22 = smoothstep(.1, .3, fbm3(uv*vec2(2., 4.)+seed*.01, 1.*.08+1.));
    outc = 1. - (1. - outc) * (1. - imgc*.21);
    
    gl_FragColor = vec4(outc.rgb, 1.);
    //gl_FragColor = vec4(vec3(ff22),1.);
    //gl_FragColor = vec4(1.,0.,0.,1.);
}