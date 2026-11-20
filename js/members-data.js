// Anadolu Spotting Team — Üye Veritabanı
// Excel dosyasından (üyeller.xlsx) otomatik aktarılmıştır.
// Toplam 26 Üye

const MEMBERS = [
  {
    "name": "spoterkrinco",
    "fullName": "Emir Ali Aydar",
    "city": "İstanbul/LTFM",
    "role": "Ekip Başkan Yardımcısı",
    "link": "https://www.instagram.com/spoterkrinco/",
    "photo": "img/members/Emir Ali Aydar.jpg"
  },
  {
    "name": "spottingdeniz",
    "fullName": "",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/spottingdeniz/",
    "photo": ""
  },
  {
    "name": "spotter5858",
    "fullName": "",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/spotter5858/",
    "photo": ""
  },
  {
    "name": "ltauspotter",
    "fullName": "",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/ltauspotter/",
    "photo": "img/members/Ltau Spoter.jpg"
  },
  {
    "name": "izmirspotterkemal",
    "fullName": "",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/izmirspotterkemal/",
    "photo": ""
  },
  {
    "name": "cinarspotting",
    "fullName": "Çağan Çınar",
    "city": "Dalaman/LTBS",
    "role": "Ekip Başkanı",
    "link": "https://www.instagram.com/cinarspotting/",
    "photo": "img/members/Çağan Çınar.jpg"
  },
  {
    "name": "spotter_buyrucu",
    "fullName": "",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/spotter_buyrucu/",
    "photo": ""
  },
  {
    "name": "aliefe_aviation1",
    "fullName": "",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/aliefe_aviation1/",
    "photo": ""
  },
  {
    "name": "ncxq_spotting",
    "fullName": "",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/ncxq_spotting/",
    "photo": ""
  },
  {
    "name": "ltai_sptr",
    "fullName": "",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/ltai_sptr/",
    "photo": ""
  },
  {
    "name": "planespotterkerim",
    "fullName": "Kerim Yılmaz",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/planespotterkerim/",
    "photo": ""
  },
  {
    "name": "flightnumberturk57",
    "fullName": "Arda Tuna Öztürk",
    "city": "İstanbul/LTFM",
    "role": "Kıdemli Yönetim Kurulu",
    "link": "https://www.instagram.com/flightnumberturk57/",
    "photo": ""
  },
  {
    "name": "spotterahmet58",
    "fullName": "Ahmet güney üzüm",
    "city": "İstanbul/LTFJ",
    "role": "Üye",
    "link": "https://www.instagram.com/spotterahmet58/",
    "photo": "img/members/Ahmet güney üzüm.jpg"
  },
  {
    "name": "spotterkutay",
    "fullName": "",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/spotterkutay/",
    "photo": ""
  },
  {
    "name": "spotter_taha1",
    "fullName": "Taha Arslan",
    "city": "İstanbul/LTFM",
    "role": "Üye",
    "link": "https://www.instagram.com/spotter_taha1/",
    "photo": "img/members/Taha ARslan.jpg"
  },
  {
    "name": "emrespotter",
    "fullName": "Emre Bıyık",
    "city": "İstanbul/LTFM",
    "role": "Yönetim Kurulu",
    "link": "https://www.instagram.com/emrespotter/",
    "photo": "img/members/Emre Bıyık.jpg"
  },
  {
    "name": "aviation.t.t",
    "fullName": "",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/aviation.t.t/",
    "photo": ""
  },
  {
    "name": "spoting_in_cappadocia",
    "fullName": "",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/spoting_in_cappadocia/",
    "photo": ""
  },
  {
    "name": "ozturkspotter",
    "fullName": "",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/ozturkspotter/",
    "photo": ""
  },
  {
    "name": "flaps_andframes",
    "fullName": "",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/flaps_andframes/",
    "photo": ""
  },
  {
    "name": "memospotting",
    "fullName": "Mehmet Küçükalemdar",
    "city": "Kayseri/LTAU",
    "role": "Üye",
    "link": "https://www.instagram.com/memospotting/",
    "photo": "img/members/Mehmet Küçükalemdar.jpg"
  },
  {
    "name": "berkxzaviation3",
    "fullName": "",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/berkxzaviation3/",
    "photo": ""
  },
  {
    "name": "spotter_ruzgar",
    "fullName": "Rüzgar Büyükyenigün",
    "city": "İstanbul/LTFM",
    "role": "Ekip Başkan Yardımcısı",
    "link": "https://www.instagram.com/spotter_ruzgar/",
    "photo": "img/members/Rüzgar Büyükyenigün.jpg"
  },
  {
    "name": "spotter_keremm",
    "fullName": "Ali Kerem Öztürk",
    "city": "",
    "role": "Üye",
    "link": "https://www.instagram.com/spotter_keremm/",
    "photo": "img/members/Ali Kerem Öztürk.jpg"
  },
  {
    "name": "burakspotter_",
    "fullName": "Burak Çelik",
    "city": "İstanbul/LTFJ",
    "role": "Üye",
    "link": "https://www.instagram.com/burakspotter_/",
    "photo": ""
  },
  {
    "name": "spottereymen6",
    "fullName": "",
    "city": "İstanbul/LTFM",
    "role": "Yönetim Kurulu Adayı",
    "link": "https://www.instagram.com/spottereymen6/",
    "photo": ""
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MEMBERS };
}
