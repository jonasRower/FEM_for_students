
class grafy {

    constructor(x, y, yM, xOsa, y0, kreslitNaOsu, kresliSrafovani, kresliNabehy, zapisText) {

        this.x = x; //tj. poradnice - prut je svisle, takze je vykreslovana jako y-souradnice
        this.y = y; //tj. funkcni hodnota - prut je svisle, takze je vykreslovana jako x-souradnice
        this.yM = yM; //data bez meritka - slouzi pro popisky
        
        this.xOsa = xOsa;
        this.y0 = y0;
        this.kreslitNaOsu = kreslitNaOsu;
        this.kresliSrafovani = kresliSrafovani;
        this.kresliNabehy = kresliNabehy;

        //aby urcil meritko (napr. pro vykreslovani podpor), zjistuje maximalni rozdil funkcnich hodnot
        this.maximalniFunkciHodnota = 0;
        this.minimalniFunkciHodnota = 0;
        this.maximalniRozdilFunkcnichHodnot;

        console.log(x);
        console.log(y);
        console.log(yM);

    
        this.startKresleni(x, y, xOsa, y0, kreslitNaOsu, kresliSrafovani, kresliNabehy);
        
        if(zapisText == true){
            this.dopisDoGrafuHodnoty(x, y, yM, xOsa, y0);
        }
        

    }


    startKresleni(x, y, xOsa, y0, kreslitNaOsu, kresliSrafovani, kresliNabehy){

        var vetknutiNahore;
        var vetknutiDole;

        //vykresli elementy
        for (var i = 0; i < x.length-1; i++) {

            //vykresli jeden element
            this.nakresliElement(x, y, xOsa, y0, i, kreslitNaOsu, kresliSrafovani, kresliNabehy);
            
        }    

        //vykresli podpory
        for (var i = 0; i < x.length; i++) {

            //nastavi podpory
            if(i == 0){
                vetknutiNahore = true;
            }
            else {
                vetknutiNahore = false;
            }

            if(i == x.length-1){
                vetknutiDole = true;
            }
            else {
                vetknutiDole = false;
            }

            //vykresli podporu v zavislosti na true/false
            this.nakresliPodpory(x, xOsa, y0, vetknutiNahore, vetknutiDole, i, kreslitNaOsu)
        }    

    }


    dopisDoGrafuHodnoty(x, y, yM, xOsa, y0){

        var textX;
        var textY;
        var text;
        var align;

        for (var i = 0; i < x.length; i++) {

            textX = y[i] + xOsa;
            textY = x[i] + y0;
            text = yM[i];

            if(y[i] < 0){
                align = "end";
            }
            else {
                align = "start";
            }

            this.napisText(textX, textY, text, align)

        }

    }


    nakresliCaru(Ax, Ay, Bx, By){
/*
        console.log("-----------------");
        console.log("Ax");
        console.log(Ax);
        console.log("Ay");
        console.log(Ay);
        console.log("Bx");
        console.log(Bx);
        console.log("By");
        console.log(By);
        console.log("-----------------");
*/
        var c = document.getElementById("myCanvas");
        var ctxL = c.getContext("2d");
        c.style.background = "#DDFFFA";
        ctxL.beginPath();
        ctxL.moveTo(Ax, Ay);
        ctxL.lineTo(Bx, By);
        ctxL.stroke();

    }


    napisText(textX, textY, text, align){

        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        ctx.font = "bold 15px Arial";

        if(text > 0){
            ctx.fillStyle = "blue";
        } 
        else {
            ctx.fillStyle = "red";
        }

        // Show the different textAlign values
        ctx.textAlign = align;      
        ctx.fillText(text, textX, textY);                 

    }




    nakresliElementVodorovneUsecky(x0, y0, vodorovnaVzdalenost){

        this.nakresliCaru(x0, y0, x0+vodorovnaVzdalenost,  y0);

    }

    nakresliVetknuti(horniLinieCarek, dolniLinieCarek, konecCarekVlevo, konecCarekVPravo, intervalMeziCarkami){

        var Ax;
        var Ay;
        var Bx;
        var By;

        var pocetCarek;
        

        pocetCarek = Math.abs(konecCarekVPravo - konecCarekVlevo)/intervalMeziCarkami

        for (var i = 0; i < pocetCarek; i++) {

            Ax = i*intervalMeziCarkami + konecCarekVlevo;
            Ay = horniLinieCarek;
            Bx = Ax + intervalMeziCarkami;
            By = dolniLinieCarek;

            this.nakresliCaru(Ax,Ay,Bx,By);

        }

    }


    vratPrusecikVodorovneSrafySeSikmouHranouGrafu(Ax, Ay, Bx, By, koeficientyAB){

        //koeficienty A a B
        var a;
        var b;

        var prusecikX;

        a = koeficientyAB[0];
        b = koeficientyAB[1];

        prusecikX = a*By + b;

        return(prusecikX);

    }


    nakresliSrafovani(Ax, Bx, poradniceYmin, poradniceYmax, koeficientyAB){

        var Ay;
        var By;
        var intervalMeziSrafy = 10;
        var pocetCarekSrafy;

        //pokud je hrana grafu sikma, dopocitava se prusecik X
        var prusecikX;

        Ay = poradniceYmin;
        By = poradniceYmin;


        pocetCarekSrafy = (poradniceYmax-poradniceYmin)/intervalMeziSrafy-1;

        for (var i = 0; i < pocetCarekSrafy; i++) {

            Ay = Ay + intervalMeziSrafy;
            By = By + intervalMeziSrafy;

            //console.log(koeficientyAB);
            if(koeficientyAB.length > 0){
                prusecikX = this.vratPrusecikVodorovneSrafySeSikmouHranouGrafu(Ax, Ay, Bx, By, koeficientyAB);
                Bx = prusecikX;
            }

            this.nakresliCaru(Ax, Ay, Bx, By);

        }

    }



    //vrati a, b - jako koeficienty primpy s predpisem 
    vratKoeficientyABproOriznuti(Ax, Ay, Bx, By){

        const matice = [
            [Ay, 1],
            [By, 1]
          ];

        const pravaStrana = [Ax, Bx];
        const maticeInv = math.inv(matice);
        const koeficientyAB = math.multiply(maticeInv, pravaStrana);  


        return(koeficientyAB);
        
    }


    //aby vykresloval spravne podporu, je potreba spocitat x-souradnici zacatku a konce kresleni
    //pocita se rozdil mezi xmin a x max
    zapisMaximalniAMinimalniFunkcniHodnotu(Ax, Bx, Cx, Dx){

        //zapise maximalni hodnoty
        if(Ax > this.maximalniFunkciHodnota){
            this.maximalniFunkciHodnota = Ax;
        }
        if(Bx > this.maximalniFunkciHodnota){
            this.maximalniFunkciHodnota = Bx;
        }
        if(Cx > this.maximalniFunkciHodnota){
            this.maximalniFunkciHodnota = Cx;
        }
        if(Dx > this.maximalniFunkciHodnota){
            this.maximalniFunkciHodnota = Dx;
        }

        //zapise minimalni hodnoty
        if(Ax < this.maximalniFunkciHodnota){
            this.minimalniFunkciHodnota = Ax;
        }
        if(Bx < this.maximalniFunkciHodnota){
            this.minimalniFunkciHodnota = Bx;
        }
        if(Cx < this.maximalniFunkciHodnota){
            this.minimalniFunkciHodnota = Cx;
        }
        if(Dx < this.maximalniFunkciHodnota){
            this.minimalniFunkciHodnota = Dx;
        }

    }


    nakresliPodpory(x, xOsa, y0, vetknutiNahore, vetknutiDole, iElem, kreslitNaOsu) {

        var Ay;
        var AxMin;
        var AxMax;
        var rodilX;

        if(vetknutiNahore == true){
            Ay = x[iElem];

            if(kreslitNaOsu == true){
                rodilX = this.maximalniFunkciHodnota;
            }
            else {
                rodilX = this.maximalniFunkciHodnota - this.minimalniFunkciHodnota;
            }

            AxMin = xOsa-rodilX/2;
            AxMax = xOsa+rodilX/2;

            this.nakresliVetknuti(Ay-10+y0, Ay+y0, AxMin, AxMax, 10);
            this.nakresliCaru(AxMin, Ay+y0, AxMax, Ay+y0);
        }

        if(vetknutiDole == true){
            Ay = x[iElem];
           
            if(kreslitNaOsu == true){
                rodilX = this.maximalniFunkciHodnota;
            }
            else {
                rodilX = this.maximalniFunkciHodnota - this.minimalniFunkciHodnota;
            }

            AxMin = xOsa-rodilX/2;
            AxMax = xOsa+rodilX/2;

            this.nakresliVetknuti(Ay+y0, Ay+10+y0, AxMin, AxMax, 10);
            this.nakresliCaru(AxMin, Ay+y0, AxMax, Ay+y0);
        }
        
    }


    //z pole x[] a y[] vybere vždy 4 páry souřadnic, tak aby nakreslil jeden element 
    nakresliElement(x, y, xOsa, y0, iElem, kreslitNaOsu, kresliSrafovani, kresliNabehy){

        //console.log(kresliNabehy);

        var Ax;
        var Ay;
        var Bx;
        var By;
        var Cx;
        var Cy;
        var Dx;
        var Dy;

        var Xpodp;
        var XminPodp;
        var XmaxPodp;

        var koeficientyAB = [];

        if(kreslitNaOsu == true){

            Ax = xOsa - y[iElem]/2;
            Ay = y0 + x[iElem];
            Bx = xOsa + y[iElem]/2;
            By = y0 + x[iElem];

            Cx = xOsa - y[iElem]/2;
            Cy = y0 + x[iElem+1];
            Dx = xOsa + y[iElem]/2;
            Dy = y0 + x[iElem+1];

           
            //maji-li se kreslit nabehy, pak se prepisou y-soradnice
            if(kresliNabehy == true){
                Dx = xOsa + y[iElem+1]/2;
            }

        }
        else {

            Ax = xOsa;
            Ay = y0 + x[iElem];
            Bx = xOsa + y[iElem];
            By = y0 + x[iElem];

            Cx = xOsa;
            Cy = y0 + x[iElem+1];
            Dx = xOsa + y[iElem];
            Dy = y0 + x[iElem+1];

            //maji-li se kreslit nabehy, pak se prepisou y-souradnice
            if(kresliNabehy == true){
                Dx = xOsa + y[iElem+1];

                //aby orizl vodorovne carky, je potreba dopocitat koeficienty 
                //A a B sikme hranice
                koeficientyAB = this.vratKoeficientyABproOriznuti(Bx, By, Dx, Dy);
            }

        }

        this.zapisMaximalniAMinimalniFunkcniHodnotu(Ax, Bx, Cx, Dx);

        /*
        console.log("-----------------");
        console.log("Ax");
        console.log(Ax);
        console.log("Ay");
        console.log(Ay);
        console.log("Bx");
        console.log(Bx);
        console.log("By");
        console.log(By);
        console.log("Cx");
        console.log(Cx);
        console.log("Cy");
        console.log(Cy);
        console.log("Dx");
        console.log(Dx);
        console.log("Dy");
        console.log(Dy);
        console.log("-----------------");
        */

        this.nakresliElementVodorovneUsecky(Ax,Ay,Bx-Ax);
        this.nakresliElementVodorovneUsecky(Cx,Cy,Dx-Cx);
        this.nakresliCaru(Ax, Ay, Cx, Cy);
        this.nakresliCaru(Bx, By, Dx, Dy);
        
        //nakresli srafovani
        if(kresliSrafovani == true){
            this.nakresliSrafovani(Ax, Bx, Ay, Cy, koeficientyAB);
        }
        
    }

}


class nactiDataZTabulky{
    
    constructor(){

        //data po delce prutu
        this.deleniElementu = [];
        this.deleniElementu = this.ziskejDelkyElementu();
        
        //data v rozmeru kolmo na osu prutu (jednotlive veliciny)
        this.funkcniHodnotyN = [];
        this.funkcniHodnotyU = [];
        this.hodnotyPricnehoRezu = [];

        //funkcni hodnoty s pouzitim meritka
        this.funkcniHodnotyN_meritko = [];
        this.funkcniHodnotyU_meritko = [];
        this.hodnotyPricnehoRezu_meritko = [];

        //ziska funkcni hodnoty z tabulky
        this.funkcniHodnotyN = this.ziskejFunkcniHodnotyZTabulky('N');
        this.funkcniHodnotyU = this.ziskejFunkcniHodnotyZTabulky('u');
        this.hodnotyPricnehoRezu = this.ziskejHodnotyPricnehoRezuZTabulky();

        //upravi data, tak aby pro jeden bod byla vzdy jen jedna funkcni hodnota
        this.funkcniHodnotyN = this.jedenBodJednaFunkcniHodnota(this.funkcniHodnotyN);
        this.funkcniHodnotyU = this.jedenBodJednaFunkcniHodnota(this.funkcniHodnotyU);

        var meritkoDelkyPrutu;
        var meritkoTvaruPrutu;
        var meritkoN;
        var meritkoU;
        var meritkoEpsilon;
        var meritkoSigma;


        //zjisti jednotliva meritka
        //meritkoDelkyPrutu = $("#meritkoNaDelku").val()
        meritkoDelkyPrutu = parseFloat($("#meritko").val());
        meritkoTvaruPrutu = parseFloat($("#meritkoKonstrukce").val());
        meritkoN = parseFloat($("#meritkoN").val());
        meritkoU = parseFloat($("#meritkoU").val());
        meritkoEpsilon = parseFloat($("#meritkoEps").val());
        meritkoSigma = parseFloat($("#meritkoSigma").val());


        //prepocita meritka
        this.deleniElementu = this.aplikujMeritko(this.deleniElementu, meritkoDelkyPrutu);
        this.funkcniHodnotyN_meritko = this.aplikujMeritko(this.funkcniHodnotyN, meritkoN);
        this.funkcniHodnotyU_meritko = this.aplikujMeritko(this.funkcniHodnotyU, meritkoU);
        this.hodnotyPricnehoRezu_meritko = this.aplikujMeritko(this.hodnotyPricnehoRezu, meritkoTvaruPrutu);

    }


    //getry

    //vrati deleni Elementu
    getDeleniElementu(){
        return(this.deleniElementu);
    }

    getFunkcniHodnotyN(){
        return(this.funkcniHodnotyN);
    }

    getFunkcniHodnotyU(){
        return(this.funkcniHodnotyU);
    }

    getFunkcniHodnotyNmeritko(){
        return(this.funkcniHodnotyN_meritko);
    }

    getFunkcniHodnotyUmeritko(){
        return(this.funkcniHodnotyU_meritko);
    }

    getHodnotyPricnehoRezuMeritko(){
        return(this.hodnotyPricnehoRezu_meritko);
    }



    //ziska  funkcni hodnoty z tabulky
    ziskejFunkcniHodnotyZTabulky(sloupec){

        var pocetRadku;
        var hodnotaBunky;
        var hodnotyZTabulky = [];

        pocetRadku = $(".radekTabulkyA").length;


        for (var i = 0; i < pocetRadku; i++) {
            hodnotaBunky = $('#' + sloupec + i + 'A').text();
            hodnotyZTabulky.push(hodnotaBunky);
            hodnotaBunky = $('#' + sloupec + i + 'B').text();
            hodnotyZTabulky.push(hodnotaBunky);
        }    
        
        return(hodnotyZTabulky);

    }


    //ziska  funkcni hodnoty z tabulky
    ziskejHodnotyPricnehoRezuZTabulky(){

        var pocetRadku;
        var hodnotyZTabulky = [];
        var hodnotaBunky;
        pocetRadku = $(".radekTabulkyA").length;

        for (var i = 0; i < pocetRadku; i++) {
            hodnotaBunky = parseFloat($('#input_a' + i + 'A').val());
            hodnotyZTabulky.push(hodnotaBunky);
        }     

        return(hodnotyZTabulky);

    }


    //ziska rozdeleni na jednotlive pruty
    ziskejDelkyElementu(){

        var pocetRadku;
        var poradniceL;
        var hodnotaBunky;
        var hodnotyZTabulky = [];

        pocetRadku = $(".radekTabulkyA").length;
        poradniceL = 0;
        hodnotyZTabulky.push(poradniceL);

        for (var i = 0; i < pocetRadku; i++) {
            hodnotaBunky = parseInt($('#input_L' + i + 'A').val());
            poradniceL = poradniceL + hodnotaBunky;
            hodnotyZTabulky.push(poradniceL);
        }   

        return(hodnotyZTabulky);

    }


    //upravi pole, tak jak je jiz implementovano drive - tj. jeden bod = jedna funkcni hodnota
    jedenBodJednaFunkcniHodnota(funkcniHodnoty){

        var funkcniHodnota;
        var funkcniHodnotaPredchozi;
        var funkcniHodnotyNew = [];

        funkcniHodnotaPredchozi = funkcniHodnoty[0];
        funkcniHodnotyNew.push(funkcniHodnotaPredchozi);

        for (var i = 1; i < funkcniHodnoty.length; i++){
            funkcniHodnota = funkcniHodnoty[i];
            if(i%2 == 0){
                funkcniHodnotyNew.push(funkcniHodnota);
            }

            funkcniHodnotaPredchozi = funkcniHodnota;

        }

        //aby se shodoval pocet bodu, zopakuje jeste posledni hodnotu
        funkcniHodnotyNew.push(funkcniHodnotaPredchozi);

        return(funkcniHodnotyNew);
        
    }


    //upravi data aby se daly vykreslovat - aplikuje meritko
    aplikujMeritko(Hodnoty, meritko){

        var HodnotyNew = [];

        for (var i = 0; i < Hodnoty.length; i++){

            var Hodnota;
            var HodnotaMeritko;

            Hodnota = parseFloat(Hodnoty[i]);
            HodnotaMeritko = Hodnota * meritko;
            
            HodnotyNew.push(HodnotaMeritko);
        }

        return(HodnotyNew);

    }

}


$(document).ready(function(){

    $('#zobrazGrafikuButt').click(function(){

        //vyčistí plátno
        const c = document.getElementById("myCanvas");
        const ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height);


        var dataZTabulky = new nactiDataZTabulky();


        var deleniElementu = [];
        var rozmeryVPohledu = [];
        var xOsa = 60;
        var kresliNaOsu = true;
        var kresliSrafovani = false;
        var kresliNabehy = false;
        var zapisText = false;
        var y0 = 50;


        rozmeryVPohledu.push(40);
        rozmeryVPohledu.push(60);
        rozmeryVPohledu.push(30);
        rozmeryVPohledu.push(30);

        deleniElementu = dataZTabulky.getDeleniElementu();
        rozmeryVPohledu = dataZTabulky.getHodnotyPricnehoRezuMeritko();
        //rozmeryVPohledu = dataZTabulky.getFunkcniHodnotyN();
        
        console.log(rozmeryVPohledu);

        var nakresliGraf = new grafy(deleniElementu, rozmeryVPohledu, rozmeryVPohledu, xOsa, y0, kresliNaOsu, kresliSrafovani, kresliNabehy, zapisText);


        //data pro zakresleni mormalove sily
        var deleniElementu = [];
        var rozmeryVPohledu = [];
        var xOsa = 250;
        var kresliNaOsu = false;
        var kresliSrafovani = true;
        var kresliNabehy = false;
        var zapisText = true;

        deleniElementu = dataZTabulky.getDeleniElementu();
        rozmeryVPohledu = dataZTabulky.getFunkcniHodnotyN();
        rozmeryVPohledu_meritko = dataZTabulky.getFunkcniHodnotyNmeritko()

        var nakresliGraf = new grafy(deleniElementu, rozmeryVPohledu_meritko, rozmeryVPohledu, xOsa, y0, kresliNaOsu, kresliSrafovani, kresliNabehy, zapisText);


        //data pro zakresleni posunu u
        var deleniElementu = [];
        var rozmeryVPohledu = [];
        var rozmeryVPohledu_meritko = [];
        var xOsa = 400;
        var kresliNaOsu = false;
        var kresliSrafovani = true;
        var kresliNabehy = true;
        var zapisText = true;

        deleniElementu = dataZTabulky.getDeleniElementu();
        rozmeryVPohledu = dataZTabulky.getFunkcniHodnotyU();
        rozmeryVPohledu_meritko = dataZTabulky.getFunkcniHodnotyUmeritko()

        var nakresliGraf = new grafy(deleniElementu, rozmeryVPohledu_meritko, rozmeryVPohledu, xOsa, y0, kresliNaOsu, kresliSrafovani, kresliNabehy, zapisText);

    });

    
});