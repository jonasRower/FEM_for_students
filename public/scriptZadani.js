function nastavVychoziHodnoty(){

    $("#inputObdelnik").hide();
    $("#inputKruh").hide();
    $("#inputPlocha").hide();
    $("#inputKompozit").hide();
    $("#a2c").hide();
    $("#a2cLabel").hide();
    $("#labelVlastniTiha").hide();
    $("#inputVlastniTiha").hide();

}


function skryjZobrazSekce(){

    var zadaniZobrazeno = true;
    var tabulkaZobrazena = true;

    //###############################################################
    //skryva/zobrazuje jednotlive sekce stranky

    $( "#skryjZadaniButt" ).click(function() {
        
        //zobrazí item2 (zadani)
        if(zadaniZobrazeno == false){
            $(".item2").show();
            $(".item1").css("grid-area", "2 / 1 / 1 / 4");
            $(".item3").css("width", "33vw");
            $(".item4").css("width", "33vw");

            //zmeni popisek tlacitka
            $("#skryjZadaniButt").text("Skryj Zadání");
            zadaniZobrazeno = true;
        }
        else {
            //skryje item2 (zadani)
            //if(zadaniZobrazeno == true){
            $(".item2").hide();
            $(".item1").css("grid-area", "2 / 1 / 1 / 3");
            $(".item3").css("width", "50vw");
            $(".item4").css("width", "50vw");

            //zmeni popisek tlacitka
            $("#skryjZadaniButt").text("Zobraz zadání");
            zadaniZobrazeno = false;
        }

    }); 



    $( "#skryjTabulkuButt" ).click(function() {
        
        //zobrazí item2 (zadani)
        if(tabulkaZobrazena == false){
            $(".item3").show();
            $(".item1").css("grid-area", "2 / 1 / 1 / 4");
            $(".item2").css("width", "33vw");
            $(".item4").css("width", "33vw");

            //zmeni popisek tlacitka
            $("#skryjTabulkuButt").text("Skryj tabulku");
            tabulkaZobrazena = true;
        }
        else {
            //skryje item2 (zadani)
            //if(tabulkaZobrazena == true){
            $(".item3").hide();
            $(".item1").css("grid-area", "2 / 1 / 1 / 3");
            $(".item2").css("width", "50vw");
            $(".item4").css("width", "50vw");

            //zmeni popisek tlacitka
            $("#skryjTabulkuButt").text("Zobraz tabulku");
            tabulkaZobrazena = false;
        }

    }); 


}


function ovladaniGUI(){

    var vybraneId;
    var skrytId;
    var checkID;

    //###############################################################
    //ovlada checkbox v sekci "Základní údaje o konstrukci"
    $('#checkVlastniTiha').click(function(){
        if($(this).prop("checked") == true){
            $("#labelVlastniTiha").show();
            $("#inputVlastniTiha").show();
        }
        else {
            $("#labelVlastniTiha").hide();
            $("#inputVlastniTiha").hide();
        };
    });


    //###############################################################

    //ovlada radiottony v sekci "Tvar průřezu"
    $('#tvarPrurezuForm input').on('change', function() {
        vybraneId = $('input[name=radioPTvarPrurezu]:checked', '#tvarPrurezuForm').attr('id');
        skrytId = vybraneId.replace("prurez", "input");
        skrytId = "#" + skrytId;

        if($("#kompozit").prop("checked") == false){
            $("#inputCtverec").hide();
            $("#inputObdelnik").hide();
            $("#inputKruh").hide();
            $("#inputPlocha").hide();
            $("#a2cLabel").hide();
            $("#a2oLabel").hide();
            $("#b2oLabel").hide();
            $("#r2Label").hide();
            $("#A2Label").hide();
            $("#a2c").hide();
            $("#a2o").hide();
            $("#b2o").hide();
            $("#r2").hide();
            $("#A2").hide();
        }
        else {
            $("#inputCtverec").show();
            $("#inputObdelnik").show();
            $("#inputKruh").show();
            $("#inputPlocha").show();
            $("#a2cLabel").show();
            $("#a2oLabel").show();
            $("#b2oLabel").show();
            $("#r2Label").show();
            $("#A2Label").show();
            $("#a2c").show();
            $("#a2o").show();
            $("#b2o").show();
            $("#r2").show();
            $("#A2").show();
        }

        $("#inputCtverec").hide();
        $("#inputObdelnik").hide();
        $("#inputKruh").hide();
        $("#inputPlocha").hide();
        

        $(skrytId).show();

    });


    //###############################################################

    // ovlada checkboxy v sekci "Typ materialu"
    // odskrtne-li se zelezobeton a je-li soucasne odskrtunt ocelobeton, pak se odskrtne i kompozit
    $('#zelezobeton').click(function(){
        if($(this).prop("checked") == false){
            if($("#ocelobeton").prop("checked") == false){
                $( "#kompozit" ).prop( "checked", false );
                $("#inputKompozit").hide();
                $("#a2cLabel").hide();
                $("#a2oLabel").hide();
                $("#b2oLabel").hide();
                $("#r2Label").hide();
                $("#A2Label").hide();
                $("#a2c").hide();
                $("#a2o").hide();
                $("#b2o").hide();
                $("#r2").hide();
                $("#A2").hide();
            };
        };
    });

    // odskrtne-li se ocelobeton a je-li soucasne odskrtunt zelezobeton, pak se odskrtne i kompozit
    $('#ocelobeton').click(function(){
        if($(this).prop("checked") == false){
            if($("#zelezobeton").prop("checked") == false){
                $( "#kompozit" ).prop( "checked", false );
                $("#inputKompozit").hide();
                $("#a2cLabel").hide();
                $("#a2oLabel").hide();
                $("#b2oLabel").hide();
                $("#r2Label").hide();
                $("#A2Label").hide();
                $("#a2c").hide();
                $("#a2o").hide();
                $("#b2o").hide();
                $("#r2").hide();
                $("#A2").hide();
            };
        };
    });


    //---- ocelobeton ----
    // odskrtne-li se vyplnenaTrubka a je-li soucasne odskrtunt zabetonovanyValcovanyProfil, pak se odskrtne i ocelobeton
    $('#vyplnenaTrubka').click(function(){
        if($(this).prop("checked") == true){
            $( "#ocelobeton" ).prop( "checked", true );
        };
        if($(this).prop("checked") == false){
            if($("#zabetonovanyValcovanyProfil").prop("checked") == false){
                $( "#ocelobeton" ).prop( "checked", false );
                if($("#zelezobeton").prop("checked") == false){
                    $("#inputKompozit").hide();
                    $("#a2cLabel").hide();
                    $("#a2oLabel").hide();
                    $("#b2oLabel").hide();
                    $("#r2Label").hide();
                    $("#A2Label").hide();
                    $("#a2c").hide();
                    $("#a2o").hide();
                    $("#b2o").hide();
                    $("#r2").hide();
                    $("#A2").hide();
                    $( "#kompozit" ).prop( "checked", false );
                }
            };
        };
    });


    // odskrtne-li se zabetonovanyValcovanyProfil a je-li soucasne odskrtunt vyplnenaTrubka, pak se odskrtne i ocelobeton
    $('#zabetonovanyValcovanyProfil').click(function(){
        if($(this).prop("checked") == true){
            $( "#ocelobeton" ).prop( "checked", true );
        };
        if($(this).prop("checked") == false){
            if($("#vyplnenaTrubka").prop("checked") == false){
                $( "#ocelobeton" ).prop( "checked", false );
                if($("#zelezobeton").prop("checked") == false){
                    $("#inputKompozit").hide();

                    
                    $("#a2cLabel").hide();
                    $("#a2oLabel").hide();
                    $("#b2oLabel").hide();
                    $("#r2Label").hide();
                    $("#A2Label").hide();
                    $("#a2c").hide();
                    $("#a2o").hide();
                    $("#b2o").hide();
                    $("#r2").hide();
                    $("#A2").hide();
                    $( "#kompozit" ).prop( "checked", false );
                }
            };
        };
    });


    // pokud se odskrtne "Kompozitní materiál", odškrtne se současně i "Železobeton" a "Ocelobeton"
    // a současně se skryjou vstupy
    $('#kompozit').click(function(){
        if($(this).prop("checked") == false){
            $( "#zelezobeton" ).prop( "checked", false );
            $( "#ocelobeton" ).prop( "checked", false );
            $("#inputKompozit").hide();
            $("#a2cLabel").hide();
            $("#a2oLabel").hide();
            $("#b2oLabel").hide();
            $("#r2Label").hide();
            $("#A2Label").hide();
            $("#a2c").hide();
            $("#a2o").hide();
            $("#b2o").hide();
            $("#r2").hide();
            $("#A2").hide();

        }
    });

    // pokud se zaškrtne "Kompozitní materiál", pak se zobrazí vstupy
    $('#kompozit').click(function(){
        if($(this).prop("checked") == true){
            $("#inputKompozit").show();
            
            $("#a2cLabel").show();
            $("#a2oLabel").show();
            $("#b2oLabel").show();
            $("#r2Label").show();
            $("#A2Label").show();
            $("#a2c").show();
            $("#a2o").show();
            $("#b2o").show();
            $("#r2").show();
            $("#A2").show();
            
        }
    });

}





$(document).ready(function(){

    skryjZobrazSekce();
    nastavVychoziHodnoty();
    ovladaniGUI();

});