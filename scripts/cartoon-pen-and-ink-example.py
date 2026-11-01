# Generates a pen-and-ink style SVG cartoon for Down Under Voices.
INK="#111"

def head(cx, cy, s=1.0, mood="grin", hair="side", tilt=0):
    """Line-art human head at (cx,cy). Returns SVG group."""
    k=s
    g=[f'<g transform="translate({cx} {cy}) rotate({tilt}) scale({k})">']
    # neck
    g.append('<path d="M-11 30 L-12 52 M11 30 L12 52" />')
    # face outline: temple, cheek, jaw, chin
    g.append('<path d="M-27 -8 Q-29 18 -18 33 Q-8 44 0 45 Q9 44 18 33 Q29 18 27 -8" fill="#fff"/>')
    # ears
    g.append('<path d="M-27 -2 Q-36 -4 -35 6 Q-34 15 -26 15" fill="#fff"/><path d="M-31 3 Q-29 8 -31 11" stroke-width="1.6"/>')
    g.append('<path d="M27 -2 Q36 -4 35 6 Q34 15 26 15" fill="#fff"/><path d="M31 3 Q29 8 31 11" stroke-width="1.6"/>')
    # cranium + hair
    if hair=="side":
        g.append('<path d="M-28 -6 Q-32 -42 -2 -46 Q30 -46 29 -8 Q24 -26 6 -30 Q-10 -24 -24 -26 Q-27 -18 -28 -6 Z" fill="#111"/>')
        g.append('<path d="M-14 -30 Q0 -40 18 -34" stroke="#fff" stroke-width="1.5"/>')
    elif hair=="thin":
        g.append('<path d="M-28 -4 Q-30 -40 0 -44 Q29 -42 28 -4" fill="#fff"/>')
        g.append('<path d="M-28 -4 Q-30 -22 -22 -30 M28 -4 Q30 -22 22 -30" stroke-width="5"/>')
        g.append('<path d="M-12 -40 Q-6 -46 2 -42 M6 -43 Q12 -46 16 -40" stroke-width="1.6"/>')
    # brows
    if mood=="grin":
        g.append('<path d="M-19 -9 Q-12 -14 -5 -10 M5 -10 Q12 -14 19 -9" stroke-width="3"/>')
    else:  # weary
        g.append('<path d="M-19 -6 Q-12 -12 -5 -11 M5 -11 Q12 -12 19 -6" stroke-width="3"/>')
    # eyes
    if mood=="grin":
        g.append('<path d="M-18 -1 Q-12 -6 -6 -1 Q-12 2 -18 -1 Z" fill="#fff"/><circle cx="-12" cy="-1.5" r="2.2" fill="#111"/>')
        g.append('<path d="M6 -1 Q12 -6 18 -1 Q12 2 6 -1 Z" fill="#fff"/><circle cx="12" cy="-1.5" r="2.2" fill="#111"/>')
        g.append('<path d="M-19 3 Q-15 5 -11 4 M11 4 Q15 5 19 3" stroke-width="1.2"/>')
    else:
        g.append('<path d="M-18 0 Q-12 -3 -6 0" /><path d="M6 0 Q12 -3 18 0"/>')
        g.append('<path d="M-17 4 Q-12 7 -7 4 M7 4 Q12 7 17 4" stroke-width="1.3"/>')
        g.append('<path d="M-16 8 Q-12 10 -8 8 M8 8 Q12 10 16 8" stroke-width="1"/>')
    # nose
    g.append('<path d="M-1 0 Q-3 10 -6 15 Q-2 19 3 17" stroke-width="2.2"/>')
    # mouth
    if mood=="grin":
        g.append('<path d="M-14 24 Q0 36 14 24 Q0 28 -14 24 Z" fill="#fff"/><path d="M-12 25.5 L12 25.5" stroke-width="1.2"/>')
        g.append('<path d="M-17 21 Q-15 26 -13 25 M17 21 Q15 26 13 25" stroke-width="1.4"/>')
    else:
        g.append('<path d="M-9 29 Q0 25 10 30" stroke-width="2.4"/>')
        g.append('<path d="M-6 37 Q0 39 6 37" stroke-width="1.2"/>')
    g.append('</g>')
    return "\n".join(g)

def hand(x, y, rot=0, s=1.0):
    return (f'<g transform="translate({x} {y}) rotate({rot}) scale({s})">'
            '<path d="M-10 6 Q-13 -6 -6 -11 L8 -12 Q14 -10 12 -4 L12 8 Q8 14 -2 13 Q-9 12 -10 6 Z" fill="#fff"/>'
            '<path d="M-6 -11 Q-8 -4 -3 -4 M1 -12 Q-1 -4 4 -4 M8 -12 Q6 -4 11 -4" stroke-width="1.4"/>'
            '<path d="M-10 2 Q-16 -2 -14 -8 Q-11 -10 -8 -6" fill="#fff" stroke-width="2"/></g>')

def candidate(cx, ytop, sign_text, sign_x, sign_w, sign_y, arm_side):
    """Standing politician in suit holding a placard on a pole."""
    o=[]
    hy=ytop+46
    sh=hy+52  # shoulder line
    # legs and shoes
    o.append(f'<path d="M{cx-26} {sh+150} L{cx-24} 632 M{cx-4} {sh+150} L{cx-5} 632 M{cx+4} {sh+150} L{cx+5} 632 M{cx+26} {sh+150} L{cx+24} 632" />')
    o.append(f'<path d="M{cx-26} {sh+150} L{cx+26} {sh+150} L{cx+24} 632 L{cx+5} 632 L{cx} {sh+170} L{cx-5} 632 L{cx-24} 632 Z" fill="url(#xhatch)"/>')
    o.append(f'<path d="M{cx-30} 640 Q{cx-30} 628 {cx-8} 630 L{cx-4} 640 Z M{cx+30} 640 Q{cx+30} 628 {cx+8} 630 L{cx+4} 640 Z" fill="#111"/>')
    # jacket torso
    o.append(f'<path d="M{cx-38} {sh+6} Q{cx-44} {sh+60} {cx-34} {sh+158} L{cx+34} {sh+158} Q{cx+44} {sh+60} {cx+38} {sh+6} Q{cx+20} {sh-4} {cx} {sh} Q{cx-20} {sh-4} {cx-38} {sh+6} Z" fill="url(#hatch)"/>')
    # shirt, lapels, tie
    o.append(f'<path d="M{cx-12} {sh} L{cx} {sh+46} L{cx+12} {sh} Z" fill="#fff"/>')
    o.append(f'<path d="M{cx-14} {sh} L{cx-22} {sh+30} L{cx-10} {sh+26} L{cx} {sh+70} M{cx+14} {sh} L{cx+22} {sh+30} L{cx+10} {sh+26} L{cx} {sh+70}" fill="#fff"/>')
    o.append(f'<path d="M{cx-4} {sh+4} L{cx+4} {sh+4} L{cx+6} {sh+40} L{cx} {sh+48} L{cx-6} {sh+40} Z" fill="#111"/>')
    o.append(f'<path d="M{cx} {sh+70} L{cx} {sh+150}" stroke-width="1.5"/><circle cx="{cx+3}" cy="{sh+88}" r="2" fill="#111"/><circle cx="{cx+3}" cy="{sh+112}" r="2" fill="#111"/>')
    # rosette
    rx=cx+(18 if arm_side<0 else -18)
    o.append(f'<circle cx="{rx}" cy="{sh+34}" r="9" fill="#fff"/><circle cx="{rx}" cy="{sh+34}" r="4"/><path d="M{rx-4} {sh+42} L{rx-7} {sh+58} M{rx+4} {sh+42} L{rx+7} {sh+58}" stroke-width="3"/>')
    # lowered arm
    d=-arm_side
    o.append(f'<path d="M{cx+d*38} {sh+10} Q{cx+d*48} {sh+70} {cx+d*40} {sh+128}" stroke-width="20"/>')
    o.append(f'<path d="M{cx+d*38} {sh+10} Q{cx+d*48} {sh+70} {cx+d*40} {sh+128}" stroke="#fff" stroke-width="13"/>')
    o.append(f'<path d="M{cx+d*38} {sh+10} Q{cx+d*48} {sh+70} {cx+d*40} {sh+128}" stroke="url(#hatch)" stroke-width="13"/>')
    o.append(hand(cx+d*40, sh+138, 180, 0.9))
    # raised arm holding pole
    px=cx+arm_side*44
    o.append(f'<line x1="{px}" y1="{sign_y+70}" x2="{px}" y2="{sh+40}" stroke-width="6"/>')
    o.append(f'<path d="M{cx+arm_side*36} {sh+8} Q{cx+arm_side*58} {sh-20} {px} {sh-62}" stroke-width="20"/>')
    o.append(f'<path d="M{cx+arm_side*36} {sh+8} Q{cx+arm_side*58} {sh-20} {px} {sh-62}" stroke="#fff" stroke-width="13"/>')
    o.append(f'<path d="M{cx+arm_side*36} {sh+8} Q{cx+arm_side*58} {sh-20} {px} {sh-62}" stroke="url(#hatch)" stroke-width="13"/>')
    o.append(hand(px, sh-72, 0, 0.9))
    # placard
    o.append(f'<rect x="{sign_x}" y="{sign_y}" width="{sign_w}" height="70" fill="#fff" stroke-width="5"/>')
    o.append(f'<rect x="{sign_x+6}" y="{sign_y+6}" width="{sign_w-12}" height="58" stroke-width="1.5"/>')
    # head
    o.append(head(cx, hy, 1.0, "grin", "side"))
    texts=f'<text x="{sign_x+sign_w/2}" y="{sign_y+45}" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="{21 if len(sign_text)<11 else 18}">{sign_text}</text>'
    return "\n".join(o), texts

parts=[]; texts=[]
c1,t1=candidate(160, 260, "PROMISES!", 40, 170, 160, -1)
c2,t2=candidate(275, 268, "MORE PROMISES!", 222, 236, 150, +1)

# voter seated behind table
v=[]
vx,vy=815,335
sh=vy+52
v.append(f'<path d="M{vx-58} 520 Q{vx-66} {sh+40} {vx-40} {sh+8} Q{vx-20} {sh-4} {vx} {sh} Q{vx+20} {sh-4} {vx+40} {sh+8} Q{vx+66} {sh+40} {vx+58} 520 Z" fill="url(#hatchLight)"/>')
v.append(f'<path d="M{vx-14} {sh} L{vx} {sh+30} L{vx+14} {sh}" fill="#fff"/>')
v.append(f'<path d="M{vx-30} {sh+40} Q{vx-26} {sh+80} {vx-34} {sh+120} M{vx+24} {sh+60} Q{vx+30} {sh+90} {vx+22} {sh+124}" stroke-width="1.6"/>')
# left arm resting on table, hand flat on bills
v.append(f'<path d="M{vx-50} {sh+20} Q{vx-80} {sh+80} {vx-110} {sh+118}" stroke-width="22"/>')
v.append(f'<path d="M{vx-50} {sh+20} Q{vx-80} {sh+80} {vx-110} {sh+118}" stroke="#fff" stroke-width="15"/>')
v.append(f'<path d="M{vx-50} {sh+20} Q{vx-80} {sh+80} {vx-110} {sh+118}" stroke="url(#hatchLight)" stroke-width="15"/>')
# right arm: elbow on table, hand to forehead
v.append(f'<path d="M{vx+48} {sh+16} Q{vx+92} {sh+80} {vx+84} {sh+128} Q{vx+70} {sh+40} {vx+44} {vy-8}" stroke-width="22"/>')
v.append(f'<path d="M{vx+48} {sh+16} Q{vx+92} {sh+80} {vx+84} {sh+128} Q{vx+70} {sh+40} {vx+44} {vy-8}" stroke="#fff" stroke-width="15"/>')
v.append(f'<path d="M{vx+48} {sh+16} Q{vx+92} {sh+80} {vx+84} {sh+128} Q{vx+70} {sh+40} {vx+44} {vy-8}" stroke="url(#hatchLight)" stroke-width="15"/>')
v.append(head(vx, vy, 1.08, "weary", "thin", -6))
v.append(hand(vx+34, vy-18, -120, 1.1))
voter="\n".join(v)

svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 760" role="img" aria-labelledby="title desc">
<title id="title">Downunder Voices Cartoon of the Day — Five days of promises</title>
<desc id="desc">Pen-and-ink editorial cartoon: two identical, grinning fictional election candidates in suits squeeze through a front door holding signs reading Promises and More Promises, while a weary New Zealand voter at a kitchen table piled with rent, power and grocery bills rests a hand on his forehead and asks whether the promises can pay the rent. A wall calendar has Saturday 7 November circled.</desc>
<defs>
  <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#fff"/><line x1="0" y1="0" x2="0" y2="7" stroke="#111" stroke-width="2.2"/></pattern>
  <pattern id="xhatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#fff"/><line x1="0" y1="0" x2="0" y2="7" stroke="#111" stroke-width="2.4"/><line x1="0" y1="0" x2="7" y2="0" stroke="#111" stroke-width="1.6"/></pattern>
  <pattern id="hatchLight" width="11" height="11" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><rect width="11" height="11" fill="#fff"/><line x1="0" y1="0" x2="0" y2="11" stroke="#111" stroke-width="1.1"/></pattern>
  <pattern id="boards" width="80" height="20" patternUnits="userSpaceOnUse"><rect width="80" height="20" fill="#fff"/><path d="M0 19.5 H80 M40 0 V20" stroke="#111" stroke-width="1.3"/><path d="M8 7 Q20 4 32 8 M50 12 Q62 9 74 13" stroke="#111" stroke-width="0.7" fill="none"/></pattern>
  <filter id="ink" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="2.6"/></filter>
</defs>
<rect width="1200" height="760" fill="#fff"/>
<rect x="24" y="24" width="1152" height="712" rx="8" fill="#fff" stroke="#111" stroke-width="6"/>
<text x="600" y="72" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="29">DOWNUNDER VOICES — CARTOON OF THE DAY</text>
<text x="600" y="108" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="18">SATIRE • 2 NOVEMBER 2026</text>
<line x1="70" y1="132" x2="1130" y2="132" stroke="#111" stroke-width="4"/>

<g filter="url(#ink)" stroke="#111" stroke-width="3.2" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <!-- wall: skirting, wallpaper stripes, window -->
  <path d="M440 140 V560 M560 140 V560" stroke-width="0.8" opacity="0.5"/>
  <path d="M30 560 H1170" stroke-width="2"/><path d="M30 572 H1170" stroke-width="1.2"/>
  <rect x="30" y="640" width="1140" height="26" fill="url(#boards)" stroke="none"/>
  <path d="M30 640 H1170" stroke-width="4.5"/>
  <!-- door frame and open door -->
  <rect x="70" y="250" width="290" height="390" fill="#fff" stroke-width="4"/>
  <rect x="60" y="240" width="310" height="10" fill="#fff" stroke-width="3"/>
  <path d="M360 250 L430 230 L430 662 L360 640 Z" fill="url(#hatchLight)" stroke-width="4"/>
  <path d="M372 280 L418 268 L418 430 L372 438 Z M372 470 L418 464 L418 630 L372 622 Z" stroke-width="2"/>
  <circle cx="412" cy="452" r="6" fill="#111"/>
  <!-- doormat -->
  <path d="M85 640 L345 640 L355 652 L75 652 Z" fill="url(#hatch)" stroke-width="2"/>
  {c1}
  {c2}
  <!-- candidates' speech bubble -->
  <path d="M440 318 L360 352 L462 336" fill="#fff"/>
  <ellipse cx="595" cy="300" rx="198" ry="58" fill="#fff"/>
  <path d="M444 320 L460 334" stroke="#fff" stroke-width="8"/>
  <!-- wall calendar -->
  <path d="M1075 160 L1075 170" stroke-width="2"/><circle cx="1075" cy="158" r="3" fill="#111"/>
  <rect x="1010" y="170" width="130" height="150" fill="#fff"/>
  <rect x="1010" y="170" width="130" height="40" fill="url(#hatchLight)"/>
  <path d="M1040 235 Q1075 222 1112 240 Q1118 285 1080 302 Q1036 300 1036 262 Q1036 240 1052 232" stroke-width="4"/>
  <!-- table -->
  <path d="M600 522 L1040 522 L1032 544 L608 544 Z" fill="url(#hatchLight)" stroke-width="3.5"/>
  <path d="M625 544 L630 640 M1015 544 L1010 640" stroke-width="9"/>
  <path d="M640 544 L644 640" stroke-width="2"/>
  {voter}
  <!-- pile of bills -->
  <g fill="#fff" stroke-width="2.4">
    <path d="M640 512 L752 500 L756 520 L644 532 Z"/>
    <path d="M652 478 L762 484 L760 506 L650 500 Z"/>
    <path d="M644 446 L752 440 L754 464 L646 470 Z"/>
    <path d="M650 420 L752 414 L754 438 L652 444 Z"/>
  </g>
  <!-- teacup and saucer -->
  <path d="M930 518 Q960 528 992 518" stroke-width="2.4"/>
  <path d="M940 480 H984 L978 514 Q962 520 946 514 Z" fill="#fff"/>
  <path d="M984 488 Q1004 492 982 508" stroke-width="3"/>
  <path d="M952 470 Q946 456 956 444 M968 470 Q962 456 972 444" stroke-width="1.8"/>
  <!-- voter's speech bubble -->
  <path d="M845 238 L830 286 L878 244" fill="#fff"/>
  <ellipse cx="862" cy="195" rx="146" ry="52" fill="#fff"/>
  <path d="M847 242 L874 241" stroke="#fff" stroke-width="8"/>
</g>

<g font-family="Georgia,serif" font-weight="700" fill="#111" text-anchor="middle">
  {t1}
  {t2}
  <text x="595" y="293" font-size="20">VOTE FOR US —</text>
  <text x="595" y="321" font-size="20">EVERYTHING GETS CHEAPER!</text>
  <text x="862" y="189" font-size="20">LOVELY. CAN I PAY</text>
  <text x="862" y="217" font-size="20">THE RENT WITH IT?</text>
  <text x="1075" y="197" font-size="17" font-family="Arial,sans-serif" fill="#111">NOVEMBER</text>
  <text x="1075" y="282" font-size="42">7</text>
  <text x="1075" y="310" font-size="12" font-family="Arial,sans-serif">SATURDAY</text>
</g>
<g font-family="Arial,sans-serif" font-weight="700" fill="#111" text-anchor="middle" font-size="13">
  <text x="698" y="521" transform="rotate(-6 698 516)">RENT — DUE</text>
  <text x="706" y="497" transform="rotate(3 706 492)">POWER</text>
  <text x="699" y="461" transform="rotate(-3 699 456)">GROCERIES</text>
  <text x="701" y="434" transform="rotate(-3 701 430)">INSURANCE</text>
</g>
<text x="1075" y="342" text-anchor="middle" font-family="Arial,sans-serif" font-weight="700" font-size="15" fill="#111">VOTE</text>

<rect x="30" y="670" width="1140" height="60" fill="#111"/>
<text x="600" y="709" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="22" fill="#fff">NZ ELECTION: FIVE MORE DAYS OF PROMISES. ONE MORE WEEK OF RENT.</text>
</svg>
'''
import sys
open(sys.argv[1],'w').write(svg)
