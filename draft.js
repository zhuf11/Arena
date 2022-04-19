player_drafting_now = 1;
num_heroes_drafted = 0;
player1_heroes = [];
player2_heroes = [];

p1_heroes_alive = [];
p2_heroes_alive = [];

p1_h1_final_pos = 2;
p1_h2_final_pos = 1;
p1_h3_final_pos = 0;

p2_h1_final_pos = 5;
p2_h2_final_pos = 6;
p2_h3_final_pos = 7;

var hero_select = document.getElementById("hero");

let change_pos_list = ["p1_h1_name", "p1_h1_pos", "p1_h2_name", "p1_h2_pos", "p1_h3_name", "p1_h3_pos",
                       "p2_h1_name", "p2_h1_pos", "p2_h2_name", "p2_h2_pos", "p2_h3_name", "p2_h3_pos", "battle_btn"]

change_pos_list.forEach((x, i) => document.getElementById(x).style.display = "none");

function change_displayed_hero_data (selected_hero_name){
    selected_hero_data = get_hero_data_from_hero_name(selected_hero_name);
    document.getElementById('curr_hero_name').innerHTML = "| " + selected_hero_data.name + ' - ' + selected_hero_data.descr + " |";
    document.getElementById('curr_hero_health_and_mana'). innerHTML = "Health: " + selected_hero_data.health + " | Mana: " + selected_hero_data.mana;
    document.getElementById('curr_hero_armor_and_ward'). innerHTML = "Armor: " + selected_hero_data.armor + " | Ward: " + selected_hero_data.ward;
    document.getElementById('curr_hero_speed').innerHTML = "Speed: " + selected_hero_data.speed;
    document.getElementById("curr_hero_passive").innerHTML = "Passive: " + selected_hero_data.passive + " - " + selected_hero_data.passive_descr + "<br>";

    function convert_AoE_to_text(AoE){
        var text = AoE;
        if (AoE == 1){
            text = "Single Target";
        }
        else if (AoE == 'row'){
            text = "Row";
        }
        else if (AoE == 'all_enemies'){
            text = "All Enemies";
        }
        return text;
    }

    curr_hero_abilities_HTML_text = "";
    for (let index = 0; index < selected_hero_data.abilities.length; index++){
        full_ability = selected_hero_data.abilities[index];
		if (full_ability.type.includes("Buff") || full_ability.type == "Debuff" || full_ability.type == "All"){
			curr_hero_abilities_HTML_text += full_ability.name.bold() + " - " + full_ability.type + " (" + convert_AoE_to_text(full_ability.AoE) + ') | ' + full_ability.range + " Range - CD: " + full_ability.cooldown + ".<br />";
		}
		else{
			curr_hero_abilities_HTML_text += full_ability.name.bold() + " - " + full_ability.damage + ' ' + full_ability.type + ' damage (' + convert_AoE_to_text(full_ability.AoE) + ') | ' + full_ability.range + " Range - CD: " + full_ability.cooldown + ".<br />";
		}

		full_ability.effects.forEach(function(e) {
			temp_descr = createDescr(e.name, e.magnitude, selected_hero_data.effects);
			if (e.duration == 0){
				curr_hero_abilities_HTML_text += "\u2022 " + e.name + ': ' + temp_descr + ".<br>";
			}
			else if (e.duration == 1){
				curr_hero_abilities_HTML_text += "\u2022 " + e.name + ': ' + temp_descr + ' for ' + e.duration + ' turn.' + "<br>";
			}

			else{
				curr_hero_abilities_HTML_text += "\u2022 " + e.name + ': ' + temp_descr + ' for ' + e.duration + ' turns.' + "<br>";
			}
        });
    };

    document.getElementById('curr_hero_abilities').innerHTML = curr_hero_abilities_HTML_text;
}

hero_select.addEventListener("change", function() {
    selected_hero_name = hero_select.options[hero_select.selectedIndex].value;
    change_displayed_hero_data(selected_hero_name);
});

localStorage.clear();

var p1_h1_position_select = document.getElementById("p1_h1_pos");
var p1_h2_position_select = document.getElementById("p1_h2_pos");
var p1_h3_position_select = document.getElementById("p1_h3_pos");
var p2_h1_position_select = document.getElementById("p2_h1_pos");
var p2_h2_position_select = document.getElementById("p2_h2_pos");
var p2_h3_position_select = document.getElementById("p2_h3_pos");

p1_h1_position_select.addEventListener("change", function() {
    selected_pos = parseInt(p1_h1_position_select.options[p1_h1_position_select.selectedIndex].value);
    p1_h1_final_pos = selected_pos;
    p1_heroes_alive[0].position = p1_h1_final_pos;
    assign_hero_data(player1_heroes, player2_heroes)
});

p1_h2_position_select.addEventListener("change", function() {
    selected_pos = parseInt(p1_h2_position_select.options[p1_h2_position_select.selectedIndex].value);
    p1_h2_final_pos = selected_pos;
    p1_heroes_alive[1].position = p1_h2_final_pos;
    assign_hero_data(player1_heroes, player2_heroes)
});

p1_h3_position_select.addEventListener("change", function() {
    selected_pos = parseInt(p1_h3_position_select.options[p1_h3_position_select.selectedIndex].value);
    p1_h3_final_pos = selected_pos;
    p1_heroes_alive[2].position = p1_h3_final_pos;
    assign_hero_data(player1_heroes, player2_heroes)
});

p2_h1_position_select.addEventListener("change", function() {
    selected_pos = parseInt(p2_h1_position_select.options[p2_h1_position_select.selectedIndex].value);
    p2_h1_final_pos = selected_pos;
    p2_heroes_alive[0].position = p2_h1_final_pos;
    assign_hero_data(player1_heroes, player2_heroes)
});

p2_h2_position_select.addEventListener("change", function() {
    selected_pos = parseInt(p2_h2_position_select.options[p2_h2_position_select.selectedIndex].value);
    p2_h2_final_pos = selected_pos;
    p2_heroes_alive[0].position = p2_h2_final_pos;
    assign_hero_data(player1_heroes, player2_heroes)
});

p2_h3_position_select.addEventListener("change", function() {
    selected_pos = parseInt(p2_h3_position_select.options[p2_h3_position_select.selectedIndex].value);
    p2_h3_final_pos = selected_pos;
    p2_heroes_alive[0].position = p2_h3_final_pos;
    assign_hero_data(player1_heroes, player2_heroes)

});

function gen_draftable_heroes(){
    hero_list = list_of_all_heroes;
    hero_list = hero_list.filter( hero => !(player1_heroes.includes(hero.name) || player2_heroes.includes(hero.name)))
    change_displayed_hero_data(hero_list[0].name);
    df = document.getElementById('hero');
    df.innerHTML = "";

    for (hero of hero_list) {
        df.innerHTML += "<option id = " + hero.name + " value =" + hero.name + ">" + hero.name + "</option>";
    }
}

gen_draftable_heroes()

function random_draft_hero(){
    var p1_num_needed_heroes = 3 - player1_heroes.length;
    var p2_num_needed_heroes = 3 - player2_heroes.length;

    for (var i = 0; i < p1_num_needed_heroes; i++){
        hero_list = list_of_all_heroes;
        hero_list = hero_list.filter( hero => !(player1_heroes.includes(hero.name) || player2_heroes.includes(hero.name)))
        drafted_hero = hero_list[Math.floor(Math.random() * hero_list.length)];
        player1_heroes.push(drafted_hero.name);
    }

    for (var j = 0; j < p2_num_needed_heroes; j++){
        hero_list = list_of_all_heroes;
        hero_list = hero_list.filter( hero => !(player1_heroes.includes(hero.name) || player2_heroes.includes(hero.name)))
        drafted_hero = hero_list[Math.floor(Math.random() * hero_list.length)];
        player2_heroes.push(drafted_hero.name);
    }

    console.log(player2_heroes)
    num_heroes_drafted = 6;
    change_pos_list.forEach((x, i) => document.getElementById(x).style.display = "inline");
    document.getElementById("battle_btn").style.display = "block";

    all_heroes_drafted = assign_hero_data(player1_heroes, player2_heroes)

    p1_heroes_alive = all_heroes_drafted[0];
    p2_heroes_alive = all_heroes_drafted[1];

    const p1_div = document.getElementById('player1_drafted');
    p1_div.innerHTML = "Player 1 Drafted: " + player1_heroes;

    const p2_div = document.getElementById('player2_drafted');
    p2_div.innerHTML = "Player 2 Drafted: " + player2_heroes;

    document.getElementById('p1_h1_name').innerHTML = p1_heroes_alive[0].name + " Position:";
    document.getElementById('p1_h2_name').innerHTML = p1_heroes_alive[1].name + " Position:";
    document.getElementById('p1_h3_name').innerHTML = p1_heroes_alive[2].name + " Position:";

    document.getElementById('p2_h1_name').innerHTML = p2_heroes_alive[0].name + " Position:";
    document.getElementById('p2_h2_name').innerHTML = p2_heroes_alive[1].name + " Position:";
    document.getElementById('p2_h3_name').innerHTML = p2_heroes_alive[2].name + " Position:";

    // console.log(document.getElementById('player1_drafted'));
    // document.getElementById('player1_drafted').innerHTML = player1_heroes[0];
    // document.getElementById('player2_drafted').innerHTML = player2_heroes[0];
    
    document.getElementById('draft_button').setAttribute('disabled', 'disabled');
    document.getElementById("random_draft_button").setAttribute('disabled', 'disabled');
}

function draft_hero(){
    drafted_hero = document.getElementById('hero').value;
    num_heroes_drafted += 1;
    console.log('player_draft_now: ' + player_drafting_now);
    if (player_drafting_now == 1){
        player1_heroes.push(drafted_hero);
    }
    
    else{
        player2_heroes.push(drafted_hero);
    }
    gen_draftable_heroes();

    console.log(num_heroes_drafted)
    console.log('P1: ' + player1_heroes)
    console.log('P2: ' + player2_heroes)
    player_drafting_now = control_drafting(player_drafting_now, num_heroes_drafted);
}

function control_drafting(player_drafting_now, num_heroes_drafted){
    if (num_heroes_drafted == 1 || num_heroes_drafted == 3 || num_heroes_drafted == 4 || num_heroes_drafted == 5 || num_heroes_drafted == 7){
        player_drafting_now = switch_drafting_player(player_drafting_now);
        console.log('player_draft_now: ' + player_drafting_now);
    }
    else if (num_heroes_drafted == 6){
        change_pos_list.forEach((x, i) => document.getElementById(x).style.display = "block");
        document.getElementById("battle_btn").style.display = "block";
        document.getElementById("random_draft_button").setAttribute('disabled', 'disabled');
        document.getElementById('draft_button').setAttribute('disabled', 'disabled');
        all_heroes_drafted = assign_hero_data(player1_heroes, player2_heroes)

        p1_heroes_alive = all_heroes_drafted[0];
        p2_heroes_alive = all_heroes_drafted[1];

        document.getElementById('p1_h1_name').innerHTML = p1_heroes_alive[0].name + " Position:";
        document.getElementById('p1_h2_name').innerHTML = p1_heroes_alive[1].name + " Position:";
        document.getElementById('p1_h3_name').innerHTML = p1_heroes_alive[2].name + " Position:";

        document.getElementById('p2_h1_name').innerHTML = p2_heroes_alive[0].name + " Position:";
        document.getElementById('p2_h2_name').innerHTML = p2_heroes_alive[1].name + " Position:";
        document.getElementById('p2_h3_name').innerHTML = p2_heroes_alive[2].name + " Position:";
    }

    const p1_div = document.getElementById('player1_drafted');
    p1_div.innerHTML = "Player 1 Drafted: " + player1_heroes;

    const p2_div = document.getElementById('player2_drafted');
    p2_div.innerHTML = "Player 2 Drafted: " + player2_heroes;


    return player_drafting_now;
}

function switch_drafting_player(player_drafting_now){
    if (player_drafting_now == 1){
        new_player = 2;
        document.getElementById("select_hero_text").innerText = "Player 2 Select Hero";
    }
    else{
        new_player = 1;
        document.getElementById("select_hero_text").innerText = "Player 1 Select Hero";
    }

    return new_player;
}

function assign_hero_data(player1_heroes, player2_heroes){
    console.log("assign hero data");
    p1_h1 = JSON.parse(JSON.stringify(get_hero_data_from_hero_name(player1_heroes[0])));
    p1_h2 = JSON.parse(JSON.stringify(get_hero_data_from_hero_name(player1_heroes[1])));
    p1_h3 = JSON.parse(JSON.stringify(get_hero_data_from_hero_name(player1_heroes[2])));
    
    var p1_heroes_alive = [p1_h1, p1_h2, p1_h3];

    p1_heroes_alive.forEach(function (p1_hero, i)
    {
        p1_hero.team = 1;
        p1_hero.curr_health = p1_hero.health;
        p1_hero.curr_mana = p1_hero.mana;
        p1_hero.effects = [];
        p1_hero.cd_basic = 0;
        p1_hero.cd_a1 = 0;
        p1_hero.cd_a2 = 0;
        p1_hero.cd_a3 = 0;
        p1_hero.base_armor = p1_hero.armor;
        p1_hero.base_ward = p1_hero.ward;
        p1_hero.curr_armor = p1_hero.armor;
        p1_hero.curr_ward = p1_hero.ward;
        p1_hero.armor_ward_penalties = [];
        p1_hero.position = 0;
        p1_hero.id = i;
        p1_hero.utilities = [];
        console.log(p1_hero.name + ' - ' + p1_hero.id);
    });

    p1_heroes_alive[0].position = p1_h1_final_pos;
    p1_heroes_alive[1].position = p1_h2_final_pos;
    p1_heroes_alive[2].position = p1_h3_final_pos;

    p2_h1 = JSON.parse(JSON.stringify(get_hero_data_from_hero_name(player2_heroes[0])));
    p2_h2 = JSON.parse(JSON.stringify(get_hero_data_from_hero_name(player2_heroes[1])));
    p2_h3 = JSON.parse(JSON.stringify(get_hero_data_from_hero_name(player2_heroes[2])));

    var p2_heroes_alive = [p2_h1, p2_h2, p2_h3];

    p2_heroes_alive.forEach(function (p2_hero, j)
    {
        p2_hero.team = 2;
        p2_hero.curr_health = p2_hero.health;
        p2_hero.curr_mana = p2_hero.mana;
        p2_hero.effects = [];
        p2_hero.cd_basic = 0;
        p2_hero.cd_a1 = 0;
        p2_hero.cd_a2 = 0;
        p2_hero.cd_a3 = 0;
        p2_hero.base_armor = p2_hero.armor;
        p2_hero.base_ward = p2_hero.ward;
        p2_hero.curr_armor = p2_hero.armor;
        p2_hero.curr_ward = p2_hero.ward;
        p2_hero.armor_ward_penalties = [];
        p2_hero.position = 7;
        p2_hero.id = j + 4;
        p2_hero.utilities = [];
        console.log(p2_hero.name + ' - ' + p2_hero.id);
    });

    p2_heroes_alive[0].position = p2_h1_final_pos;
    p2_heroes_alive[1].position = p2_h2_final_pos;
    p2_heroes_alive[2].position = p2_h3_final_pos;

    console.log(p1_heroes_alive);
    window.localStorage.setItem("p1_heroes_alive", JSON.stringify(p1_heroes_alive));
    window.localStorage.setItem("p2_heroes_alive", JSON.stringify(p2_heroes_alive));
    return([p1_heroes_alive, p2_heroes_alive]);

}

function get_hero_data_from_hero_name(name){
    for (hero of list_of_all_heroes){
        if (hero.name == name){
            //console.log("Match!")
            //console.log(hero.name)
            return (hero)
        }
    }
}