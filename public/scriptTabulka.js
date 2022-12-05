
class dataTabulka {
    constructor(pocetIntervalu, nastavData, typPrurezu) {

        $("table").empty();

        this.celkovaDelkaPrutu;
        this.celkovaDelkaPrutu = $("#celkovaDelkaPrutu").val();

        this.pocetIntervalu = pocetIntervalu;
        this.nastavData = nastavData;
        this.typPrurezu = typPrurezu;

        this.pridejHlavicku(this.typPrurezu);
        this.generujTabulku(this.pocetIntervalu, this.nastavData);

        this.obarviRadkyTabulky(pocetIntervalu);
        this.vratRadekSVyplnenymiHodnotami(this.pocetIntervalu);

    }


    //generuje tabulka
    generujTabulku(pocetIntervalu, nastavData){

        var radekData;
        for (var i = 0; i < pocetIntervalu; i++) {

            radekData = nastavData[i];
            this.pridejRadek(i, radekData);

        }        

    }


    obarviRadkyTabulky(pocetIntervalu){

        var idTrA;
        var idTrB;

        for (var i = 0; i < pocetIntervalu; i++) { 

            idTrA = '#trA' + i;
            idTrB = '#trB' + i;

            if(i % 2 == 0){
                $(idTrA).css("background-color", "rgb(200, 210, 255)");
                $(idTrB).css("background-color", "rgb(200, 210, 255)");
            }
            else {
                $(idTrA).css("background-color", "rgb(152, 255, 255)");
                $(idTrB).css("background-color", "rgb(152, 255, 255)");
            }

        }

    }


    vratRadekSVyplnenymiHodnotami(pocetIntervalu){

        var F;
        var a;
        var b;
        var r;
        var L;
        var E;

        var S;
        var EAL;
        var u;
        var N;
        var epsilon;
        var Sigma;

        var objemovaTiha;

        objemovaTiha = parseInt($("#inputVlastniTiha").val());

        for (var i = 0; i < pocetIntervalu; i++) {

            F = parseFloat($('#input_F' + i + 'A').val());
            L = parseFloat($('#input_L' + i + 'A').val());
            E = parseFloat($('#input_E' + i + 'A').val());

            //dopočítá síly nahrazující objemové tíhy elementu
            F = objemovaTiha*L/2;

            if(this.typPrurezu == "prurezCtverec"){
                a = $('#input_a' + i + 'A').val();
                S = a*a;
            }
            if(this.typPrurezu == "prurezObdelnik"){
                a = $('#input_a' + i + 'A').val();
                b = $('#input_b' + i + 'A').val();
                S = a*b;
            }
            if(this.typPrurezu == "prurezKruh"){
                r = $('#input_r' + i + 'A').val();
                S = math.PI()*r*r;
            }
            if(this.typPrurezu == "prurezPlocha"){
                S = $('#input_S' + i + 'A').val();
            }

            //dopocita EA/L
            EAL = E*S/L;

            //dopise sily jako objemove tihy
            $('#input_F' + i + 'A').val(F);
            $('#input_F' + i + 'B').val(F);

            //dopise hodnoty - A
            $('#S' + i + 'A').empty();
            $('#S' + i + 'A').append(S);

            //dopise hodnoty - EA/L
            $('#EAL' + i + 'A').empty();
            $('#EAL' + i + 'A').append(EAL);

        }

    }



    //generuje ty bunky, ktere jsou ve sloucenem radku nahore
    generujBunkyRadkuNahore(radek){

        var bunka;
        var radekPole = [];

        var val_F = 0;
        var val_a = 0;
        var val_L = 0;
        var val_E = $("#modulPruznosti").val();

        val_L = this.celkovaDelkaPrutu/this.pocetIntervalu;

        //prida sloupec se silou
        bunka = '<td id="F' + radek + '"><input type="text" id="input_F' + radek + '" value=' + val_F + '></td>';
        radekPole.push(bunka);
        
        //prida sloupec, kde se zadava a jakozto strana prurezu
        if(this.typPrurezu == "prurezCtverec"){ //pokud prurez je ctverec
            var val_a;
            val_a = $("#a1c").val();
            bunka = '<td id="a' + radek + '"><input type="text" id="input_a' + radek + '" value=' + val_a + '></td>';
            radekPole.push(bunka);  
        }
        if(this.typPrurezu == "prurezObdelnik"){ //pokud prurez je obdelnik
            var val_a;
            var val_b;
            val_a = $("#a1o").val();
            val_b = $("#bo").val();
            bunka = '<td id="a' + radek + '"><input type="text" id="input_a' + radek + '" value=' + val_a + '></td>';
            radekPole.push(bunka);
            bunka = '<td id="b' + radek + '"><input type="text" id="input_b' + radek + '" value=' + val_b + '></td>';
            radekPole.push(bunka);
        }     
        if(this.typPrurezu == "prurezKruh"){     //pokud je prurez kruh
            var val_r;
            val_r = $("#r1").val();
            bunka = '<td id="r' + radek + '"><input type="text" id="input_r' + radek + '" value=' + val_r + '></td>';
            radekPole.push(bunka);
        }  
        
        //prida sloupec, kde se zadava L jakozto delka elementu
        bunka = '<td id="L' + radek + '"><input type="text" id="input_L' + radek + '" value=' + val_L + '></td>';
        radekPole.push(bunka);
        
        //prida sloupec kde se zadava modul pruznosti
        bunka = '<td id="E' + radek + '"><input type="text" id="input_E' + radek + '" value=' + val_E + '></td>';
        radekPole.push(bunka); 
        
        //prida sloupec kde se zadava plocha pricneho rezu
        //pokud se plocha pricneho rezu nastavuje, pak je pridan input box
        if(this.typPrurezu == "prurezPlocha"){
            bunka = '<td id="S' + radek + '"><input type="text" id="input_S' + radek + '" value=' + val_A + '></td>';
            radekPole.push(bunka);
        }  
        else {  // v ostatnich pripadech je plocha dopocitavana automaticky, pak je zde jen bunka bez moznosti editace
            bunka = '<td id="S' + radek + '"></td>';
            radekPole.push(bunka);
        }

        //prida sloupec kde kde je dopocitano EA/L
        bunka = '<td id="EAL' + radek + '"></td>';
        radekPole.push(bunka);

        //prida sloupec kde kde je dopocitana osova sila v prutu
        bunka = '<td id="N' + radek + '"></td>';
        radekPole.push(bunka);

        //prida sloupec kde kde jsou dopocitany deformace u
        bunka = '<td id="u' + radek + '"></td>';
        radekPole.push(bunka);

        //prida sloupec kde kde jsou dopocitany poerne deformace epsilon
        bunka = '<td id="Eps' + radek + '"></td>';
        radekPole.push(bunka);

        //prida sloupec kde kde je dopocitano napeti Sigma
        bunka = '<td id="Sigma' + radek + '"></td>';
        radekPole.push(bunka);

        return(radekPole);

    }

    //generuje ty bunky, ktere jsou ve sloucenem radku dole
    generujBunkyRadkuDole(radek){

        var bunka;
        var radekPole = [];

        var val_F = 0;

        bunka = '<td id="F' + radek + '"><input type="text" id="input_F' + radek + '" value=' + val_F + '></td>';
        radekPole.push(bunka); 
        bunka = '<td id="N' + radek + '"></td>';
        radekPole.push(bunka);
        bunka = '<td id="u' + radek + '"></td>';
        radekPole.push(bunka);
        bunka = '<td id="Eps' + radek + '"></td>';
        radekPole.push(bunka);
        bunka = '<td id="Sigma' + radek + '"></td>';
        radekPole.push(bunka);

        return(radekPole);

    }


    spojBunkyRadku(radek){

        var radekA;
        var radekB;
        var radekPoleNahore;
        var radekPoleDole;
        var dataRadkuNahoreIDole;
        
        radekA = radek + "A";
        radekB = radek + "B";

        radekPoleNahore = this.generujBunkyRadkuNahore(radekA);
        radekPoleDole = this.generujBunkyRadkuDole(radekB);

        //k datum na hornim radku pridava atribut ' rowspan="2" ' cimz slouci 2 radky pouze v danem sloupci
        radekPoleNahore = this.slucBunkyDvouRadkuVeSloupci(radekPoleNahore, "a", radek);
        radekPoleNahore = this.slucBunkyDvouRadkuVeSloupci(radekPoleNahore, "L", radek);
        radekPoleNahore = this.slucBunkyDvouRadkuVeSloupci(radekPoleNahore, "E", radek);
        radekPoleNahore = this.slucBunkyDvouRadkuVeSloupci(radekPoleNahore, "S", radek);
        radekPoleNahore = this.slucBunkyDvouRadkuVeSloupci(radekPoleNahore, "EAL", radek);

        //prida tag <tr> k radku nahore
        var tagTr = [];
        var idTr = 'id="trA' + radek + '"';
        tagTr.push('<tr class="radekTabulkyA" ' + idTr + '>');
        radekPoleNahore = tagTr.concat(radekPoleNahore);

        //prida koncovy tag k radku nahore
        var tagTr = [];
        tagTr.push('</tr>');
        radekPoleNahore = radekPoleNahore.concat(tagTr);

        //prida tag <tr> k radku dole
        var tagTr = [];
        var idTr = 'id="trB' + radek + '"';
        tagTr.push('<tr class="radekTabulkyB" ' + idTr + '>');
        radekPoleDole = tagTr.concat(radekPoleDole);

        //prida koncovy tag k radku dole
        var tagTr = [];
        tagTr.push('</tr>');
        radekPoleDole = radekPoleDole.concat(tagTr);

        //slouci radky nahore a dole do jednoho a vytvori tak radek, kde nektere bunky jsou sloucene
        dataRadkuNahoreIDole = radekPoleNahore.concat(radekPoleDole);


        console.log(dataRadkuNahoreIDole);

        return(dataRadkuNahoreIDole);

    }

    //pro pozadovane id sloupecku, prida ' rowspan="2" ' tak, aby bunky v danem sloupci byly sloucene
    slucBunkyDvouRadkuVeSloupci(radekPole, nazevSloupce, indexRadku){

        var radekObsah;
        var radekObsahNew;
        var Idreq;
        var IdNew;
        
        //Vytvori id, za ktere bude dosazovat ' rowspan="2" '
        //je potreba vytvorit napr: 'id="a2A"' tj. a-nazevSloupce + 2-indexRadku + A-konstanta
        Idreq = 'id="' + nazevSloupce + indexRadku + 'A"';

        //nahradi Idreq za IdNew (vytvori napr: ' id="a2A" rowspan="2" ')
        IdNew = Idreq + ' rowspan="2"'

        for (var i = 0; i < radekPole.length; i++) {
            radekObsah = radekPole[i]
            if(radekObsah.includes(Idreq) == true){
                radekObsahNew = radekObsah.replace(Idreq, IdNew);
                radekPole[i] = radekObsahNew;
            }
        }    

        return(radekPole);

    }


    pridejRadek(radek, radekData){
      
        //var radekPole = this.generujRadekPole(radek, radekData);
        //var radekTable = '<tr class="radekTabulky">';
        var radekPole = this.spojBunkyRadku(radek);
        var radekTable = "";

        var id;
        var radekId;
            
        for (var i = 0; i < radekPole.length; i++) {
            radekTable = radekTable + radekPole[i];
        }


        //radekTable = radekTable + '</tr>';
        //console.log(radekTable);

        //prida radek rovnou s naslouchacem
        $("table").append($(radekTable)).on('change paste keyup','input',function(){
            
            // DODELAT !!!!!!
            
            /*
            id = $(this).attr('id');

            radekId = id.replace("input_","");
            radekId = radekId.replace("F","");
            //radekId = radekId.replace("a","");

            //pri zmene inputboxu se rovnou zmeni obsah radku
            var selector_input_F = '"#input_F' + radekId + 'A"';
            var selector_input_a = '"#input_a' + radekId + 'A"';
            var selector_input_L = '"#input_L' + radekId + 'A"';
            var selector_A = "#S" + radekId;
            var selector_N = "#N" + radekId;
            var selector_Sigma1 = "#Sigma" + radekId;
            
            var F = $(selector_input_F).val();
            var a = $(selector_input_a).val();
            var L = $(selector_input_L).val();
            var A = a*a;
            var N = F;
            var Sigma = N/A;
            
            $(selector_A).empty();
            $(selector_N).empty();
            $(selector_Sigma1).empty();  

            $(selector_A).append(A);
            $(selector_N).append(N);
            $(selector_Sigma1).append(Sigma);
*/
        });

    }



    pridejHlavicku(typPrurezu){

        var radekTable;
        //alert(typPrurezu);

        if(typPrurezu == "prurezCtverec"){
            radekTable = '<th id="prurezCtverec">F</th>'
                        + '<th>a</th>'
                        + '<th>L</th>'
                        + '<th>E</th>'
                        + '<th>A</th>'
                        + '<th>EA/L</th>'
                        + '<th>N</th>'
                        + '<th>u</th>'
                        + '<th>Eps</th>'
                        + '<th>Sigma</th>';
        }

        if(typPrurezu == "prurezObdelnik"){
            radekTable = '<th id="prurezObdelnik">F</th>'
                        + '<th>a</th>'
                        + '<th>b</th>'
                        + '<th>L</th>'
                        + '<th>E</th>'
                        + '<th>A</th>'
                        + '<th>EA/L</th>'
                        + '<th>N</th>'
                        + '<th>u</th>'
                        + '<th>Eps</th>'
                        + '<th>Sigma</th>';
        }

        if(typPrurezu == "prurezKruh"){
            radekTable = '<th id="prurezKruh">F</th>'
                        + '<th>r</th>'
                        + '<th>L</th>'
                        + '<th>E</th>'
                        + '<th>A</th>'
                        + '<th>EA/L</th>'
                        + '<th>N</th>'
                        + '<th>u</th>'
                        + '<th>Eps</th>'
                        + '<th>Sigma</th>';
        }

        if(typPrurezu == "prurezPlocha"){
            radekTable = '<th id="prurezPlocha">F</th>'
                        + '<th>A</th>'
                        + '<th>N start</th>'
                        + '<th>N end</th>'
                        + '<th>Sigma</th>';
        }
       

        $("table").prepend($(radekTable));
      

    }   
  

}


function nactiDataStavajiciTabulky(){

  
    var pocetRadkuTabulky;
    var F_arr;
    var a_arr;
    var A_arr;
    var b_arr;
    var L_arr;
    
    var dataPredchozi = [];
    var typTabulky;

    //OPRAVIT !!

    pocetRadkuTabulky = $(".radekTabulky").length;
    typTabulky = $("th").attr('id');

    //naplni tabulku daty
   // if(typTabulky == "prurezCtverec"){

        for (var i = 0; i < pocetRadkuTabulky; i++) {
            var radek = [];

            F_arr = $('#input_F' + i).val();
          //  a_arr = $('#input_a' + i).val();
            L_arr = $('#input_L' + i).val();
            radek[0] = F_arr;
           // radek[1] = a_arr;
            //radek[2] = L_arr;
            dataPredchozi[i] = radek;
        }

       // console.log(dataPredchozi);

   // }

/*
    if(typTabulky == "prurezObdelnik"){

        for (var i = 0; i < pocetRadkuTabulky; i++) {
            var radek = [];
            F_arr = $('#input_F' + i).val();
            a_arr = $('#input_a' + i).val();
            b_arr = $('#input_b' + i).val();
            L_arr = $('#input_L' + i).val();
            radek[0] = F_arr;
            radek[1] = a_arr;
            radek[2] = b_arr;
            radek[3] = L_arr;
            dataPredchozi[i] = radek;
        }
        
    }


    if(typTabulky == "prurezKruh"){

        for (var i = 0; i < pocetRadkuTabulky; i++) {
            var radek = [];
            F_arr = $('#input_F' + i).val();
            r_arr = $('#input_r' + i).val();
            L_arr = $('#input_L' + i).val();
            radek[0] = F_arr;
            radek[1] = r_arr;
            radek[2] = L_arr;
            dataPredchozi[i] = radek;
        }
        
    }

    if(typTabulky == "prurezPlocha"){

        for (var i = 0; i < pocetRadkuTabulky; i++) {
            var radek = [];
            F_arr = $('#input_F' + i).val();
            A_arr = $('#input_A' + i).val();
            L_arr = $('#input_L' + i).val();
            radek[0] = F_arr;
            radek[1] = A_arr;
            radek[2] = L_arr;
            dataPredchozi[i] = radek;
        }
        
    }
*/

    return(dataPredchozi);

}


$(document).ready(function(){

    //pridejRadek();
    var tabulka = new dataTabulka();
    var dataPredchozi = [];
    var typPrurezu;

    //podle poctu intervalu nastavuje delku tabulky
    $('#spoctiTabulkuButt').click(function() {
        
        //Podle nastaveni tvar prurezu pozměnuje tabulku
        typPrurezu = $('input[name=radioPTvarPrurezu]:checked', '#tvarPrurezuForm').attr('id');
        var pocetIntervalu = $("#pocetIntervalu").val();
        dataPredchozi = nactiDataStavajiciTabulky();
        console.log(dataPredchozi);
        var tabulka = new dataTabulka(pocetIntervalu, dataPredchozi, typPrurezu);
    });    

});