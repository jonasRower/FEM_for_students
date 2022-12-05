
//spocita vnitrni sily a deformace
class FEM {
  constructor(){


    //************************** 
    //data ze zadani
    
    // EA/L z tabulky 
    this.EALpole;

    // vektor zatizeni z tabulky
    this.Fpole;

    // vektor zatizeni prevedeny na vstup do FEM-resice
    this.F;

    // vektor s podoprami true/false
    this.podpory

    //************************** 
    
    //ziska zadani z tabulky
    this.nactiZadani();

    console.log(this.EALpole);
    this.startProgramu(this.EALpole);

    this.vysledekPosuny;
    this.vysledekVnitrniSily;

  }

  //vraci data z tridy
  getVysledekPosuny(){
    return(this.vysledekPosuny);
  }

  getVysledekVnitrniSily(){
    return(this.vysledekVnitrniSily);
  }


  startProgramu(EAL){

    //matice tuhosti Globalni
    var KGlob;

    //matice tuhosti Globalni, redukovana o kodova cisla v podporach
    var Kred;

    //redukovane zatizeni
    var Fred;

    //výsledné deformace mimo podpory
    var uRed

    //výsledné deformace včetně podor
    var uFull

    //vnitrni sily na cele konstrukci
    var vnitrniSilyNaKonstrukci = [];




    /*
    //vektor prave strany
    var F = [[0], [10], [10], [0]];

    //definuje v jakych uzlech jsou podpory
    var podpory = [true, false, false, true];
    */

    var F = this.F;
    var podpory = this.podpory;

    
  


    //sestavMaticiTuhostiGlobalni_Test(E, A, L);
    KGlob = this.sestavMaticiTuhostiGlobalni(EAL);
    Kred = this.redukujMaticiTuhosti(KGlob, podpory);
    Fred = this.redukujVektorZatizeni(F, podpory);


    console.log(this.F);
    console.log(this.EALpole);
    console.log(this.podpory);

    console.log(KGlob);
    console.log(Fred);


    uRed = this.vratReseniFKu(Kred, Fred)
    uFull = this.sestavPlnyVektorPosunu(podpory, uRed);

    //vnitrni sily na cele konstrukci
    vnitrniSilyNaKonstrukci = this.ziskejVnitrniSilyNaKonstrukci(EAL, uFull)


    //ulozi data, tak aby je mohl publikovat do jine tridy
    this.vysledekPosuny = uFull;
    this.vysledekVnitrniSily = vnitrniSilyNaKonstrukci;

    console.log(this.vysledekPosuny);
    console.log(this.vysledekVnitrniSily);



  }



  //nacte zadani z tabulky
  nactiZadani(){

    var pocetRadku;
    var EALpole = [];
    var EAL;
    var hodnotaF;
    var Fpole = [];
    var vektorF;
    var podpory = [];

    pocetRadku = $(".radekTabulkyA").length;

    for (var i = 0; i < pocetRadku; i++) {

      // ziska vektor zatizeni
      hodnotaF = $('#input_F' + i + 'A').val();
      Fpole.push(hodnotaF);

      hodnotaF = $('#input_F' + i + 'B').val();
      Fpole.push(hodnotaF);

      // ziska EA/L
      EAL= $('#EAL' + i + 'A').text();
      EALpole.push(EAL);


      //ziska vektor s podporami
      //ziska status podpory na hornim konci
      if(i == 0){
        if($('#podporaNahore_vetknuti:checked').val() == "vetknuti"){
          podpory.push(true);
        }
        else {
          podpory.push(false);
        }
      }
      else {
        podpory.push(false);
      }
    }

    //dopise status podpory na spodnim konci
    if($('#podporaDole_vetknuti:checked').val() == "vetknuti"){
      podpory.push(true);
    }
    else {
      podpory.push(false);
    }


    //prevede vektor zatizeni, tak aby byl citelny pro FEM
    vektorF = this.prevedZatizeniZTabulkyNaDataDoFEMsolveru(Fpole, pocetRadku)

    //zapise data jako tridni promenne
    this.F = vektorF;
    this.EALpole = EALpole;
    this.podpory = podpory;

  }


  //FEM solever vyzaduje vektor zatizeni jako [[10], [10], [10]...]
  //take je treba secist sily na koncich elementu, tak jelikoz pocet radku se silou F je vyssi, nez pocet uzlu (v 1 uzlu jsou 2 sily)
  prevedZatizeniZTabulkyNaDataDoFEMsolveru(Fpole, pocetRadku){

    var vektorZatizeni = [];
    var FsilaA;
    var FsilaB;
    var index = 0;

    FsilaA = 0;

    for (var i = 0; i < pocetRadku; i++) {
      FsilaB = parseInt(Fpole[index]);
      var Fsila = [];
      Fsila.push(FsilaA + FsilaB);
      vektorZatizeni.push(Fsila);

      index = index + 1;
      FsilaA =  parseInt(Fpole[index]);
      index = index + 1;
      
    }  

    //prida jeste posledni silu
    FsilaB = 0;
    Fsila = FsilaA + FsilaB;
    var Fsila = [];
    Fsila.push(FsilaA + FsilaB);
    vektorZatizeni.push(Fsila);


    //console.log(Fpole);
    //console.log(vektorZatizeni);

    return(vektorZatizeni);

  }


  sestavKLok(EAL){

    var KLok = [[EAL, -EAL], [-EAL, EAL]]; 

    return(KLok);

  }


  pridejKLokDoKGlob(KLok){

    var KGlob = [];
    
    
    //prvky lokalni matice tuhosti
    var KL11;
    var KL12;
    var KL21;
    var KL22;

    //ziska jednotlive prvky matice tuhosti lokalni
    KL11 = KLok[0][0];
    KL12 = KLok[0][1];
    KL21 = KLok[1][0];
    KL22 = KLok[1][1];

    //prida 1. radek lokalni matice tuhosti
    var KGlobRadek = [];

    KGlobRadek.push(KL11);
    KGlobRadek.push(KL12);

    KGlob.push(KGlobRadek);


    //prida 2. radek lokalni matice tuhosti
    var KGlobRadek = [];

    KGlobRadek.push(KL21);
    KGlobRadek.push(KL22);

    KGlob.push(KGlobRadek);


    //****************************************************

    var pocetRadkuKGlob;
    pocetRadkuKGlob = KGlob.length;  

    var KGlobRadek = [];
    KGlobRadek.push(0);
    KGlobRadek.push(KL11);
    KGlobRadek.push(KL12);

    KGlob.push(KGlobRadek);

    var KGlobRadek = [];
    KGlobRadek.push(0);
    KGlobRadek.push(KL21);
    KGlobRadek.push(KL22);

    KGlob.push(KGlobRadek);

    return(KGlob);

  } 


  vytvorKLok0(KLok, indexMax, pocetRadku){

    var kGlobRadek = [];
    var KGlobRadekNew = [];

    var KLok11;
    var KLok12;
    var KLok21;
    var KLok22;

    var KLokNew = [];
    var Kclen;
    var zapisovatNulyNaCelemRadku;


    for (var r = 0; r < pocetRadku; r++) {

      var KLokRadekNew = [];
      if(r < indexMax){
        zapisovatNulyNaCelemRadku = false;
      }
      else{
        zapisovatNulyNaCelemRadku = true;
      }

      for (var s = 0; s < pocetRadku; s++) {
        Kclen = 0;
        if(zapisovatNulyNaCelemRadku == false){
          if(s < indexMax){
            Kclen = KLok[r][s];
          }
        }
        
        KLokRadekNew.push(Kclen);
      }

      KLokNew.push(KLokRadekNew);
      
    }

    return(KLokNew);

  }   


  //z KLok0 vytvori K0Lok
  vytvor0KLok(KLok0){

    var pocetRadku;
    
    var K0Lok = [];
    var bunkaKLok0;
    var rKLok0;
    var sKLok0;

    pocetRadku = KLok0.length;

    for (var r = 0; r < pocetRadku; r++) {
      var K0LokRadek = [];

      rKLok0 = pocetRadku - r - 1;

      for (var s = 0; s < pocetRadku; s++) {
        sKLok0 = pocetRadku - s - 1;

        bunkaKLok0 = KLok0[rKLok0][sKLok0];
        K0LokRadek.push(bunkaKLok0);
      }  

      K0Lok.push(K0LokRadek);
    }  

    return(K0Lok)

  }


  //vrati reseni soustavy rovnic pro reseni matice tuhosti
  vratReseniFKu(K, F){

    console.log(K);

    var C = math.inv(K);
    var u = math.multiply(C, F);

    return(u);

  }

  
  //sestavi matici tuhosti globalni
  sestavMaticiTuhostiGlobalni(EAL){

    var KLok;
    var KLok0;
    var K0Lok;
    var KGlob0;
    var KGlob;

    KLok = this.sestavKLok(EAL[0]);

    for (var i = 1; i < EAL.length; i++) {

      //ziska K_Globalni rozsirenou o nuly na pozadovanou velikost
      if(i > 1){
        KGlob0 = this.vytvorKLok0(KGlob,i+1,i+2);
      }
      else {
        KLok0 = this.vytvorKLok0(KLok,i+1,i+2);
        KGlob0 = KLok0;
      }

      KLok = this.sestavKLok(EAL[i]);

      KLok0 = this.vytvorKLok0(KLok, 2, i+2); 
      K0Lok = this.vytvor0KLok(KLok0);
      KGlob = math.add(KGlob0, K0Lok);

    } 

    return(KGlob);

  }  


  //redukuje matici tuhosti o radky a sloupce, kde jsou nulova kodova cisla (kde jsou podpory)
  redukujMaticiTuhosti(KGlob, podpory){

    //MaticeTuhostiRedukovana
    var Kred = [];
    var KGlobRadek = [];
    var KGlobBunka;
    
    var redukovatRadek;
    var redukovatBunku;


    for (var r = 0; r <= podpory.length; r++) {

      redukovatRadek = podpory[r];
      KGlobRadek = KGlob[r];

      if(redukovatRadek == false){
        var KredRadek = [];

        for (var s = 0; s < podpory.length; s++) {
          redukovatBunku = podpory[s];

          if(redukovatBunku == false){
            KGlobBunka = KGlobRadek[s];
            KredRadek.push(KGlobBunka);
          }
        }

        Kred.push(KredRadek);

      }  
    }  


    return(Kred);

  }  


  redukujVektorZatizeni(vektorZatizeni, podpory){

    var redukovatZatizeni;
    var zatizeni;
    var zatizeniRed = [];

    for (var i = 0; i <= podpory.length; i++) {

      redukovatZatizeni = podpory[i];
      zatizeni = vektorZatizeni[i];
      
      if(redukovatZatizeni == false){
        zatizeniRed.push(zatizeni);
      }
    }   

    return(zatizeniRed);

  }  




  //************************************
  //sLOUZI PRO TESTOVACI UCELY
  //sestavi matici tuhosti globalni
  sestavMaticiTuhostiGlobalni_Test(E, A, L){

    //K_2x2
    KLok = this.sestavKLok(EAL[0]);

    //************************************
    //K_3x3

    //K_Lokalni rozsirena o nuly na matici 3x3
    KLok0 = this.vytvorKLok0(KLok,2,3);

    //K_Globalni rozsirena o nuly na matici 3x3 (= K_Lokalni)
    KGlob0 = KLok0;

    //K_Lokalni 2. prutu
    KLok = this.sestavKLok(EAL[1]);

    //K_Lokalni rozsirena o nuly na matici 3x3
    KLok0 = this.vytvorKLok0(KLok,2,3); //slouzi jen pro ziskani dat (bezi stejnou funkci)
    K0Lok = this.vytvor0KLok(KLok0);

    //K_Globalni 3x3 vznika souctem KGlob0 a K0Lok
    KGlob = math.add(KGlob0, K0Lok);


    //************************************
    //K_4x4

    //K_Globalni rozsirena o nuly na matici 4x4
    KGlob0 = this.vytvorKLok0(KGlob,3,4);

    //K_Lokalni 3. prutu
    KLok = this.sestavKLok(EAL[2]);

    //K_Lokalni rozsirena o nuly na matici 3x3
    KLok0 = this.vytvorKLok0(KLok,2,4); //slouzi jen pro ziskani dat (bezi stejnou funkci)
    K0Lok = this.vytvor0KLok(KLok0);

    //K_Globalni 4x4 vznika souctem KGlob0 a K0Lok
    KGlob = math.add(KGlob0, K0Lok);
    console.log(KGlob);

  }
  //sLOUZI PRO TESTOVACI UCELY
  //************************************


  ziskejSilyZpetnymDosazenim(EAL, uElem){

    var KLok;
    var vektU;
    var vnitrniSily = []; 

    KLok = this.sestavKLok(EAL);
    console.log(KLok);
    console.log(uElem);
    vnitrniSily = math.multiply(KLok, uElem);

    return(vnitrniSily);

  }


  sestavPlnyVektorPosunu(podpory, u){

    var uFull = [];
    var podpora;
    var indexU = -1;


    for (var i = 0; i < podpory.length; i++) {

      podpora = podpory[i];
      if(podpora == true){
        uFull.push(0);
      }
      else {
        indexU = indexU + 1;
        uFull.push(u[indexU]);
      }

    }

    return(uFull);

  }


  prevedPoleNaCislo(promenna){

    var cislo;
    var jeToPole;

    jeToPole = Array.isArray(promenna);
   
    if(jeToPole == true){
      cislo = promenna[0];
    }
    else {
      cislo = promenna;
    }

    return(cislo);

  }


  ziskejVektorKoncovychPosunu(uFull, index){

    var u1;
    var u2;
    var vektorKoncovychPosunu = [];

    u1 = this.prevedPoleNaCislo(uFull[index]);
    u2 = this.prevedPoleNaCislo(uFull[index+1]);

    console.log(index);
    console.log(u1);
    console.log(u2);

    vektorKoncovychPosunu.push(u1);
    vektorKoncovychPosunu.push(u2);

    return(vektorKoncovychPosunu);

  }


  ziskejVektorKoncovychSil(FFull, index){

    var sila;
    var silaPole;
    var Felem = [];

    silaPole = FFull[index];
    sila = silaPole[0];
    Felem.push(sila);

    silaPole = FFull[index+1];
    sila = silaPole[0];
    Felem.push(sila);

    return(Felem);

  }


  transformujVnitrniSilyNaElementu(Felem){

    var F1;
    var F2;
    var FelemTransform = [];

    F1 = Felem[0];
    F2 = Felem[1];

    FelemTransform.push(F1*(-1));
    FelemTransform.push(F2);

    return(FelemTransform);


  }


  //ziska vnitrni sily na prutech
  ziskejVnitrniSilyNaKonstrukci(EAL, uFull){

    //vektor posunu na elementu
    var uElem;

    //vnitrni sily na elementu
    var Felem;

    //transformovane vnitřní síly, tak, jak se vykreslují v grafice
    var FelemTransform;

    //vnitrni sily na cele konstrukci
    var vnitrniSilyNaKonstrukci = [];
    
    console.log(EAL.length);

    for (var i = 0; i < EAL.length; i++) {
      uElem = this.ziskejVektorKoncovychPosunu(uFull, i);
      Felem = this.ziskejSilyZpetnymDosazenim(EAL[i], uElem);
      FelemTransform = this.transformujVnitrniSilyNaElementu(Felem);
      vnitrniSilyNaKonstrukci.push(FelemTransform);
    }

    return(vnitrniSilyNaKonstrukci);

  }

}


//zapise vysledky do tabulky
class zapisVysledkyDoTabulky {
  constructor(vysledekPosuny, vysledekVnitrniSily){

    this.vysledekPosuny = vysledekPosuny;
    this.vysledekVnitrniSily = vysledekVnitrniSily;

    this.pocetDesetinnychmist = $("#zaokrouhlit").val();

    //zapise posuny do tabulky
    this.zapisDoTabulkyPosuny();

    //zapise do tabulky vnitrni sily
    this.zapisVnitrniSilyDoTabulky();

  }

  //zapise posuny do tabulky
  zapisDoTabulkyPosuny(){

    var pocetRadku;
    var id;
    var indexVPoli;
    var hodnotaU;

    indexVPoli = 0;
    pocetRadku = $(".radekTabulkyA").length;

    for (var i = 0; i < pocetRadku; i++) {

      hodnotaU = this.vysledekPosuny[indexVPoli];
      hodnotaU = this.zaokrouhliVysledek(hodnotaU, this.pocetDesetinnychmist)

      //zapise data na horni radek
      $('#u' + i + 'A').empty();
      $('#u' + i + 'A').append(hodnotaU);

      indexVPoli = indexVPoli + 1;
      hodnotaU = this.vysledekPosuny[indexVPoli];
      hodnotaU = this.zaokrouhliVysledek(hodnotaU, this.pocetDesetinnychmist)

      //zapise data na dolni radek
      $('#u' + i + 'B').empty();
      $('#u' + i + 'B').append(hodnotaU);
      
    }  

  }

  //zapise do tabulky vnitrni sily
  zapisVnitrniSilyDoTabulky(){

    var pocetRadku;
    var dataRadekVnitrniSily;
    var hodnotaF;
    var id;

    pocetRadku = $(".radekTabulkyA").length;

    for (var i = 0; i < pocetRadku; i++) {
      dataRadekVnitrniSily = this.vysledekVnitrniSily[i];
      
      id = '#u' + i + 'A';
      hodnotaF = dataRadekVnitrniSily[0];
      hodnotaF = this.zaokrouhliVysledek(hodnotaF, this.pocetDesetinnychmist)

      //zapise data na horni radek
      $('#N' + i + 'A').empty();
      $('#N' + i + 'A').append(hodnotaF);

      id = '#u' + i + 'B';
      hodnotaF = dataRadekVnitrniSily[1];
      hodnotaF = this.zaokrouhliVysledek(hodnotaF, this.pocetDesetinnychmist)

      //zapise data na dolni radek
      $('#N' + i + 'B').empty();
      $('#N' + i + 'B').append(hodnotaF);

    }   

  }


  


  


  zaokrouhliVysledek(hodnota, pocetDesetinnychmist){

    var hodnotaNew;
    var posunDesetinouCarku;

    posunDesetinouCarku = 10**pocetDesetinnychmist;

    hodnotaNew = hodnota * posunDesetinouCarku;
    hodnotaNew = Math.round(hodnotaNew);
    hodnotaNew = hodnotaNew / posunDesetinouCarku;

    return(hodnotaNew);
    
  }

}

class meritka {

  constructor(vysledekPosuny, vysledekVnitrniSily){

    this.vysledekPosuny = vysledekPosuny;
    this.vysledekVnitrniSily = vysledekVnitrniSily;


    this.zapisMeritka(vysledekPosuny, vysledekVnitrniSily);

  }


  //zapise vysledna meritka
  zapisMeritka(vysledekPosuny, vysledekVnitrniSily){

    var i;
    var rozdilHodnot;
    var meritko;
    var celkovaDelkaL;
    var Maxa;


    celkovaDelkaL = this.zjistiCelkovouDelkuZTabulky();
    meritko = 600/celkovaDelkaL;
    $("#meritko").val(meritko);

    Maxa = this.zjistiMaximalniRozmerPricnehoRezu();
    meritko = 50/Maxa;
    $("#meritkoKonstrukce").val(meritko);

    rozdilHodnot = this.zjistiRozdilMeziMaximemeAMinimem(vysledekVnitrniSily);
    meritko = 100/rozdilHodnot;

    $("#meritkoN").val(meritko);

    rozdilHodnot = this.zjistiRozdilMeziMaximemeAMinimem(vysledekPosuny);
    meritko = 100/rozdilHodnot;

    $("#meritkoU").val(meritko);
    $("#meritkoEps").val(99);
    $("#meritkoSigma").val(99);

  }


  zjistiRozdilMeziMaximemeAMinimem(funkcniHodnoty){

    var minimalniHodnota = 0;
    var maximalniHodnota = 0;
    var hodnota;
    var rozdilHodnot;

    console.log(funkcniHodnoty);

    for (var i = 0; i < funkcniHodnoty.length; i++) {

      hodnota = funkcniHodnoty[i];
      if(hodnota.length > 1){
        hodnota = hodnota[0];
      }
      console.log(hodnota);
      if(hodnota > maximalniHodnota){
        maximalniHodnota = hodnota;
      }
      if(hodnota < minimalniHodnota){
        minimalniHodnota = hodnota;
      }

    }

    rozdilHodnot = maximalniHodnota - minimalniHodnota;
    

    return(rozdilHodnot);
    
  }


  zjistiCelkovouDelkuZTabulky(){

    var L;
    var Lsum = 0;
    var pocetRadku;

    pocetRadku = $(".radekTabulkyA").length;

    for (var i = 0; i < pocetRadku; i++) {
      L = parseFloat($('#input_L' + i + 'A').val());
      Lsum = Lsum + L;
    }  

    return(Lsum);

  }


  zjistiMaximalniRozmerPricnehoRezu(){

    var a;
    var Maxa = 0;
    var pocetRadku;

    pocetRadku = $(".radekTabulkyA").length;

    for (var i = 0; i < pocetRadku; i++) {
      a = parseInt($('#input_a' + i + 'A').val());
      
      if(a > Maxa){
        Maxa = a;
      }

    }  

    return(Maxa);

  }

}  


$(document).ready(function(){

  $( "#spoctiVysledkyButt" ).click(function() {

    var vypocetFEM = new FEM();

    //ziska vysledne posuny a zapise je nazpet do tabulky
    var vysledekPosuny;
    var vysledekVnitrniSily;

    //nacte data ze tridy
    vysledekPosuny = vypocetFEM.getVysledekPosuny();
    vysledekVnitrniSily = vypocetFEM.getVysledekVnitrniSily();

    //console.log(vysledekPosuny);
    //console.log(vysledekVnitrniSily);

    //zapise data do tabulky
    var zapisDat = new zapisVysledkyDoTabulky(vysledekPosuny, vysledekVnitrniSily)



    //zapise meritka
    var zapisMeritka = new meritka(vysledekPosuny, vysledekVnitrniSily)

  });

});

