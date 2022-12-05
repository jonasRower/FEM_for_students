

//spocita vnitrni sily a deformace
class OOFEM {
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

        //console.log(this.Fpole);
        //console.log(this.EALpole);
        //console.log(this.podpory);
  
        this.zapisInputBoxy(this.Fpole, "F");
        this.zapisInputBoxy(this.EALpole, "EAL");
        this.zapisInputBoxy(this.podpory, "Supp");

        this.odesliDataNaBackend();

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

        
        //zapise data jako tridni promenne
        this.Fpole = Fpole;
        this.EALpole = EALpole;
        this.podpory = podpory;

    }


    //ziskana data zapise do inputboxu
    zapisInputBoxy(pole, velicina){

        var textJQuery;
        var hodnota;

        for (var i = 0; i < pole.length; i++) {

            hodnota = pole[i];
            textJQuery = '<input type="hidden" name="' + velicina + i + 'A" value="' + hodnota + '"></input>'
            $("#form").append(textJQuery);
            
        }

        //zapisePocetPolozek
        velicina = 'countOf_' + velicina;
        hodnota = pole.length;
        textJQuery = '<input type="hidden" name="' + velicina + '" value="' + hodnota + '"></input>'
        $("#form").append(textJQuery);
        
    }    


    //vytvori tlacitko submit a odesle data na backend
    odesliDataNaBackend(){

        //odesle data na backend
        $("#form").append('<button id="submitButt">Submit</button>');
        $("#submitButt").click();
        $("#submitButt").hide();

    }

}


$(document).ready(function(){

    //pri stisku tlacitka "Výpočet FEM" mačte data do polí a následně je odešle na backend
    $('#submitButtPok').click(function(){

        var dataOOFEM = new OOFEM();

        //nactiDataProSubmit();




    });

    
});