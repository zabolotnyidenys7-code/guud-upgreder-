const ageGateKey = 'bestUpgraderAgeGate';
const adminSessionKey = 'bestUpgraderAdminSession';
const statsKey = 'bestUpgraderStats';
const supabaseClient = window.bestUpgraderSupabase || null;
const currentPage = location.pathname.split(/[\\/]/).pop() || 'index.html';
const getStats = () => JSON.parse(localStorage.getItem(statsKey) || '{"casesOpened":0,"spins":0,"wins":0,"losses":0,"purchases":0,"sales":0,"totalSpent":0,"totalEarned":0}');
const track = (event, amount = 0) => {
  const stats = getStats();
  stats[event] = (stats[event] || 0) + 1;
  if (event === 'totalSpent' || event === 'totalEarned') stats[event] += amount;
  localStorage.setItem(statsKey, JSON.stringify(stats));
};
if (!['login.html', 'admin.html'].includes(currentPage) && localStorage.getItem(ageGateKey) !== 'accepted') {
  location.replace('login.html');
}

const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
if (menuButton && nav) menuButton.addEventListener('click', () => nav.classList.toggle('open'));

const balanceKey = 'lootDistrictBalance';
const itemsKey = 'lootDistrictItems';
const skinImages = {
  'AK-47 | Redline': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-RHGavzedxuPUnFniykEtzsWWBzoyuIiifaAchDZUjTOZe4RC_w4buM-6z7wzbgokUyzK-0H08hRGDMA',
  'Glock-18 | Water Elemental': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK72fB3aFxP11te99cCW6khUz_TjVyompc3-QOFR2DJQkFOMJtBbqk9LlY-7n5QLZjtkTxCWqhixPv311o7FVIf8eASQ',
  'M4A1-S | Printstream': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9lj_F7Rienhgk1tjyIpYPwJiPTcAAoCpsiEO5ZsUbpm9C2Zuni4VHW3o5EzSX62HxP7Sg96-hWVqYi_6TJz1aW0nxrkGs',
  'AWP | Asiimov': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6V-Kf2cGFidxOp_pewnF3nhxEt0sGnSzN76dH3GOg9xC8FyEORftRe-x9PuYurq71bW3d8UnjK-0H0YSTpMGQ',
  'AWP | Dragon Lore': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk4veqYaF7IfysCnWRxuF4j-B-Xxa-kBkupjDLw96pcX6TZg5yCZJ5TbNZtxjtwNS2NemztgDbidoQyH-sjCga6no-6_FCD_QEyQmfGQ',
  'USP-S | Kill Confirmed': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_uV_vO1WTCa9kxQ1vjiBpYPwJiPTcFB2Xpp5TO5cskG9lYCxZu_jsVCL3o4Xnij23ClO5ik9tegFA_It8qHJz1aWe-uc160',
  'Desert Eagle | Blaze': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7vORbqhsLfWAMWuZxuZi_uI_TX6wxxkjsGXXnImsJ37COlUoWcByEOMOtxa5kdXmNu3htVPZjN1bjXKpkHLRfQU',
  'M4A4 | Howl': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afVSKP-EAm6extF7teVgWiT9wh5_5zyAwo6oeSrDawUkCMN0QbEM5BO-wNazMe3qsgHZg4wQyy-t2jQJsHi3nDJ37A',
  'AK-47 | Vulcan': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSMuWRDGKC_uJ_t-l9AXCxxEh14zjTztivci2ePQZ2W8NzTecD4BKwloLiYeqxtAOIj9gUyyngznQeF7I6QE8',
  'AWP | Hyper Beast': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V6x0MPWBMWWVwP1ij-1gSCGn20pxtm_WzNuoeHKeaFAnCZUiTe5bt0HqxofmZOrm5Q2IjoMQzS_5iShXrnE8NzWs__c',
  'Glock-18 | Fade': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a7s2oaaBoH_yaCW-Ej-8u5bZvHnq1w0Vz62TUzNj4eCiVblMmXMAkROJeskLpkdXjMrzksVTAy9US8PY25So',
  'AK-47 | Fire Serpent': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0PSneqF-JeKDC2mE_u995LZWTTuygxIYvzSCkpu3cnvFPQB2DpUkROFY4Rntw93lP7i241DbiI1BxSuviHlKunk_6-sHU71lpPMTRLyP4Q',
  'M4A1-S | Hyper Beast': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_OGMWrEwL9JuPh5SjuMlxgmoCm6lob-KT-JbwF1WZEjR-YJskK9k9XiYePltAeNjYlAxSn5j34dvCZstb4LB6Ut-7qX0V8Xkv5_2A',
  'Desert Eagle | Printstream': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk7OeRbKFsJ8-DHG6e1f1iouRoQha_nBovp3OGmdeqInyVP1V0XsYlRbEI50a5wNyzZr605AyI3t5MmCSohylAuC89_a9cBoMY9UkV',
  'Bayonet | Doppler': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLzn4_v8ydP0POjV6BiMOCfC3Wv0eZ3o-Q7cCW6khUz_TjRnNesInvCZ1chXsZ0FLZfsEKxltOyZOzitQLdj40WnCSq3SpO5yt1o7FVDNJZV5E',
  'Butterfly Knife | Fade': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Z-ua6bbZrLOmsD2avx-9ytd5lRi67gVNwsDvSwtqqc3iXZg4kCZYjReYLtRbum9XgYuvm5wbWjtgUzCn3iSsf8G81tFEeH9rw',
  'Karambit | Tiger Tooth': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Q7uCvZaZkNM-SAFiEyOlzot5mXSi9khgYvzSCkpu3eC3BbwUmCcMlQbMD4xG_w9zkPu7gsQXe2YJFzHqqjixL5ylr4ukAWb1lpPNV9oeSnQ',
  'M9 Bayonet | Doppler': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1Wts2sab1iLvWHMWad_up5oPFlSjuMhRUmoDjUpYPwJiPTcA8nCcZ1EOcDu0Lum9CzZO6w4Fbeg4wQxX392ykb6yc4troKAPIm-6fJz1aWPFsIQnE',
  'Gut Knife | Gamma Doppler': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL6kJ_m-B1c-uaRaalSJ_GeA2avxeFmoO1sXRajnRw0tmy6lob-KT-JbwN0WZR2Re5fuxXswdKxP-Kx5Qzdj9hCnn6qiyIb5yc45-1QA6Ut_LqX0V-_N17M0A',
  'Glock-18 | Bunsen Burner': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a_s2pZKtuK6HLMWGcwONzo95rQzy2qhEutDWR1Nb7IC-TOw4hCZF5FOJe40W5lILlZLvktAHXiIJMyST_3XlIv3k94escEf1yWue1sjU',
  'MP9 | Sand Scale': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f_CNk5_uqbelgMKmsAm6Xyfo4tuA9TnDrzB5w5GTczo74cnyTblAkWcclRuYIuhXplde2ZePl4FTc2ZUFk3tXKn8xpQ',
  'MAC-10 | Candy Apple': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5WxrR1I4M28baBSLPmUBnPemLZw4rk6Gi3gxkp_5W3Qmdv_cnrDPwZ1Asd2FOcM5BO4k4KxMe7h7xue1dzcbAPD_Q',
  'P250 | Sand Dune': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwjFU0OGvZqBSLPmUBnPelesn5-RrSXDlwRhx5TjSwtmocCifPwQpDpshReBfsxPrk4DhNu3jshue1dy8VcXxuA',
  'USP-S | Forest Leaves': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSM-CsAmKR1-tlj-1gSCGn2xgh5W3Rwo2gcH6eP1IhWcYmTeYO4xTsw9TmY-mx5Q3a3ogQmSqsiCtXrnE8utrnVdI',
  'FAMAS | Survivor Z': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3n5vh7h1Y-s2oaalsM8-fC2mEwNF6ueZhW2exlE8hsTzcw4n4JC7BOAQpCscmRrRe5xW7w9TgNu7itAHWiYpAziqokGoXuXR1eqm1',
  'MP7 | Cirrus': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8jsHf-jFk6fugaahSMP-cAmOVwOpg4t5lRi67gVMj5j6Dwtaocy6UOAIgApNyQrQOshS7lIXlMbvqslHfi41Eyi7823xK8G81tHGGql6L',
  'Galil AR | Akoben': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2n5rp8SNJ0OG-V6NsLPmfMWabzuxzvt5lRi67gVMlt2_dzd6qcH2TOgN0CpIlE7Ve5hbukdW0MrixslPW2IgQzyv8jypI8G81tJzCUipD',
  'Five-SeveN | Scrawl': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3l4Dl7idN6vyRa7FSJvmFC3SV1-t4j-BlXyGyqhIqtjqEpYPwJiPTcAInA5J0FO9csBSww4bhZruzswLcjIsXmCusjCsbuno_57tXUqB386HJz1aW2pI_m5Q',
  'Tec-9 | Ice Cap': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLlm5W5wiNW0Oara5s0H-OWD1iDwOJij-1gSCGn2xtz5TjdyNquJX-XaVV0CMd3EOUP5Bjsw93uP77jsVHejohEyH6t339XrnE8zMglqPs',
  'PP-Bizon | Space Cat': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLzl4zv8x1Y-s2sYb5iLs-AHmaTxO13pN5lRi67gVN04jvcmYv6IHnGbw51XsYmQO5ftBG9xoexNrix4gPYjIJEzX_2iX9I8G81tOIzQC5J',
  'XM1014 | Watchdog': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLpk8ewrHZk6OGRcKk8cKHHMXCR1e1-tO5ucCW6khUz_W2Dz9ehdHuWZwN2CJd0EOYDt0LpxNG2Zr6w4w3ei48UyC2riCJN6Sl1o7FVTxWp7to',
  'MAG-7 | Insomnia': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8n5G3wiFO0P-vb_NSKf6AAWqeyO9JvOhuRz39wh4k4TzUnN_9cC6WO1J2DJdyROcI4BC9x9XmN-vj71eN34xAzC33hzQJsHiziLtbUA',
  'P90 | Freight': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhx8bf-jFk_6v-V6diLuSSB2mV09F6ueZhW2fhk09ytjmDm4n8JHOebQEgCMAmQrEMuhi4k4W0MurntVHfid5GnC38kGoXuRB1lB54',
  'M4A4 | Magnesium': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiVI0P_6afBSI_icHneV09FxuO56Wxa_nBovp3OAzo2vdHPFPFUmCJRxRbNZ4xewx9W1Nb7j4gzXg99Ayy73iC1Aun1q_a9cBiEfMG3G',
  'AK-47 | Uncharted': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSIeqHC2SvzedxuPUnFnCwwBl_5D_Syon8dnyUaQUlD5oiQ7ECuxW7l920ZL-w4AfX2IlByTK-0H0PRM7cOA',
  'AWP | Acheron': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf9Ttk4eetZKFsMs-ABXKczf1JouRtTSWmkCIrujqNjsH4eC-ROFMkDccjR7EDsBCxlN2xZu7jtlaNj4pMxSr8hiIc53tt67kHT-N7rafi4HxI',
  'Glock-18 | Moonrise': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1a7s2pZKtuK8_CVliF0-x3vt5kQCa9qhsipTiXpYPwJiPTcANzXJNyFOEMthXsktHhMLzl4FaK3toWn3iqhi9BvHw9su5UU6Zw-_bJz1aWcX-Jd_0',
  'M4A1-S | Nitro': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H-OcMWiCwOBxtd5oTCq2mwk0jDGMnYftb3nFaVQgApQiQuEOukS-x4KxP-PjsQOLjt9HzS6t2CpB6C0_4LxWBaA7uvqANEieesU',
  'SSG 08 | Abyss': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLijZGwpR1a_s2ibbJkIeSbD2mvzedxuPUnH3_jzE1y4TvQyIr9JyieZlckCsRxF-8K50bsxN3gZOzktAzc2IJEzDK-0H1XlSI8xg',
  'Desert Eagle | Light Rail': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6OGRbKFsJ_yWMWKIztF6ueZhW2fhlhlw6m-GnNyvIiiXOwQoDMR2QbZe5hi5k9KxN-vhtFbciN1FnyqskGoXuU4JtHUo',
  'AK-47 | Elite Build': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSLfGAGmKC2NF6ueZhW2e2wh9y5GjTztirdSqfP1dyCpclR7FZ5xe9wNbhZei25FGPjokXxC2vkGoXuQLr5jvs',
  'AWP | PAW': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_C9k7uW-V7RsN-CSGVicyOl-pK84Tn-3xkgltWWGnI39c3LDaA4lD5V0QO8It0LqktfuMOrq7gDajYJG02yg2bUm5WIV',
  'M4A4 | Evil Daimyo': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiFO0P_6afBSJeaaAliUwOd7qe5WQyC0nQlp4GqGz42ucCqXaQMhDpd4R-AIsxK6ktXgZePltVPXitoRn3-tjCgd6zErvbijVJZd2Q',
  'USP-S | Cortex': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLkjYbf7itX6vytbbZSI-WsG3SA_u1jpN5lRi67gVNz4G7Qm938cS_Da1AhXpB1EeVb4xm4mtDjN7vj4A3b2NpGyCr52i4Y8G81tMzdoYZ7',
  'Glock-18 | Vogue': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL2kpnj9h1Y-s2pZKtuK8-WF2KTzuBiseJ9cCW6khUz_T-GyNavdCqRawN1CMFwTOcO5hO7loXiY-zmsQKPi44QzHj22ikcvy11o7FVfFOBmfY',
  'MP9 | Starlight Protector': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8js_f-jFk4uL3V7d5IeKfB2CY1dF6ueZhW2flkUtztz_SzYypJSqRalUhDJNwQO4PsBXtx9HkN-K37w3bgohGmHn3kGoXuZ3lRdvF',
  'P250 | See Ya Later': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLhzMOwwiFO0OL8PfRSI-mRC3WT0-F1j-1gSCGn2x9ytmzWnN6pInjGOwMlDZp0EORe5BHsx93lP7zr5wzbiI5AyXr_jS9XrnE8gQrIgng',
  'FAMAS | Commemoration': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL3n5vh7h1c_M2oaalsM8-fC2CRwvdJt-5lSxa_nBovp3PUztn4d3qSPQ8kDMR5ROVb4xCxw9a0NLni4lCIio4QzXn32yMb6Sds_a9cBr1TwPEt',
  'M4A1-S | Leaded Glass': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwjFS4_ega6F_H_eAMWrEwL9Jo-loWz22hyIrujqNjsH8dn6ePwB2DpEmFuAMt0HulYa1Nu2z4QWPjt9NnCX63H9M5ys96r1QT-N7rZDTLd1E',
  'AK-47 | Ice Coaled': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwlcK3wiFO0POlPPNSI_-UGm-Zz-llj-1gSCGn2x4l5z_RyNj6JXnEbgFzXMYjEOUIsBe5m9exP-zg4leMj4pGxXn7jCJXrnE84asPq_0',
  'AWP | Fever Dream': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyLwiYbf_jdk7uW-V7R-OfObAXeR1eZJvOhuRz39kE1w4jiAzNiod3qTOgcgXpAlQ-ML5hjqxtHjZOrrtlHWit9EyCj9iDQJsHhCZP-wUg',
  'M4A4 | The Emperor': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL8ypexwiVI0P_6afBSJf2DC3Wf09F6ueZhW2exwBh_6m3dnt36InjDPQ4oXJt1TbJeshW_mtfjN-vrsgaKiokWy333kGoXuRj4z9Nd',
  'Desert Eagle | Mecha Industries': 'https://community.steamstatic.com/economy/image/i0CoZ81Ui0m-9KwlBY1L_18myuGuq1wfhWSaZgMttyVfPaERSR0Wqmu7LAocGIGz3UqlXOLrxM-vMGmW8VNxu5Dx60noTyL1m5fn8Sdk6OGRbKFsJ_yWMWqVwuZ3j-1gSCGn20h042vSyY2tdyjCZwIlXJBxQeNe4EWxxoHkMOq0sQGIid5Fnyr42HtXrnE8p4gbgvE'
};
const getSkinImage = name => skinImages[name] || '';
Object.assign(skinImages, {
  'AWP | Oni Taiji': skinImages['AWP | Hyper Beast'],
  'AK-47 | Legion of Anubis': skinImages['AK-47 | Fire Serpent'],
  'M4A1-S | Blue Phosphor': skinImages['M4A1-S | Printstream'],
  'Glock-18 | Bullet Queen': skinImages['Glock-18 | Fade'],
  'USP-S | Neo-Noir': skinImages['USP-S | Cortex'],
  'Desert Eagle | Code Red': skinImages['Desert Eagle | Printstream'],
  'M4A4 | In Living Color': skinImages['M4A4 | Howl'],
  'AK-47 | Head Shot': skinImages['AK-47 | Vulcan'],
  'AWP | Chrome Cannon': skinImages['AWP | Hyper Beast'],
  'M4A1-S | Printstream 2': skinImages['M4A1-S | Printstream'],
  'Glock-18 | Vogue 2': skinImages['Glock-18 | Vogue'],
  'P250 | Asiimov': skinImages['P250 | See Ya Later'],
  'MP9 | Food Chain': skinImages['MP9 | Starlight Protector'],
  'FAMAS | Rapid Eye Movement': skinImages['FAMAS | Commemoration'],
  'AK-47 | Slate': skinImages['AK-47 | Elite Build'],
  'AWP | Duality': skinImages['AWP | PAW'],
  'M4A4 | Poly Mag': skinImages['M4A4 | Magnesium'],
  'USP-S | Ticket to Hell': skinImages['USP-S | Forest Leaves'],
  'Glock-18 | Umbral Rabbit': skinImages['Glock-18 | Moonrise'],
  'MP7 | Abyssal Apparition': skinImages['MP7 | Cirrus'],
  'P90 | Vent Rush': skinImages['P90 | Freight'],
  'M4A1-S | Briefing': skinImages['M4A1-S | Nitro'],
  'Galil AR | Chromatic Aberration': skinImages['Galil AR | Akoben'],
  'SSG 08 | Turbo Peek': skinImages['SSG 08 | Abyss'],
  'Desert Eagle | Ocean Drive': skinImages['Desert Eagle | Light Rail']
});
const affordableSkins = [
  ['Glock-18 | Bunsen Burner', 'COMMON', 40],
  ['MP9 | Sand Scale', 'COMMON', 45],
  ['MAC-10 | Candy Apple', 'COMMON', 55],
  ['P250 | Sand Dune', 'COMMON', 60],
  ['Nova | Polymer', 'COMMON', 65],
  ['USP-S | Forest Leaves', 'COMMON', 70],
  ['FAMAS | Survivor Z', 'COMMON', 80],
  ['MP7 | Cirrus', 'COMMON', 90],
  ['Galil AR | Akoben', 'COMMON', 100],
  ['Five-SeveN | Scrawl', 'COMMON', 110],
  ['Tec-9 | Ice Cap', 'COMMON', 120],
  ['PP-Bizon | Space Cat', 'COMMON', 135],
  ['XM1014 | Watchdog', 'COMMON', 150],
  ['MAG-7 | Insomnia', 'COMMON', 165],
  ['P90 | Freight', 'COMMON', 180],
  ['M4A4 | Magnesium', 'RARE', 200],
  ['AK-47 | Uncharted', 'RARE', 220],
  ['AWP | Acheron', 'RARE', 240],
  ['Glock-18 | Moonrise', 'RARE', 260],
  ['M4A1-S | Nitro', 'RARE', 280],
  ['SSG 08 | Abyss', 'RARE', 300],
  ['Desert Eagle | Light Rail', 'RARE', 330],
  ['AK-47 | Elite Build', 'RARE', 360],
  ['AWP | PAW', 'RARE', 390],
  ['M4A4 | Evil Daimyo', 'RARE', 420],
  ['USP-S | Cortex', 'RARE', 460],
  ['Glock-18 | Vogue', 'RARE', 520],
  ['MP9 | Starlight Protector', 'RARE', 600],
  ['P250 | See Ya Later', 'RARE', 680],
  ['FAMAS | Commemoration', 'RARE', 760],
  ['M4A1-S | Leaded Glass', 'EPIC', 850],
  ['AK-47 | Ice Coaled', 'EPIC', 950],
  ['AWP | Fever Dream', 'EPIC', 1050],
  ['M4A4 | The Emperor', 'EPIC', 1150],
  ['Desert Eagle | Mecha Industries', 'EPIC', 1200]
];
affordableSkins.push(
  ['Glock-18 | Vogue 2', 'RARE', 340],
  ['P250 | Asiimov', 'RARE', 390],
  ['MP9 | Food Chain', 'RARE', 450],
  ['FAMAS | Rapid Eye Movement', 'RARE', 520],
  ['AK-47 | Slate', 'RARE', 600],
  ['M4A4 | Poly Mag', 'RARE', 680],
  ['USP-S | Ticket to Hell', 'RARE', 740],
  ['Glock-18 | Umbral Rabbit', 'RARE', 800],
  ['MP7 | Abyssal Apparition', 'EPIC', 860],
  ['P90 | Vent Rush', 'EPIC', 920],
  ['M4A1-S | Briefing', 'EPIC', 980],
  ['Galil AR | Chromatic Aberration', 'EPIC', 1050],
  ['SSG 08 | Turbo Peek', 'EPIC', 1120],
  ['Desert Eagle | Ocean Drive', 'EPIC', 1180],
  ['AWP | Duality', 'EPIC', 1250]
);
const newShopSkins = [
  ...affordableSkins,
  ['M4A4 | Howl', 'LEGENDARY', 6500],
  ['AK-47 | Vulcan', 'EPIC', 2800],
  ['AWP | Hyper Beast', 'EPIC', 2400],
  ['Glock-18 | Fade', 'LEGENDARY', 4200],
  ['AK-47 | Fire Serpent', 'LEGENDARY', 7500],
  ['Bayonet | Doppler', 'LEGENDARY', 12000],
  ['Butterfly Knife | Fade', 'LEGENDARY', 18000],
  ['Karambit | Tiger Tooth', 'LEGENDARY', 25000],
  ['M9 Bayonet | Doppler', 'LEGENDARY', 30000],
  ['Gut Knife | Gamma Doppler', 'LEGENDARY', 9500],
  ['AWP | Oni Taiji', 'LEGENDARY', 4200],
  ['AK-47 | Legion of Anubis', 'LEGENDARY', 5200],
  ['M4A1-S | Blue Phosphor', 'LEGENDARY', 7800],
  ['Glock-18 | Bullet Queen', 'LEGENDARY', 3600],
  ['USP-S | Neo-Noir', 'EPIC', 2100],
  ['Desert Eagle | Code Red', 'EPIC', 2600],
  ['M4A4 | In Living Color', 'EPIC', 2900],
  ['AK-47 | Head Shot', 'EPIC', 3200],
  ['AWP | Chrome Cannon', 'EPIC', 3800],
  ['M4A1-S | Printstream 2', 'EPIC', 4500]
];
const getUpgradedItem = item => {
  const options = newShopSkins
    .filter(skin => skin[2] > item.value)
    .sort((a, b) => a[2] - b[2]);
  const target = options[0] || newShopSkins[newShopSkins.length - 1];
  return { name: target[0], rarity: target[1], value: target[2], image: getSkinImage(target[0]) };
};
const CASE_REWARD_MIN = 10;
const caseRewardCaps = {
  100: 80,
  250: 150,
  350: 220,
  500: 300,
  750: 500,
  1000: 700,
  1250: 850,
  1500: 1000
};
const chooseReward = (rewards, caseCost) => {
  const maxReward = caseRewardCaps[caseCost] || Math.max(CASE_REWARD_MIN, caseCost);
  const affordableRewards = rewards.filter(reward => reward[2] >= CASE_REWARD_MIN && reward[2] <= maxReward);
  const fallbackRewards = affordableSkins.filter(skin => skin[2] >= CASE_REWARD_MIN && skin[2] <= maxReward);
  const pool = affordableRewards.length ? affordableRewards : fallbackRewards;
  const weighted = pool.map(reward => ({ reward, weight: Math.pow(maxReward / reward[2], 0.75) }));
  const totalWeight = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = Math.random() * totalWeight;
  for (const entry of weighted) {
    cursor -= entry.weight;
    if (cursor <= 0) return entry.reward;
  }
  return pool[pool.length - 1];
};
const caseRewards = {
  'Стартовый кейс': [
    ...affordableSkins.slice(0, 15),
    ['AK-47 | Redline', 'RARE', 420],
    ['Glock-18 | Water Elemental', 'RARE', 520],
    ['USP-S | Kill Confirmed', 'RARE', 610]
  ],
  'Неоновый кейс': [
    ...affordableSkins.slice(8, 25),
    ['AK-47 | Redline', 'RARE', 420],
    ['Glock-18 | Water Elemental', 'RARE', 520],
    ['M4A1-S | Printstream', 'EPIC', 1600],
    ['USP-S | Kill Confirmed', 'RARE', 610]
  ],
  'Городской кейс': [
    ...affordableSkins.slice(18, 35),
    ['Glock-18 | Water Elemental', 'RARE', 520],
    ['M4A1-S | Printstream', 'EPIC', 1600],
    ['AWP | Asiimov', 'EPIC', 3000],
    ['Desert Eagle | Blaze', 'EPIC', 1800]
  ],
  'Золотой кейс': [
    ...affordableSkins.slice(25),
    ['M4A1-S | Printstream', 'EPIC', 1600],
    ['AWP | Asiimov', 'EPIC', 3000],
    ['AWP | Dragon Lore', 'LEGENDARY', 50000],
    ['AK-47 | Vulcan', 'EPIC', 2800]
  ],
  'Теневой кейс': [
    ['AWP | Asiimov', 'EPIC', 3000],
    ['AWP | Hyper Beast', 'EPIC', 2400],
    ['Desert Eagle | Blaze', 'EPIC', 1800],
    ['AK-47 | Fire Serpent', 'LEGENDARY', 7500]
  ],
  'Кейс элиты': [
    ['AWP | Dragon Lore', 'LEGENDARY', 50000],
    ['M4A4 | Howl', 'LEGENDARY', 6500],
    ['Glock-18 | Fade', 'LEGENDARY', 4200],
    ['Bayonet | Doppler', 'LEGENDARY', 12000]
  ],
  'Вольт-кейс': [
    ['AK-47 | Vulcan', 'EPIC', 2800],
    ['AK-47 | Fire Serpent', 'LEGENDARY', 7500],
    ['Gut Knife | Gamma Doppler', 'LEGENDARY', 9500],
    ['Butterfly Knife | Fade', 'LEGENDARY', 18000]
  ],
  'Королевский кейс': [
    ['M4A4 | Howl', 'LEGENDARY', 6500],
    ['Bayonet | Doppler', 'LEGENDARY', 12000],
    ['Butterfly Knife | Fade', 'LEGENDARY', 18000],
    ['Karambit | Tiger Tooth', 'LEGENDARY', 25000],
    ['M9 Bayonet | Doppler', 'LEGENDARY', 30000]
  ]
};
if (localStorage.getItem('bestUpgraderBalanceVersion') !== '4') {
  localStorage.setItem(balanceKey, '2000');
  localStorage.setItem('bestUpgraderBalanceVersion', '4');
}
const getBalance = () => Number(localStorage.getItem(balanceKey) || 2000);
const getItems = () => JSON.parse(localStorage.getItem(itemsKey) || '[]');
const saveItems = items => localStorage.setItem(itemsKey, JSON.stringify(items));
const updateState = () => {
  document.querySelectorAll('#balance').forEach(node => node.textContent = getBalance().toLocaleString('ru-RU'));
  document.querySelectorAll('#itemCount, #profileItems').forEach(node => node.textContent = getItems().length);
};
const changeBalance = amount => localStorage.setItem(balanceKey, String(getBalance() + amount));
updateState();

const header = document.querySelector('.header');
if (header && !header.querySelector('.header-actions')) {
  const actions = document.createElement('div');
  actions.className = 'header-actions';
  actions.innerHTML = '<button class="donate-button" type="button">Донат</button><a class="plus-button" href="https://t.me/unfixd" target="_blank" rel="noopener" title="Написать администратору в Telegram">+</a><a class="admin-link" href="login.html">Вход</a>';
  header.appendChild(actions);
  if (nav && !nav.querySelector('a[href="shop.html"]')) {
    const shopLink = document.createElement('a');
    shopLink.href = 'shop.html';
    shopLink.textContent = 'Магазин';
    nav.appendChild(shopLink);
  }
}
document.querySelectorAll('.donate-button').forEach(button => button.addEventListener('click', () => alert('Упс, оплата ещё не доступна.')));

const renderInventory = () => {
  const inventory = document.querySelector('#inventory');
  if (!inventory) return;
  const items = getItems();
  if (!items.length) {
    inventory.innerHTML = '<div class="empty">Инвентарь пуст. Открой кейс, чтобы получить первый скин.</div>';
    return;
  }
  inventory.innerHTML = items.map((item, index) => `
    <article class="inventory-item">
      ${item.image || getSkinImage(item.name) ? `<img class="skin-image" src="${item.image || getSkinImage(item.name)}" alt="${item.name}" loading="lazy">` : ''}
      <span class="rarity">${item.rarity}</span>
      <strong>${item.name}</strong>
      <small>Стоимость: ${item.value} ◈</small>
      <button class="sell-skin" data-index="${index}">Продать за ${item.value} ◈</button>
    </article>`).join('');
  inventory.querySelectorAll('.sell-skin').forEach(button => button.addEventListener('click', () => {
    const current = getItems();
    const [sold] = current.splice(Number(button.dataset.index), 1);
    saveItems(current);
    changeBalance(sold.value);
    track('sales');
    track('totalEarned', sold.value);
    renderInventory();
    updateState();
  }));
};
renderInventory();

document.querySelectorAll('.open-case').forEach(button => button.addEventListener('click', () => {
  const cost = Number(button.dataset.cost);
  const caseName = button.dataset.case;
  if (getBalance() < cost) {
    alert('Недостаточно виртуальных монет.');
    return;
  }
  const rewards = caseRewards[caseName] || caseRewards['Стартовый кейс'];
  const reward = chooseReward(rewards, cost);
  changeBalance(-cost);
  track('casesOpened');
  track('totalSpent', cost);
  const result = document.querySelector('#caseResult');
  result.hidden = false;
  result.classList.add('case-opening');
  const rewardImage = getSkinImage(reward[0]);
  result.innerHTML = `${rewardImage ? `<img class="skin-image case-reward-image" src="${rewardImage}" alt="${reward[0]}">` : ''}<strong>Выпал скин: ${reward[0]}</strong><br><span>${reward[1]} · ${reward[2]} ◈</span><div class="case-actions"><button class="button keep-reward">Оставить в инвентарь</button><button class="sell-reward">Продать за ${reward[2]} ◈</button></div>`;
  const rewardItem = { name: reward[0], rarity: reward[1], value: reward[2], image: rewardImage };
  result.querySelector('.keep-reward').addEventListener('click', () => {
    saveItems([...getItems(), rewardItem]);
    result.textContent = `${reward[0]} оставлен в инвентаре.`;
    updateState();
  });
  result.querySelector('.sell-reward').addEventListener('click', () => {
    changeBalance(reward[2]);
    track('sales');
    track('totalEarned', reward[2]);
    result.textContent = `${reward[0]} продан за ${reward[2]} ◈.`;
    updateState();
  });
  result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  updateState();
}));

document.querySelectorAll('.buy-skin:not([data-bound])').forEach(button => {
  button.dataset.bound = 'true';
  button.addEventListener('click', () => {
  const price = Number(button.dataset.price);
  if (getBalance() < price) {
    alert('Недостаточно виртуального баланса.');
    return;
  }
  const item = { name: button.dataset.name, rarity: button.dataset.rarity, value: price, image: getSkinImage(button.dataset.name) };
  changeBalance(-price);
  track('purchases');
  track('totalSpent', price);
  saveItems([...getItems(), item]);
  button.textContent = 'Куплено';
  button.disabled = true;
  updateState();
  });
});

const shopGrid = document.querySelector('.shop-grid');
if (shopGrid) {
  const baseShopPrices = {
    'AK-47 | Redline': 420,
    'Glock-18 | Water Elemental': 520,
    'M4A1-S | Printstream': 1600,
    'AWP | Asiimov': 3000,
    'Karambit | Doppler': 25000,
    'AWP | Dragon Lore': 50000
  };
  shopGrid.querySelectorAll('.buy-skin').forEach(button => {
    const price = baseShopPrices[button.dataset.name];
    if (!price) return;
    button.dataset.price = price;
    button.textContent = `Купить за ${price} ◈`;
    const details = button.parentElement.querySelector('span');
    if (details) details.textContent = `${button.dataset.rarity} · ${price} ◈`;
  });
  shopGrid.insertAdjacentHTML('beforeend', newShopSkins.map(skin => `
    <article class="shop-skin">
      ${getSkinImage(skin[0]) ? `<img class="skin-preview" src="${getSkinImage(skin[0])}" alt="${skin[0]}" loading="lazy">` : '<div class="skin-preview skin-generated">◈</div>'}
      <h2>${skin[0]}</h2>
      <span>${skin[1]} · ${skin[2]} ◈</span>
      <button class="button buy-skin" data-name="${skin[0]}" data-rarity="${skin[1]}" data-price="${skin[2]}">Купить за ${skin[2]} ◈</button>
    </article>`).join(''));
  shopGrid.querySelectorAll('.buy-skin:not([data-bound])').forEach(button => {
    button.dataset.bound = 'true';
    button.addEventListener('click', () => {
      const price = Number(button.dataset.price);
      if (getBalance() < price) {
        alert('Недостаточно виртуального баланса.');
        return;
      }
      const item = { name: button.dataset.name, rarity: button.dataset.rarity, value: price, image: getSkinImage(button.dataset.name) };
      changeBalance(-price);
      track('purchases');
      track('totalSpent', price);
      saveItems([...getItems(), item]);
      button.textContent = 'Куплено';
      button.disabled = true;
      updateState();
    });
  });
}

const source = document.querySelector('#upgradeSource');
let selectedIndex = null;
const renderUpgradeSource = () => {
  if (!source) return;
  const items = getItems();
  source.innerHTML = items.length ? items.map((item, index) => `<button class="upgrade-skin ${index === 0 ? 'selected' : ''}" data-index="${index}">${item.image || getSkinImage(item.name) ? `<img class="skin-image" src="${item.image || getSkinImage(item.name)}" alt="${item.name}" loading="lazy">` : ''}<b>${item.name}</b><span>${item.value} ◈</span></button>`).join('') : '<span class="empty">Сначала открой кейс и оставь скин в инвентаре.</span>';
  selectedIndex = items.length ? 0 : null;
  source.querySelectorAll('.upgrade-skin').forEach(button => button.addEventListener('click', () => {
    source.querySelectorAll('.upgrade-skin').forEach(item => item.classList.remove('selected'));
    button.classList.add('selected');
    selectedIndex = Number(button.dataset.index);
  }));
};
renderUpgradeSource();

const spin = document.querySelector('#spin');
const multiplierPicker = document.querySelector('#multiplier');
const wheel = document.querySelector('#wheel');
const multiplierChance = { 1: 0.1, 3: 0.2, 5: 0.4, 7: 0.6 };
let selectedMultiplier = 1;
let selectedSpeed = 4000;
let wheelRotation = 0;
const updateWheel = () => {
  if (!wheel) return;
  const green = Math.round(multiplierChance[selectedMultiplier] * 360);
  const blend = 4;
  wheel.style.background = `conic-gradient(var(--green) 0deg ${Math.max(0, green - blend)}deg, #49d58b ${Math.max(0, green - 1)}deg ${green + 1}deg, var(--gray) ${green + blend}deg 360deg)`;
};
document.querySelectorAll('#multiplier .choice-button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('#multiplier .choice-button').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected');
  selectedMultiplier = Number(button.dataset.value);
  updateWheel();
}));
document.querySelectorAll('#spinSpeed .choice-button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('#spinSpeed .choice-button').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected');
  selectedSpeed = Number(button.dataset.value);
}));
updateWheel();
if (spin) spin.addEventListener('click', () => {
  const message = document.querySelector('#rouletteMessage');
  const result = document.querySelector('#skinResult');
  if (selectedIndex === null) {
    message.textContent = 'Сначала выбери скин из инвентаря.';
    return;
  }
  const items = getItems();
  const item = items[selectedIndex];
  const multiplier = selectedMultiplier;
  const chance = multiplierChance[multiplier];
  const speed = selectedSpeed;
  const greenDegrees = Math.round(chance * 360);
  const landingDegrees = Math.random() < chance
    ? Math.random() * greenDegrees
    : greenDegrees + Math.random() * (360 - greenDegrees);
  const fullTurns = speed === 2000 ? 6 : 10;
  const currentDegrees = wheelRotation % 360;
  const landingRotation = (360 - landingDegrees - currentDegrees + 360) % 360;
  wheelRotation += (fullTurns * 360) + landingRotation;
  const pointerDegrees = (360 - (wheelRotation % 360)) % 360;
  const won = pointerDegrees < greenDegrees;
  track(won ? 'wins' : 'losses');
  track('spins');
  spin.disabled = true;
  wheel.classList.remove('wheel-win', 'wheel-lose');
  document.querySelector('.roulette-box').classList.remove('roulette-win', 'roulette-lose');
  wheel.style.transitionDuration = `${speed}ms`;
  wheel.style.transform = `rotate(${wheelRotation}deg)`;
  if (!won) {
    items.splice(selectedIndex, 1);
    saveItems(items);
    renderUpgradeSource();
  }
  setTimeout(() => {
    wheel.classList.add(won ? 'wheel-win' : 'wheel-lose');
    document.querySelector('.roulette-box').classList.add(won ? 'roulette-win' : 'roulette-lose');
    let resultItem = item;
    if (won) {
      const upgradedItem = getUpgradedItem(item);
      items[selectedIndex] = upgradedItem;
      resultItem = upgradedItem;
      saveItems(items);
      renderUpgradeSource();
    }
    message.textContent = won ? `Зелёный сектор! Апгрейд ×${multiplier} успешен, скин подорожал.` : 'Серый сектор — проигрыш. Скин пропал. Не стоит лудить без остановки.';
    result.className = `skin-result visible ${won ? 'win' : 'lose'}`;
    document.querySelector('#skinName').textContent = won ? `${resultItem.name} · ${resultItem.value} ◈` : 'Скин потерян';
    document.querySelector('#skinStatus').textContent = won ? ' — улучшение успешно' : ' — предмет удалён';
    spin.disabled = false;
    updateState();
  }, speed);
});

const ageForm = document.querySelector('#ageForm');
if (ageForm) ageForm.addEventListener('submit', async event => {
  event.preventDefault();
  const error = document.querySelector('#userLoginError');
  const form = new FormData(ageForm);
  const rememberMe = form.get('rememberMe') === 'on';
  localStorage.setItem('bestUpgraderRememberMe', String(rememberMe));
  localStorage.setItem(ageGateKey, 'accepted');
  if (supabaseClient) {
    error.textContent = 'Подключение к серверу...';
    const email = String(form.get('email') || '');
    const password = String(form.get('userPassword') || '');
    const authClient = window.supabase.createClient(
      window.bestUpgraderSupabaseConfig.url,
      window.bestUpgraderSupabaseConfig.key,
      { auth: { persistSession: rememberMe } }
    );
    let result = await authClient.auth.signInWithPassword({ email, password });
    if (result.error) {
      const registration = await authClient.auth.signUp({ email, password });
      if (registration.error || !registration.data.session) {
        error.textContent = registration.error?.message || 'Проверьте почту для подтверждения аккаунта.';
        return;
      }
      result = registration;
    }
    if (result.data.user) {
      await authClient.from('profiles').upsert({ id: result.data.user.id, balance: getBalance() }, { onConflict: 'id' });
      await authClient.from('game_stats').upsert({ user_id: result.data.user.id }, { onConflict: 'user_id' });
    }
  }
  location.href = 'index.html';
});

const adminLogin = document.querySelector('#adminLogin');
if (adminLogin) adminLogin.addEventListener('submit', async event => {
  event.preventDefault();
  const form = new FormData(adminLogin);
  const error = document.querySelector('#loginError');
  if (!supabaseClient) {
    error.textContent = 'Сервер авторизации не подключен.';
    return;
  }
  const auth = await supabaseClient.auth.signInWithPassword({
    email: String(form.get('login') || ''),
    password: String(form.get('password') || '')
  });
  if (auth.error || !auth.data.user) {
    error.textContent = 'Неверный email или пароль.';
    return;
  }
  const profile = await supabaseClient.from('profiles').select('is_admin').eq('id', auth.data.user.id).maybeSingle();
  if (profile.error || !profile.data?.is_admin) {
    await supabaseClient.auth.signOut();
    error.textContent = 'У этого аккаунта нет прав администратора.';
    return;
  }
  if (auth.data.user) {
    localStorage.setItem(adminSessionKey, 'active');
    location.href = 'admin.html';
  }
});

const adminStats = document.querySelector('#adminStats');
if (adminStats) {
  const loadAdminPanel = async () => {
    const session = supabaseClient ? await supabaseClient.auth.getSession() : { data: { session: null } };
    const userId = session.data.session?.user?.id;
    const profile = userId ? await supabaseClient.from('profiles').select('is_admin').eq('id', userId).maybeSingle() : { data: null };
    if (localStorage.getItem(adminSessionKey) !== 'active' || !profile.data?.is_admin) {
      location.replace('login.html');
      return;
    }
    const stats = getStats();
    const cards = [
      ['Открыто кейсов', stats.casesOpened],
      ['Вращений рулетки', stats.spins],
      ['Побед', stats.wins],
      ['Проигрышей', stats.losses],
      ['Покупок', stats.purchases],
      ['Продаж', stats.sales],
      ['Потрачено ◈', stats.totalSpent],
      ['Заработано ◈', stats.totalEarned],
      ['Предметов сейчас', getItems().length],
      ['Баланс в браузере', getBalance()]
    ];
    adminStats.innerHTML = cards.map(card => `<article class="stat-card"><span>${card[0]}</span><strong>${Number(card[1]).toLocaleString('ru-RU')}</strong></article>`).join('');
    document.querySelector('#adminState').textContent = 'Администратор авторизован через Supabase. Локальная статистика будет перенесена в общую базу после выполнения игровых серверных операций.';
  };
  loadAdminPanel();
}
const adminLogout = document.querySelector('#adminLogout');
if (adminLogout) adminLogout.addEventListener('click', () => {
  localStorage.removeItem(adminSessionKey);
  if (supabaseClient) supabaseClient.auth.signOut();
  location.href = 'login.html';
});
