from pathlib import Path
import random, math
random.seed(34)
P=Path(__file__).parent/'assets'; P.mkdir(exist_ok=True)

def rect(x,y,w,h,fill,more=''):
 return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" {more}/>'
def path(d,fill,more=''):
 return f'<path d="{d}" fill="{fill}" {more}/>'
def ellipse(x,y,rx,ry,fill,more=''):
 return f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="{fill}" {more}/>'
def line(x1,y1,x2,y2,c,w=2):
 return f'<path d="M{x1} {y1}L{x2} {y2}" fill="none" stroke="{c}" stroke-width="{w}"/>'

def frame(x,y,w=120,h=150,portrait=True):
 s=rect(x-9,y-9,w+18,h+18,'#503627', 'rx="2" stroke="#b28a54" stroke-width="3"') +rect(x,y,w,h,'#957d5c')
 s+=rect(x+7,y+7,w-14,h-14,'url(#painting)')
 if portrait:
  s+=ellipse(x+w*.53,y+h*.42,w*.19,h*.23,'#776451')+path(f'M{x+15} {y+h-8}Q{x+24} {y+h*.57} {x+w*.52} {y+h*.65}Q{x+w-10} {y+h*.57} {x+w-8} {y+h-8}Z','#3d433e')
 else:
  s+=path(f'M{x+5} {y+h-10}l{w*.33} {-h*.43}l{w*.14} {h*.17}l{w*.23} {-h*.29}l{w*.27} {h*.55}Z','#3f514c')
 return s

def door(x,y=190,w=215,h=520,kind='door',open=False):
 s=rect(x-14,y-12,w+28,h+24,'#35241c','stroke="#916c4d" stroke-width="7"')
 s+=rect(x,y,w,h,'url(#wood)' if kind!='white' else 'url(#whiteDoor)','stroke="#1e1513" stroke-width="3"')
 for ry,rh in [(32,190),(261,215)]:
  s+=rect(x+20,y+ry,w-40,rh,'none','stroke="#aa8660" stroke-opacity=".42" stroke-width="6"')
 s+=ellipse(x+w-32,y+h*.56,10,10,'#dfb46a')+ellipse(x+w-32,y+h*.56,5,5,'#5b3b20')
 if open:
  s+=path(f'M{x+20} {y+6}L{x+w-25} {y+32}L{x+w-25} {y+h-18}L{x+20} {y+h-5}Z','#0a0e15','opacity=".8"')
 return s

def window(x,y=110,w=290,h=330,night=True):
 s=rect(x-13,y-12,w+26,h+30,'#50392b','stroke="#bd8b57" stroke-width="8"')
 s+=rect(x,y,w,h,'url(#outside)' if night else '#6b7480')
 for i in range(6):
  xp=x+((i*67+23)%w)
  s+=path(f'M{xp} {y+h-10}l{8*(i%3-1)} {-75-i%3*36}m-24 54l24 -12l22 16','none','stroke="#1b232e" stroke-width="4" opacity=".6"')
 for i in range(65):
  xp=x+random.uniform(6,w-6); yp=y+random.uniform(4,h-8)
  s+=line(round(xp,1),round(yp,1),round(xp+random.uniform(-2,2),1),round(yp+random.uniform(5,17),1),'#a8bed1',random.choice([.6,.8,1.2]))
 s+=rect(x+w/2-5,y,10,h,'#b59a7a')+rect(x,y+h*.49,w,10,'#b59a7a')
 s+=path(f'M{x-5} {y-5}Q{x+40} {y+30} {x+32} {y+h}L{x-5} {y+h}Z','#c8a895','opacity=".32"')
 s+=path(f'M{x+w+5} {y-5}Q{x+w-40} {y+30} {x+w-32} {y+h}L{x+w+5} {y+h}Z','#c8a895','opacity=".32"')
 s+=rect(x-14,y+h,w+28,15,'url(#whiteDoor)')
 return s

def lamp(x,y,scale=1):
 return f'<g transform="translate({x} {y}) scale({scale})">'+ellipse(0,14,78,75,'#ffa044','opacity=".12"')+rect(-5,0,10,135,'#8f6849')+ellipse(0,0,22,6,'#886141')+path('M-58 0L-33 -90Q0 -106 33 -90L58 0Z','url(#lampshade)','stroke="#cda779" stroke-width="4"')+ellipse(0,-7,38,4,'#e6b27b','opacity=".7"')+'</g>'

def sofa(x,y=490):
 s=ellipse(x+200,y+250,260,40,'#080a11','opacity=".45"')
 s+=rect(x,y+48,407,160,'url(#fabric)','rx="38" stroke="#6e443c" stroke-width="8"')
 s+=rect(x-15,y+140,439,94,'#735449','rx="28" stroke="#9d7964" stroke-width="8"')
 s+=rect(x+16,y+228,25,32,'#3c211c')+rect(x+359,y+228,25,32,'#3c211c')
 for i in range(3):
  s+=rect(x+20+i*128,y+65,115,114,'#8f6858','rx="24" stroke="#ad8570" stroke-width="5"')
  s+=path(f'M{x+30+i*128} {y+86}l85 81m-85 0l85 -81','none','stroke="#ad8b7b" stroke-width="2" opacity=".32"')
 return s

def television(x,y=330):
 s=rect(x,y,245,245,'#241e1c','rx="19" stroke="#5b4d3c" stroke-width="15"')
 s+=rect(x+17,y+17,185,184,'url(#tvNoise)','rx="12" stroke="#63574b" stroke-width="9"')
 s+=ellipse(x+216,y+55,12,12,'#918272')+ellipse(x+217,y+93,12,12,'#5d4f49')
 s+=rect(x-30,y+244,315,50,'#4a3328')+rect(x-15,y+294,280,90,'#392820')
 for i in range(6): s+=line(x+24,y+28+i*27,x+183,y+30+i*27,'#c4d0cb',1)
 return s

def cabinet(x,y=90):
 s=rect(x,y,330,350,'url(#wood)','stroke="#a5784d" stroke-width="8"')
 for i in range(2):
  s+=rect(x+14+i*157,y+14,146,320,'#503326','stroke="#9a734e" stroke-width="7"')
  s+=ellipse(x+128+i*52,y+172,5,7,'#e6bf74')
 return s

def counter(x,y=450):
 s=rect(x,y,600,250,'url(#wood)','stroke="#66432d" stroke-width="7"')
 for i in range(4):
  s+=rect(x+17+i*147,y+22,130,194,'none','stroke="#a57b4f" stroke-width="6"')+ellipse(x+105+i*147,y+103,5,6,'#dbb875')
 s+=rect(x-12,y-16,625,34,'#b4a18e','stroke="#d4c8b0" stroke-width="7"')
 return s

def plant(x,y=545,scale=1):
 s=f'<g transform="translate({x} {y}) scale({scale})">'+path('M-38 20L-27 88Q0 115 27 88L38 20Z','#8f5a42')
 for i in range(8):
  ang=random.uniform(-2,2); dx=int(math.sin(ang)*65); dy=random.randint(-120,-30)
  s+=path(f'M0 20Q{dx//2} {dy//2} {dx} {dy}','none','stroke="#415642" stroke-width="5"')+ellipse(dx,dy,23,13,'#3d5942',f'transform="rotate({int(ang*45)} {dx} {dy})"')
 return s+'</g>'

def bed(x,y=415):
 s=rect(x-20,y+140,480,165,'#634a3e','rx="8"')+rect(x+16,y+140,450,145,'url(#fabric)','rx="25" stroke="#bea58f" stroke-width="9"')
 s+=rect(x-20,y-75,38,380,'#7d5940','rx="9"')+rect(x+417,y-75,38,380,'#7d5940','rx="9"')
 s+=path(f'M{x} {y+122}Q{x+205} {y+55} {x+440} {y+122}L{x+440} {y+245}H{x}Z','#9e8d86','opacity=".8"')
 for i in range(2): s+=rect(x+28+i*201,y+85,169,69,'#e9d7bb','rx="17"')
 return s

def stair(x,y=235):
 s=path(f'M{x} {y+470}L{x+430} {y+470}L{x+350} {y-28}L{x+180} {y-28}Z','#100f12')
 for i in range(10):
  yy=y+440-i*41; xa=x+i*13; xb=x+427-i*16
  s+=path(f'M{xa} {yy}L{xb} {yy}l-8 -14H{xa+4}Z','#634a3a','stroke="#9f7453" stroke-width="3"')
 return s

def washer(x,y=405):
 s=rect(x,y,240,290,'url(#whiteDoor)','rx="8" stroke="#5f6669" stroke-width="7"')+rect(x+15,y+17,210,39,'#aea9a1')
 for i in range(5): s+=ellipse(x+35+i*40,y+34,9,9,'#c6c2bb','stroke="#74736f" stroke-width="3"')
 s+=ellipse(x+121,y+173,92,92,'#565f69','stroke="#d1cbc1" stroke-width="16"')+ellipse(x+121,y+173,66,66,'#1d2731','stroke="#b0babd" stroke-width="5"')
 return s

def utility(x,y=245):
 s=rect(x,y,215,290,'#777874','rx="4" stroke="#c0b7a6" stroke-width="6"')
 for i in range(4):
  for j in range(3): s+=rect(x+19+i*48,y+22+j*75,32,55,'#3f4343','stroke="#b8b0a6" stroke-width="2"')
 s+=rect(x+72,y+318,14,170,'#5c5145')
 return s

def dining(x,y=510):
 s=ellipse(x+215,y+155,300,44,'#090912','opacity=".45"')+path(f'M{x-60} {y}H{x+500}L{x+445} {y+62}H{x-30}Z','#6d4430','stroke="#aa7f59" stroke-width="9"')
 for dx in [9,403]:s+=rect(x+dx,y+57,24,128,'#563827')
 for dx in [0,385]:s+=rect(x+dx,y-110,83,140,'#6c4937','rx="14" stroke="#997051" stroke-width="8"')
 return s

def porch(x,y=280):
 s=rect(x+100,y+270,610,180,'#2c2932','stroke="#aaa6a0" stroke-width="10"')
 s+=path(f'M{x+42} {y+70}L{x+750} {y+70}L{x+710} {y+270}L{x+90} {y+270}Z','#474146')
 s+=door(x+297,y+80,187,235)
 return s

def garage(x,y=185):
 s=rect(x,y,520,510,'#4a433d','stroke="#7b6b5c" stroke-width="12"')
 for i in range(8):
  s+=rect(x+16,y+20+i*59,490,47,'#5e5852','stroke="#8b8171" stroke-width="4"')
 return s

def scene(room, seed):
 random.seed(seed); W=3200; H=900
 outdoor=room in ['yard','porch','garage']
 ground='url(#ground)' if outdoor else 'url(#floor)'
 wall={'living':'#544036','foyer':'#534239','kitchen':'#55443c','dining':'#503b36','hall':'#39404d','evelyn':'#584640','parents':'#4b3b35','bathroom':'#4b565a','basement':'#3d3935','yard':'#17202b','garage':'#403c37','porch':'#293139'}[room]
 s=f'''<svg xmlns="http://www.w3.org/2000/svg" width="3200" height="900" viewBox="0 0 3200 900"><defs>
 <linearGradient id="wall" x2="0" y2="1"><stop stop-color="#10111b"/><stop offset=".16" stop-color="{wall}"/><stop offset=".75" stop-color="{wall}"/><stop offset="1" stop-color="#211c1e"/></linearGradient>
 <linearGradient id="floor" x2="0" y2="1"><stop stop-color="#3a2921"/><stop offset="1" stop-color="#100c0e"/></linearGradient>
 <linearGradient id="ground" x2="0" y2="1"><stop stop-color="#202833"/><stop offset="1" stop-color="#090e15"/></linearGradient>
 <linearGradient id="wood" x2="0" y2="1"><stop stop-color="#7f5740"/><stop offset=".56" stop-color="#533627"/><stop offset="1" stop-color="#30201b"/></linearGradient>
 <linearGradient id="whiteDoor" x2="0" y2="1"><stop stop-color="#dbcbaf"/><stop offset="1" stop-color="#796955"/></linearGradient>
 <linearGradient id="painting" x2=".2" y2="0" x1="0" y1="1"><stop stop-color="#8a775a"/><stop offset="1" stop-color="#283d44"/></linearGradient>
 <linearGradient id="outside" x2="0" y2="1"><stop stop-color="#192739"/><stop offset="1" stop-color="#080d18"/></linearGradient>
 <linearGradient id="fabric" x2="0" y2="1"><stop stop-color="#b28b76"/><stop offset="1" stop-color="#655047"/></linearGradient>
 <linearGradient id="lampshade" x2="0" y2="1"><stop stop-color="#ffe2a2"/><stop offset="1" stop-color="#a9653c"/></linearGradient>
 <radialGradient id="tvNoise"><stop stop-color="#9eaeb3"/><stop offset=".7" stop-color="#39424b"/><stop offset="1" stop-color="#0b1118"/></radialGradient>
 <radialGradient id="vignette"><stop offset=".60" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".67"/></radialGradient>
 <pattern id="paper" width="78" height="98" patternUnits="userSpaceOnUse"><path d="M36 6q-10 31 5 55m-5-28q-30 2-18-19m19 40q25-15 26-28" stroke="#d0a98b" stroke-opacity=".1" stroke-width="2" fill="none"/><circle cx="35" cy="16" r="5" fill="#b4857a" fill-opacity=".17"/><circle cx="18" cy="38" r="4" fill="#b4857a" fill-opacity=".10"/></pattern>
 <filter id="grain"><feTurbulence baseFrequency=".34" numOctaves="2" stitchTiles="stitch" seed="8"/></filter>
 <filter id="glow"><feGaussianBlur stdDeviation="17"/></filter>
 </defs>'''
 if outdoor:
  s+=rect(0,0,W,H,'url(#outside)')
  for x in range(-20,3300,58):
   h=random.randint(120,560)
   s+=path(f'M{x} 620l{random.randint(-35,20)} -{h}m-26 {h//2}l28 -50l35 -30m-50 60l-42 -48','none','stroke="#101925" stroke-width="15" opacity=".8"')
  s+=rect(0,590,W,310,'url(#ground)')
 else:
  s+=rect(0,0,W,690,'url(#wall)')+rect(0,0,W,690,'url(#paper)')
  s+=rect(0,0,W,37,'#211c1d')+rect(0,33,W,18,'#9b7452','opacity=".45"')
  s+=rect(0,685,W,215,'url(#floor)')+rect(0,677,W,14,'#c0a17c','opacity=".6"')
  for i in range(19):
   y=695+i*11
   s+=line(0,y,3200,y,'#967151',1)
  for x in range(0,3400,164):
   s+=path(f'M{x} 690L{x+random.randint(-120,130)} 900','none','stroke="#8f6545" stroke-width="2" opacity=".28"')
 for base in [0,800,1600,2400]:
  s+=rect(base+794,60,9,610,'#a48d73','opacity=".22"')
  if outdoor:
   s+=window(base+175,160,290,275)
   s+=path(f'M{base+35} 700L{base+120} 550L{base+350} 550L{base+430} 700','none','stroke="#49505a" stroke-width="16"')
  elif room=='living':
   if base==0: s+=window(base+85,130,290,305)+sofa(base+364,490)+lamp(base+76,485,.7)
   if base==800:s+=television(base+290,255)+cabinet(base+5,150)+plant(base+665,530,.72)
   if base==1600:s+=door(base+255,175,210,500)+frame(base+60,210,105,135)+lamp(base+580,495,.7)
   if base==2400:s+=window(base+380,115,285,305)+sofa(base+15,510)+frame(base+690,240,90,110)
  elif room=='foyer':
   if base==0:s+=door(base+300,165,220,520)+plant(base+95,530,.7)+plant(base+630,530,.7)
   if base==800:s+=stair(base+170,240)
   if base==1600:s+=cabinet(base+100,210)+frame(base+510,210,170,220)
   if base==2400:s+=window(base+260,150,300,330)+frame(base+35,220)
  elif room=='kitchen':
   if base==0:s+=window(base+145,110,310,307)+counter(base+85,485)+plant(base+600,480,.65)
   if base==800:s+=door(base+320,182,212,520,'white')+cabinet(base+14,115)
   if base==1600:s+=counter(base+55,485)+cabinet(base+40,105)+cabinet(base+390,105)
   if base==2400:s+=door(base+130,202,215,490)+window(base+458,160,250,260)
  elif room=='dining':
   if base==0:s+=dining(base+130,510)+frame(base+385,175,160,210)
   if base==800:s+=window(base+180,120,380,340)+plant(base+635,510,.7)
   if base==1600:s+=cabinet(base+48,240)+frame(base+470,200,195,240)
   if base==2400:s+=dining(base+90,535)+lamp(base+555,485,.65)
  elif room=='hall':
   if base==0:s+=door(base+260,190,210,500)+frame(base+65,205,116,164)
   if base==800:s+=door(base+110,210,200,480)+door(base+490,210,200,480)
   if base==1600:s+=window(base+235,155,330,330)+plant(base+600,540,.66)
   if base==2400:s+=door(base+258,190,210,500)+frame(base+550,217)
  elif room=='evelyn':
   if base==0:s+=bed(base+165,398)+lamp(base+680,515,.75)
   if base==800:s+=window(base+170,132,360,320)+frame(base+15,192,100,145)+frame(base+625,175,105,155)
   if base==1600:s+=cabinet(base+105,220)+frame(base+525,210,140,180)
   if base==2400:s+=door(base+100,200,198,485)+bed(base+348,485)
  elif room=='parents':
   if base==0:s+=bed(base+185,420)
   if base==800:s+=window(base+190,150,350,300)+lamp(base+625,500,.75)
   if base==1600:s+=cabinet(base+100,260)+frame(base+520,170,144,185)
   if base==2400:s+=door(base+268,190,203,500)
  elif room=='bathroom':
   if base==0:s+=rect(base+136,172,345,350,'#36434a','stroke="#bfac93" stroke-width="19"')+rect(base+80,575,480,100,'#dad0b6','rx="20"')
   if base==800:s+=door(base+290,190,214,490,'white')
   if base==1600:s+=window(base+170,160,370,303)+rect(base+155,537,400,130,'url(#whiteDoor)')
   if base==2400:s+=cabinet(base+130,248)
  elif room=='basement':
   if base==0:s+=stair(base+75,245)+rect(base+550,310,194,320,'#242222','stroke="#635849" stroke-width="10"')
   if base==800:s+=washer(base+75,395)+washer(base+346,390)+utility(base+608,300)
   if base==1600:s+=utility(base+75,235)+cabinet(base+367,270)
   if base==2400:s+=door(base+85,200,210,500)+rect(base+410,340,345,335,'#2c2420','stroke="#705745" stroke-width="8"')
  elif room=='garage':
   if base==0:s+=garage(base+120,170)
   if base==800:s+=cabinet(base+115,340)+door(base+530,205,220,485)
   if base==1600:s+=garage(base+90,185)
   if base==2400:s+=garage(base+190,190)
  elif room=='porch':
   if base==0:s+=porch(base,200)
   if base==800:s+=window(base+155,200,300,265)
   if base==1600:s+=door(base+245,190,220,510)
   if base==2400:s+=window(base+340,160,320,330)
  elif room=='yard':
   if base==0:s+=porch(base-80,200)
   if base==800:s+=path(f'M{base+70} 660L{base+680} 660L{base+680} 310L{base+70} 310Z','#292e2e','stroke="#655f55" stroke-width="16"')+door(base+260,310,210,360)
   if base==1600:s+=garage(base+120,215)
   if base==2400:s+=window(base+190,195,330,320)
 s+=rect(0,0,W,H,'url(#vignette)','opacity=".76"')
 s+=rect(0,0,W,H,'#ffffff','filter="url(#grain)" opacity=".033"')
 s+='</svg>'
 (P/f'{room}.svg').write_text(s)

rooms=['living','foyer','kitchen','dining','hall','evelyn','parents','bathroom','basement','yard','garage','porch']
for i,room in enumerate(rooms):scene(room,34+i)

# Original 2D cutout villain closely directed by the uploaded character design sheet: dark shaggy hair,
# tired eyes, stubble, black battered jacket, rumpled button-down shirt, jeans and boots.
char='''<svg xmlns="http://www.w3.org/2000/svg" width="520" height="1060" viewBox="0 0 520 1060"><defs><linearGradient id="skin" x2="1" y2="1"><stop stop-color="#d3b2a0"/><stop offset=".8" stop-color="#8c7069"/><stop offset="1" stop-color="#4e4444"/></linearGradient><linearGradient id="coat" x2="1" y2="1"><stop stop-color="#44484a"/><stop offset=".52" stop-color="#181e24"/><stop offset="1" stop-color="#080d11"/></linearGradient><linearGradient id="jeans" x2="0" y2="1"><stop stop-color="#31363d"/><stop offset="1" stop-color="#171d24"/></linearGradient><radialGradient id="faceLight"><stop stop-color="#e8d5c3" stop-opacity=".26"/><stop offset="1" stop-color="#f1eee8" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="263" cy="1034" rx="151" ry="20" fill="#000" opacity=".3"/>
<path d="M185 558Q198 712 180 928L168 992L242 1007L263 720L291 1008L365 992Q342 723 330 549Z" fill="url(#jeans)" stroke="#0d1017" stroke-width="14"/>
<path d="M168 977L242 989L245 1024Q209 1044 128 1031Q119 1013 168 977M290 986L365 976Q426 1005 403 1032L294 1030Z" fill="#221c1b" stroke="#52433a" stroke-width="11"/>
<path d="M206 299Q123 303 97 395L63 688Q75 740 114 724L177 517L175 651L346 654L357 512L405 719Q451 740 463 693L423 399Q394 311 331 302Z" fill="url(#coat)" stroke="#101417" stroke-width="13"/>
<path d="M200 305L183 648L341 646L331 305Z" fill="#a29a8b" stroke="#3a3f43" stroke-width="9"/>
<path d="M245 315L248 619M288 315L281 609" stroke="#56544f" stroke-width="4" opacity=".7"/>
<g fill="#282b2a"><circle cx="249" cy="382" r="6"/><circle cx="250" cy="448" r="6"/><circle cx="250" cy="524" r="6"/></g>
<path d="M196 303L153 364L197 467L175 595L248 644L217 398L232 314M336 300L379 375L338 473L348 600L288 643L304 401L294 310" fill="#252a30" stroke="#4c4a48" stroke-width="8"/>
<path d="M115 689Q105 760 146 770Q176 766 162 720M414 698Q387 755 414 776Q456 763 449 728" fill="url(#skin)" stroke="#3c3432" stroke-width="10"/>
<path d="M205 143Q183 223 201 283Q221 329 262 335Q315 325 334 267L339 175Q337 106 276 95Q216 93 205 143Z" fill="url(#skin)" stroke="#3b3131" stroke-width="9"/>
<path d="M215 255Q246 275 280 272Q305 263 326 245Q319 309 269 314Q225 317 215 255" fill="#77635d" opacity=".23"/>
<path d="M196 173Q180 107 219 67Q254 14 319 60Q359 79 360 139L352 205L333 174L320 103L301 148L260 102L242 149L219 127Z" fill="#221e20" stroke="#1a181a" stroke-width="11"/>
<path d="M187 156Q190 50 257 44M214 94Q236 33 295 41M291 52Q354 51 357 163M317 89Q376 113 350 192M239 69Q237 153 202 194" fill="none" stroke="#3b302c" stroke-width="17" stroke-linecap="round"/>
<path d="M218 197Q244 181 257 191M286 192Q305 179 329 191" fill="none" stroke="#423631" stroke-width="10" stroke-linecap="round"/>
<path d="M222 211Q238 205 253 212M289 213Q309 202 325 211" stroke="#252b2d" stroke-width="5" fill="none"/>
<circle cx="239" cy="212" r="5" fill="#7b887e"/><circle cx="307" cy="211" r="5" fill="#788278"/><circle cx="239" cy="212" r="2"/><circle cx="307" cy="211" r="2"/>
<path d="M272 209L261 261L277 264" stroke="#584442" stroke-width="5" fill="none"/>
<path d="M251 292Q275 282 298 290M229 294q48 29 84-1" fill="none" stroke="#654743" stroke-width="5"/>
<path d="M222 267l11 13m-1 -10l8 15m68-20l-9 17m16-16l-11 23" stroke="#493d39" stroke-width="2"/>
<ellipse cx="264" cy="206" rx="108" ry="149" fill="url(#faceLight)"/>
</svg>'''
(P/'nathaniel.svg').write_text(char)

close='''<svg xmlns="http://www.w3.org/2000/svg" width="820" height="940" viewBox="0 0 820 940"><defs><radialGradient id="sh"><stop stop-color="#876963"/><stop offset="1" stop-color="#221a20"/></radialGradient><linearGradient id="j" x2="1" y2="1"><stop stop-color="#545050"/><stop offset="1" stop-color="#09090e"/></linearGradient></defs><ellipse cx="400" cy="830" rx="420" ry="460" fill="#050509" opacity=".32"/><path d="M74 915Q84 575 253 553L534 547Q756 576 816 940Z" fill="url(#j)" stroke="#0e0d11" stroke-width="16"/><path d="M270 559L396 884L535 550L458 520L329 528Z" fill="#a7a096"/><path d="M225 117Q170 239 214 435Q256 587 390 619Q539 583 591 407L566 166Q535 74 406 77Z" fill="url(#sh)" stroke="#18171c" stroke-width="24"/><path d="M190 299Q166 52 329 34Q509 -4 605 135L617 333L557 223L531 115L462 199L416 124L338 211L284 140Z" fill="#151419"/><path d="M222 220Q235 52 383 62m-78 130Q330 31 490 69m-19 103Q596 94 604 242M274 126Q247 258 204 309" stroke="#30262a" stroke-width="36" fill="none" stroke-linecap="round"/><path d="M273 339Q315 315 365 339M447 341Q510 310 553 337" stroke="#16141b" stroke-width="20" fill="none"/><path d="M275 383Q324 360 366 389M440 389Q496 359 544 384" stroke="#171a1e" stroke-width="10" fill="none"/><ellipse cx="325" cy="379" rx="13" ry="16" fill="#a6b6a2"/><ellipse cx="487" cy="378" rx="13" ry="16" fill="#a6b6a2"/><circle cx="325" cy="381" r="8"/><circle cx="487" cy="380" r="8"/><path d="M410 353L380 479L425 488" stroke="#302329" stroke-width="13" fill="none"/><path d="M333 534Q404 483 478 529" stroke="#311c24" stroke-width="15" fill="none"/><path d="M292 504L321 525m206-35l-28 39m-188 45l25 10m158-8l-22 13" stroke="#37272b" stroke-width="6"/><path d="M239 700Q116 660 59 775M551 711Q714 642 816 765" stroke="#837574" stroke-width="7" opacity=".3" fill="none"/></svg>'''
(P/'nathaniel-close.svg').write_text(close)

# Exterior menu image, fully original hand-assembled architectural illustration.
ex='''<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#040711"/><stop offset=".5" stop-color="#152135"/><stop offset="1" stop-color="#141724"/></linearGradient><linearGradient id="house" x2="1" y2="1"><stop stop-color="#43434a"/><stop offset="1" stop-color="#161922"/></linearGradient><linearGradient id="roof" x2="0" y2="1"><stop stop-color="#171b25"/><stop offset="1" stop-color="#060b11"/></linearGradient><radialGradient id="warm"><stop stop-color="#ffc47e"/><stop offset="1" stop-color="#b55a1f"/></radialGradient><linearGradient id="drive" x2="0" y2="1"><stop stop-color="#39383e"/><stop offset="1" stop-color="#080b13"/></linearGradient><radialGradient id="edge"><stop offset=".45" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".75"/></radialGradient><filter id="blur"><feGaussianBlur stdDeviation="20"/></filter><filter id="grain"><feTurbulence baseFrequency=".5" numOctaves="2" seed="17"/></filter></defs><rect width="1920" height="1080" fill="url(#sky)"/>'''
random.seed(89)
for i in range(95):
 x=random.randrange(0,1920); h=random.randrange(120,440)
 ex+=f'<path d="M{x} 690v{-h}m0 65l-35 -87m35 45l35 -103" fill="none" stroke="#0a101a" stroke-width="{random.randrange(12,29)}" opacity=".76"/>'
ex+='''<path d="M510 530L980 130L1603 510L1603 785L510 785Z" fill="url(#house)" stroke="#252831" stroke-width="12"/><path d="M465 530L977 92L1666 528L1550 524L980 201L551 551Z" fill="url(#roof)" stroke="#333441" stroke-width="16"/>
<path d="M1110 450L1460 450L1460 773L1110 773Z" fill="#26262d" stroke="#53505a" stroke-width="15"/>'''
for y in range(487,761,54):
 ex+=f'<path d="M1120 {y}H1450" stroke="#4f4b4a" stroke-width="9"/>'
ex+='''<rect x="748" y="495" width="178" height="285" fill="#1d1516" stroke="#96806b" stroke-width="14"/><rect x="784" y="540" width="75" height="110" fill="url(#warm)" opacity=".9"/><path d="M821 542v110m-38-54h74" stroke="#504032" stroke-width="7"/><circle cx="895" cy="659" r="10" fill="#dcb584"/>
<rect x="963" y="291" width="200" height="202" fill="url(#warm)" stroke="#8b7d73" stroke-width="15"/><path d="M1065 293v198M963 390h200" stroke="#79614d" stroke-width="13"/><rect x="651" y="344" width="138" height="160" fill="#121c2b" stroke="#5c5450" stroke-width="13"/><path d="M718 346v154m-67-75h138" stroke="#514840" stroke-width="10"/>
<path d="M460 775L1640 775L1920 1080L40 1080Z" fill="url(#drive)"/><path d="M0 856L1920 850M0 961L1920 947" stroke="#93939e" stroke-width="6" opacity=".2"/>
<path d="M1428 697Q1535 620 1712 678L1787 752V824H1400V753Z" fill="#181c25" stroke="#393c44" stroke-width="12"/><path d="M1474 702L1571 670L1662 707Z" fill="#303a49"/><ellipse cx="1498" cy="828" rx="54" ry="57" fill="#090a10" stroke="#4d4f53" stroke-width="17"/><ellipse cx="1724" cy="828" rx="55" ry="56" fill="#090a10" stroke="#4d4f53" stroke-width="17"/><rect x="1710" y="754" width="50" height="27" rx="6" fill="#a93b31" opacity=".45"/>
<path d="M360 815v-182" stroke="#39353a" stroke-width="22"/><rect x="296" y="599" width="160" height="86" rx="23" fill="#40414a" stroke="#999097" stroke-width="8"/><text x="375" y="653" font-size="38" text-anchor="middle" fill="#d6c8b4" font-family="Georgia">2147</text>
<ellipse cx="981" cy="777" rx="175" ry="35" fill="#ffb86a" opacity=".25" filter="url(#blur)"/><ellipse cx="1061" cy="533" rx="160" ry="110" fill="#eb9452" opacity=".17" filter="url(#blur)"/>
<rect width="1920" height="1080" fill="url(#edge)"/><rect width="1920" height="1080" filter="url(#grain)" opacity=".05"/></svg>'''
(P/'cover.svg').write_text(ex)
print('Wrote',len(rooms),'panoramas, antagonist sprites, cover art')
