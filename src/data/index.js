import { interpret_quran } from "./1.interpret_quran";
import { tafsir_ibnu_katsir } from "./2.tafsir_ibnu_katsir";
import { pentingnya_mahdzab } from "./3.pentingnya_madzhab";
import { al_an_am_162 } from "./5.al_an_am_162";
import { al_an_am_163 } from "./6.al_an_am_163";
import { allah } from "./7.allah";
import { nabi_dan_rasul } from "./8.nabi_dan_rasul";
import { pengampun } from "./11.pengampun";
import { ridhoi_allah } from "./12.agama_yang_diridhoi";
import { pengakuan } from "./9.pengakuan";
import { hoax } from "./10.hoax";
import { al_an_am_159 } from "./4.al_an_am_159";

const datas_information = [
    ...hoax,
	...interpret_quran,
	...tafsir_ibnu_katsir,
	...pentingnya_mahdzab,
    ...al_an_am_159,
	...al_an_am_162,
	...al_an_am_163,
	...allah,
    ...nabi_dan_rasul,
    ...pengakuan,
	...pengampun,
    ...ridhoi_allah
];

export { datas_information };
