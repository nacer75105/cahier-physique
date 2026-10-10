"""Lecture d'un spectre JCAMP-DX du NIST au format AFFN « (X++(Y..Y)) » :
chaque ligne porte une abscisse puis des ordonnées espacées de DELTAX.
Lancé seul, affiche les creux (bandes) au-dessus de 1300 cm-1 :
    python outils/spectres-ir/jdx.py outils/spectres-ir/jcamp/C64175-3.jdx"""
import sys, re
def lire(p):
    xs=[];ys=[];h={};dx=None;on=False
    for l in open(p,encoding='latin-1'):
        l=l.strip()
        if l.startswith('##'):
            k,_,v=l[2:].partition('='); h[k]=v
            on = k=='XYDATA'
            if k=='END': on=False
            continue
        if on and l:
            t=l.split(); x0=float(t[0]); d=float(h['DELTAX']) if float(h['LASTX'])>float(h['FIRSTX']) else -abs(float(h['DELTAX']))
            for i,y in enumerate(t[1:]): xs.append(x0+i*d); ys.append(float(y)*float(h.get('YFACTOR',1)))
    return h,xs,ys
if __name__=='__main__':
    h,x,y=lire(sys.argv[1])
    pts=sorted(zip(x,y))
    print(h['TITLE'], len(pts), 'x', round(pts[0][0]), round(pts[-1][0]), 'ymin', min(y), 'ymax', max(y))
    # local minima (bands): over window 25 cm-1, depth
    import bisect
    X=[p[0] for p in pts]; Y=[p[1] for p in pts]
    out=[]
    for i in range(len(X)):
        a=bisect.bisect_left(X,X[i]-30); b=bisect.bisect_right(X,X[i]+30)
        if Y[i]==min(Y[a:b]) and Y[i]<0.75 and X[i]>1300:
            if not out or X[i]-out[-1][0]>20: out.append((round(X[i]),round(Y[i],3)))
    print(out)
