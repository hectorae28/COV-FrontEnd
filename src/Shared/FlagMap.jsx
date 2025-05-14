/**
 * Mapa de códigos de país (ISO 3166-1 alpha-2) a componentes SVG de banderas.
 * Los SVGs se importan desde la carpeta 'banderas'.
 */

// Importación de todas las banderas desde la carpeta
const flagMap = {
    'ad': require('@/../public/assets/bandera/ad.svg').default,
    'ae': require('@/../public/assets/bandera/ae.svg').default,
    'af': require('@/../public/assets/bandera/af.svg').default,
    'ag': require('@/../public/assets/bandera/ag.svg').default,
    'al': require('@/../public/assets/bandera/al.svg').default,
    'am': require('@/../public/assets/bandera/am.svg').default,
    'ar': require('@/../public/assets/bandera/ar.svg').default,
    'at': require('@/../public/assets/bandera/at.svg').default,
    'au': require('@/../public/assets/bandera/au.svg').default,
    'az': require('@/../public/assets/bandera/az.svg').default,
    'ba': require('@/../public/assets/bandera/ba.svg').default,
    'bb': require('@/../public/assets/bandera/bb.svg').default,
    'bd': require('@/../public/assets/bandera/bd.svg').default,
    'be': require('@/../public/assets/bandera/be.svg').default,
    'bf': require('@/../public/assets/bandera/bf.svg').default,
    'bg': require('@/../public/assets/bandera/bg.svg').default,
    'bh': require('@/../public/assets/bandera/bh.svg').default,
    'bi': require('@/../public/assets/bandera/bi.svg').default,
    'bj': require('@/../public/assets/bandera/bj.svg').default,
    'bn': require('@/../public/assets/bandera/bn.svg').default,
    'bo': require('@/../public/assets/bandera/bo.svg').default,
    'br': require('@/../public/assets/bandera/br.svg').default,
    'bs': require('@/../public/assets/bandera/bs.svg').default,
    'bt': require('@/../public/assets/bandera/bt.svg').default,
    'bw': require('@/../public/assets/bandera/bw.svg').default,
    'by': require('@/../public/assets/bandera/by.svg').default,
    'bz': require('@/../public/assets/bandera/bz.svg').default,
    'ca': require('@/../public/assets/bandera/ca.svg').default,
    'cd': require('@/../public/assets/bandera/cd.svg').default,
    'cf': require('@/../public/assets/bandera/cf.svg').default,
    'cg': require('@/../public/assets/bandera/cg.svg').default,
    'ch': require('@/../public/assets/bandera/ch.svg').default,
    'ci': require('@/../public/assets/bandera/ci.svg').default,
    'cl': require('@/../public/assets/bandera/cl.svg').default,
    'cm': require('@/../public/assets/bandera/cm.svg').default,
    'cn': require('@/../public/assets/bandera/cn.svg').default,
    'co': require('@/../public/assets/bandera/co.svg').default,
    'cr': require('@/../public/assets/bandera/cr.svg').default,
    'cu': require('@/../public/assets/bandera/cu.svg').default,
    'cv': require('@/../public/assets/bandera/cv.svg').default,
    'cy': require('@/../public/assets/bandera/cy.svg').default,
    'cz': require('@/../public/assets/bandera/cz.svg').default,
    'de': require('@/../public/assets/bandera/de.svg').default,
    'dj': require('@/../public/assets/bandera/dj.svg').default,
    'dk': require('@/../public/assets/bandera/dk.svg').default,
    'dm': require('@/../public/assets/bandera/dm.svg').default,
    'do': require('@/../public/assets/bandera/do.svg').default,
    'dz': require('@/../public/assets/bandera/dz.svg').default,
    'ec': require('@/../public/assets/bandera/ec.svg').default,
    'ee': require('@/../public/assets/bandera/ee.svg').default,
    'eg': require('@/../public/assets/bandera/eg.svg').default,
    'er': require('@/../public/assets/bandera/er.svg').default,
    'es': require('@/../public/assets/bandera/es.svg').default,
    'et': require('@/../public/assets/bandera/et.svg').default,
    'fi': require('@/../public/assets/bandera/fi.svg').default,
    'fj': require('@/../public/assets/bandera/fj.svg').default,
    'fm': require('@/../public/assets/bandera/fm.svg').default,
    'fr': require('@/../public/assets/bandera/fr.svg').default,
    'ga': require('@/../public/assets/bandera/ga.svg').default,
    'gb': require('@/../public/assets/bandera/gb.svg').default,
    'gd': require('@/../public/assets/bandera/gd.svg').default,
    'ge': require('@/../public/assets/bandera/ge.svg').default,
    'gh': require('@/../public/assets/bandera/gh.svg').default,
    'gm': require('@/../public/assets/bandera/gm.svg').default,
    'gn': require('@/../public/assets/bandera/gn.svg').default,
    'gq': require('@/../public/assets/bandera/gq.svg').default,
    'gr': require('@/../public/assets/bandera/gr.svg').default,
    'gt': require('@/../public/assets/bandera/gt.svg').default,
    'gw': require('@/../public/assets/bandera/gw.svg').default,
    'gy': require('@/../public/assets/bandera/gy.svg').default,
    'hn': require('@/../public/assets/bandera/hn.svg').default,
    'hr': require('@/../public/assets/bandera/hr.svg').default,
    'ht': require('@/../public/assets/bandera/ht.svg').default,
    'hu': require('@/../public/assets/bandera/hu.svg').default,
    'id': require('@/../public/assets/bandera/id.svg').default,
    'ie': require('@/../public/assets/bandera/ie.svg').default,
    'il': require('@/../public/assets/bandera/il.svg').default,
    'in': require('@/../public/assets/bandera/in.svg').default,
    'iq': require('@/../public/assets/bandera/iq.svg').default,
    'ir': require('@/../public/assets/bandera/ir.svg').default,
    'is': require('@/../public/assets/bandera/is.svg').default,
    'it': require('@/../public/assets/bandera/it.svg').default,
    'jm': require('@/../public/assets/bandera/jm.svg').default,
    'jo': require('@/../public/assets/bandera/jo.svg').default,
    'jp': require('@/../public/assets/bandera/jp.svg').default,
    'ke': require('@/../public/assets/bandera/ke.svg').default,
    'kg': require('@/../public/assets/bandera/kg.svg').default,
    'kh': require('@/../public/assets/bandera/kh.svg').default,
    'ki': require('@/../public/assets/bandera/ki.svg').default,
    'km': require('@/../public/assets/bandera/km.svg').default,
    'kn': require('@/../public/assets/bandera/kn.svg').default,
    'kp': require('@/../public/assets/bandera/kp.svg').default,
    'kr': require('@/../public/assets/bandera/kr.svg').default,
    'kw': require('@/../public/assets/bandera/kw.svg').default,
    'kz': require('@/../public/assets/bandera/kz.svg').default,
    'la': require('@/../public/assets/bandera/la.svg').default,
    'lb': require('@/../public/assets/bandera/lb.svg').default,
    'lc': require('@/../public/assets/bandera/lc.svg').default,
    'li': require('@/../public/assets/bandera/li.svg').default,
    'lk': require('@/../public/assets/bandera/lk.svg').default,
    'lr': require('@/../public/assets/bandera/lr.svg').default,
    'ls': require('@/../public/assets/bandera/ls.svg').default,
    'lt': require('@/../public/assets/bandera/lt.svg').default,
    'lu': require('@/../public/assets/bandera/lu.svg').default,
    'lv': require('@/../public/assets/bandera/lv.svg').default,
    'ly': require('@/../public/assets/bandera/ly.svg').default,
    'ma': require('@/../public/assets/bandera/ma.svg').default,
    'mc': require('@/../public/assets/bandera/mc.svg').default,
    'md': require('@/../public/assets/bandera/md.svg').default,
    'me': require('@/../public/assets/bandera/me.svg').default,
    'mg': require('@/../public/assets/bandera/mg.svg').default,
    'mh': require('@/../public/assets/bandera/mh.svg').default,
    'mk': require('@/../public/assets/bandera/mk.svg').default,
    'ml': require('@/../public/assets/bandera/ml.svg').default,
    'mm': require('@/../public/assets/bandera/mm.svg').default,
    'mn': require('@/../public/assets/bandera/mn.svg').default,
    'mr': require('@/../public/assets/bandera/mr.svg').default,
    'mt': require('@/../public/assets/bandera/mt.svg').default,
    'mu': require('@/../public/assets/bandera/mu.svg').default,
    'mv': require('@/../public/assets/bandera/mv.svg').default,
    'mw': require('@/../public/assets/bandera/mw.svg').default,
    'mx': require('@/../public/assets/bandera/mx.svg').default,
    'my': require('@/../public/assets/bandera/my.svg').default,
    'mz': require('@/../public/assets/bandera/mz.svg').default,
    'na': require('@/../public/assets/bandera/na.svg').default,
    'ne': require('@/../public/assets/bandera/ne.svg').default,
    'ng': require('@/../public/assets/bandera/ng.svg').default,
    'ni': require('@/../public/assets/bandera/ni.svg').default,
    'nl': require('@/../public/assets/bandera/nl.svg').default,
    'no': require('@/../public/assets/bandera/no.svg').default,
    'np': require('@/../public/assets/bandera/np.svg').default,
    'nr': require('@/../public/assets/bandera/nr.svg').default,
    'nz': require('@/../public/assets/bandera/nz.svg').default,
    'om': require('@/../public/assets/bandera/om.svg').default,
    'pa': require('@/../public/assets/bandera/pa.svg').default,
    'pe': require('@/../public/assets/bandera/pe.svg').default,
    'pg': require('@/../public/assets/bandera/pg.svg').default,
    'ph': require('@/../public/assets/bandera/ph.svg').default,
    'pk': require('@/../public/assets/bandera/pk.svg').default,
    'pl': require('@/../public/assets/bandera/pl.svg').default,
    'pt': require('@/../public/assets/bandera/pt.svg').default,
    'pw': require('@/../public/assets/bandera/pw.svg').default,
    'py': require('@/../public/assets/bandera/py.svg').default,
    'qa': require('@/../public/assets/bandera/qa.svg').default,
    'ro': require('@/../public/assets/bandera/ro.svg').default,
    'rs': require('@/../public/assets/bandera/rs.svg').default,
    'ru': require('@/../public/assets/bandera/ru.svg').default,
    'rw': require('@/../public/assets/bandera/rw.svg').default,
    'sa': require('@/../public/assets/bandera/sa.svg').default,
    'sb': require('@/../public/assets/bandera/sb.svg').default,
    'sc': require('@/../public/assets/bandera/sc.svg').default,
    'sd': require('@/../public/assets/bandera/sd.svg').default,
    'se': require('@/../public/assets/bandera/se.svg').default,
    'sg': require('@/../public/assets/bandera/sg.svg').default,
    'si': require('@/../public/assets/bandera/si.svg').default,
    'sk': require('@/../public/assets/bandera/sk.svg').default,
    'sl': require('@/../public/assets/bandera/sl.svg').default,
    'sm': require('@/../public/assets/bandera/sm.svg').default,
    'sn': require('@/../public/assets/bandera/sn.svg').default,
    'so': require('@/../public/assets/bandera/so.svg').default,
    'sr': require('@/../public/assets/bandera/sr.svg').default,
    'ss': require('@/../public/assets/bandera/ss.svg').default,
    'st': require('@/../public/assets/bandera/st.svg').default,
    'sv': require('@/../public/assets/bandera/sv.svg').default,
    'sy': require('@/../public/assets/bandera/sy.svg').default,
    'sz': require('@/../public/assets/bandera/sz.svg').default,
    'td': require('@/../public/assets/bandera/td.svg').default,
    'tg': require('@/../public/assets/bandera/tg.svg').default,
    'th': require('@/../public/assets/bandera/th.svg').default,
    'tj': require('@/../public/assets/bandera/tj.svg').default,
    'tl': require('@/../public/assets/bandera/tl.svg').default,
    'tm': require('@/../public/assets/bandera/tm.svg').default,
    'tn': require('@/../public/assets/bandera/tn.svg').default,
    'to': require('@/../public/assets/bandera/to.svg').default,
    'tr': require('@/../public/assets/bandera/tr.svg').default,
    'tt': require('@/../public/assets/bandera/tt.svg').default,
    'tv': require('@/../public/assets/bandera/tv.svg').default,
    'tw': require('@/../public/assets/bandera/tw.svg').default,
    'tz': require('@/../public/assets/bandera/tz.svg').default,
    'ua': require('@/../public/assets/bandera/ua.svg').default,
    'ug': require('@/../public/assets/bandera/ug.svg').default,
    'us': require('@/../public/assets/bandera/us.svg').default,
    'uy': require('@/../public/assets/bandera/uy.svg').default,
    'uz': require('@/../public/assets/bandera/uz.svg').default,
    'va': require('@/../public/assets/bandera/va.svg').default,
    'vc': require('@/../public/assets/bandera/vc.svg').default,
    've': require('@/../public/assets/bandera/ve.svg').default,
    'vn': require('@/../public/assets/bandera/vn.svg').default,
    'vu': require('@/../public/assets/bandera/vu.svg').default,
    'ws': require('@/../public/assets/bandera/ws.svg').default,
    'ye': require('@/../public/assets/bandera/ye.svg').default,
    'za': require('@/../public/assets/bandera/za.svg').default,
    'zm': require('@/../public/assets/bandera/zm.svg').default,
    'zw': require('@/../public/assets/bandera/zw.svg').default,
};

/**
 * Componente para mostrar un placeholder cuando no se encuentra una bandera
 */
import React from 'react';

const DefaultFlag = (props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="12"
        viewBox="0 0 18 12"
        {...props}
    >
        <rect width="18" height="12" fill="#DDDDDD" />
        <text
            x="9"
            y="7"
            fontSize="6"
            textAnchor="middle"
            fill="#666666"
        >
            {props.code?.toUpperCase() || '?'}
        </text>
    </svg>
);

/**
 * Función para obtener un componente de bandera según el código de país
 * @param {string} countryCode - Código ISO del país (2 caracteres)
 * @returns {React.ComponentType} Componente React que renderiza la bandera
 */
export const getFlag = (countryCode) => {
    if (!countryCode) {
        return (props) => <DefaultFlag {...props} />;
    }

    // Normaliza el código a minúsculas para buscar en el mapa
    const code = countryCode.toLowerCase();

    // Si existe en el mapa, devuelve el componente
    if (flagMap[code]) {
        return flagMap[code];
    }

    // Si no existe, devuelve un componente placeholder
    return (props) => <DefaultFlag code={countryCode} {...props} />;
};

export default flagMap;