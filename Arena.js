//Arena

var ai_called = false;
class Hero{
	constructor(name, descr, health, mana, mana_regen, armor, ward, physical_shield, magic_shield, abilities, passive, speed, movement){
		this.name = name;
		this.descr = descr;
		this.health = health;
		this.mana = mana;
		this.mana_regen = mana_regen;
		this.armor = armor;
		this.ward = ward;
		this.physical_shield = physical_shield;
		this.magic_shield = magic_shield;
		this.abilities = abilities;
		this.passive = passive;
		this.speed = speed;
		this.movement = movement;
	}
}

class Ability{
	constructor(name, damage, type, range, AoE, effects, cooldown, mana_cost){
		this.name = name;
		this.damage = damage;
		this.type = type
		this.range = range;
		this.AoE = AoE;
		this.effects = effects;
		this.cooldown = cooldown;
		this.mana_cost = mana_cost;
	}
}


//[hero, name, range, total predicted utility]
//get range and cooldown from ability.range
class Utility{
	constructor(ability, target, init_damage, total_damage, total_utility){
		this.ability = ability;
		this.target = target;
		this.init_damage = init_damage;
		this.total_damage = total_damage;
		this.total_utility = total_utility;
	}
}

document.getElementById("curr_hero_all_ability_info").style.display = "none";

const list_of_parent_effects = ["Dauntless Vanguard", "Fury Buff", "Frozen", "Glacial Chains", "Storm Surge", "Nature's Blessing"];

function createDescr(name, magnitude, effects_list){
	//console.log("name: " + name);
	//console.log(effects_list)
	//console.log(name)
	if (magnitude > 1){
		turn_or_turns = ' turns';
	}
	else{
		turn_or_turns = ' turn'
	}

	if (name == ('Stun')){
		descr = "Target enemy skips their next turn"
	}

	else if (name == ('Self Stun')){
		descr = "This hero skips their next turn"
	}

	else if (name == ('Heal Self For All Enemies Within 2 Rows')){
		descr = "Heal this hero for " + magnitude + " Health for every enemy within 2 rows"
	}
	
	else if (name == ('Gain Self Damage Reduction For All Enemies Within 2 Rows')){
		descr = "Take " + magnitude[0] * 100 + "% less damage for " + magnitude[1] + " turns for every enemy within 2 rows"
	}

	else if (name == "Increase Damage Based On Self Ward"){
		try{
			c_ward = curr_hero.curr_ward;
		}
		catch{
			c_ward = 0;
		}
		descr = "This attack deals additional Magic Damage equal to " + magnitude * 100 + "% of this hero's Ward. " + "(" + magnitude * 100 * c_ward + " Magic damage)"
	}

	else if (name == "Increase Damage If Target More Health"){
		descr = "This attack deals additional damage equal to " + magnitude * 100 + "% of the Health difference between Vulshok and his target"
	}

	else if (name == "Lose Current Mana And Deal Damage"){
		try{
			c_mana = curr_hero.curr_mana;
		}
		catch{
			c_mana = 0;
		}
		descr = "Consume " + magnitude[0] *100 + "% of this hero's current Mana (" + Math.round(magnitude[0] * c_mana) + " Mana) to deal " + magnitude[1] * 100 + "% consumed Mana as additional damage. (" + Math.round(magnitude[0] * magnitude[1] * c_mana) + " Additional Damage)"
	}

	else if (name == "Drain Percent Current Mana and Gain Magic Shield"){
		descr = "Drain " + magnitude[0] * 100 + "% of the target's current Mana. Gain " + magnitude[1] * 100 + "% of the drained mana as Magic Shield.";
	}

	else if (name == 'More Damage If No Physical Shield'){
		descr = "If target has no Physical Shield, deal " + magnitude * 100 + '% more damage'
	} 

	else if (name == 'More Damage If Target Low Life'){
		descr = "If target has less than 50% health, deal " + magnitude * 100 + '% more damage'
	} 

	else if (name == 'Only Usable If Enemy Is Low Life'){
		descr = "Can only be used if an enemy has less than 50% health"
	} 

	else if (name == "Physical Damage other Enemies in Row"){
		descr = "Deal " + magnitude + " Physical damage to all other enemies in target's row"
	}

	else if (name == 'Pull'){
		descr = "Target moves 1 space closer"
	}

	else if (name == 'Push'){
		descr = "Target moves 1 space away"
	}

	else if (name == 'Gain Armor and Ward From Buffs'){
		descr = "For each buff on target, gain " + magnitude + " Armor and Ward";
	}

	else if (name.includes('Increase Buffs')){
		descr = "Increase duration of buffs on target by " + magnitude + turn_or_turns;
	}

	else if (name.includes('Decrease Buffs')){
		descr = "Decrease duration of buffs on target by " + magnitude + turn_or_turns;
	}

	else if (name == 'Mana Drain'){
		descr = "Target loses " + magnitude + " Mana and current hero gains " + magnitude + " Mana."
	}

	else if (name.includes('Decrease Debuffs')){
		descr = "Decrease duration of debuffs by " + magnitude  + turn_or_turns;
	} 

	else if (name.includes('Increase Debuffs')){
		descr = "Increase duration of debuffs by " + magnitude  + turn_or_turns;
	} 

	else if (name.includes('Change Armor')){
		if (magnitude >= 0){
			descr = "Increase Armor by " + magnitude;
		}
		else{
			descr = "Decrease Armor by " + magnitude * -1
		}
	
	} 

	else if (name.includes('Change Ward')){
		if (magnitude >= 0){
			descr = "Increase Ward by " + magnitude
		}
		else{
			descr = "Decrease Ward by " + magnitude * -1
		}
	
	} 

	else if (name == 'Blind'){
		descr = "Cannot use abilities that target heroes farther than " + magnitude  + ' space(s) away'
	} 

	else if (name == 'Weak'){
		descr = "Target enemy has their ability damage reduced by " + magnitude * 100 + '%'
	} 

	else if (name == 'Gain Magic Shield'){
		descr = "Target gains " + magnitude + ' Magic Shield';
	} 

	else if (name == 'Self Gain Magic Shield'){
		descr = "Current Hero gains " + magnitude + ' Magic Shield';
	} 

	else if (name == 'Gain Physical Shield'){
		descr = "Target gains " + magnitude + ' Physical Shield';
	} 

	else if (name == 'Self Gain Physical Shield'){
		descr = "Current Hero gains " + magnitude + ' Physical Shield';
	} 

	else if (name == 'Vulnerable'){
		descr = "Target enemy takes " + magnitude * 100 + '% more damage from abilities'
	} 

	else if (name == 'Self Vulnerable'){
		descr = "This hero takes " + magnitude * 100 + '% more damage from abilities'
	} 

	else if (name == 'Burn'){
		descr = "Take " + magnitude + " damage at the end of every turn"
	} 

	else if (name == 'Bleed'){
		descr = "Take " + magnitude + " damage at the end of every turn"
	} 

	else if (name == 'Poison'){
		descr = "Take " + magnitude + " damage at the end of every turn"
	} 

	else if (name == 'Anti-Heal'){
		descr = "Reduce all healing received by " + magnitude * 100 + '%'
	} 

	else if (name.includes('Elusive')){
		descr = "Take " + magnitude * 100 + '% less damage from attacks more than 1 space away'
	} 

	else if (name.includes('Immortal')){
		descr = "Cannot die. Any fatal damage instead reduces health to 1"
	}

	else if (name.includes('Immunity')){
		descr = "Cannot receive any debuffs"
	}

	else if (name.includes('Change Mana')){
		descr = "Change target's Mana by " + magnitude;
	}

	else if (name.includes('Remove Debuffs')){
		descr = "Remove all debuffs from target";
	}

	else if (name.includes('Remove Buffs')){
		descr = "Remove all buffs from target";
	}

	else if (name.includes('Reverse DoT and Health Regen')){
		descr = "DoTs restore health, Health Regen deals damage instead";
	}

	else if (name.includes('Decrease Mana Costs')){
		descr = "Decrease the mana cost of all abilities by " + magnitude * 100 + "%";
	}

	else if (name.includes('Increase Next Magic Attack')){
		descr = "Increase the damage of this unit's next magic attack by " + magnitude * 100 + "%";
	}

	else if (name.includes('Tranquil')){
		descr = "Cannot use Attacks or Debuffs"
	}

	else if (name.includes('Magic Damage Mark')){
		descr = "While this target is marked, the next attack against this target consumes this mark to deal " + magnitude + " Magic damage to the target";
	}

	else if (name.includes('Reduce Attacker CD Mark')){
		descr = "While this target is marked, the next attack against this target consumes this mark to reduce the ability cooldowns of the attacker by " + magnitude + ' turn';
	}

	else if (name.includes('Unbalanced')){
		descr = "The next attack against this target stuns it - this lasts for "
	}

	else if (name.includes('Health Regen')){
		descr = "Recovers " + magnitude + ' Health per turn'
	}

	else if (name.includes('Heal Missing Health Percentage')){
		descr = "Heal " + magnitude * 100 + '% of missing health'
	}

	else if (name.includes('Recover Missing Mana Percentage')){
		descr = "Recover " + magnitude * 100 + '% of missing mana'
	}

	else if (name == "Fortify"){
		descr = "Target takes " + magnitude * 100 + '% less damage from all abilities'
	}

	else if (name == "Self Fortify"){
		descr = "This hero takes " + magnitude * 100 + '% less damage from all abilities'
	}

	else if (name.includes('Mana Regen')){
		descr = "Recovers an additional " + magnitude + ' Mana per turn'
	}  

	else if (name.includes('Taunt')){
		descr = "Forces this hero to attack " + magnitude;
	} 

	else if (name.includes("More Damage if Vulnerable")){
		descr = "If target is vulnerable, further increase damage by " + magnitude * 100 + "%";
	}

	else if (name.includes('Defender')){
		descr = "This hero intercepts all single-target attacks targeting allies in their row"
	} 

	else if (name.includes('Change Speed')){
		descr = "Change target's speed by " + magnitude;
	} 

	else if (name.includes('Increase Damage')){
		descr = "This unit deals " + magnitude * 100 + '% more damage';
	} 

	else if (name == 'Root'){
		descr = "Target cannot move";
	} 

	else if (name == 'Magic Damage'){
		descr = "This ability deals an additional " + magnitude + " Magic damage";
	} 


	else if (name.includes('Stealth')){
		descr = "This unit cannot be targeted by single-target abilities. Attacking while in Stealth causes the attack to deal 20% more damage but removes Stealth. This unit is stealthed ";
	} 

	else if (name == "Flame Cloak"){
		try{
			lost_health = Math.round(magnitude * curr_hero.curr_health);
		}
		catch{
			lost_health = 0;	
		}
		descr = "Lose " + lost_health + " (" + magnitude*100 + "% Current Health) Health." + "Enemies within 1 row take " + Math.round(.5 * lost_health) + " Magic Damage every turn. Enemies 2 rows away take " + Math.round(.25 * lost_health) + " Magic Damage. Enemies within 2 rows that attack Kane burn for " + Math.round(.5 * lost_health) + " Magic Damage each turn."
	}

	else if (name == 'Mind Over Matter'){
		descr = magnitude * 100 + "% of all damage to this unit's health is dealt to its mana instead";
	} 

	else if (name == 'Piercing'){
		descr = "Ignores " + magnitude * 100 + "% of target's armor and ward";
	} 

	else if (name.includes('Ethereal')){
		descr = "Immune to damage"
	} 

	else if (name == 'Permanently Reduce Damage'){
		descr = "Decrease Kalia's damage by " + magnitude * 100 + "%";
	} 

	else if (name == 'Remove Frozen'){
		descr = "If target is currently Frozen, remove Frozen from the target"
	}
	
	else if (name == 'Cancel Blizzard'){
		descr = "Cancel channeling of Blizzard"
	} 

	else if (name == "Increase Damage if Target Frozen"){
		descr = "If target is currently Frozen, this ability deals " + magnitude * 100 + "% more damage";
	}

	else if (name == "Decrease Armor and Ward if Target Frozen"){
		descr = "If target is currently Frozen, decrease their Armor and Ward by " + magnitude;
	}

	else if (name == "Double Frostbite Slow"){
		descr = "Double the slow effect of Frostbite on the target"
	}
	else if (name == 'Force Move Self'){
		descr = "Move forward " + magnitude + " rows or until in front of first enemy";
	} 

	else if (name == "More Damage If Physical Shield"){
		descr = "Deal " + magnitude *100 + "% damage if target has a physical shield";
	} 

	else if (name == "More Damage If Magic Shield"){
		descr = "Deal " + magnitude *100 + "% damage if target has a magic shield";
	} 
	
	else if (name.includes('Melee Counter')){
		descr = "Whenever attacked by an enemy within 2 rows, deal " + magnitude + " Physical damage to them"
	}

	else if (name.includes('Enhanced Inspired Courage')){
		descr = "Gain " + magnitude[0] * 100 + "% Fortify, " + magnitude[1] * 100 + "% Increased Damage, and +" + magnitude[2] + " Speed"
	}

	else if (name.includes('Inspired Courage')){
		descr = "Gain " + magnitude[0] * 100 + "% Fortify and +" + magnitude[2] + " Speed"
	}

	else if (name.includes('Leap to First Ally')){
		descr = "Move to same row as the furthest most ally"
	}

	else if (name.includes("Multistrike")){
		descr = "Attack an additional " + magnitude + " time(s)";
	}

	else if (name.includes('Lose Current Health And Deal Damage')){
		try{
			lost_health = Math.round(magnitude[0] * curr_hero.curr_health);
		}
		catch{
			lost_health = 0;	
		}
		descr = "Lose " + magnitude[0] *100 + "% (" + lost_health + " Health)" + " of current health and deal additional damage equal to " + magnitude[1] * 100 + "% of lost health (" + Math.round(magnitude[1] * lost_health) + " damage)"
	}

	else if (name.includes('Lose Current Mana And Deal Damage')){
		try{
			lost_mana = Math.round(magnitude[0] * curr_hero.curr_mana);
			descr = "Lose " + magnitude[0] *100 + "% (" + lost_mana + " Mana)" + " of current mana and deal additional damage equal to " + magnitude[1] * 100 + "% of lost mana (" + Math.round(magnitude[1] * lost_mana) + " damage)"
	
		}
		catch{
			lost_health = 0;	
		}
		}

	else if (name.includes('Fury Buff') && (effects_list == null || effects_list.length == 0)){
		descr = "For each " + magnitude[0] + " Undying Health Regen, gain +" + magnitude[1] + " speed and other stuff."
	}

	else if (name == "Frostbite"){
		descr = "For each stack of Frostbite, decrease this unit's speed by 1. At 4 stacks, remove all stacks and Freeze unit for 1 turn. Decrease this unit's speed by " + magnitude;
	}

	else if (name.includes("Increase Tidal Cutlass Damage")){
		descr = "Tidal Cutlass deals " + magnitude *100 + "% more damage";
	}

	else if (name.includes("Give Attacks Anti-Heal")){
		descr = "Attacks inflict " + magnitude *100 + "% Anti-Heal (1 turn)";
	}

	else if (name.includes("Crippled")){
		descr = "Everytime this hero moves, they take " + magnitude + " Health damage";
	}

	else if (name.includes("Drain")){
		descr = "Restore health to hero for " + magnitude * 100 + "% of damage dealt";
	}

	else if (name.includes("Reflect Physical Damage")){
		descr = "Attackers take " + magnitude * 100+ "% of pre-mitigation Physical damage as Physical damage";
	}

	else if (name.includes("Reflect Magic Damage")){
		descr = "Attackers take " + magnitude * 100+ "% of pre-mitigation Magic damage as Magic damage";
	}

	else if (name.includes("Magic Fortify")){
		descr = "Take " + magnitude * 100+ "% less Magic damage";
	}

	else if (name.includes("Physical Fortify")){
		descr = "Take " + magnitude * 100+ "% less Physical damage";
	}

	else if (name.includes("Increase Max Health")){
		descr = "Increase target's Max Health by " + magnitude;
	}

	else if (name == "Increase Damage Based On Target Armor"){
		descr = "Deal extra damage equal to " + magnitude * 100 + " of target's armor";
	}

	else if (name.includes("Increase Damage Based On Self")){
		descr = "Deal extra damage equal to " + magnitude * 100 + " of self ward";
	}
	
	else if (name.includes("Heal")){
		descr = "Restore " + magnitude + " Health to target hero";
	}

	else if (name.includes("Move Self")){
		descr = "Move up to " + magnitude + " spaces";
	}

	else if (name.includes("Cantrip")){
		descr = "Using this ability does not end this hero's turn";
	}
	
	else if (name.includes('Decrease Armor')){
		descr = "Decrease target's armor by " + magnitude;
	}

	else if (name.includes('Unified Strength')){
		descr = "For every alive ally, deal an additional " + magnitude[0] + " Physical damage. For each buff on each alive ally (up to 3 buffs per ally), deal an additional " + Math.round(magnitude[0] * magnitude[1]) + " Physical damage.";
	}


	else if (name.includes('Decrease Ward')){
		descr = "Decrease target's ward by " + magnitude;
	}

	//names of parent effects
	else if (list_of_parent_effects.includes(name)){
		descr = '';
		for (i=0; i<effects_list.length; i++){
			if (effects_list[i].parentName == name){
				turn_or_turns = ' turn'
				if (effects_list[i].duration > 1){
					turn_or_turns = ' turns'
				}
				
				descr += createDescr(effects_list[i].name, effects_list[i].magnitude, []) + ' for ' + effects_list[i].duration + turn_or_turns + '. ';
			}
		}
	}


	else{
		descr = 'Whoops! Add a description at around line 300!'
	}

	return descr;
	}


class Effect{
	//add parentName: include parent name - don't display if they have parent name
	constructor(name, magnitude, duration, parentName, isBuff, isUnique, descr){//isUNique now has 3 options (1/23/22) - lol (true, false, or "stack");
		this.name = name;
		this.magnitude = magnitude;
		this.duration = duration;
		this.parentName = parentName;
		this.isBuff = isBuff;
		this.isUnique = isUnique;
		this.descr = createDescr(this.name, this.magnitude, [])
	}

}

class Field_Effect{
	constructor(name, damage, type, duration, effects, when_triggers, owner, mana_upkeep, location, descr){
		this.name = name;
		this.damage = damage;
		this.type = type;
		this.duration = duration;
		this.effects = effects;
		this.when_triggers = when_triggers;
		this.owner = owner;
		this.mana_upkeep = mana_upkeep;
		this.location = location;
		this.descr = createDescr(this.name, this.magnitude, []);
	}
}


//Mae:
const mae_basic = new Ability("Snipe", 13, 'Physical', 5, 1, [new Effect("Piercing", .3, 0, null, false, false)], 0, 0);
const winds_fury = new Ability("Wind's Fury", 8, 'Physical', 5, 1, [new Effect("Multistrike", 1, 0, null, false, false)], 1, 5);
const hunters_trap = new Ability("First Aid", 0, 'Buff', 2, 1, [new Effect("Heal", 15, 0, null, false, false), new Effect('Decrease Debuffs', 2, 0, null, false, false)], 3, 10);
const winds_grace = new Ability("Wind's Grace", 0, 'Buff', 3, 'All Allies', [new Effect("Change Speed", 2, 2, null, false, false)], 3, 15);

//Draug Abilties
const sapping_touch = new Ability("Sapping Touch", 21, 'Magic', 2, 1, [new Effect("Drain", .5, 0, null, false, false), new Effect("Change Speed", -2, 1, null, false, false)], 0, 10);
const necrotic_blast = new Ability("Necrotic Blast", 23, 'Magic', 3, 1, [new Effect('Weak', .3, 2, null, false, false)], 2, 10);
const baleful_blade = new Ability("Baleful Blade", 14, 'Physical', 2, 1, [new Effect('Burn', 6, 2, null, false, false), new Effect('Anti-Heal', .5, 2, null, false, false)], 2, 5);
const rites_of_corruption = new Ability('Rites of Corruption', 0, 'Debuff', 99, 'all_enemies', [new Effect('Increase Debuffs', 1, 0, null, false, false)], 3, 15);

//Leif Abilities
const smite = new Ability("Smite", 18, 'Physical', 1, 1, [new Effect('Magic Damage', 8, 0, null, false, false)], 1, 10);
const cleansing_seal = new Ability("Cleansing Seal", 0, 'Buff', 99, 1, [new Effect('Gain Magic Shield', 10, 0, null, true, false), new Effect('Remove Debuffs', 1, 0, null, false, false)], 3, 15);
const thunderous_blow = new Ability("Thunderous Blow", 21, 'Physical', 1, 1, [new Effect('Stun', '', 1, null, false, false)], 3, 10);
const blinding_radiance = new Ability("Blinding Radiance", 15, 'Magic', 4, 1, [new Effect('Stun', '', 1, null, false, false), new Effect('Blind', 2, 2, null, false, false)], 4, 15);

//Forsyth Abilities
const mocking_shout = new Ability("Mocking Shout", 0, 'Debuff', 3, 1, [new Effect('Taunt', "Forsyth", 2, null, false, false), new Effect('Self Mana Regen', 8, 2, null, true, false)], 2, 0);
const shield_bash = new Ability("Shield Bash", 20, 'Physical', 1, 1, [new Effect('Self Change Armor', 8, 0, null, false, false)], 1, 5);
const dwarven_draught = new Ability("Dwarven Draught", 0, 'Buff', 1, 1, [new Effect('Health Regen', 7, 3, null, true, false), new Effect('Decrease Debuffs', 2, 0, null, false, false)], 3, 20);
const heroic_charge = new Ability("Heroic Charge", 20, 'Physical', 3, "First Enemy", [new Effect('Self Fortify', .3, 2, null, true, false), new Effect('Force Move Self', 2, 0, null, true, false)], 3, 10);

//Rivelle Abilities
const essence_drain = new Ability("Essence Drain", 17, 'Magic', 40, 1, [new Effect('Mana Drain', 8, 0, null, false, false)], 1, 0);
const natures_blessing = new Ability("Nature's Blessing", 0, 'Buff', 2, 1, [new Effect('Health Regen', 8, 2, "Nature's Blessing", true, true), new Effect('Mana Regen', 8, 2, "Nature's Blessing", true, true)], 2, 25); //new Effect('Change Speed', 2, 2, true)
const reap_and_sow = new Ability("Reap and Sow", 0, 'Buff', 2, 1, [new Effect('Gain Armor and Ward From Buffs', 5, 0, null, true, false), new Effect('Increase Buffs', 1, 0, null, true, false)], 3, 20);
const stranglevines = new Ability("Stranglevines", 16, 'Magic', 4, "row", [new Effect('Weak', .3, 1, null, false, false), new Effect('Root', 1 , 1, null, false, false)], 3, 20);

//Esme abilities
const draining_kiss = new Ability("Draining Kiss", 20, 'Magic', 1, 1, [new Effect('Drain', .6, 0, null, true, false), new Effect('More Damage if Vulnerable', .3, 0, null, false, false)], 0, 0); //1.3 * 1.23 ~ 1.6
const seductive_gaze = new Ability("Seductive Gaze", 16, 'Magic', 2, 1, [new Effect('Vulnerable', .3, 2, null, false, false), new Effect('Pull', 1, 0, null, false, false)], 4, 20); //change mana burn to force move forward 1
const dissolve_into_shadows = new Ability("Dissolve Into Shadows", 0, 'Buff', 0, 1, [new Effect('Elusive', .5, 2, null, false, false), new Effect('Move Self', 2, 0, null, true, false)], 3, 15);
const bat_storm = new Ability("Bat Storm", 8, 'Magic', 3, "Enemies Within 2 Rows", [new Effect('Lose Current Health And Deal Damage', [.7, .4], 0, null, true, false), new Effect('Force Move Self', -2, 0, null, true, false)], 3, 15);

//Nox abilities
const savage_blows = new Ability('Savage Blows', 11, 'Physical', 2, 1, [new Effect('More Damage If No Physical Shield', .3, 0, null, false, false), new Effect("Multistrike", 1, 0, null, false, false)], 1, 5);
const glorious_execution = new Ability('Glorious Execution', 26, 'Physical', 2, 1, [new Effect('Piercing', .5, 0, null, false, false), new Effect("More Damage If Target Low Life", .6, 0, null, false, false)], 4, 10); //change to missing health
const lunging_strike = new Ability("Lunging Strike", 24, 'Physical', 3, 1, [new Effect('Force Move Self', 1, 0, null, false, false)], 2, 10);
const roar_of_the_arena = new Ability("Roar of the Arena", 0, "Self Buff", 0, 1, [new Effect('Change Speed', 2, 2, null, true, false), new Effect('Increase Damage', .3, 2, null, true, false), new Effect("Heal Missing Health Percentage", .6, 0, null, false, false), new Effect('Only Usable If Enemy Is Low Life', 0, 0, null, false, false)], 4, 10);

//Kythra abilities:
const flame_of_justice = new Ability("Flame of Justice", 13, "Magic", 3, 1, [new Effect('Gain Magic Shield', 7, 0, null, false, false)], 1, 15);
const celestial_blade = new Ability("Celestial Blade", 20, "Magic", 2, 1, [new Effect('Piercing', .5, 0, null, false, false), new Effect('Heal Most Wounded Ally', 8, 0, null, false, false)], 1, 10);
const divine_restoration = new Ability("Divine Restoration", 0, "Buff", 3, 1, [new Effect('Decrease Debuffs', 1, 0, null, false, false), new Effect('Change Mana', 15, 0, null, false, false)], 3, 0);
const angelic_ascent = new Ability("Angelic Ascent", 0, "Self Buff", 0, 1, [new Effect('Ethereal', 1, 1, null, true, true), new Effect('Heal', 15, 0, null, false, false)], 4, 0);
// [flame_of_justice, celestial_blade, divine_restoration, angelic_ascent]

//Dark Kythra Abilities:
const shadowflame = new Ability("Shadowflame", 9, "Magic", 3, 1, [new Effect('Burn', 13, 1, null, false, false)], 0, 5)
const lash_of_torment = new Ability("Lash of Torment", 21, "Magic", 3, 1, [new Effect('Increase Debuffs', 1, 0, null, false, false), new Effect('Piercing', .5, 0, null, false, false), new Effect('Change Mana', -8, 0, null, false, false)], 1, 0)
const unholy_purge = new Ability("Unholy Purge", 24, "Magic", 4, 1, [new Effect('Drain', .75, 0, null, false, false), new Effect('Vulnerable', .3, 2, null, false, false), new Effect('Remove Buffs', 1, 0, null, false, false)], 3, 0)
const demonic_ascent = new Ability("Demonic Ascent", 18, "Magic", 99, 'all_enemies', [new Effect('Drain', .75, 0, null, false, false), new Effect('Self Increase Damage', .3, 2, null, true, false)], 3, 0)
// [shadowflame, lash_of_torment, unholy_purge, demonic_ascent]
//demonic ascent
const evolved_shadowflame = new Ability("Shadowflame", 13, "Magic", 3, 1, [new Effect('Burn', 13, 1, null, false, false)], 0, 5)

//Dara Abilities:
const essence_bolt = new Ability("Essence Bolt", 11, "Magic", 3, 1, [new Effect('Lose Current Mana And Deal Damage', [.3, .75], 0, null, false, false)], 0, 10)
const mind_over_matter = new Ability("Mind Over Matter", 0, "Buff", 0, 1, [new Effect('Mind Over Matter', .75, 2, null, false, true), new Effect('Cantrip', 0, 0, false)], 2, 0)
const siphon_power = new Ability("Siphon Power", 0, "Magic", 4, 1, [new Effect('Drain Percent Current Mana and Gain Magic Shield', [.25, 1], 0, null, false, false)], 2, 0)
const arcane_overload = new Ability("Arcane Overload", 0, "Magic", 4, "row", [new Effect('Lose Current Mana And Deal Damage', [.6, .65], 0, null, false, false)], 3, 0)

//Jakob Abilities:
const crossbow_shot = new Ability("Crossbow Shot", 19, "Physical", 3, 1, [new Effect('Anti-Heal', .3, 1, null, false, false)], 0, 5) //new Effect('More Damage If No Armor', .4, 0, null, false,false),
const firebomb = new Ability("Firebomb", 0, 'Debuff', 3, "row", [new Effect('Burn', 8, 2, null, false, false), new Effect('Anti-Heal', .7, 2, null, false, false)], 3, 10)
const flash_powder = new Ability("Flash Powder", 0, 'Debuff', 2, 1, [new Effect('Stun', 1, 1, null, false, true), new Effect('Vulnerable', .3, 1, null, false, false)], 4, 15)
const final_stand = new Ability("Final Stand", 11, "Physical", 3, 1, [new Effect("Multistrike", 2, 0), new Effect('Self Change Armor', 15, 0), new Effect('Self Change Ward', 15, 0), new Effect('Self Elusive', .5, 1, null, true, false)], 0, 0)

//Cyren Empowered Abilities:
const empowered_blades_of_the_immortals = new Ability('*Blades of the Immortals*', 12, "Physical", 2, 1, [new Effect('Drain', 1, 0), new Effect('Physical Damage', 12, 0, true)], 1, 10)
const empowered_radiant_warhammer = new Ability('*Radiant Warhammer*', 0, "Physical", 2, 1, [new Effect('Destroy Armor/Ward and Health Damage', [20, 20, .5], false)], 1, 15) //add destroy armor/ward+health damage
const empowered_solar_javelin = new Ability('*Solar Javelin*', 18, "Magic", 4, 1, [new Effect('Piercing', .5, 0, false), new Effect('Self Change Ward', 10, 0), new Effect('Self Heal', 10, 0)], 1, 12) //add self-heal
const empowered_divine_aegis = new Ability('*Divine Aegis*', 15, "Melee", 2, 1, [new Effect('Stun', 1, 0, null, false, true), new Effect('Self Change Armor', 12, 0)], 1, 15)

//Cyren Unempowered_abilities
const blades_of_the_immortals = new Ability('Blades of the Immortals', 10, "Physical", 1, 1, [new Effect("Multistrike", 1, 0)], 1, 10)
const radiant_warhammer = new Ability('Radiant Warhammer', 0, "Physical", 2, 1, [new Effect('Decrease Ward', 12, 0, false), new Effect('Decrease Armor', 12, 0, false)], 1, 15)
const solar_javelin = new Ability('Solar Javelin', 14, "Magic", 4, 1, [new Effect('Self Change Ward', 6, 0)], 1, 12) 
const divine_aegis = new Ability('Divine Aegis', 12, "Physical", 2, 1, [new Effect('Self Change Armor', 8, 0)], 1, 15)

//Vulshok Abilities
const sunder_armor = new Ability('Sunder Armor', 22, "Physical", 1, 1, [new Effect("Decrease Armor", 16, 0, false)], 1, 10)
const kingslayer = new Ability('Kingslayer', 18, "Physical", 1, 1, [new Effect("Increase Damage If Target More Health", .2, 0, false), new Effect("Drain", .5, 0, false)], 1, 15)
const brutal_blow = new Ability("Brutal Blow", 28, "Physical", 1, 1, [], 0, 0)
const immortal_rage = new Ability("Immortal Rage", 0, "Self Buff", 0, 1, [new Effect("Self Immortal", 0, 2, null, true, true)], 6, 0)

//Scion Abilities
const voltaic_arc = new Ability("Voltaic Arc", 15, "Magic", 3, 1, [new Effect("Increase Damage Based On Target Armor", .18, 0 , false), new Effect("Piercing", .3, 0, false)], 0, 10)
const shock_therapy = new Ability("Shock Therapy", 16, "Magic", 3, 1, [new Effect("Remove Buffs", 1, 0, false), new Effect("Decrease Debuffs", 2, 0, false)], 3, 15)
const overload = new Ability("Overload", 35, "Magic", 3, 1, [new Effect("Health Regen", 5, 3, null, true, false)], 3, 20)
const retrograde = new Ability("Retrograde", 0, 'Any', 3, 1, [new Effect("Reverse DoT and Health Regen", 1, 3, null, false, true)], 4, 10)

//Zeth Abilities:
const tainted_reconstruction = new Ability("Tainted Reconstruction", 0, "Buff", 3, 1, [new Effect("Heal", 22, 0, false), new Effect("Bleed", 4, 2, null, false, false)], 2, 20)
const twisted_vitality = new Ability("Twisted Vitality", 0, "Buff", 3, 1, [new Effect("Increase Max Health", 8, 0, false), new Effect("Vulnerable", .3, 1, null, false, false)], 2, 20)
const ritual_dagger = new Ability("Ritual Dagger", 15, "Physical", 2, 1, [new Effect("Bleed", 4, 2, null, false, false), new Effect("Restore Mana If Health Damage", 10, 0, false)], 0, 0)
const crimson_hex = new Ability("Crimson Hex", 0, "Debuff", 3, "row", [new Effect("Vulnerable", .3, 1, null, false, false), new Effect("Anti-Heal", .7, 1, null, false, false)], 3, 20) //maybe make this unique effect?


//Empowered Zeth Abilities:
const empowered_tainted_reconstruction = new Ability("*Tainted Reconstruction*", 0, "Buff", 3, 1, [new Effect("Heal", 22, 0, false)], 2, 10)
const empowered_twisted_vitality = new Ability("*Twisted Vitality*", 0, "Buff", 3, 1, [new Effect("Increase Max Health", 12, 0, false), new Effect("Increase Damage", .3, 1, null, true, false)], 2, 10)
const empowered_ritual_dagger = new Ability("*Ritual Dagger*", 18, "Physical", 3, 1, [new Effect("Bleed", 5, 3), new Effect("Restore Mana If Health Damage", 15, 0, false)], 0, 0)
const empowered_crimson_hex = new Ability("*Crimson Hex*", 0, "Debuff", 3, "row", [new Effect("Vulnerable", .3, 2, null, false, false), new Effect("Anti-Heal", .7, 2, null, false, false)], 3, 10)

//Kess Abilities:
const double_daggers = new Ability("Double Daggers", 13, "Physical", 2, 1, [new Effect("Cantrip", 0, 0, false), new Effect("Piercing", .3, 0, false)], 0, 0)
const cheap_shot = new Ability("Cheap Shot", 23, "Physical", 2, 1, [new Effect("Increase Damage If Target Has Debuff", .2, 0, false), new Effect("Increase Damage If Target Has Stun, Root, Crippled", .25, 0, false)], 1, 0)
const vanishing_powder = new Ability("Vanishing Powder", 0, 'Self Buff', 0, 0, [new Effect("Change Speed", 2, 1, null, true, false), new Effect("Self Stealth", 0, 1, null, true, true), new Effect('Move Self', 1, 0, true)], 3, 15)
const tumble = new Ability("Tumble", 0, "Buff", 0, 0, [new Effect('Self Elusive', .5, 1, null, true, false), new Effect("Cantrip", 0, 0, false), new Effect("Move Self", 1, 0, true)], 2, 0)

//Azrael Abilities:
const night_slash = new Ability("Night Slash", 11, 'Physical', 2, 1, [new Effect('Magic Damage', 11, 0, true)], 0, 10);
const phantasmal_strike = new Ability("Phantasmal Strike", 21, "Physical", 2, 1, [new Effect("Self Elusive", .5, 1, null, true, false)], 2, 10)
const blade_shield = new Ability("Blade Shield", 0, "Self Buff", 0, 0, [new Effect("Self Physical Fortify", .6, 2, "Blade Shield", true, true), new Effect("Self Reflect Physical Damage", .4, 2, "Blade Shield", true, true)], 4, 0) //make this unique
const mark_of_the_abyss = new Ability("Mark of the Abyss", 12, "Magic", 3, 1, [new Effect("Magic Damage Mark", 12, 2, "Mark of the Abyss", false, true), new Effect("Reduce Attacker CD Mark", 1, 2, "Mark of the Abyss", true, false)], 3, 15)

//Arthurias Abilities: 
const flesh_shield = new Ability("Flesh Shield", 0, "Self Buff", 0, 0, [new Effect("Lose Current Health And Give Self Physical And Magic Shield", [.25, .8], 0, null, false, false)], 2, 0);
const reckless_slam = new Ability("Reckless Slam", 12, "Physical", 3, "First Enemy", [new Effect("Stun Enemy If High Damage", 25, 0, null, false, false), new Effect('Lose Current Health And Deal Damage', [.2, 1.25], 0, null, true, false), new Effect('Force Move Self', 2, 0, true)], 1, 0);
const noxious_miasma = new Ability("Noxious Miasma", 0, "Debuff", 2, "Enemies Within 2 Rows", [new Effect("Weak", .3, 2, null, false, false), new Effect("Poison", 8, 2, null, false, false)], 3, 0);
const roid_rage = new Ability("Roid Rage", 0, "Self Buff", 0, 1, [new Effect("Fury Buff", [3, .1, .1, 1], 3, null, true, true), new Effect("Trigger Health Regen then Remove Regen", 1, 0, null, false, false)])//Fury buff - [X HP Lost, damage increase, fortify, speed boost] - also decrease reckless slam cooldown to 0. //Currently Unimplemented

//Athena Abilities: 
const rune_blast = new Ability("Rune Blast", 10, "Magic", 3, 1, [new Effect('Increase Damage Based On Self Ward', .2, 0, false), new Effect('Self Change Ward', 5, 0)], 1, 10);
const protective_glyph = new Ability("Protective Glyph", 0, "Buff", 2, 1, [new Effect("Immunity", 1, 2, "Protective Glyph", true, true), new Effect('Change Ward', 12, 2, "Protective Glyph", true, true)], 3, 15);//what to change "Change ward" to?
const mana_seal = new Ability("Mana Seal", 0, "Buff", 2, 1, [new Effect("Decrease Mana Costs", .5, 2, null, true, false), new Effect("Increase Next Magic Attack", .4, 2, null, true, true)], 2, 10)
const tranquility = new Ability("Tranquility", 0, "Debuff", 99, "all_enemies", [new Effect('Tranquil', 1, 1, null, false, true)], 4, 20);

//Kane Abilities:
const obsidian_hammer = new Ability("Obsidian Hammer", 20, "Physical", 1, 1, [new Effect("Piercing", .4, 0, false)], 0, 0)
const enduring_cry = new Ability("Enduring Cry", 0, "Debuff", 2, "Enemies Within 2 Rows", [new Effect("Taunt", "Kane", 1, null, false, true), new Effect("Heal Self For All Enemies Within 2 Rows", 10, 0, false), new Effect("Gain Self Damage Reduction For All Enemies Within 2 Rows", [.15, 2], 0, null, true, true)], 3, 15)
const magma_armor = new Ability("Magma Armor", 0, "Self Buff", 1, 1, [new Effect("Flame Cloak", .25, 3, null, true, true)], 3, 0);
const flowstone_wave = new Ability("Flowstone Wave", 16, "Magic", 3, 1, [new Effect("Unbalanced", 1, 1, null, false, true), new Effect("Pull", 1, 0, false)], 3, 15)

//Kalia Abilities:
const wicked_hack = new Ability("Wicked Hack", 22, "Physical", 2, 1, [new Effect("Physical Damage other Enemies in Row", 12, 0, false), new Effect("Permanently Reduce Damage", .1, 0, false)], 0, 0)
const thunderous_roar = new Ability("Thunderous Roar", 0, "Debuff", 2, "row", [new Effect("Stun", 1, 1, null, false, true), new Effect("Permanently Reduce Damage", .25, 0, false)], 2, 0)
const iron_rush = new Ability("Iron Rush", 26, "Physical", 4, "First Enemy", [new Effect("Self Vulnerable", .3, 1, null, false, false), new Effect("Self Change Speed", 4, 1, null, true, false), new Effect("Piercing", .5, 0, false), new Effect('Force Move Self', 3, 0, null, false, false)], 3, 0)
const endure = new Ability("Endure", 0, "Self Buff", 0, 0, [new Effect("Heal Missing Health Percentage", .7, 0, false), new Effect("Decrease Max Health by Percent", .25, 0, false)], 3, 0)

//Octavius Abilities:
const skypiercer_lance = new Ability("Skypiercer Lance", 20, "Physical", 2, 1, [new Effect("Piercing", .2, 0, false), new Effect("More Damage If Physical Shield", .5, 0, false)], 0, 0)
const coalition_assault = new Ability("Coalition Assault", 6, "Physical", 2, 1, [new Effect("Unified Strength", [6, .33])], 0, 0)
const rousing_oration = new Ability("Rousing Oration", 0, "Buff", 10, "All Allies Except Self", [new Effect("Decrease Debuffs", 1, 0, false), new Effect("Heal Missing Health Percentage", .3, 0, false), new Effect("Recover Missing Mana Percentage", .3, 0, false)], 4, 0)
const dauntless_vanguard = new Ability("Dauntless Vanguard", 0, "Self Buff", 1, 1, [new Effect('Self Change Armor', 25, 2, "Dauntless Vanguard", true, false), new Effect('Self Change Ward', 25, 2, "Dauntless Vanguard", true, false), new Effect("Self Defender", 1, 1, null, true, true), new Effect("Self Melee Counter", 12, 2, "Dauntless Vanguard", true, false), new Effect("Leap to First Ally", 0, 0, null, false, false)], 4, 10);

//Cassia Abilities:
const frost_lance = new Ability("Frost Lance", 19, "Magic", 4, 1, [new Effect("Frostbite", 4, 2, null, false, "stack"), new Effect("Piercing", .4, 0, false)], 0, 10);
const glacial_chains = new Ability("Glacial Chains", 21, "Magic", 3, 1, [new Effect("Frostbite", 1, 2, null, false, "stack"), new Effect("Root", 1, 1, "Glacial Chains", false, false), new Effect("Double Frostbite Slow", 0, 0, null, false, false)], 2, 15);
const shatterfrost = new Ability("Shatterfrost", 18, "Magic", 3, 1, [new Effect("Increase Damage if Target Frozen", 1, 0, false), new Effect("Decrease Armor and Ward if Target Frozen", 15, 0, null, false, false), new Effect("Piercing", .5, 0, false), new Effect("Remove Frozen", 0, 0, false)], 1, 15);
const blizzard = new Ability("Blizzard", 12, "Magic Channeled Field Effect", 3, 1, [new Effect("Frostbite", 1, 2, null, false, "stack")], 0, 10);
const cancel_blizzard = new Ability("Cancel Blizzard", 0, "Self Buff", 0, 1, [new Effect("Cantrip", 0, 0, null, false, false), new Effect("Cancel Blizzard", 0, 0, null, false, false)], 0, 0)

//Corvus Abilities:
const lash_of_agony = new Ability("Lash of Agony", 20, "Physical", 2, 1, [new Effect("Bleed", 5, 2, null, false, false), new Effect("Increase Longest Debuff if Buff Duration", [6, 1], 0, null, false, false)], 1, 0);
const exorcise = new Ability("Exorcise", 0)

//Arcturus Abilities:
const tidal_cutlass = new Ability("Tidal Cutlass", 20, "Physical", 1, 1, [new Effect("Magic Damage", 8, 0, null, false, false)], 0, 0);
const raging_torrent = new Ability("Raging Torrent", 16, "Magic", 4, "row", [new Effect("Unbalanced", 1, 1, null, false, false), new Effect("Push", 1, 0, null, false, false)], 3, 15);
const storm_surge = new Ability("Storm Surge", 0, "Self Buff", 0, 1, [new Effect("Change Speed", 2, 3, "Storm Surge", true, false), new Effect("Self Change Armor", 25, 3, "Storm Surge", true, false), new Effect("Self Change Ward", 25, 3, "Storm Surge", true, false), new Effect("Self Increase Tidal Cutlass Damage", .25, 3, "Storm Surge", true, true)], 4, 20);
const bombard = new Ability("Bombard", 10, "3 Turn Physical Field Effect", 99, 1, [], 4, 15);

//Azura Abilities:
const lance_of_divinity = new Ability("Lance of Divinity", 21, "Magic", 2, 1, [new Effect("Heal Most Wounded Ally", 9, 0, null, false, false)], 0, 0);
const heroic_armor = new Ability("Heroic Armor", 0, "Buff", 2, 1, [new Effect("Heroic Armor", [15, .03, 3], 0, null, true, true)], 3, 15) //first value is base armor/ward increase, second value is for every 1% missing health increase base value by 1 + (.03 * %missing HP), 3rd is duration
const soaring_sword = new Ability("Soaring Sword", 24, "Physical", 2, 1, [new Effect("Increase Speed of Allies in Row", [2, 2], 0, null, true, false)], 2, 10); //first value is mag, 2nd value is duration
const dains_vengeance = new Ability("Dain's Vengeance", 25, "Physical", 2, 1, [new Effect("Only Use When Ally Died Last Turn"), new Effect("Dain's Vengeance", [.3, .5, 3], 0, null, true, true)], 0, 15);

//Varkos Abilities:
const butchers_blade = new Ability("Butcher's Blade", 25, "Physical", 1, 1, [new Effect("Crippled", 5, 2, null, false, false)], 0, 0);
const slaughter_hooks = new Ability("Slaughter Hooks", 0, "2 Turn Movement Trap Field Effect", 3, 1, [], 4, 10)


//Tanks
const Leif = new Hero("Leif", "Paladin of Light", 80, 40, 4, 70, 100, 0, 0, [smite, cleansing_seal, thunderous_blow, blinding_radiance], "Sigil of Light", 4, 2)
// Leif: Damage: 2 || Range: 0 || Utility: 3 || Sustain: 1 || Mobility: 0
const Forsyth = new Hero("Forsyth", "Dwarven Vanguard", 90, 30, 3, 80, 65, 0, 0, [shield_bash, mocking_shout, dwarven_draught, heroic_charge], 'Sturdy Step', 3, 1)
// Forsyth: Damage: 0 || Range: 0 || Utility: 2 || Sustain: 3 || Mobility: 1
const Drakon = new Hero("Drakon", "Icebound Behemoth", 85, 40, 5, 50, 50, 0, 0, ['Brittle Steel', 'Crystalline Slumber', 'Colossal Smash', 'Shard Explosion'], "Frozen Soul", 1, 1) //Prio 1 
// Drakon: Damage: 2 || Range: 0 || Utility: 1 || Sustain: 3 || Mobility: 0
const Arthurias = new Hero("Arthurias", "Escaped Experiment", 80, 40, 4, 45, 40, 0, 0, [flesh_shield, reckless_slam, noxious_miasma, roid_rage], "Inhuman Vitality", 5, 1)
// Arthurias: Damage: 1 || Range: 0 || Utility: 2 || Sustain: 3 || Mobility: 0
//['Flesh Shield', 'Reckless Slam', 'Chain Lash', 'Necromantic Rites']
const Kane = new Hero("Kane", "Tribal Chieftain", 75, 40, 4, 65, 55, 0, 0, [obsidian_hammer, enduring_cry, magma_armor, flowstone_wave], "Volcanic Blood", 5, 2)

//Enchanters & Support
const Rivelle = new Hero("Rivelle", "Dryad Enchantress", 55, 50, 10, 30, 40, 0, 0, [essence_drain, natures_blessing, reap_and_sow, stranglevines], 'Mana Spring', 7, 2)
// Rivelle: Damage: 1 || Range: 1 || Utility: 1 || Sustain: 3 || Mobility: 0
const Zeth = new Hero("Zeth", "Flesh Sculptor", 60, 50, 5, 25, 25, 0, 0, [tainted_reconstruction, twisted_vitality, ritual_dagger, crimson_hex], "Canvas of Blood", 5, 2)
// Zeth: Damage: 1 || Range: 1 || Utility: 1 || Sustain: 3 || Mobility: 0
const Athena = new Hero("Athena", "Runic Sage", 50, 45, 10, 25, 60, 0, 0, [rune_blast, protective_glyph, mana_seal, tranquility], "Mending Magic", 5, 2)
const Halfdan = new Hero("Halfdan", "Dwarven Warsmith", 65, 45, 5, 35, 25, 0, 0,["Tainted Reconstruction", "Twisted Vitality", "Ritual Dagger", "Crimson Hex"], "Canvas of Blood", 5, 2)
const Azura = new Hero("Azura", "Saintly Valkyrie", 65, 50, 5, 40, 50, 0, 0, [lance_of_divinity, heroic_armor, soaring_sword, dains_vengeance], "Valhalla", 7, 2);

//Physical Damage
const Mae = new Hero("Mae", "Wind Ranger", 60, 30, 3, 40, 30, 0, 0,[mae_basic, hunters_trap, winds_fury, winds_grace], "Wind Dancer", 9, 3);
// Mae: Damage: 2 || Range: 2 || Utility: 1 || Sustain: 0 || Mobility: 0
const Nox = new Hero("Nox", "Champion Gladiator", 70, 30, 5, 60, 50, 0, 0,[savage_blows, glorious_execution, lunging_strike, roar_of_the_arena], 'Thrill of Combat', 5, 2)
// Nox: Damage: 3 || Range: 0 || Utility: 0 || Sustain: 0 || Mobility: 1
const Vulshok = new Hero("Vulshok", "Berserker", 80, 35, 5, 40, 40, 0, 0, [sunder_armor, kingslayer, brutal_blow, immortal_rage], 'Berserker Rage', 6, 2)
// Nox: Damage: 3 || Range: 0 || Utility: 0 || Sustain: 0 || Mobility: 1
const Jakob = new Hero("Jakob", "Vampire Hunter", 60, 40, 4, 45, 40, 0, 0, [crossbow_shot, firebomb, flash_powder, final_stand], 'Dark Avenger', 6, 2); 
const Kess = new Hero("Kess", "Back-Alley Rogue", 55, 30, 5, 40, 30, 0, 0, [double_daggers, cheap_shot, vanishing_powder, tumble], "The Finisher", 8, 3)
const Azrael = new Hero("Azrael", "Guardian of the Void", 65, 40, 5, 50, 40, 0, 0, [night_slash, phantasmal_strike, blade_shield, mark_of_the_abyss], "Abyssal Blade", 6, 2)
const Kalia = new Hero("Kalia", "Hellion", 70, 30, 5, 55, 50, 0, 0, [wicked_hack, thunderous_roar, iron_rush, endure], "Battle Fury", 6, 2)//"Thunderous Roar", "Iron Rush", "Endure"],
const Cyren = new Hero("Cyren", "Exiled Demigod", 65, 50, 8, 25, 30, 0, 0,["Blades of the Immortals", "Radiant Warhammer", "Solar Javelin", "Divine Aegis"], 'Divine Ancestry', 6, 2)
const Octavius = new Hero("Octavius", "The Gilded Spear", 80, 40, 5, 70, 60, 0, 0, [skypiercer_lance, coalition_assault, rousing_oration, dauntless_vanguard], "Lion of the North", 5, 2)//"Coalition Assault", "Rousing Oration", "Dauntless Vanguard"
const Silvermane = new Hero("Silvermane", "Werewolf", 80, 40, 5, 60, 50, 0, 0, ["Chase Down", "Blood Mark", "Evicerate", "Primal Howl"], "Pack Hunter", 5, 2)
const Arcturus = new Hero("Arcturus", "Rogue Admiral", 70, 50, 7, 55, 55, 0, 0, [tidal_cutlass, raging_torrent, storm_surge, bombard], "Fury of the Seas", 5, 2)
const Varkos = new Hero("Varkos", "Flesh Cleaver", 80, 30, 5, 60, 50, 0, 0, [butchers_blade, butchers_blade, butchers_blade, butchers_blade], "Fear", 5, 2)


//Magic Damage
const Esme = new Hero("Esme", "Vampire Queen", 60, 45, 5, 40, 45, 0, 0,[draining_kiss, seductive_gaze, dissolve_into_shadows, bat_storm], 'Crimson Queen', 7, 2)
// Esme: Damage: 2 || Range: 0 || Utility: 1 || Sustain: 2 || Mobility: 2
const Dara = new Hero("Dara", "Arcane Scholar", 55, 1000, 10, 50, 15, 0, 0, [essence_bolt, mind_over_matter, siphon_power, arcane_overload], 'Ancient Knowledge', 5, 2)
// Dara: Damage: 3 || Range: 1 || Utility: 1 || Sustain: 1 || Mobility: 0
const Kythra = new Hero("Kythra", 'Demonic Angel', 50, 40, 5, 40, 40, 0, 0, [flame_of_justice, celestial_blade, divine_restoration, angelic_ascent], 'The Darkness Within', 6, 2)
// Kythra: Damage: 1 || Range: 1 || Utility: 1 || Sustain: 1 || Mobility: 0
// Dark Kythra: Damage: 3 || Range: 2 || Utility: 1 || Sustain: 3 || Mobility: 0
const Draug = new Hero("Draug", "Lord of the Undying", 65, 35, 4, 50, 50, 0, 0,[sapping_touch, necrotic_blast, baleful_blade, rites_of_corruption], 'Soul Drain', 4, 1);
// Draug: Damage: 2 || Range: 1 || Utility: 1 || Sustain: 1 || Mobility: 0
const Scion = new Hero("Scion", "Mad Experimenter", 60, 50, 5, 40, 40, 0, 0, [voltaic_arc, shock_therapy, overload, retrograde], "Static Field", 5, 2)
//Other
const Corvus = new Hero("Corvus", "Dark Inquisitor", 60, 45, 5, 40, 65, 0, 0, ["Lash of Agony", "Exorcise", "Silencer's Needle", "Magebane Poison"], "Cull the Source", 5, 2)
const Raven = new Hero("Raven", "Night's Shadow", 45, 30, 5, 5, 10, 0, 0,['Shadowstrike', "Night Piercer", "Shadowbolt", "Embrace Darkness"], 'The Comforting Dark', 9, 3);
const Cassia = new Hero("Cassia", "Frost Princess", 55, 60, 10, 40, 45, 0, 0, [frost_lance, glacial_chains, shatterfrost, blizzard], "Winter's Wrath", 4, 2)
const Aria = new Hero("Aria", "Whimsical Dancer", 60, 50, 8, 40, 40, 0, 0, ['Violent Cadence', "Nimble Aura", "ELegant Trail", "Quickstep"], "Everlasting Waltz", 6, 2)


Nox.passive_descr = "Nox's abilities have their cooldown reduced by 1 whenever he reduces an enemy to below 50% health."
Mae.passive_descr = "Mae's abilities deal additional damage equal to the difference between Mae's speed and her target's speed."
Draug.passive_descr = "When a hero dies, Draug gains Health, Mana, Armor, and Ward equal to 20% of the hero's initial stats."
Esme.passive_descr = "When Esme is at full health, 40% of the drained health from her abilities is added to her max health."
Jakob.passive_descr = "Jakob's damaging attacks reduce their target's maximum health by 4. Last Stand consumes at least 5 Wrath. Gain 1 Wrath whenever Jakob is targeted by an ability and 5 Wrath when an ally dies."//potential passive: enemies who kill allies are marked. Killing a marked enemy gives Jakob 50% of his missing health back.
Leif.passive_descr = "Leif's attacks mark enemies. When an ally attacks a marked target, the mark is consumed and the ally heals for 10% of their maximum health. Marks do not stack."
Vulshok.passive_descr = "Vulshok deals 1% more damage per 2% missing health."
Scion.passive_descr = "When Scion or an ally in Scion's row would be Stunned, ignore the Stun and instead give Weak (1) and -2 Speed for 1 turn to the target."
Zeth.passive_descr = "Every 80 Health lost by heroes empowers Zeth's next ability and halves its mana cost."
Arthurias.passive_descr = "50% of all non-DoT damage Arthurias takes is recovered as Health Regen over 3 turns."
Octavius.passive_descr =  "After an enemy hero dies, all allied heroes gain +1 Speed and take 20% less damage for 2 turns. If Octavius killed the enemy hero with an ability, all allies gain 20% more damage, an additional +1 Speed, and buff duration increased by 1 turn."
Azura.passive_descr = "Increase Azura's healing effectiveness by 20% for every slain ally. Once per battle, when an ally dies, Azura can prevent their death and heal them for 40% of their Max HP."
Kess.passive_descr = "All of Kess' abilities deal extra Physical damage equal to 15% of their target's missing health."
Forsyth.passive_descr = "Forsyth cannot be slowed."
Kane.passive_descr = "Once per turn, if an ability would debuff Kane, he sacrifices 10% of his Max HP to prevent all debuffs inflicted by the ability. [Unimplemented]"
Rivelle.passive_descr = "At the beginning of the game, all of Rivelle's allies gain +2 Mana Regen. [Unimplemented]"
Athena.passive_descr = "When Athena uses an ability, restore 5 Health to the most wounded allied champion. [Unimplemented]" 
Azrael.passive_descr = "Attacking the same enemy on consecutive turns makes the second attack deal an additional 15 Magic Damage."
Kalia.passive_descr = "Kalia's attacks cause her damage to permanently decrease. This decrease cannot be cleansed from abilities. When Kalia passes her turn, her damage decrease is lowered by 25%."
Arcturus.passive_descr = "When Arcturus is attacked, gain a stack of Fury that lasts 3 turns. Each stack is separate. For each stack of Fury, gain +10 Armor/Ward. At max stacks, gain +3 Speed."
Dara.passive_descr = "Dara has no cap on her maximum Mana. Dara gains Mana Regen equal to 30% of her allies' Mana Regen."
Kythra.passive_descr = "Kythra battles with the Darkness within herself. Using Kythra's abilities (10 Darkness/ability, Angelic Ascent decreases Darkness by 15) and receiving damage increases her Darkness meter (50% of health damage taken converted to darkness). Maximum Darkness: 100. At 50 and 100 Darkness, gain 10 Max HP. At 25, 50, 75, and 100 Darkness, 1 of Kythra's abilities is upgraded." 
Cassia.passive_descr = "All of Cassia's damaging abilities add a stack of Frostbite that persists for 2 turns and is refreshed by each new stack: (1 Stack: -1 Speed, 2 Stacks: -2 Speed, 3 Stacks: -3 Speed, 4 Stacks: consume all stacks and Freeze 1). If target is frozen, cannot gain Frostbite stacks."
//p1_heroes_alive = []
p1_heroes_alive = JSON.parse(window.localStorage.getItem('p1_heroes_alive'));
p2_heroes_alive = JSON.parse(window.localStorage.getItem('p2_heroes_alive'));

//var p1_h1 = JSON.parse(JSON.stringify(Esme));
var p1_h1 = p1_heroes_alive[0];
p1_h1.team = 1;
p1_h1.curr_health = p1_h1.health;
p1_h1.curr_mana = p1_h1.mana;
p1_h1.effects = [];
p1_h1.cd_basic = 0;
p1_h1.cd_a1 = 0;
p1_h1.cd_a2 = 0;
p1_h1.cd_a3 = 0;
p1_h1.base_armor = p1_h1.armor;
p1_h1.base_ward = p1_h1.ward;
p1_h1.curr_armor = p1_h1.armor;
p1_h1.curr_ward = p1_h1.ward;
p1_h1.armor_ward_penalties = [];
//p1_h1.position = 0;
p1_h1.id = 0;
p1_h1.utilities = [];

//var p1_h2 = JSON.parse(JSON.stringify(Arcturus));
var p1_h2 = p1_heroes_alive[1];
p1_h2.team = 1;
p1_h2.curr_health = p1_h2.health;
p1_h2.curr_mana = p1_h2.mana;
p1_h2.effects = [];
p1_h2.cd_basic = 0;
p1_h2.cd_a1 = 0;
p1_h2.cd_a2 = 0;
p1_h2.cd_a3 = 0;
p1_h2.base_armor = p1_h2.armor;
p1_h2.base_ward = p1_h2.ward;
p1_h2.curr_armor = p1_h2.armor;
p1_h2.curr_ward = p1_h2.ward;
p1_h2.armor_ward_penalties = [];
//p1_h2.position = 1;
p1_h2.id = 1;
p1_h2.utilities = [];

//var p1_h3 = JSON.parse(JSON.stringify(Azura));
var p1_h3 = p1_heroes_alive[2];
p1_h3.team = 1;
p1_h3.curr_health = p1_h3.health;
p1_h3.curr_mana = p1_h3.mana;
p1_h3.effects = [];
p1_h3.cd_basic = 0;
p1_h3.cd_a1 = 0;
p1_h3.cd_a2 = 0;
p1_h3.cd_a3 = 0;
p1_h3.base_armor = p1_h3.armor;
p1_h3.base_ward = p1_h3.ward;
p1_h3.curr_armor = p1_h3.armor;
p1_h3.curr_ward = p1_h3.ward;
p1_h3.armor_ward_penalties = [];
//p1_h3.position = 2;
p1_h3.id = 2;
p1_h3.utilities = [];

//var p2_h1 = JSON.parse(JSON.stringify(Varkos));
var p2_h1 = p2_heroes_alive[0];
p2_h1.team = 2;
p2_h1.curr_health = p2_h1.health;
p2_h1.curr_mana = p2_h1.mana;
p2_h1.effects = [];
p2_h1.cd_basic = 0;
p2_h1.cd_a1 = 0;
p2_h1.cd_a2 = 0;
p2_h1.cd_a3 = 0;
p2_h1.base_armor = p2_h1.armor;
p2_h1.base_ward = p2_h1.ward;
p2_h1.curr_armor = p2_h1.armor;
p2_h1.curr_ward = p2_h1.ward;
p2_h1.armor_ward_penalties = [];
//p2_h1.position = 5;
p2_h1.id = 5;
p2_h1.utilities = [];

//var p2_h2 = JSON.parse(JSON.stringify(Octavius));
var p2_h2 = p2_heroes_alive[1];
p2_h2.team = 2;
p2_h2.curr_health = p2_h2.health;
p2_h2.curr_mana = p2_h2.mana;
p2_h2.effects = [];
p2_h2.cd_basic = 0;
p2_h2.cd_a1 = 0;
p2_h2.cd_a2 = 0;
p2_h2.cd_a3 = 0;
p2_h2.base_armor = p2_h2.armor;
p2_h2.base_ward = p2_h2.ward;
p2_h2.curr_armor = p2_h2.armor;
p2_h2.curr_ward = p2_h2.ward;
p2_h2.armor_ward_penalties = [];
//p2_h2.position = 6;
p2_h2.id = 6;
p2_h2.utilities = [];

//var p2_h3 = JSON.parse(JSON.stringify(Cassia));
var p2_h3 = p2_heroes_alive[2];
p2_h3.team = 2;
p2_h3.curr_health = p2_h3.health;
p2_h3.curr_mana = p2_h3.mana;
p2_h3.effects = [];
p2_h3.cd_basic = 0;
p2_h3.cd_a1 = 0;
p2_h3.cd_a2 = 0;
p2_h3.cd_a3 = 0;
p2_h3.base_armor = p2_h3.armor;
p2_h3.base_ward = p2_h3.ward;
p2_h3.curr_armor = p2_h3.armor;
p2_h3.curr_ward = p2_h3.ward;
p2_h3.armor_ward_penalties = [];
//p2_h3.position = 7;
p2_h3.id = 7;
p2_h3.utilities = [];

function isUpper(str) {
    return !/[a-z]/.test(str) && /[A-Z]/.test(str);
}

function set_initial_position(){
	for (hero of p1_heroes_alive.concat(p2_heroes_alive)){
		pos = hero.position;
		//console.log('Hero + Position: ' + hero.name + ' - ' + hero.position)
		document.getElementById('field_position' + pos).appendChild(document.getElementById("space" + hero.id));

		var to_hide = document.getElementById('field_position' + pos).getElementsByClassName('hero');
		for (var i = 0; i < to_hide.length; i++){
			if(to_hide[i].innerText == "__"){
				//console.log(to_hide[i]);
				to_hide[i].style.display = 'none';
			}
		}
	}
}

p1_heroes_alive = [p1_h1, p1_h2, p1_h3];
p2_heroes_alive = [p2_h1, p2_h2, p2_h3];


document.getElementById('space' + p1_h1.id).innerHTML = "<h1>" + p1_h1.name + "</h1>";
document.getElementById('space' + p1_h2.id).innerHTML = "<h1>" + p1_h2.name + "</h1>";
document.getElementById('space' + p1_h3.id).innerHTML = "<h1>" + p1_h3.name + "</h1>";

document.getElementById('space' + p2_h1.id).innerHTML = "<h1>" + p2_h1.name + "</h1>";
document.getElementById('space' + p2_h2.id).innerHTML = "<h1>" + p2_h2.name + "</h1>";
document.getElementById('space' + p2_h3.id).innerHTML = "<h1>" + p2_h3.name + "</h1>";


set_initial_position();

// for (var space_num = 0; space_num < 8; space_num++) {
// 	//document.getElementById('space' + space_num).innerHTML = "<h1>__</h1>";
// 	console.log(space_num);
// 	console.log(document.getElementById('space' + space_num).innerHTML)
// }

p1_h1.leif_mark = false;
p1_h2.leif_mark = false;
p1_h3.leif_mark = false;
p2_h1.leif_mark = false;
p2_h2.leif_mark = false;
p2_h3.leif_mark = false;

//field effects init list
var current_field_effects = [];

function get_valid_targets(hero, range, curr_action, ability){
	checkIfBlind = (hero.effects.filter(obj => {
		return obj.name.includes('Blind');
	  }))
	isBlind = (checkIfBlind.length != 0);

	if (isBlind){
	//console.log(checkIfBlind[0].magnitude)
	range = Math.min(checkIfBlind[0].magnitude, range)
	console.log('Range changed to ' + range)
	}

	var valid_positions = array_range(Math.max(hero.position - range, 0), Math.min(hero.position + range + 1, 8))
	valid_targets = [];
	if(!ability.type.includes("Field Effect")){
		for (h of p1_heroes_alive.concat(p2_heroes_alive)) {
			//console.log(h);
			//console.log(h.position);
			if (valid_positions.includes(h.position)){
				valid_targets.push(h)
				//console.log('adding ' + h.name);
			}
		}
	}
	else{
		valid_targets = valid_positions;
	}
	// console.log("init valid targets")
	// console.log(valid_targets);
	valid_targets = drop_invalid_targets(hero, ability, valid_targets);
	return valid_targets;
}

function drop_invalid_targets(hero, ability, valid_targets){
	//console.log(hero)
	var new_valid_targets = [];
	var type = ability.type;
	//console.log(ability.name + ' - ' + ability.type);
	//console.log("Init Targets for ability (next line):");
	//console.log(valid_targets)
	//include all type 
	if(type.includes("Field Effect")){
		new_valid_targets = valid_targets;
	}
	else{

		if(type == "Physical" || type == "Magic" || type == 'Debuff'){
			new_valid_targets = valid_targets.filter(function(target) {return (target.team != hero.team)});
			//console.log("After first phys/magic/debuff filter")
			//console.log(new_valid_targets);

			//check for taunts
			tauntingTargets = [];

			checkIfTaunted = (hero.effects.filter(obj => {
				return obj.name.includes('Taunt');
				}))		
			isTaunted = (checkIfTaunted.length != 0);	
			for (i = 0; i < checkIfTaunted.length; i++){
					taunting_hero_name = checkIfTaunted[i].magnitude;
					taunting_hero = p1_heroes_alive.concat(p2_heroes_alive).find(hero => hero.name == taunting_hero_name)
					tauntingTargets.push(taunting_hero)

			}

			//console.log('Taunting Targets: ' + tauntingTargets)
			if (tauntingTargets.length != 0){
				new_valid_targets = tauntingTargets;
			}

			if (type == 'Any'){
				//console.log('type is Any')
				for (i = 0; i < valid_targets.length; i++){
					if(valid_targets[i].team == hero.team && valid_targets[i].team != null){
						new_valid_targets.push(valid_targets[i]);
					}
				}
			}

		} 
		
		else{
			new_valid_targets = valid_targets.filter(function(target) {return (target.team == hero.team)});
			
			if (type.includes("Self")){
				//console.log("Only ME!")
				new_valid_targets = [curr_hero];
			}
		}

		console.log('New Valid Targets:')
		console.log(new_valid_targets)
		// AoE == First Enemy
		//console.log('before first enemy')
		//console.log(new_valid_targets)
		//console.log(ability.AoE);
		//console.log(ability)
		if (ability.AoE == 'First Enemy'){
			//console.log('getting targets for First Enemy...')

			//
			var first_enemy_to_left_pos = -1
			//console.log(enemy_hero_list)
			for (var j = 0; j < new_valid_targets.length; j++){
				//console.log(enemy_hero_list[j].position)
				//console.log(first_enemy_to_left_pos)
				//console.log(enemy_hero_list[j].position > first_enemy_to_left_pos)
				if (new_valid_targets[j].team != hero.team && new_valid_targets[j].position > first_enemy_to_left_pos && new_valid_targets[j].position < curr_hero.position){
					first_enemy_to_left_pos = new_valid_targets[j].position;
					//console.log('woot!')
				}
			}

			var first_enemy_to_right_pos = 8
			for (var k = 0; k < new_valid_targets.length; k++){
				if (new_valid_targets[k].team != hero.team && new_valid_targets[k].position < first_enemy_to_right_pos && new_valid_targets[k].position > curr_hero.position){
					first_enemy_to_right_pos = new_valid_targets[k].position;
				}
			}
			//console.log(new_valid_targets)
			//console.log('rightmost: ' + first_enemy_to_right_pos)
			//console.log('leftmost: ' + first_enemy_to_left_pos)
			new_valid_targets = (new_valid_targets.filter(obj => {
				return (obj.position == first_enemy_to_left_pos || obj.position == first_enemy_to_right_pos);
			}))
			//console.log("AFter first enemy")
			//console.log(new_valid_targets)
		}

			//console.log('before defender')
			//console.log(new_valid_targets);
			//switch - first identify heroes who are defender/stealthed, then at the end of the loop, resolve this.
			for (i = 0; i < new_valid_targets.length; i++){
				//check for defender - if stealthed, then cancel effects of defender;

				new_valid_targets = new_valid_targets.filter(function(target) {
					checkIfStealth = (target.effects.filter(obj => {
						return obj.name.includes('Stealth');
					}))
					isStealth = (checkIfStealth.length != 0);	
					
					if (!isStealth){
						return target;
					}
				})

				try{
					checkIfDefender = (new_valid_targets[i].effects.filter(obj => {
						return obj.name.includes('Defender');
					}))		
					isDefender = (checkIfDefender.length != 0);	
					
					//console.log(new_valid_targets[i])
					//console.log("isDefender: " + isDefender);
					//if hero is defender, filter out all enemies in same row as defender.
					if (isDefender){
						console.log(valid_targets[i]);
						new_valid_targets = new_valid_targets.filter(function(h) {return ( (h.team == valid_targets[i].team) && 
							((h.name == valid_targets[i].name || (h.position != valid_targets[i].position)) ))});
						//console.log('after defender')
						//console.log(new_valid_targets)
					}
				}
				catch{
					console.log("no defender")
				}


		//check for stealth:
	
		
		// if(valid_targets[i].team != hero.team && valid_targets[i].team != null && (!isStealth)){
		// 	new_valid_targets.push(valid_targets[i]);
		// }
	}

	if (ability.AoE == "All Allies Except Self"){
		if (hero.team == 1){
			allied_alive_heroes = p1_heroes_alive;
		}
		
		else{
			allied_alive_heroes = p2_heroes_alive;
		}
		
		allied_alive_heroes = allied_alive_heroes.filter(function(el) { return el.name != curr_hero.name; }); 

		new_valid_targets = allied_alive_heroes;
		
		//console.log(new_valid_targets)
	}

	if (ability.AoE == "All Allies"){
		if (hero.team == 1){
			allied_alive_heroes = p1_heroes_alive;
		}
		
		else{
			allied_alive_heroes = p2_heroes_alive;
		}
		new_valid_targets = allied_alive_heroes;
		
		console.log(new_valid_targets)
	}

	if (ability.AoE == "Enemies Within 2 Rows"){
		if (hero.team == 1){
			enemy_hero_list = p2_heroes_alive;
		}
		
		else{
			enemy_hero_list = p1_heroes_alive;
		}
		
		new_valid_targets = (enemy_hero_list.filter(obj => {
			return (Math.abs(obj.position - hero.position) <= 2);
		  }))
		
		//console.log(new_valid_targets)

	}
}
	//console.log(ability.name + ' - ' + ability.type + ' - Final Targets');
	//console.log("Valid targets")
	//console.log(new_valid_targets)
	return new_valid_targets;
}



var curr_hero;

var rounds = 1;

var endTurn = false;

//var field = [p1_h1, p1_h2, p1_h3, 0, 0, p2_h1, p2_h2, p2_h3];

//change field to a position attribute
//check if Kythra is involved:
scion_is_alive = false;
zeth_is_alive = false;
octavius_is_alive = false;
for (hero of p1_heroes_alive.concat(p2_heroes_alive)) {
	if (hero.name == 'Kythra'){
		hero.darkness = 0
		console.log('Carry Pants: ON')
	}

	//check if Jakob is involved
	if (hero.name == 'Jakob'){
		hero.wrath = 0
	}

	//check if Dara is involved
	if (hero.name == 'Dara'){
		hero.curr_mana = 50
		console.log('Dara Mana set to 50')
	}	

	if (hero.name == 'Scion'){
		scion_is_alive = true
		console.log('Zap!')
	}

	if (hero.name == 'Octavius'){
		octavius_is_alive = true;
		octavius_team = hero.team;
		console.log('For the North!')
	}

	if (hero.name == 'Zeth'){
		hero.health_lost = 0
		console.log('Jack the Dripper')
	}

	if (hero.name == 'Kalia'){
		hero.damage_decrease = 0;
		//console.log('Rawr')
	}

	if (hero.name == 'Azura'){
		hero.azura_can_revive = true;
		hero.azura_slain_allies = 0;
		hero.ally_died_last_turn = false;
		console.log('To Valhalla!')
	}

	if (hero.name == 'Kess'){
		hero.knives_ammo = 2;
		p1_h1.kess_used_finisher = false;
		p1_h1.kess_knives = 0;
		p1_h2.kess_used_finisher = false;
		p1_h2.kess_knives = 0;
		p1_h3.kess_used_finisher = false;
		p1_h3.kess_knives = 0;
		p2_h1.kess_used_finisher = false;
		p2_h1.kess_knives = 0;
		p2_h2.kess_used_finisher = false;
		p2_h2.kess_knives = 0;
		p2_h3.kess_used_finisher = false;
		p2_h3.kess_knives = 0;
		console.log("Time to throw knives!")
	}
	if (hero.name == 'Azrael'){
		hero.id_azrael_most_recently_attacked = false;
		var azrael_mark_applied_this_turn_already = false;
		console.log('One to cut, one to seal.')
		console.log(hero.id_azrael_most_recently_attacked)
	}
}

function ai_generate_utility(){
	ai_called = true;
	for (hero of p1_heroes_alive.concat(p2_heroes_alive)) {
		get_hero_utility(hero)
		hero.utilities.sort((a, b) => b.total_utility - a.total_utility);
	}
	ai_called = false;
}


function get_hero_utility(hero){
	//store original curr hero here
	original_curr_hero = curr_hero;
	alive_heroes = p1_heroes_alive.concat(p2_heroes_alive);
	var original_alive_heroes = [];

	if (alive_heroes.includes(p1_h1)){
		original_p1_h1 = _.cloneDeep(p1_h1);
		original_alive_heroes.push(original_p1_h1);
	}
	
	if (alive_heroes.includes(p1_h2)){
		original_p1_h2 = _.cloneDeep(p1_h2);
		original_alive_heroes.push(original_p1_h2);
	}

	if (alive_heroes.includes(p1_h3)){
		original_p1_h3 = _.cloneDeep(p1_h3);
		original_alive_heroes.push(original_p1_h3);
	}

	if (alive_heroes.includes(p2_h1)){
		original_p2_h1 = _.cloneDeep(p2_h1);
		original_alive_heroes.push(original_p2_h1);
	}

	if (alive_heroes.includes(p2_h2)){
		original_p2_h2 = _.cloneDeep(p2_h2);
		original_alive_heroes.push(original_p2_h2);
	}

	if (alive_heroes.includes(p2_h3)){
		original_p2_h3 = _.cloneDeep(p2_h3);
		original_alive_heroes.push(original_p2_h3);
	}

	//console.log(original_alive_heroes);

	for (let index = 0; index < hero.abilities.length; index++) {

		var ability = hero.abilities[index];
		//run apply-ability with curr_hero set as hero in for loop.
		curr_hero = hero;
		//console.log(hero.name + ' - ' + ability.name)

		
		var valid_targets = get_valid_targets(hero, ability.range, hero.position, ability)
		// console.log("Valid Targets:");
		// console.log(valid_targets);
		//console.log(hero.name + ' - ' + ability.name + ' - ' + valid_targets.length)
		//console.log('Range: ' + ability.range)
		//console.log('Pos: ' + hero.position)
		
		//console.log('vt length: ' + valid_targets.length);
		for (let t = 0; t < valid_targets.length; t++) {
			
			p1_h1 = original_p1_h1;
			p1_h2 = original_p1_h2;
			p1_h3 = original_p1_h3;
			p2_h1 = original_p2_h1;
			p2_h2 = original_p2_h2;
			p2_h3 = original_p2_h3;

			console.log(valid_targets[t].name)
			apply_ability(ability, valid_targets[t])
			//console.log(alive_heroes);
			//var pred_damage = damage_prediction(hero, ability, valid_targets[t], valid_targets[t].position, true)
			pred_damage = 1
			var DoTs = (ability.effects.filter(obj => {
				return (obj.name == 'Burn' || obj.name == 'Poison' || obj.name == 'Bleed');
			}));

			var DoT_damage = 0;
			if(DoTs.length > 0){
				for (let dot_num = 0; dot_num < DoTs.length; dot_num++) {
					DoT_damage += DoTs[dot_num].magnitude * DoTs[dot_num].duration;
				}
			}

			//todo: find utility gain for status effects

			// class Utility{
			// 	constructor(ability, target, init_damage, total_damage, total_utility){
			// 		this.ability = ability;
			// 		this.target = target;
			// 		this.init_damage = init_damage;
			// 		this.total_damage = total_damage;
			// 		this.total_utility = total_utility;
			// 	}
			// }

			// //create clones of all current heroes.
			
			//console.log(cloned_alive_heroes)
			//apply_
			util = new Utility(ability, valid_targets[t], pred_damage, pred_damage, pred_damage);
			//console.log(util)
			//inside clone simulation, calculate utility of moves
			if (hero.utilities.indexOf(util) == -1){
				hero.utilities.push(util)
			}
			
			//console.log(new Utility(ability, valid_targets[t], pred_damage, pred_damage))
		}
	}
	curr_hero = original_curr_hero;
	//recover original heroes: 

	


	// all_potential_moves.sort((a, b) => (b[1] - a[1]));
	// console.log(all_potential_moves)
	// return all_potential_moves;
}

//plan: make function to get utility based off damage (add up both teams hp and get difference.)

// function get_initial_utility(){
// 	var hero_list = p1_heroes_alive.concat(p2_heroes_alive)
// 	var utility;

// 	for (let hero_num = 0; hero_num < hero_list.length; hero_num++) {
// 		var all_potential_moves = []
// 		hero = hero_list[hero_num]
// 		for (let index = 0; index < hero.abilities.length; index++) {
// 			const ability = hero.abilities[index];
			
// 			var valid_targets = get_valid_targets(hero, ability.range, hero.position, ability)
// 			console.log("Valid Targets for " + ability.name + ' : ' + valid_targets)
	
// 			for (let t = 0; t < valid_targets.length; t++) {
// 				var pred_damage = damage_prediction(hero, ability, field[valid_targets[t]], valid_targets[t], true)
// 				console.log(ability.name + ' predicted damage = ' + pred_damage)

// 				var DoTs = (ability.effects.filter(obj => {
// 					return (obj.name == 'Burn' || obj.name == 'Poison');
// 				}));
// 				var DoT_damage = 0;
// 				if(DoTs.length > 0){
// 					for (let index = 0; index < DoTs.length; index++) {
// 						DoT_damage += DoTs[index].magnitude * DoTs[index].duration;
// 					}
// 				}

// 				//decrease armor/ward:
// 				var decreaseArmor = (ability.effects.filter(obj => {
// 					return (obj.name == 'Decrease Armor');
// 				}));
// 				var armor_decrease_amt = 0;
// 				if(decreaseArmor.length > 0){
// 					armor_decrease_amt += Math.min(decreaseArmor[0].magnitude, field[valid_targets[t]].armor);
// 				}

// 				var decreaseWard = (ability.effects.filter(obj => {
// 					return (obj.name == 'Decrease Ward');
// 				}));
// 				var ward_decrease_amt = 0;
// 				if(decreaseWard.length > 0){
// 					console.log(decreaseWard[0].magnitude)
// 					ward_decrease_amt += Math.min(decreaseWard[0].magnitude, field[valid_targets[t]].ward);
// 				}
// 				console.log(decreaseWard)
// 				console.log('ward decrease amt:' + ward_decrease_amt)

// 				utility = pred_damage[0] + DoT_damage + armor_decrease_amt + ward_decrease_amt;

// 				all_potential_moves.push([ability.name, utility, pred_damage[0], ability, ability.type, valid_targets[t]])
				
// 			}
// 		}
// 		all_potential_moves.sort((a, b) => (b[1] - a[1]));
// 		hero.moves = all_potential_moves;
// 	}
// }

var speed_list = p1_heroes_alive.concat(p2_heroes_alive).filter(obj => {
  			return obj.curr_health > 0;
		})

console.log(speed_list)


function drop_invalid_moves(move_range, curr_hero){
	//console.log(move_range);
	var valid_moves = []
	for (var i = 0; i < move_range.length; i++) {
		//if (field[move_range[i]].team == null || field[move_range[i]].team == curr_hero.team && field[move_range[i]] != curr_hero){
		if (move_range[i] > curr_hero.position){ // moving to right
			//get position of first enemy unit to the right 
			var leftmost_enemy = 8

			if (curr_hero.team == 1){
				for (enemy_hero of p2_heroes_alive){
					if (enemy_hero.position > curr_hero.position && enemy_hero.position < leftmost_enemy){
						leftmost_enemy = enemy_hero.position;
					}
				}
			}

			else{
				for (enemy_hero of p1_heroes_alive){
					if (enemy_hero.position > curr_hero.position && enemy_hero.position < leftmost_enemy){
						leftmost_enemy = enemy_hero.position;
					}
				}
			}

			//console.log('left: ' + leftmost_enemy);
			if (move_range[i] < leftmost_enemy){
				valid_moves.push(move_range[i]);
			}
		}

		else { //moving to left
			var rightmost_enemy = -1
			if (curr_hero.team == 1){
				for (enemy_hero of p2_heroes_alive){
					if (enemy_hero.position < curr_hero.position && enemy_hero.position > rightmost_enemy){
						rightmost_enemy = enemy_hero.position;
					}
				}
			}
			else{
				for (enemy_hero of p1_heroes_alive){
					//console.log(enemy_hero.position)
					if (enemy_hero.position < curr_hero.position && enemy_hero.position > rightmost_enemy){
						rightmost_enemy = enemy_hero.position;
					}
				}
			}
			//console.log('rightmost enemy: ' + rightmost_enemy);
			if (move_range[i] > rightmost_enemy){
				valid_moves.push(move_range[i]);
			}				
		}

		//}
	}
	return valid_moves;
}

function move_current_hero(movement, ability){
	if (movement == 'hero_movement'){
		curr_hero.cd_basic = Math.max(0, curr_hero.cd_basic - 1)
		curr_hero.cd_a1 = Math.max(0, curr_hero.cd_a1 - 1)
		curr_hero.cd_a2 = Math.max(0, curr_hero.cd_a2 - 1)
		curr_hero.cd_a3 = Math.max(0, curr_hero.cd_a3 - 1)

		movement = curr_hero.movement;

		endTurn = true;
	}
	endTurn = true;

	if (ability != false){
		checkIfCantrip = (ability.effects.filter(obj => {
			return obj.name.includes('Cantrip');
			}))
		isCantrip = (checkIfCantrip.length != 0);
		console.log('isCantrip' + isCantrip);

		if (isCantrip){
			endTurn = false;
		}
	}
	//console.log("End Turn Status: " + endTurn)


	curr_pos = curr_hero.position;

	move_range = array_range(Math.max(curr_pos - movement), Math.min(curr_pos + movement + 1, 8))
	valid_moves = drop_invalid_moves(move_range, curr_hero);

	if (ability != false){
		valid_moves.push(curr_hero.position)
	}

	//console.log("Valid Moves " + valid_moves);
	outline_valid_moves(valid_moves, ability);
}

function array_range(start, stop, step) {
    if (typeof stop == 'undefined') {
        // one param defined
        stop = start;
        start = 0;
    }

    if (typeof step == 'undefined') {
        step = 1;
    }

    if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
        return [];
    }

    var result = [];
    for (var i = start; step > 0 ? i < stop : i > stop; i += step) {
        result.push(i);
    }

    return result;
};

var shuffle = function (array) {

	var currentIndex = array.length;
	var temporaryValue, randomIndex;

	// While there remain elements to shuffle...
	while (0 !== currentIndex) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;

};

function display_turn_order(speed_list){
	var parsed = '';
    for (i = 0; i< speed_list.length; i++) {
        var myobj =  speed_list[i];
           parsed += myobj.name + ' - ';          
    }   
    document.getElementById('turn_order').innerHTML = parsed;
}
function update_speed(){
	if (speed_list.length == 0){
		speed_list = p1_heroes_alive.concat(p2_heroes_alive).filter(obj => {
			return obj.curr_health > 0;
	  })
	}
	for (var i = 0; i < speed_list.length; i++) {
		speed_list[i].temp_speed = speed_list[i].speed;

		speed_modifiers = (speed_list[i].effects.filter(obj => {
		  					return (obj.name == 'Change Speed' || obj.name == 'Frostbite');
					  }));
		if (speed_modifiers.length > 0){
			for (var j = 0; j < speed_modifiers.length; j++) {
				speed_list[i].temp_speed += speed_modifiers[j].magnitude;
			}
		}
	}

	shuffle(speed_list).sort((a, b) => (parseFloat(b.temp_speed) - parseFloat(a.temp_speed)) || Math.random() >= .5);
	display_turn_order(speed_list)
	return speed_list;
}


function predict_damage_on_mouseover(ability, target){
	pred = damage_prediction(curr_hero, ability, target, target.position, true)
		
	damage = pred;

	console.log('Predicted Damage: ' + damage)// + ' | Pierce Damage: ' + pierce_damage);
	document.getElementById("predicted_damage").innerHTML = 'Predicted Damage: ' + damage //+ ' | Pierce Damage: ' + pierce_damage;
}

function change_targeting_border_on_mouseover(target, valid_targets, ability){
	//console.log("changing border on mouseover")
	for (i = 0; i < valid_targets.length; i++){
		//console.log("Valid Target: " + valid_targets[i])
		if (p1_heroes_alive.concat(p2_heroes_alive).includes(valid_targets[i])){
			document.getElementById('space' + valid_targets[i].id).style.outline = '2px dashed coral';
		}
	}
	//console.log(target)
	//document.getElementById('space' + target.id).style.outline = '2px solid red';
	if (ability == false){
		//console.log('false')

	}
	else{
		//console.log(ability)
		//console.log(ability.AoE)
		AoE = ability.AoE;
		//console.log(ability.damage)
		if (AoE == 'row'){
			//console.log(target)
			for (hero of p1_heroes_alive.concat(p2_heroes_alive)){
				//console.log(hero)
				if (hero.position == target.position){
					document.getElementById('space' + hero.id).style.outline = '2px solid red';
				}
		
			}
		}

		else if (AoE == 'all_enemies'){
			for (hero of p1_heroes_alive.concat(p2_heroes_alive)){
				//console.log(hero)
				if (hero.team == target.team){
					document.getElementById('space' + hero.id).style.outline = '2px solid red';
				}
		
			}
		}

		else if (AoE == 'All Allies'){
			for (hero of p1_heroes_alive.concat(p2_heroes_alive)){
				//console.log(hero)
				if (hero.team != target.team){
					document.getElementById('space' + hero.id).style.outline = '2px solid red';
				}
		
			}
		}

		else if (ability.AoE == "Enemies Within 2 Rows"){
			if (curr_hero.team == 1){
				enemy_hero_list = p2_heroes_alive;
			}
			
			else{
				enemy_hero_list = p1_heroes_alive;
			}

			//console.log(enemy_hero_list)
			for (var testing_hero of enemy_hero_list){
				//console.log(testing_hero.name)
				//console.log(testing_hero.position)
				//console.log(curr_hero.position)
				if (Math.abs(testing_hero.position - curr_hero.position) <= 2){
					//console.log(testing_hero)
					document.getElementById('space' + testing_hero.id).style.outline = '2px solid red';
				}
			}
	
		}

		else{
			//console.log('space' + target)
			try{
				document.getElementById('space' + target.id).style.outline = '2px solid red';
			} 
			catch{
				null;
			}
			
		}
	}
}

function moveTo(hero, start, end, ability){
	console.log('ability: ' + ability);
	console.log(hero.name + " started from " + start + ' and moved to ' + end + ' with ' + ability.name);
	if (start != end || ability.name == 'Dauntless Vanguard'){
		console.log('MoveTo ability: ' + ability)
		console.log(document.getElementById('field_position' + start));
		hero.position = end;

		//deal damage if hero is Crippled
		var effects = hero.effects;

		for (i = 0; i < effects.length; i++){
			if (effects[i].name.includes("Crippled")){
				hero.curr_health -= effects[i].magnitude;
				//console.log("Voorhees")
				//console.log(hero.curr_health);
			}
		}

		al_heroes = check_if_any_heroes_died(null);

		p1_heroes_alive = al_heroes[0];
		p2_heroes_alive = al_heroes[1];
		console.log(p1_heroes_alive)

		//console.log(hero)
		if (ai_called == false && p1_heroes_alive.concat(p2_heroes_alive).includes(hero)){
			console.log(end);
			document.getElementById('field_position' + end).appendChild(document.getElementById("space" + hero.id));

			var to_show = document.getElementById('field_position' + start).getElementsByClassName('hero');
			if (to_show.length == 1){
				to_show[0].innerText = "__";
				to_show[0].classList.add('hero');
				to_show[0].style.display = 'block';
				//to_show[0].onmouseover = function() {display_field_effect_info(start)};
			}
			else if (to_show.length == 0){
				var iDiv = document.createElement('div');
				iDiv.classList.add('hero');
				//iDiv.onmouseover = function() {display_field_effect_info(start)}
				iDiv.innerHTML = "<h1>__</h1>"
				//console.log(iDiv);
				document.getElementById('field_position' + start).appendChild(iDiv);
			}

			var to_hide = document.getElementById('field_position' + end).getElementsByClassName('hero');
			console.log(to_hide)
			//console.log(to_hide.length)
			for (var i = 0; i < to_hide.length; i++){
				if (to_hide[i].innerHTML == "<h1>__</h1>"){
					to_hide[i].style.display = 'none';
				}
			}
		}
		else {
			console.log(document.getElementById('field_position' + start).children.length)

			document.getElementById('space' + hero.id).remove();

			var to_hide = document.getElementById('field_position' + start).getElementsByClassName('hero');
			console.log(to_hide)
			console.log(to_hide.length)

			if (to_hide.length == 1){
				var iDiv = document.createElement('div');
				iDiv.classList.add('hero');
				iDiv.innerHTML = "<h1>__</h1>"
				console.log(iDiv);
				document.getElementById('field_position' + start).appendChild(iDiv);

			}
		}
    }
	// if (ability != false){
		try{
			var movementCheck = (ability.effects.filter(obj => {
				return (obj.name.includes('Force') || obj.name.includes('Leap'));
		   }))
		}
		catch{
			movementCheck = [1];
		}
		
	//}


	if (ability != false && hero == curr_hero){
		
		console.log('applying ability from movement')
		if(ability.name == hero.abilities[1].name){
			curr_hero.cd_a1 = ability.cooldown;

			if (movementCheck.length == 0){
				apply_effects(ability, hero, true)
			}

			

		} else if(ability.name == hero.abilities[2].name){
			curr_hero.cd_a2 = ability.cooldown;

		// 	var movementCheck = (ability.effects.filter(obj => {
		// 		return obj.name.includes('Move Self');
		//    }))
		// 	if (movementCheck.length != 0){
		// 		console.log('applying effects 2')
		// 		apply_effects(ability, hero, true)
		// 	}
		if (movementCheck.length == 0){
			apply_effects(ability, hero, true)
		}

		} else if(ability.name == hero.abilities[3].name){
			curr_hero.cd_a3 = ability.cooldown;
		// 	console.log(curr_hero);

		// 	var movementCheck = (ability.effects.filter(obj => {
		// 		return obj.name.includes('Move Self');
		//    }))
		// 	if (movementCheck.length != 0){
		// 		console.log('applying effects 3')
		// 		apply_effects(ability, hero, true)
		// 	}
			//ability = false;
			if (movementCheck.length == 0){
				apply_effects(ability, hero, true)
			}

		} else if(ability.name == hero.abilities[0].name){
			curr_hero.cd_basic = ability.cooldown;

		// 	var movementCheck = (ability.effects.filter(obj => {
		// 		return obj.name.includes('Move Self');
		//    }))
		// 	if (movementCheck.length != 0){
		// 		console.log('applying effects 0')
		// 		apply_effects(ability, hero, true)
		// 	}
		// 	//ability = false;
		if (movementCheck.length == 0){
			apply_effects(ability, hero, true)
		}

		}  else {
			console.log(ability)
			console.log('ability = quotes')
			ability = false;
		}

	}

	if (ai_called == false){
		update_current_hero(false)
		update_field()
	}
	
}

function outline_valid_moves(valid_moves, ability){
	AoE = ability.AoE;
	all_tiles = document.getElementsByClassName("field");
	for (let i = 0; i < all_tiles.length; i++){
		all_tiles[i].style.outline = '0';
		all_tiles[i].onclick = '';
		//all_tiles[i].onmouseover = function() {display_field_effect_info(i)};
	}

	all_spaces= document.getElementsByClassName("hero");
	for (let i = 0; i < all_spaces.length; i++){
		all_spaces[i].style.outline = '0';
		all_spaces[i].onclick = '';
		all_spaces[i].onmouseover = function() {display_stats(i)};
	}


	for (i = 0; i < valid_moves.length; i++){
		// console.log('space' + valid_targets[i])
		document.getElementById('field_position' + valid_moves[i]).style.outline = '2px dashed coral';
		const target = valid_moves[i]
		document.getElementById('field_position' + valid_moves[i]).onclick = function() {moveTo(curr_hero, curr_hero.position, target, ability)};
		//console.log("YEEEEEEEEEEEEEEEEEEEEEEEEEEE")
		//console.log(valid_moves[i]);
		document.getElementById('field_position' + valid_moves[i]).onmouseover = function() {change_targeting_border_on_mouseover(target, valid_moves, ability)};	
	}
}

function outline_valid_targets(ability, valid_targets, AoE){
	console.log(valid_targets);
	try{
		AoE = ability.AoE;
	}
	catch{
		console.log(":(")
	}
	all_tiles = document.getElementsByClassName("field");
	for (let i = 0; i < all_tiles.length; i++){
		all_tiles[i].style.outline = '0';
		all_tiles[i].onclick = '';
	}

	all_spaces= document.getElementsByClassName("hero");
	for (let i = 0; i < all_spaces.length; i++){
		all_spaces[i].style.outline = '0';
		all_spaces[i].onclick = '';
		all_spaces[i].onmouseover = function() {display_stats(i)};
	}
	

	if (ability == false){
		console.log('ability = false')
	}
	else{
		valid_rows = [];

		for (i = 0; i < valid_targets.length; i++){
			if (Number.isInteger(valid_targets[i])){

				document.getElementById('field_position' + valid_targets[i]).style.outline = '2px dashed coral';
				const target = valid_targets[i]
				document.getElementById('field_position' + valid_targets[i]).onclick = function() {apply_ability(ability, target)};

				document.getElementById('field_position' + valid_targets[i]).onmouseover = function() {display_stats(target.id) ; change_targeting_border_on_mouseover(target, valid_targets, ability)};	
			}
			else{

				if (ability.AoE == 'row'){
					heroes_same_row = [];
					for (hero of p1_heroes_alive.concat(p2_heroes_alive)) {
	
						if (hero.position == valid_targets[i].position){
							heroes_same_row.push(hero)
						}
	
					}
					valid_targets.concat(heroes_same_row)
				}
	
				document.getElementById('space' + valid_targets[i].id).style.outline = '2px dashed coral';
				const target = valid_targets[i]
				document.getElementById('space' + valid_targets[i].id).onclick = function() {apply_ability(ability, target)};
				//console.log(target.name)
				document.getElementById('space' + valid_targets[i].id).onmouseover = function() {display_stats(target.id) ; change_targeting_border_on_mouseover(target, valid_targets, ability); predict_damage_on_mouseover(ability, target)};	
			//}
			}
		}

	}


}

function MindOverMatterFunc(damage, mindOverMatterMagnitude, target){		

	if (damage * mindOverMatterMagnitude > target.curr_mana){
		MoMPreventedDamage = target.curr_mana;
		target.curr_mana = 0;
	}
	else{
		MoMPreventedDamage = Math.round(damage * mindOverMatterMagnitude);
		target.curr_mana = target.curr_mana - Math.round(damage * mindOverMatterMagnitude);

	}
	damage -= MoMPreventedDamage;
	return damage;

}

function damage_prediction(hero, ability, target, position, isPred){
	damage = ability.damage;
	if (target.name == null){
		target = field[target];
	}

	//console.log(target)
	//console.log(hero)
	if (hero.name == 'Mae'){
		damage += Math.max(hero.temp_speed - target.temp_speed, 0)
		//console.log("Damage after Mae's Passive: " + damage)
	}

	//console.log(ability);
	//console.log(target)

	checkIfMultistrike = (ability.effects.filter(obj => {
		return obj.name == 'Multistrike';
	  }))
	  
	isMultistrike = (checkIfMultistrike.length != 0);
	if (isMultistrike && isPred == true){
		//console.log(checkIfMultistrike)
		damage = damage * (checkIfMultistrike[0].magnitude + 1);
		//console.log("Damage with Multistrike: " + damage)
	}

	checkIfManaDamage = (ability.effects.filter(obj => {
		return obj.name == 'Lose Current Mana And Deal Damage';
	  }))
	  
	isManaDamage = (checkIfManaDamage.length != 0);
	if (isManaDamage){
		damage += Math.round(hero.curr_mana * checkIfManaDamage[0].magnitude[0] * checkIfManaDamage[0].magnitude[1])
		console.log("Damage with Mana Boost: " + damage)
	}

	//Lose Current Health And Give Self Armor And Ward

	checkIfLoseCurrentHealthAndSelfPhysicalMagicShield = (ability.effects.filter(obj => {
		return obj.name == 'Lose Current Health And Give Self Physical And Magic Shield';
	  }))
	
	
	isLoseCurrentHealthAndSelfPhysicalMagicShield = (checkIfLoseCurrentHealthAndSelfPhysicalMagicShield.length != 0);
	
	if (isLoseCurrentHealthAndSelfPhysicalMagicShield && isPred == false){
		var mag = checkIfLoseCurrentHealthAndSelfPhysicalMagicShield[0].magnitude;
		console.log("Lost " + Math.round(hero.curr_health * (mag[0])) + " Health");
		console.log("Increasing Shields by " + Math.round(hero.curr_health * mag[0] * mag[1]));
		hero.physical_shield += Math.round(hero.curr_health * mag[0] * mag[1]);
		hero.magic_shield += Math.round(hero.curr_health * mag[0] * mag[1]);
		hero.curr_health = Math.round(hero.curr_health * (1 - mag[0]));
		console.log('flesh shield')
	}

	//deal damage based on missing health from ability
	checkIfBatStorm = (ability.effects.filter(obj => {
		return obj.name == 'Lose Current Health And Deal Damage';
	  }))
	  
	isBatStorm = (checkIfBatStorm.length != 0);
	//console.log('bat storm dmg:' + (curr_hero.curr_health * checkIfBatStorm[0].magnitude[0] * checkIfBatStorm[0].magnitude[1]))
	
	if (isBatStorm && isPred == false){
		damage += Math.round(hero.curr_health * checkIfBatStorm[0].magnitude[0] * checkIfBatStorm[0].magnitude[1])
		curr_hero.curr_health = Math.max(1, Math.round(curr_hero.curr_health * (1 - checkIfBatStorm[0].magnitude[0])))
	}

	//console.log('Unmodified Dmg: ' + damage);

	//check if curr.hero is weak
	checkIfWeak = (hero.effects.filter(obj => {
					  return obj.name == 'Weak';
				}))
	isWeak = (checkIfWeak.length != 0);

	if (isWeak){
		console.log(checkIfWeak[0].magnitude)
		damage = Math.round(damage * (1 - checkIfWeak[0].magnitude));
		console.log('Dmg after weak: '+ damage)
	}

	checkIfExtraMagicDamage = (ability.effects.filter(obj => {
		return obj.name == 'Magic Damage';
	}))
	isExtraMagicDamage = (checkIfExtraMagicDamage.length != 0);

	if (isExtraMagicDamage && isPred == false){
		var attack = new Ability(ability.name + " Magic Damage", checkIfExtraMagicDamage[0].magnitude, "Magic", 99, 1, [], 0, 0)
		resolve_damage(attack, target, target.position);
	}

	//check if curr hero is stealthed
	checkIfStealth = (hero.effects.filter(obj => {
		return obj.name.includes('Stealth');
	  }))
	isStealth = (checkIfStealth.length != 0);

	if (isStealth){ //flat 20% damage boost
	
	damage = Math.round(damage * 1.2);
	console.log('Dmg after increased damage: '+ damage)
	const removeStealth = hero.effects.findIndex( item => item.name == "Stealth" )
	hero.effects.splice( removeStealth, 1 );

	}

	//check if target has Magic Damage Mark
	checkIfMagicDamageMark = (target.effects.filter(obj => {
		return obj.name.includes('Magic Damage Mark');
	  }))
	isMagicDamageMark = (checkIfMagicDamageMark.length != 0);

	if (isMagicDamageMark){
		var attack = new Ability("Magic Mark", checkIfMagicDamageMark[0].magnitude, "Magic", 99, 1, [], 0, 0)

		checkIfCantrip = (ability.effects.filter(obj => {
			return obj.name.includes('Cantrip');
			}))
		if (checkIfCantrip.length != 0){
			attack.name = "Cantrip Damage"
		}
		if (isPred == false){
			const removeMagicDamageMark = target.effects.findIndex(item => item.name == "Magic Damage Mark" )
			target.effects.splice( removeMagicDamageMark, 1 );
			console.log("Mark consumed for " + checkIfMagicDamageMark[0].magnitude + ' damage')
			resolve_damage(attack, target, target.position);
			curr_hero.effects.push()
		}
	}

	//check if target has Unbalanced
	checkIfUnbalanced = (target.effects.filter(obj => {
		return obj.name.includes('Unbalanced');
	  }))
	isUnbalanced = (checkIfUnbalanced.length != 0);

	if (isUnbalanced && isPred == false){
		e = new Effect("Stun", 1, 1, null, false, false);
		target.effects.push(e)
		const removeUnbalanced = target.effects.findIndex(item => item.name == "Unbalanced" )
		target.effects.splice( removeUnbalanced, 1 );
		console.log("He slippin'")
	}


	//check if target has CD reduction Mark
	checkIfAttackerCDReductionMark = (target.effects.filter(obj => {
		return obj.name.includes('Reduce Attacker CD Mark');
	  }))
	isAttackerCDReductionMark = (checkIfAttackerCDReductionMark.length != 0);

	if (isAttackerCDReductionMark){
		if (isPred == false){
		hero.cd_basic = Math.max(0, hero.cd_basic - 1);
		hero.cd_a1 = Math.max(0, hero.cd_a1 - 1);
		hero.cd_a2 = Math.max(0, hero.cd_a2 - 1);
		hero.cd_a3 = Math.max(0, hero.cd_a3 - 1);
		console.log("Mark consumed for CD Reduction")
		const removeAttackerCDReductionMark = target.effects.findIndex( item => item.name == "Reduce Attacker CD Mark" )
		target.effects.splice( removeAttackerCDReductionMark, 1 );
		}
	}


	//Unified Strength - Octavius Coalition Assault
	checkIfUnifiedStrength = (ability.effects.filter(obj => {
		return obj.name.includes("Unified Strength");
		}))
	isUnifiedStrength = (checkIfUnifiedStrength.length != 0);
	
	if (isUnifiedStrength){
		if (curr_hero.team == 1){
			allied_alive_heroes = p1_heroes_alive;
		}
		else{
			allied_alive_heroes = p2_heroes_alive;
		}
	
		allied_alive_heroes = allied_alive_heroes.filter(function(el) { return el.name != "Octavius"; }); 

		console.log(allied_alive_heroes)
		for (ally of allied_alive_heroes){
			console.log(ally)
			var damage_increase = ((ally.effects.filter(obj => {
				return obj.isBuff == true;
		  }).length * checkIfUnifiedStrength[0].magnitude[1]) + 1) * checkIfUnifiedStrength[0].magnitude[0];
		  damage += Math.round(damage_increase);
		}
		console.log('Dmg after increased damage: '+ damage)
	}

	//check if opponent has physical shields and increase damage
	checkIfIncreaseDamagePhysicalShield = (ability.effects.filter(obj => {
		return obj.name.includes("More Damage If Physical Shield");
	  }))
	isIncreaseDamagePhysicalShield = (checkIfIncreaseDamagePhysicalShield.length != 0);

	if (isIncreaseDamagePhysicalShield && target.physical_shield > 0){
	console.log(checkIfIncreaseDamagePhysicalShield[0].magnitude)
	damage = Math.round(damage * (1 + checkIfIncreaseDamagePhysicalShield[0].magnitude));
	console.log('Dmg after increased damage: '+ damage)
	}

	//check if opponent has magic shields
	checkIfIncreaseDamageMagicShield = (ability.effects.filter(obj => {
		return obj.name.includes("More Damage If Magic Shield");
	  }))
	isIncreaseDamageMagicShield = (checkIfIncreaseDamageMagicShield.length != 0);

	if (isIncreaseDamageMagicShield && target.magic_shield > 0){
	console.log(checkIfIncreaseDamageMagicShield[0].magnitude)
	damage = Math.round(damage * (1 + checkIfIncreaseDamageMagicShield[0].magnitude));
	console.log('Dmg after increased damage: '+ damage)
	}



	//increased damage if target has debuffs
	checkIfIncreaseDamageIfTargetHasDebuff = (ability.effects.filter(obj => {
		return obj.name.includes('Increase Damage If Target Has Debuff');
	  }))
	isIncreaseDamageIfTargetHasDebuff = (checkIfIncreaseDamageIfTargetHasDebuff.length != 0);
	//console.log('isIncreaseDamageIfTargetHasDebuff: ' + isIncreaseDamageIfTargetHasDebuff)

	if (isIncreaseDamageIfTargetHasDebuff){
		console.log('target has debuff')
		numberOfDebuffs = (target.effects.filter(obj => {
							  return obj.isBuff == false;
						})).length 
		
		if (numberOfDebuffs > 0){
			damage = Math.round(damage * (1 + checkIfIncreaseDamageIfTargetHasDebuff[0].magnitude))
		}
	}


	//increased damage if target has debuffs
	checkIfIncreaseDamageIfTargetHasStunRootCrippled = (ability.effects.filter(obj => {
		return obj.name.includes('Increase Damage If Target Has Stun, Root, Crippled');
	  }))
	isIncreaseDamageIfTargetHasStunRootCrippled = (checkIfIncreaseDamageIfTargetHasStunRootCrippled.length != 0);

	if (isIncreaseDamageIfTargetHasStunRootCrippled){
		//console.log('damage before stun, root, crippled check: ' + damage);
		isStunRootCrippled = (target.effects.filter(obj => {
							  return (obj.name == 'Stun' || obj.name == 'Root' || obj.name == 'Crippled');
						})).length 
		
		if (isStunRootCrippled > 0){
			damage = Math.round(damage * (1 + checkIfIncreaseDamageIfTargetHasStunRootCrippled[0].magnitude));
			//console.log('damage after stun, root, crippled check: ' + damage);
		}
	}
	//Increase Damage if Target Frozen
	checkIfIncreaseDamageIfTargetFrozen = (ability.effects.filter(obj => {
		return obj.name.includes('Increase Damage if Target Frozen');
	  }))
	//console.log(checkIfIncreaseDamageIfTargetFrozen);
	isIncreaseDamageIfTargetFrozen = (checkIfIncreaseDamageIfTargetFrozen.length != 0);
	//console.log(isIncreaseDamageIfTargetFrozen)
	if (isIncreaseDamageIfTargetFrozen){
		console.log(target.effects)
		isFrozen = (target.effects.filter(obj => {
							  return (obj.parentName == 'Frozen');
						})).length 
		
		if (isFrozen > 0){
			damage = Math.round(damage * (1 + checkIfIncreaseDamageIfTargetFrozen[0].magnitude));
			//console.log(damage)
			//console.log('damage after stun, root, crippled check: ' + damage);
		}
	}


	//Decrease Armor and Ward if Target Frozen
	checkIfDecreaseArmorWardIfTargetFrozen = (ability.effects.filter(obj => {
		return obj.name.includes('Decrease Armor and Ward if Target Frozen');
	}))
	isDecreaseArmorWardIfTargetFrozen = (checkIfDecreaseArmorWardIfTargetFrozen.length != 0);
	if (isDecreaseArmorWardIfTargetFrozen){
		//console.log('damage before stun, root, crippled check: ' + damage);
		console.log(target.effects)
		isFrozen = (target.effects.filter(obj => {
							return (obj.parentName == 'Frozen');
						})).length 
		console.log(isFrozen)
		console.log(isPred)
		if (isFrozen > 0 && isPred == false){
			console.log("WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")

			ward_to_destroy = checkIfDecreaseArmorWardIfTargetFrozen[0].magnitude

			base_ward_destroyed = Math.round(ward_to_destroy * (target.base_ward/target.curr_ward));


			target.base_ward = Math.max(0, target.base_ward - base_ward_destroyed);
			console.log('base ward immediately after ' + target.base_ward)

			ward_modifiers = (target.effects.filter(obj => {
				return (obj.name.includes('Change Ward')); 
			}));

			if (ward_modifiers.length > 0){
				for (var j = 0; j < ward_modifiers.length; j++) {
					if (ward_modifiers[j].magnitude > 0){
						temp_ward_destroyed = Math.round(ward_to_destroy * (ward_modifiers[j].magnitude/target.curr_ward));
						ward_modifiers[j].magnitude = Math.max(0, ward_modifiers[j].magnitude - temp_ward_destroyed);
					}
				}
			}
		
			armor_to_destroy = checkIfDecreaseArmorWardIfTargetFrozen[0].magnitude
			console.log('Target Armor Before: ' + target.armor)
			console.log('base armor before ' + target.base_armor)
			base_armor_destroyed = Math.round(armor_to_destroy * (target.base_armor/target.curr_armor));
			console.log('base armor destroyed: ' + base_armor_destroyed);

			target.base_armor = Math.max(0, target.base_armor - base_armor_destroyed);
			//console.log('base armor immediately after ' + target.base_armor)

			armor_modifiers = (target.effects.filter(obj => {
				return (obj.name.includes('Change Armor')); 
			}));

			if (armor_modifiers.length > 0){
				for (var j = 0; j < armor_modifiers.length; j++) {
					if (armor_modifiers[j].magnitude > 0){
						temp_armor_destroyed = Math.round(armor_to_destroy * (armor_modifiers[j].magnitude/target.curr_armor));
						armor_modifiers[j].magnitude = Math.max(0, armor_modifiers[j].magnitude - temp_armor_destroyed);
					}
				}
			}
		}
	}


	//check if target is vulnerable
	checkIfVulnerable = (target.effects.filter(obj => {
					  return obj.name.includes('Vulnerable');
				}))
	isVulnerable = (checkIfVulnerable.length != 0);

	if (isVulnerable){
		console.log(checkIfVulnerable[0].magnitude)
		damage = Math.round(damage * (1 + checkIfVulnerable[0].magnitude));

		extraVulnerableDamage = (ability.effects.filter(obj => {
			  return obj.name == 'More Damage if Vulnerable';
		}))

		isExtraVulnerableDamage = (extraVulnerableDamage.length != 0);

		if (isExtraVulnerableDamage){
			damage = Math.round(damage * (1 + extraVulnerableDamage[0].magnitude));
		}

		console.log('Dmg after vulnerable: '+ damage)
	}

	//check if target has flame cloak
	checkIfFlameCloak = (target.effects.filter(obj => {
		return obj.name == 'Flame Cloak';
  	}))
	isFlameCloak = (checkIfFlameCloak.length != 0);

	if (isFlameCloak){
	console.log(checkIfFlameCloak[0].magnitude)
	console.log(curr_hero.position)
	console.log(target.position)
	if (isPred == false && Math.abs((curr_hero.position - target.position)) <= 2){
		e = new Effect("Burn", Math.round(.33 * checkIfFlameCloak[0].magnitude), 2, false)
		curr_hero.effects.push(e)
	//burn target for 33% of lost health over 2 turns
	}
}

	//check if target is elusive: 50% less damage from ranged (> 3 range)

	checkIfElusive = (target.effects.filter(obj => {
					  return obj.name.includes('Elusive');
				}))			
	isElusive = (checkIfElusive.length != 0 && Math.abs(curr_hero.position - position) > 1);
	//console.log('isElusive: ' + isElusive);
	if (isElusive){
		console.log(checkIfElusive[0].magnitude)
		damage = Math.round(damage * (1 - checkIfElusive[0].magnitude));
		console.log('Dmg after elusive: '+ damage)
	}


	//"Damage Based On Target Armor" (Voltaic Arc)
	checkIfMoreDamageTargetArmor = (ability.effects.filter(obj => {
		return obj.name == ("Increase Damage Based On Target Armor");
  	}))			
	isMoreDamageTargetArmor = (checkIfMoreDamageTargetArmor.length != 0);
	//console.log('isVoltaicArc: ' + isMoreDamageTargetArmor);
	if (isMoreDamageTargetArmor){
		console.log(checkIfMoreDamageTargetArmor[0].magnitude)
		damage += Math.round(target.armor * checkIfMoreDamageTargetArmor[0].magnitude)
		
		console.log('Dmg after voltaic arc: '+ damage)
	}

	//damage based on self ward
	checkIfMoreDamageSelfWard = (ability.effects.filter(obj => {
		return obj.name == ("Increase Damage Based On Self Ward");
  	}))			
	isMoreDamageSelfWard = (checkIfMoreDamageSelfWard.length != 0);
	//console.log('isMorDamageSelfWard: ' + isMoreDamageSelfWard);
	if (isMoreDamageSelfWard){
		console.log(checkIfMoreDamageSelfWard[0].magnitude)
		damage += Math.round(curr_hero.ward * checkIfMoreDamageSelfWard[0].magnitude)
		
		console.log('Dmg after self ward: '+ damage)
	}

	
	//check if kingslayer/increased damage with more target health.

	checkIfMoreDamageTargetHigherHealth = (ability.effects.filter(obj => {
		return obj.name == ("Increase Damage If Target More Health");
  	}))			
	isMoreDamageTargetHigherHealth = (checkIfMoreDamageTargetHigherHealth.length != 0);
	//console.log('iskingslayer: ' + isMoreDamageTargetHigherHealth);
	if (isMoreDamageTargetHigherHealth){
		console.log(checkIfMoreDamageTargetHigherHealth[0].magnitude)
		health_diff = target.curr_health - curr_hero.curr_health

		if (health_diff > 0){
			damage += Math.round(health_diff * checkIfMoreDamageTargetHigherHealth[0].magnitude)
		}
		console.log('Dmg after kingslayer: '+ damage)
	}

	checkIfMindOverMatter = (target.effects.filter(obj => {
		return obj.name.includes('Mind Over Matter');
	  }))			
	  
	isMoM = (checkIfMindOverMatter.length != 0);
	//console.log('isMindOverMatter: ' + isMoM);
	if (isMoM){
		mindOverMatterMagnitude = checkIfMindOverMatter[0].magnitude
	}

	checkIfNoArmor =  (ability.effects.filter(obj => {
			return obj.name == 'More Damage If No Armor';
		}))
		isNoArmor = (checkIfNoArmor.length != 0 && target.armor <= 0);
		//console.log('isNoArmor: ' + isNoArmor);
		if (isNoArmor){
		console.log(checkIfNoArmor[0].magnitude)
		damage = Math.round(damage * (1 + checkIfNoArmor[0].magnitude));
		console.log('Dmg after armor bonus: '+ damage)
	}

	checkIfNoPhysicalShield =  (ability.effects.filter(obj => {
		return obj.name == 'More Damage If No Physical Shield';
	}))
	isNoPhysicalShield = (checkIfNoPhysicalShield.length != 0 && target.physical_shield <= 0);
	if (isNoPhysicalShield){
	console.log(checkIfNoPhysicalShield[0].magnitude)
	damage = Math.round(damage * (1 + checkIfNoPhysicalShield[0].magnitude));
	console.log('Dmg after no phys shield bonus: '+ damage)
}

	checkIfTargetLowLife = (ability.effects.filter(obj => {
			return obj.name == 'More Damage If Target Low Life';
		}))

		targetIsLowLife = (checkIfTargetLowLife.length != 0 && target.curr_health <= .5 * target.health);
		//console.log('targetIsLowLife: ' + targetIsLowLife);

		if (targetIsLowLife){
			console.log(checkIfTargetLowLife[0].magnitude)
			damage = Math.round(damage * (1 + checkIfTargetLowLife[0].magnitude));
			console.log('Dmg after armor bonus: '+ damage)
	}

		//Remove Frozen
		checkIfRemoveFrozen = (ability.effects.filter(obj => {
			return obj.name.includes('Remove Frozen');
		  }))
		isRemoveFrozen = (checkIfRemoveFrozen.length != 0);
	
		if (isRemoveFrozen && isPred == false){
			//console.log('damage before stun, root, crippled check: ' + damage);
			isFrozen = (target.effects.filter(obj => {
								  return (obj.parentName == 'Frozen');
							})).length 
			
			if (isFrozen > 0){
				target.effects = target.effects.filter( el => el.parentName != 'Frozen');
				//console.log('damage after stun, root, crippled check: ' + damage);
			}
		}


//Check Fortify
	checkIfFortify = (target.effects.filter(obj => {
		return (obj.name.includes('Fortify') && (!obj.name.includes('Physical Fortify')) && (!obj.name.includes('Magic Fortify'))) ;
	  }))			
	  
	isFortify = (checkIfFortify.length != 0);
	//console.log('isFortify: ' + isFortify);
	if (isFortify){
		console.log(checkIfFortify[0].magnitude)
		damage = Math.round(damage * (1 - checkIfFortify[0].magnitude));
		console.log('Dmg after fortify: '+ damage)
	}

	checkIfPhysicalFortify = (target.effects.filter(obj => {
		return obj.name.includes('Physical Fortify');
	  }))			
	  
	isPhysicalFortify = ((checkIfPhysicalFortify.length != 0) && ability.type == "Physical");
	//console.log('isPhysicalFortify: ' + isPhysicalFortify);
	if (isPhysicalFortify){
		console.log(checkIfPhysicalFortify[0].magnitude)
		damage = Math.round(damage * (1 - checkIfPhysicalFortify[0].magnitude));
		console.log('Dmg after Phys fortify: '+ damage)
	}

	checkIfMagicFortify = (target.effects.filter(obj => {
		return obj.name.includes('Magic Fortify');
	  }))			
	  
	isMagicFortify = ((checkIfMagicFortify.length != 0) && ability.type == "Magic");
	//console.log('isMagicFortify: ' + isMagicFortify);
	if (isMagicFortify){
		console.log(checkIfMagicFortify[0].magnitude)
		damage = Math.round(damage * (1 - checkIfMagicFortify[0].magnitude));
		console.log('Dmg after Magic fortify: '+ damage)
	}

	//Increase Next Magic Attack
	checkIfIncreaseNextMagicAttack = (curr_hero.effects.filter(obj => {
		return obj.name.includes('Increase Next Magic Attack');
	  }))
	isIncreaseNextMagicAttack = (checkIfIncreaseNextMagicAttack.length != 0);
	//console.log(checkIfIncreaseNextMagicAttack);

	if (isIncreaseNextMagicAttack && ability.type == 'Magic'){
		console.log("Base Magic Damage = " + damage);
		console.log("Magic Damage Increase Mag: " + checkIfIncreaseNextMagicAttack[0].magnitude)
		console.log("Unrounded Magic Damage: " + damage * (1 + checkIfIncreaseNextMagicAttack[0].magnitude))
		damage = Math.round(damage * (1 + checkIfIncreaseNextMagicAttack[0].magnitude))
		console.log("Magic Damage Increased To " + damage);

		if (isPred == false){
			const removeIncreaseNextMagicAttack = curr_hero.effects.findIndex(item => item.name == "Increase Next Magic Attack")
			curr_hero.effects.splice( removeIncreaseNextMagicAttack, 1);
		}
	}
	//check if curr.hero has increased damage
	checkIfIncreaseDamage = (hero.effects.filter(obj => {
		return obj.name.includes('Increase Damage');
	  }))
	isIncreaseDamage = (checkIfIncreaseDamage.length != 0);

	if (isIncreaseDamage){
	console.log(checkIfIncreaseDamage[0].magnitude)
	damage = Math.round(damage * (1 + checkIfIncreaseDamage[0].magnitude));
	console.log('Dmg after increased damage: '+ damage)
	}

	//Kess - The Finisher
	if (curr_hero.name == 'Kess'){
		console.log("The Finisher")
		damage += Math.round((target.health - target.curr_health) * .15);
		console.log('Dmg after finisher: '+ damage)
	}

	//Increase Tidal Cutlass Damage
	checkIfTidalCutlassIncreaseDamage = (hero.effects.filter(obj => {
		return obj.name.includes('Increase Tidal Cutlass Damage');
	  }))
	isTidalCutlassIncreaseDamage = (checkIfTidalCutlassIncreaseDamage.length != 0);

	if (isTidalCutlassIncreaseDamage && ability.name.includes("Tidal Cutlass")){
	console.log(checkIfTidalCutlassIncreaseDamage[0].magnitude)
	damage = Math.round(damage * (1 + checkIfTidalCutlassIncreaseDamage[0].magnitude));
	console.log('Dmg after increased damage: '+ damage)
	}

	//check if Stun if high enough damage
	//console.log('damage: ' + damage)
	checkIfStunEnemyIfHighDamage = (ability.effects.filter(obj => {
		return obj.name.includes('Stun Enemy If High Damage');
	  }))
	isStunEnemy = (checkIfStunEnemyIfHighDamage.length != 0);
	//console.log('isStunEnemy: ' + isStunEnemy)
	//console.log(checkIfStunEnemyIfHighDamage[0].magnitude)
	if (isStunEnemy && damage >= checkIfStunEnemyIfHighDamage[0].magnitude){
		console.log('threshold: ' + checkIfStunEnemyIfHighDamage[0].magnitude);
		target.effects.push(new Effect("Stun", 1, 1, null, false, false))
	}

	checkIfReflect = (target.effects.filter(obj => {
		return (obj.name.includes('Reflect Damage') && (!obj.name.includes('Reflect Physical Damage')) && (!obj.name.includes('Reflect Magic Damage'))) ;
	  }))			

	//check for reflect
	isReflect= (checkIfReflect.length != 0);
	//console.log('isReflect: ' + isReflect);
	if (isReflect && (ability.type == 'Physical' || ability.type == "Magic")){
		console.log(checkIfReflect[0].magnitude)
		reflect_damage = Math.round(damage * (checkIfReflect[0].magnitude));

		var attack = new Ability("Reflect", reflect_damage, ability.type, 99, 1, [], 0, 0)

		checkIfCantrip = (ability.effects.filter(obj => {
			return obj.name.includes('Cantrip');
			}))
		if (checkIfCantrip.length != 0){
			attack.name = "Cantrip Damage"
		}

		resolve_damage(attack, hero, hero.position);

		console.log('Reflect Dmg: '+ reflect_damage)
	}

	checkIfPhysicalReflect = (target.effects.filter(obj => {
		return (obj.name.includes('Reflect Physical Damage'));
	  }))			
	  
	isPhysicalReflect= (checkIfPhysicalReflect.length != 0);
	//console.log('isPhysicalReflect: ' + isPhysicalReflect);
	if (isPhysicalReflect && ability.type == 'Physical'){
		console.log(checkIfPhysicalReflect[0].magnitude)
		reflect_damage = Math.round(damage * (checkIfPhysicalReflect[0].magnitude));
		var attack = new Ability("Reflect", reflect_damage, ability.type, 99, 1, [], 0, 0)

		checkIfCantrip = (ability.effects.filter(obj => {
			return obj.name.includes('Cantrip');
			}))
		if (checkIfCantrip.length != 0){
			attack.name = "Cantrip Damage"
		}

		resolve_damage(attack, hero, hero.position);

		console.log('Reflect Dmg: '+ reflect_damage)
	}

	checkIfMagicReflect = (target.effects.filter(obj => {
		return (obj.name.includes('Reflect Magic Damage'));
	  }))			
	  
	isMagicReflect= (checkIfMagicReflect.length != 0);
	//console.log('isMagicReflect: ' + isMagicReflect);
	if (isMagicReflect && ability.type == 'Physical'){
		console.log(checkIfMagicReflect[0].magnitude)
		reflect_damage = Math.round(damage * (checkIfMagicReflect[0].magnitude));
		var attack = new Ability("Reflect", reflect_damage, ability.type, 99, 1, [], 0, 0)

		checkIfCantrip = (ability.effects.filter(obj => {
			return obj.name.includes('Cantrip');
			}))
		if (checkIfCantrip.length != 0){
			attack.name = "Cantrip Damage"
		}

		resolve_damage(attack, hero, hero.position);

		console.log('Reflect Dmg: '+ reflect_damage)
	}

	//Check if Give Attacks Anti-Heal:
	checkIfGiveAttacksAntiHeal = (curr_hero.effects.filter(obj => {
		return obj.name == 'Give Attacks Anti-Heal';
	}))

	isGiveAttacksAntiHeal = (checkIfGiveAttacksAntiHeal.length != 0);
	//console.log('Give Attacks Anti-Heal ' + isGiveAttacksAntiHeal);

	abil = checkIfGiveAttacksAntiHeal[0];
	if (isGiveAttacksAntiHeal && isPred == false){
		target.effects.push(new Effect("Anti-Heal", abil.magnitude, 1, null, false, false));
	}


	//Check If Decrease Ward
	checkIfDecreaseWard = (ability.effects.filter(obj => {
		return obj.name == 'Decrease Ward';
	}))

	isDecreaseWard = (checkIfDecreaseWard.length != 0);
	//console.log('isDecreaseWard ' + isDecreaseWard);

	if (isDecreaseWard && isPred == false){
		ward_to_destroy = checkIfDecreaseWard[0].magnitude
		//console.log('Target Ward Before: ' + target.ward)
		//console.log('base ward before ' + target.base_ward)
		base_ward_destroyed = Math.round(ward_to_destroy * (target.base_ward/target.curr_ward));
		//console.log('base ward destroyed: ' + base_ward_destroyed);

		target.base_ward = Math.max(0, target.base_ward - base_ward_destroyed);
		console.log('base ward immediately after ' + target.base_ward)

		ward_modifiers = (target.effects.filter(obj => {
			return (obj.name.includes('Change Ward')); 
		}));

		if (ward_modifiers.length > 0){
			for (var j = 0; j < ward_modifiers.length; j++) {
				if (ward_modifiers[j].magnitude > 0){
					temp_ward_destroyed = Math.round(ward_to_destroy * (ward_modifiers[j].magnitude/target.curr_ward));
					ward_modifiers[j].magnitude = Math.max(0, ward_modifiers[j].magnitude - temp_ward_destroyed);
				}
			}

			// for (var k = 0; k < target.effects.length; k++){
			// 	target.effects[k].descr = createDescr(target.effects[k].name, target.effects[k].magnitude);
			// 	console.log(target.effects[k].descr)
			// }
		}
		}
	//2000
	//Check If Decrease Armor
	checkIfDecreaseArmor = (ability.effects.filter(obj => {
		return obj.name == 'Decrease Armor';
	}))

	isDecreaseArmor = (checkIfDecreaseArmor.length != 0);
	//console.log('isDecreaseArmor ' + isDecreaseArmor);

	if (isDecreaseArmor && isPred == false){
		armor_to_destroy = checkIfDecreaseArmor[0].magnitude
		//console.log('Target Armor Before: ' + target.armor)
		//console.log('base armor before ' + target.base_armor)
		base_armor_destroyed = Math.round(armor_to_destroy * (target.base_armor/target.curr_armor));
		//console.log('base armor destroyed: ' + base_armor_destroyed);

		target.base_armor = Math.max(0, target.base_armor - base_armor_destroyed);
		//console.log('base armor immediately after ' + target.base_armor)

		armor_modifiers = (target.effects.filter(obj => {
			return (obj.name.includes('Change Armor')); 
		}));

		if (armor_modifiers.length > 0){
			for (var j = 0; j < armor_modifiers.length; j++) {
				if (armor_modifiers[j].magnitude > 0){
					temp_armor_destroyed = Math.round(armor_to_destroy * (armor_modifiers[j].magnitude/target.curr_armor));
					armor_modifiers[j].magnitude = Math.max(0, armor_modifiers[j].magnitude - temp_armor_destroyed);
				}
			}
		}
		}
		//console.log('penalty ' + target.armor_ward_penalties)
		//console.log('base armor: ' + target.base_armor);
		//console.log(target.effects)

		//console.log('Target Armor After: ' + target.armor)
	

	//Check if id_azrael_most_recently_attacked:
	if (curr_hero.name == 'Azrael' && azrael_mark_applied_this_turn_already == false){
		azrael_mark_applied_this_turn_already = true
		//console.log("Most recent hero id azrael attacked: " + curr_hero.id_azrael_most_recently_attacked)
		//console.log("targeted azrael id: " + target.id)

		if (curr_hero.id_azrael_most_recently_attacked == false){
			curr_hero.id_azrael_most_recently_attacked = target.id;

		}

		else if (curr_hero.id_azrael_most_recently_attacked == target.id){ //deal damage
			//console.log("Azrael 12 magic damage")
			curr_hero.id_azrael_most_recently_attacked = false;

			var attack = new Ability("Basic Attack", 12, 'Magic', 99, 1, [], 0, 0)

			checkIfCantrip = (ability.effects.filter(obj => {
				return obj.name.includes('Cantrip');
				}))
			if (checkIfCantrip.length != 0){
				attack.name = "Cantrip Damage"
			}

			resolve_damage(attack, target, target.position);

		}
		else{
			curr_hero.id_azrael_most_recently_attacked = target.id;
		}

	}

	if (hero.name == 'Vulshok'){
		pct_health = hero.curr_health/hero.health;
		damage_boost = (1 - pct_health)/2;
		damage = Math.round(damage * (1 + damage_boost));
		console.log("Damage after Vulshok's Passive: " + damage);
	}

	var pierce_percentage = 0;
	checkIfPiercing = (ability.effects.filter(obj => {
		return obj.name == 'Piercing';
	}))

	isPiercing= (checkIfPiercing.length != 0);
	//console.log('isPiercing ' + isPiercing);

	if (isPiercing){
		pierce_percentage = checkIfPiercing[0].magnitude
		//console.log("Pierce Percentage: " + pierce_percentage)
	}

	//Check If Kalia has damage decrease:
	if (curr_hero.name == 'Kalia'){
		damage = Math.round(damage * (1 - curr_hero.damage_decrease))
	}

	if (ability.type == 'Physical'){
		//console.log('Damage Before Armor: ' + damage);
		//armor/ward reduction formula: (Damage/(Armor/100 + 1))
		damage = Math.round(damage/( (target.curr_armor * (1 - pierce_percentage))/100 + 1) )
	}

	else if (ability.type == 'Magic'){
		//console.log('Damage Before Ward: ' + damage);
		//armor/ward reduction formula: (Damage/(Armor/100 + 1))
		damage = Math.round(damage/( (target.curr_ward * (1 - pierce_percentage))/100 + 1) )
	}
	else{
		damage = damage;
	}

	return damage;
}
function resolve_damage(ability, target, position){
		endTurn = true;
		//console.log(ability)
		//console.log(target)

		//check if cantrip:
		checkIfCantrip = (ability.effects.filter(obj => {
			return obj.name.includes('Cantrip');
			}))
		isCantrip = (checkIfCantrip.length != 0);
		console.log('isCantrip' + isCantrip);

		if (isCantrip || ability.name == 'Cantrip Damage'){
			endTurn = false;
		}

		var damage_to_health = 0;
		var health_before = target.curr_health;
		pred = damage_prediction(curr_hero, ability, target, position, false)

		damage = pred;
		console.log("pred damage: " + damage)
		var MoMPreventedDamage;

		if (isMoM && target.curr_mana > 0){
			
			if (damage * mindOverMatterMagnitude > target.curr_mana){
				MoMPreventedDamage = target.curr_mana;
				target.curr_mana = 0;
			}
			else{
				MoMPreventedDamage = Math.round(damage * mindOverMatterMagnitude);
				target.curr_mana = target.curr_mana - Math.round(pierce_damage * mindOverMatterMagnitude);

			}
			damage -= MoMPreventedDamage;
		}
		//Leif Marks

		if ((target.leif_mark == true) && (target.team != curr_hero.team)){
			target.leif_mark = false;
			console.log('Leif Mark Name: ' + target.name)
			console.log('Leif Mark HP Before: ' + curr_hero.curr_health)
			curr_hero.curr_health = Math.min(curr_hero.health, curr_hero.curr_health + Math.round(.1 * curr_hero.health));
			console.log('Leif Mark HP After: ' + curr_hero.curr_health)
			console.log("Leif Mark Consumed");
		}
		else if ((target.leif_mark == false) && (ability.name == "Smite" || ability.name == "Thunderous Blow" || ability.name == "Blinding Radiance")){
			target.leif_mark = true;
			console.log("target is marked by Leif");
		}
		else{
			null;
		}


		if (target.name == "Jakob"){
			target.wrath += 1;
		}


		if (ability.name == "Crossbow Shot" || ability.name == 'Final Stand'){
			target.health -= 4;
			if (target.curr_health > target.health){
				target.curr_health = target.health;
			}

			if (ability.name == 'Final Stand'){
				curr_hero.wrath = 0;
			}
		}

		var pierce_percentage = 0;
		checkIfPiercing = (ability.effects.filter(obj => {
			return obj.name == 'Piercing';
		}))
	
		// isPiercing= (checkIfPiercing.length != 0);
		// console.log('isPiercing ' + isPiercing);
	
		// if (isPiercing){
		// 	pierce_percentage = checkIfPiercing[0].magnitude
		// 	console.log("Pierce Percentage: " + pierce_percentage)
		// }

		// //Check If Kalia has damage decrease:
		// if (curr_hero.name == 'Kalia'){
		// 	damage = Math.round(damage * (1 - curr_hero.damage_decrease))
		// }

		if (ability.type == 'Physical'){
			console.log('Damage Before Armor: ' + damage);
			//armor/ward reduction formula: (Damage/(Armor/100 + 1))
			//damage = Math.round(damage/( (target.curr_armor * (1 - pierce_percentage))/100 + 1) )
			console.log("Damage after Armor: " + damage);
			if (target.physical_shield >= damage){
				if (target.name == "Kythra" && curr_hero.name != 'Kythra'){
					target.darkness = Math.min(target.darkness + Math.round(damage * .25), 100);
				}
				
				target.physical_shield -= damage;
				console.log('physical_shield_after = ' + target.physical_shield)
			} else if (target.physical_shield == 0) {

				if (isMoM && target.curr_mana > 0){
					damage = MindOverMatterFunc(damage, mindOverMatterMagnitude, target);
				}
				console.log('target curr health: ' + target.curr_health)
				target.curr_health -= damage;
				console.log('target curr health after: ' + target.curr_health)
			} else{
				if (target.name == "Kythra" && curr_hero.name != 'Kythra'){
					target.darkness = Math.min(target.darkness + Math.round(target.armor * .25), 100);
				}
				var remainder = damage - target.physical_shield;
				target.physical_shield = 0
				console.log('remainder = ' + remainder)

				if (isMoM && target.curr_mana > 0){
					remainder = MindOverMatterFunc(remainder, mindOverMatterMagnitude, target);
				}

				target.curr_health -= remainder;
			}
		} else if (ability.type == 'Magic'){
			//damage = Math.round(damage/ (target.curr_ward * (1 - pierce_percentage)/100 + 1))
			if (target.magic_shield >= damage){
				if (target.name == "Kythra" && curr_hero.name != 'Kythra'){
					target.darkness = Math.min(target.darkness + Math.round(damage * .25), 100);
				}
				target.magic_shield -= damage;
			} else if (target.magic_shield == 0) {

				if (isMoM && target.curr_mana > 0){
					damage = MindOverMatterFunc(damage, mindOverMatterMagnitude, target);
				}

				target.curr_health -= damage;
			} else{
				if (target.name == "Kythra" && curr_hero.name != 'Kythra'){
					target.darkness = Math.min(target.darkness + Math.round(target.ward * .25), 100);
				}
				var remainder = damage - target.magic_shield;
				target.ward = 0

				if (isMoM && target.curr_mana > 0){
					remainder = MindOverMatterFunc(remainder, mindOverMatterMagnitude, target);
				}

				target.curr_health -= remainder;
			}
		}

		damage_to_health = health_before - Math.max(target.curr_health, 0);


		if (target.name == "Arthurias"){
			var amt = Math.round(damage_to_health * .5/3)
			if (amt > 0){
				target.effects.push(new Effect('Undying Health Regen', amt, 3, null, true, false));
			}
			
		}

		if (target.name == "Kythra" && curr_hero.name != 'Kythra'){
			target.darkness = Math.min(target.darkness + Math.round(damage_to_health * .5), 100);
		}

		if ((target.curr_health <= target.health * .5) && curr_hero.name == 'Nox'){
			nox_position = curr_hero.position
			console.log('noxPosition: ' + nox_position)
			console.log(ability.name)

			if (ability.name == Nox.abilities[0].name){
				curr_hero.cd_basic = curr_hero.cd_basic - 1;
			}
			else if (ability.name == Nox.abilities[1].name){
				curr_hero.cd_a1 = curr_hero.cd_a1 - 1;
			}

			else if (ability.name == Nox.abilities[2].name){
				curr_hero.cd_a2 = curr_hero.cd_a2 - 1;
			}

			else if (ability.name == Nox.abilities[3].name){
				curr_hero.cd_a3 = curr_hero.cd_a3 - 1;
			}

			else{
				console.log('Nox used Roar of the Arena')
			}
		}

		hero_list = p1_heroes_alive.concat(p2_heroes_alive);
			checkIfZeth = (hero_list.filter(obj => {
				return obj.name == 'Zeth';
			  }))
			if (checkIfZeth.length > 0){
				checkIfZeth[0].health_lost += damage_to_health;
			}


		checkIfManaRestoreIfHealthDamage = (ability.effects.filter(obj => {
			return obj.name.includes('Restore Mana If Health Damage');
			}))
		isManaRestoreIfHealthDamage = (checkIfManaRestoreIfHealthDamage.length != 0);
		//console.log('isManaRestoreIfHealthDamage' + isManaRestoreIfHealthDamage);

		if (damage_to_health > 0 && isManaRestoreIfHealthDamage){
			curr_hero.curr_mana = Math.min(curr_hero.mana, curr_hero.curr_mana + checkIfManaRestoreIfHealthDamage[0].magnitude)
			console.log('Mana increased by ' + checkIfManaRestoreIfHealthDamage[0].magnitude)
		}
		
		//check for drain
		checkIfDrain = (ability.effects.filter(obj => {
	  					return obj.name == 'Drain';
					}))
		isDrain = (checkIfDrain.length != 0);
		//console.log('isDrain' + isDrain);
		if (isDrain){
			console.log(checkIfDrain[0].magnitude)
			drain = Math.round(damage * (checkIfDrain[0].magnitude));

			//check if Esme
			if (curr_hero.name == 'Esme' && (drain + curr_hero.curr_health > curr_hero.health)){
				curr_hero.health += Math.round((drain + curr_hero.curr_health - curr_hero.health) * .40);
			}

			curr_hero.curr_health = Math.min(curr_hero.health, curr_hero.curr_health + drain)
			console.log('Drain Amt: '+ drain)
		}

		//check if target is unkillable
		checkIfCannotDie = (target.effects.filter(obj => {
			return obj.name.includes('Immortal');
			}))
		isCannotDie = (checkIfCannotDie.length != 0);
		//console.log('isCannotDie' + isCannotDie);
		if (isCannotDie && (target.curr_health <= 0)){
			target.curr_health = 1
		}

		//check if target has the ability to counter:
		checkIfCounter = (target.effects.filter(obj => {
			return obj.name.includes('Counter');
			}))
		isCounter = (checkIfCounter.length != 0);
		console.log('isCounter' + isCounter);
		if (curr_hero.team != target.team && !(ability.name.includes("Basic Attack")) && isCounter && (target.curr_health >= 0 && (checkIfCounter[0].name.includes('Melee') && Math.abs(curr_hero.position - target.position) <= 2))){
			console.log("Melee Counter")
			var attack = new Ability("Basic Attack", checkIfCounter[0].magnitude, 'Physical', 4, 1, [], 0, 0)
			console.log('counter target: '+ curr_hero.name)
			resolve_damage(attack, curr_hero, curr_hero.position);
		}
		//any counter regardless of distance.
		else if (curr_hero.team != target.team && !(ability.name.includes("Basic Attack")) && isCounter && (target.curr_health >= 0)){
			var attack = new Ability("Basic Attack", checkIfCounter[0].magnitude, 'Physical', 4, 1, [], 0, 0)
			resolve_damage(attack, curr_hero, curr_hero.position);
		}

		al_heroes = check_if_any_heroes_died(ability);

		p1_heroes_alive = al_heroes[0];
		p2_heroes_alive = al_heroes[1];
};

function check_if_any_heroes_died(ability){
	alive_heroes = p1_heroes_alive.concat(p2_heroes_alive);
	for (hero of alive_heroes){
		if (hero.curr_health <= 0){

			//check if dead - but azura is alive
			var ally_azura_alive = false;
			if (hero.team == 1){
				ally_azura_alive = (p1_heroes_alive.filter(obj => {
					return obj.name == 'Azura';
				})).length > 0;
			}
			else{
				ally_azura_alive = (p2_heroes_alive.filter(obj => {
					return obj.name == 'Azura';
				})).length > 0;
			}

			azura = p1_heroes_alive.concat(p2_heroes_alive).filter(obj => { //yes this code is repetitive but I'm keep it for now.
				return obj.name == 'Azura';
			});

			if (azura.length > 0){
				azura = azura[0];
			}

			if (ally_azura_alive && azura.azura_can_revive == true && hero.name != "Azura"){
				//offer choice of resurrection
				var prevent_ally_death = false;
				if (confirm("Prevent " + hero.name + " from dying?")) {
					prevent_ally_death = true;
					azura.azura_can_revive = false;
					

				} else {
					prevent_ally_death = false;
				}

				if (prevent_ally_death == true){
					target.curr_health = Math.round(.4 * target.health);
				}
				console.log(azura.azura_can_revive);
				console.log(azura.azura_slain_allies);
			}

			//check if dead
			if (hero.curr_health <= 0){
				if (hero.name == 'Scion'){
					scion_is_alive = false;
				}

				if (hero.name == 'Zeth'){
					zeth_is_alive = false;
				}

				if (hero.name == 'Octavius'){
					octavius_is_alive = false;
				}

				if (hero.team == azura.team){
					azura.azura_slain_allies += 1;
					azura.ally_died_last_turn = true;
				}
				
				if (hero.kess_knives > 0){
					for (kess_hero of p1_heroes_alive.concat(p2_heroes_alive)){
						if (kess_hero.name == "Kess"){
							kess_hero.knives_ammo += hero.kess_knives
						}
					}
				}

				if (hero.team == 1){
					var dead_hero_index = p1_heroes_alive.indexOf(hero)
					if (dead_hero_index > -1) {
						p1_heroes_alive.splice(dead_hero_index, 1);
					}
				}
				else {
					var dead_hero_index = p2_heroes_alive.indexOf(hero)
					if (dead_hero_index > -1) {
						p2_heroes_alive.splice(dead_hero_index, 1);
					}
				}
				if (octavius_is_alive && hero.team != octavius_team && ability != null){
					if (octavius_team == 1){
						allied_team_heroes = p1_heroes_alive;
					}
					else{
						allied_team_heroes = p2_heroes_alive;
					}
					console.log("Testing Inspired Courage!")
					if (["Skypiercer Lance", "Coalition Assault"].includes(ability.name)){ //|| ( && (ability.name == 'Basic Attack'))){ //I'm going to hardcode this lol
						console.log("enhanced!")

						for (ohero of allied_team_heroes){
							if (ohero.name == 'Octavius'){
								enhanced_ic = new Effect("Enhanced Inspired Courage", [.2, .2, 2], 4, null, true, false); //effect.magnitude[0] = damage reudction, [1] is damage increase, [2] is speed boost
							}
							else{
								enhanced_ic = new Effect("Enhanced Inspired Courage", [.2, .2, 2], 3, null, true, false);
							}
							console.log(ohero.name)
							console.log(enhanced_ic)
							//check if inspired courage is already there: if enhanced, refresh duration. If not enhanced, make enhanced.
							already_inspired = false;
							for (effect of ohero.effects){
								if (effect.name.includes("Inspired Courage")){
									already_inspired = true;
									effect.duration = enhanced_ic.duration;
									effect.magnitude = [.2, .2, 2];
								}
							}
							if (already_inspired == false){ 
								ohero.effects.push(enhanced_ic)
							}
							
						}
					}
					else{
						for (allied_hero of allied_team_heroes){
							if (allied_hero.name == curr_hero.name && curr_hero.team == octavius_team){
								//increase duration by 1
								ic = new Effect("Inspired Courage", [.2, 0, 1], 3, null, true, false) //effect.magnitude[0] = damage reudction, [1] is damage increase, [2] is speed boost
							}
							else{
								ic = new Effect("Inspired Courage", [.2, 0, 1], 2, null, true, false)
							}

							already_inspired = false;
							for (effect of allied_hero.effects){
								if (effect.name == "Inspired Courage"){
									already_inspired = true;
									effect.duration = Math.max(ic.duration, effect.duration);
								}
							}
							if (already_inspired == false){ 
								allied_hero.effects.push(ic)
							}
							
						}
					}
				}
				
				hero_list = p1_heroes_alive.concat(p2_heroes_alive);
				checkIfJakob = (hero_list.filter(obj => {
					return obj.name == 'Jakob';
				}))
				if (checkIfJakob.length > 0 && hero.name != 'Jakob' && hero.team == checkIfJakob[0].team){
					checkIfJakob[0].wrath += 5;
				}
				
				

				checkIfDraug = (hero_list.filter(obj => {
					return obj.name == 'Draug';
				}))
				if (checkIfDraug.length > 0){
					checkIfDraug[0].curr_health = Math.min(Math.round(hero.health * .2) + checkIfDraug[0].health, checkIfDraug[0].health);
					checkIfDraug[0].curr_mana = Math.min(Math.round(hero.mana * .2) + checkIfDraug[0].mana, checkIfDraug[0].mana);
					checkIfDraug[0].armor += Math.round(hero.max_armor * .2);
					checkIfDraug[0].ward += Math.round(hero.max_ward * .2);
				}

			}

			if (ai_called == false){
					console.log(document.getElementById('field_position' + hero.position).children)
					console.log(document.getElementById('field_position' + hero.position).children.length)
					// if (document.getElementById('field_position' + hero.position).children.length >= 1){
						
					document.getElementById('space' + hero.id).innerHTML= "<div class = 'hero'><h1>__</h1></div>";
					document.getElementById('space' + hero.id).style.color = 'black';

						// document.getElementById('space' + hero.id).remove();
					//}
					p1_heroes_alive = p1_heroes_alive.filter( el => el.name != hero.name);
					p2_heroes_alive = p2_heroes_alive.filter( el => el.name != hero.name);

					if (p1_heroes_alive.length == 0){
						alert("Player 2 Triumphs!")
						window.close();
					}
				
					if (p2_heroes_alive.length == 0){
						alert("Player 1 Triumphs!")
						window.close()
					}

					for (alive_hero of p1_heroes_alive.concat(p2_heroes_alive)){
						if (alive_hero.position == hero.position){
							document.getElementById('space' + hero.id).remove();
							break;
						}
					}


					console.log(p1_heroes_alive)

					const index = speed_list.indexOf(hero);
					if (index > -1) {
					  speed_list.splice(index, 1);
					}
					update_field();

					return([p1_heroes_alive, p2_heroes_alive]);
				}

		}
}
return([p1_heroes_alive, p2_heroes_alive]);
};


//also heals lol - add anti_heal later
function resolve_DoT(curr_hero, effect){

	checkIfReverseDoTAndHealthRegen = (curr_hero.effects.filter(obj => {
		return obj.name == 'Reverse DoT and Health Regen';
		}))

	//console.log(checkIfReverseDoTAndHealthRegen)

	isReversed = (checkIfReverseDoTAndHealthRegen.length != 0);
	//console.log('isReversed' + isReversed);

	if (effect.name == 'Burn' || effect.name == 'Poison' || effect.name == 'Bleed'){
		if (isReversed){
			curr_hero.curr_health = Math.min(curr_hero.health, curr_hero.curr_health + effect.magnitude)
		}
		else{
			curr_hero.curr_health -= effect.magnitude;

			hero_list = p1_heroes_alive.concat(p2_heroes_alive);
			checkIfZeth = (hero_list.filter(obj => {
				return obj.name == 'Zeth';
			  }))
			if (checkIfZeth.length > 0){
				checkIfZeth[0].health_lost += effect.magnitude;
			}
		}
	}


	if (effect.name.includes('Health Regen')){
		if (isReversed){
			curr_hero.curr_health -= effect.magnitude;

			hero_list = p1_heroes_alive.concat(p2_heroes_alive);
			checkIfZeth = (hero_list.filter(obj => {
				return obj.name == 'Zeth';
			  }))
			if (checkIfZeth.length > 0){
				checkIfZeth[0].health_lost += effect.magnitude;
			}

		}
		else{
			curr_hero.curr_health = Math.min(curr_hero.health, curr_hero.curr_health + effect.magnitude)
		}
		
	}

	if (effect.name == "Flame Cloak"){
		for (hero of p1_heroes_alive.concat(p2_heroes_alive)) {
			if (hero.team != curr_hero.team && (Math.abs(hero.position - curr_hero.position) == 1)){
				var attack = new Ability("Basic Attack", Math.round(.33 * effect.magnitude), 'Magic', 4, 1, [], 0, 0)
				resolve_damage(attack, hero, hero.position);
			}
			else if (hero.team != curr_hero.team && (Math.abs(hero.position - curr_hero.position) == 2)){
				var attack = new Ability("Basic Attack", Math.round(.16 * effect.magnitude), 'Magic', 4, 1, [], 0, 0)
				resolve_damage(attack, hero, hero.position);
			}
		}
	}

	checkIfCannotDie = (curr_hero.effects.filter(obj => {
		return obj.name == 'Immortal';
		}))
	isCannotDie = (checkIfCannotDie.length != 0);
	//console.log('isCannotDie' + isCannotDie);

	if (isCannotDie && (curr_hero.curr_health <= 0)){
		curr_hero.curr_health = 1
	}
	if (effect.name.includes('Mana Regen')){
		curr_hero.curr_mana = Math.min(curr_hero.mana, curr_hero.curr_mana + effect.magnitude)
	}


	al_heroes = check_if_any_heroes_died(null);
	p1_heroes_alive = al_heroes[0];
	p2_heroes_alive = al_heroes[1];

	if (p1_heroes_alive.length == 0){
		alert("Player 2 Triumphs!")
		window.close();
	}

	if (p2_heroes_alive.length == 0){
		alert("Player 1 Triumphs!")
		window.close()
	}
}

function resolve_effects(curr_hero){
	// console.log(curr_hero);
	// console.log(p1_heroes_alive[0]);
	// console.log(p1_heroes_alive[1]);
	// console.log(p1_heroes_alive[2]);
	try{
		if (p1_heroes_alive.concat(p2_heroes_alive).includes(curr_hero)){
			var effects = curr_hero.effects;
	
			for (i = 0; i < effects.length; i++){
				resolve_DoT(curr_hero, effects[i]);
				var before = effects[i].duration;
				effects[i].duration -= 1;
		
				if (effects[i].duration == before){
					effects[i].duration -= 1;
				}
		
				curr_hero.effects = effects.filter(e => {
					  return e.duration > 0;
				})
		
			}
	}
}
	
	catch{
		console.log(":( ")
	}

	current_field_effects.forEach(function(field_effect){
		if (field_effect.when_triggers == 'end enemy turn' && field_effect.location == curr_hero.position){
			var attack = new Ability(field_effect.name, field_effect.damage, field_effect.type, 99, 1, field_effect.effects, 0, 0)
			console.log(attack)
			resolve_damage(attack, curr_hero, curr_hero.position);
			apply_effects(attack, curr_hero, true);
		}

		else if (field_effect.when_triggers == 'end caster turn' && curr_hero.name == field_effect.owner.name){
			var attack = new Ability(field_effect.name, field_effect.damage, field_effect.type, 99, 1, field_effect.effects, 0, 0)
			for (hero of p1_heroes_alive.concat(p2_heroes_alive)) {
				if ((hero.position == field_effect.location)){
					console.log("attacking " + hero.name)
					resolve_damage(attack, hero, hero.position);
					apply_effects(attack, hero, true);
				}
			}
		}

		// console.log(field_effect.mana_upkeep)
		// console.log(field_effect.owner);
		// console.log(curr_hero.name)

		if (field_effect.mana_upkeep > 0 && field_effect.owner.name == curr_hero.name){
			console.log("upkeep!")
			curr_hero.curr_mana = Math.max(curr_hero.curr_mana - field_effect.mana_upkeep, 0);
			if(curr_hero.curr_mana == 0){
				console.log('cancel channel')
				current_field_effects = current_field_effects.filter( el => el.name != field_effect.name);
			}
		}

		if (field_effect.duration > 0 && field_effect.owner.name == curr_hero.name){
			console.log("decrease duration")
			field_effect.duration -= 1;
			if(field_effect.duration == 0){
				console.log('funtime over')
				current_field_effects = current_field_effects.filter( el => el.name != field_effect.name);
			}
		}
		//console.log(document.getElementById("space" + hero.id))
	});

	return curr_hero.effects;
}

function apply_effects(ability, target, apply_buffs){
	//endTurn = true;
	//console.table(ability)
	//console.log(target);

	checkIfCantrip = (ability.effects.filter(obj => {
		return obj.name.includes('Cantrip');
		}))
	isCantrip = (checkIfCantrip.length != 0);

	//console.log(ability.name)
	console.log('ability effects length');
	console.log(ability.effects.length);
	for (i = 0; i < ability.effects.length; i++){
		var a_name = ability.effects[i].name;
		var a_mag = ability.effects[i].magnitude;
		var a_duration = ability.effects[i].duration;
		console.log(i);
		console.log(a_name);
		console.log(a_duration);
		if ((ability.effects[i].isBuff == true && apply_buffs == false) || target.curr_health <= 0){
			console.log('not applying buffs')
		}

		else{
		
		if (a_duration > 0){
			var e = JSON.parse(JSON.stringify(ability.effects[i]))

			//check if targeted hero has immunity
			checkIfImmunity = (target.effects.filter(obj => {
				return obj.name.includes('Immunity');
			  }))
			isImmunity = (checkIfImmunity.length != 0);
		
			if (isImmunity && (e.isBuff == false)){
				console.log("Yay Immunity!")
			}

			else if (e.name.includes("Change Speed") && a_mag < 0 && curr_hero.name == "Forsyth"){
				console.log("Sturdy Step");
			}
			else if (e.name.includes("Frostbite")){
				isFrozen = (target.effects.filter(obj => {
					return (obj.parentName == 'Frozen');
				  })).length > 0; 
				if (isFrozen){
					console.log("Can't apply Frostbite to Frozen enemies.")
				}	  
			}

			else {
				console.table(e)
				if (a_name.includes("Self")){
					e.duration = a_duration + 1;
					curr_hero.effects.push(e);
				}
				else if (a_name.includes("Flame Cloak")){
					//e.duration = a_duration + 1;
					lost_health = Math.round(a_mag * curr_hero.curr_health);
					curr_hero.curr_health -= lost_health;
					curr_hero.armor += Math.round(.5 * lost_health);
					curr_hero.ward += Math.round(.5 * lost_health);
					e.magnitude = lost_health;
					//console.log(e)
					
					e.descr = "Enemies within 1 row take " + Math.round(.33 * e.magnitude) + " Magic Damage every turn. Enemies 2 rows away take " + Math.round(.16 * e.magnitude) + " Magic Damage. Enemies within 2 rows that attack Kane burn for " + Math.round(.33 * e.magnitude) + " Magic Damage each turn over 2 turns."
					curr_hero.effects.push(e);
					console.log(curr_hero.effects)
				}

				else if (a_name == "Fury Buff"){
					all_undying_health_regen = curr_hero.effects.filter(effect => {
						return (effect.name == "Undying Health Regen");
					});
					total_health_regen = 0
					for (regen of all_undying_health_regen) {
						total_health_regen += regen.magnitude; 
					}
					//console.log('total health regen: ' + total_health_regen)
					multiplier = Math.round(total_health_regen / a_mag[0])
					//console.log('multi ' + multiplier)
					if (multiplier > 0){
						curr_hero.effects.push(new Effect("Change Speed", multiplier, 3, "Fury Buff", true, false))
						curr_hero.effects.push(new Effect("Fortify", multiplier * .1, 3, "Fury Buff", true, false))
						curr_hero.effects.push(new Effect("Increase Damage", multiplier * .1, 3, "Fury Buff", true, false))
					}
				}

				else {
					if (target == curr_hero && (a_name == 'Increase Next Melee Attack' || a_name == 'Increase Next Magic Attack' || a_name == 'Decrease Mana Costs' 
						|| a_name == 'Immunity' || a_name == 'Ethereal' || a_name == 'Elusive' || a_name == 'Increase Damage' || a_name == 'Change Speed' || a_name == 'Fortify' 
						|| a_name == 'Taunt' || a_name == "Mind Over Matter" || a_name == 'Vulnerable')){
						e.duration = a_duration + 1;
					}
					console.log(target)
					console.log(target.curr_health)
					if (target.curr_health >= 0){
						console.log('target health > 0')
						//If Scion is on the same row, replace Stun with Weak (1) and -2 Speed (1)
						if (scion_is_alive == true){
							scion_position = 999;
							for (hero of p1_heroes_alive.concat(p2_heroes_alive)) {
								if (hero.name == 'Scion'){
									scion_position = hero.position;
								}
							}
							if (scion_position == target.position && a_name.includes("Stun")){
								target.effects.push(new Effect('Weak', .3, 1, false))
								target.effects.push(new Effect('Change Speed', -2, 1, false))
							}
							else{
								target.effects.push(e)
							}
						}
	
					else{
						if (e.isUnique == "stack"){ //if stack = loop through and increase magnitude by magnitude and refresh duraiton
							var effect_exists_now = false;
							target.effects.forEach(function(curr_effect){
								//console.log("BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
								console.log(curr_effect.name);
								console.log(e.name)
								console.log(curr_effect)
								
								if (curr_effect.name == e.name){
									effect_exists_now = true;
									curr_effect.magnitude += e.magnitude;
									curr_effect.duration = e.duration;
								}
								console.log(curr_effect)
							})
							if (effect_exists_now == false){
								target.effects.push(e);
							}
							
						}

						else{
							target.effects.push(e)
						}
						

					}
					
				}
	
			}


			}

	}
		else if (a_name == 'Physical Damage other Enemies in Row'){
			//console.log(target)
			var attack = new Ability("Kalia Attack", a_mag, 'Physical', 4, 1, [], 0, 0)

			checkIfCantrip = (ability.effects.filter(obj => {
				return obj.name.includes('Cantrip');
				}))
			if (checkIfCantrip.length != 0){
				attack.name = "Cantrip Damage"
			}
			//find enemies in row:
			for (hero of p1_heroes_alive.concat(p2_heroes_alive)) {
				if ( (hero.position == target.position) & (hero.name != target.name)){
					resolve_damage(attack, hero, hero.position);
				}
			}
		} 

		else if (a_name == 'Magic Damage'){
			//console.log(target)
			var attack = new Ability("Basic Attack", a_mag, 'Magic', 4, 1, [], 0, 0)

			checkIfCantrip = (ability.effects.filter(obj => {
				return obj.name.includes('Cantrip');
				}))
			if (checkIfCantrip.length != 0){
				attack.name = "Cantrip Damage"
			}

			resolve_damage(attack, target, target.position);
		} 

		else if (a_name == 'Physical Damage'){
			var attack = new Ability("Basic Attack", a_mag, 'Physical', 4, 1, [], 0, 0)

			checkIfCantrip = (ability.effects.filter(obj => {
				return obj.name.includes('Cantrip');
				}))
			if (checkIfCantrip.length != 0){
				attack.name = "Cantrip Damage"
			}

			resolve_damage(attack, target, target.position);
		}
		//Kalia Dmg Reduction
		else if (a_name == 'Permanently Reduce Damage'){
			curr_hero.damage_decrease = Math.min(curr_hero.damage_decrease + a_mag, 1)
			console.log(curr_hero.damage_decrease)
		}

		else if (a_name == 'Increase Max Health'){
			target.health += a_mag;
			target.curr_health = Math.min(target.health, target.curr_health + a_mag);
		}


		else if (a_name == 'Increase Ward'){
			target.ward += a_mag;
		}

		else if (a_name == 'Mana Drain'){
			//console.log('mana drain!')
			target.curr_mana = Math.max(target.curr_mana - a_mag, 0);
			curr_hero.curr_mana = Math.min(curr_hero.mana, curr_hero.curr_mana + a_mag)
		}

		else if (a_name == 'Mana Drain If No Ward' && target.ward == 0){
			//console.log('Mana Drain since target has 0 ward')
			target.curr_mana = Math.max(target.curr_mana - a_mag, 0);
			curr_hero.curr_mana = Math.min(curr_hero.mana, curr_hero.curr_mana + a_mag)
		}

		else if (a_name == 'Drain Percent Current Mana and Gain Magic Shield'){
			var mana_drained = Math.round(a_mag[0] * target.curr_mana);
			target.curr_mana = Math.max(Math.round(target.curr_mana - mana_drained), 0);
			curr_hero.curr_mana = Math.min(curr_hero.mana, curr_hero.curr_mana + mana_drained);
			curr_hero.magic_shield += mana_drained;
		}

		else if (a_name == 'Self Increase Ward'){
			curr_hero.ward += a_mag;
		}

		else if (a_name == 'Change Armor'){
			target.armor += a_mag;
		}

		else if (a_name == 'Self Change Armor'){
			curr_hero.armor += a_mag;
			console.log('increasing armor')
		}

		else if (a_name == 'Lose Current Mana And Deal Damage'){
			curr_hero.curr_mana = Math.max(1, Math.round(curr_hero.curr_mana * (1 - a_mag[0])))
		}

		else if (a_name == 'Heal Most Wounded Ally'){
			var lowest_health = 999;
			var most_injured_ally = 0;
			hero_list = p1_heroes_alive.concat(p2_heroes_alive);
			for (let index = 0; index < hero_list.length; index++) {
				if (hero_list.team == curr_hero.team && hero_list.curr_health < hero_list.health && hero_list.curr_health < lowest_health){
					most_injured_ally = hero_list[index]
				}
			}

			if (most_injured_ally != 0){
				most_injured_ally.curr_health = Math.min(most_injured_ally.health, most_injured_ally.curr_health + a_mag)
				console.log('Healed ' + most_injured_ally.name + ' for ' + a_mag + ' health!')
			}
		}

		else if (a_name == 'Change Mana'){
			target.curr_mana = Math.min(Math.max(0, target.curr_mana + a_mag), target.mana);
			console.log('target mana: ' + target.curr_mana)
		}

		else if (a_name == 'Heal'){
			target.curr_health = Math.min(target.health, target.curr_health + a_mag);
		}

		else if (a_name == 'Gain Magic Shield'){
			target.magic_shield += a_mag;
		} 
	
		else if (a_name == 'Self Gain Magic Shield'){
			curr_hero.magic_shield += a_mag;
		} 
	
		else if (a_name == 'Gain Physical Shield'){
			target_hero.physical_shield += a_mag;
		} 
	
		else if (a_name == 'Self Gain Physical Shield'){
			curr_hero.physical_shield += a_mag;
		} 

		else if (a_name.includes('Change Armor') && a_mag > 0){
			if (a_name.includes("Self")){
				curr_hero.curr_armor += a_mag;
				curr_hero.base_armor += a_mag;
			}
			else{
				target.curr_armor += a_mag;
				target.base_armor += a_mag;
			}
		}

		else if (a_name.includes('Change Ward') && a_mag > 0){
			if (a_name.includes("Self")){
				curr_hero.curr_ward += a_mag;
				curr_hero.base_ward += a_mag;
				console.log(curr_hero.curr_ward);
			}
			else{
				target.curr_ward += a_mag;
				target.base_ward += a_mag;
			}
		}

		else if (a_name == 'Heal'){
			target.curr_health = Math.min(target.health, target.curr_health + a_mag);
		}


		else if (a_name == 'Heal Missing Health Percentage'){
			target.curr_health = Math.min(target.health, Math.round(target.curr_health + (target.health - target.curr_health) * a_mag));
		}

		else if (a_name == 'Recover Missing Mana Percentage'){
			target.curr_mana = Math.min(target.mana, Math.round(target.curr_mana + (target.mana - target.curr_mana) * a_mag));
		}

		else if (a_name == 'Decrease Max Health by Percent'){
			target.health = Math.round(target.health * (1 - a_mag));
			target.curr_health = Math.min(target.health, target.curr_health)
		}

		else if (a_name == 'Pull'){
			hero_list = p1_heroes_alive.concat(p2_heroes_alive);
			enemy_position_list = [];
			console.log(target.team)
			
			if (target.team == 1){
				for (const enemy in p2_heroes_alive){
					console.log(enemy)
					enemy_position_list.push(enemy.position);
				}
			}
			else{
				for (const enemy in p1_heroes_alive){
					console.log(enemy)
					enemy_position_list.push(enemy.position);
				}
			}
			if (curr_hero.position < target.position){ // target to right
				distance_array = array_range(target.position - a_mag, target.position + 1, 1)
				console.log('dist_array before: ' + distance_array)
				distance_array = drop_invalid_moves(distance_array, target)
				// for (var position in distance_array) {
				// 	if (enemy_position_list.includes(position)){
				// 		index = distance_array.indexOf(position);
				// 		distance_array.splice(i, 1)
				// 	}					
				// }
				var end = Math.min(...distance_array)
			} 

			else { //target to left
				console.log('target to left')
				distance_array = array_range(target.position, target.position + a_mag + 1, 1)
				distance_array = drop_invalid_moves(distance_array, target)
				console.log('dist_array before: ' + distance_array)
				// for (var position in distance_array) {
				// 	if (enemy_position_list.includes(position)){
				// 		console.log(position)
				// 		index = distance_array.indexOf(position);
				// 		distance_array.splice(i, 1)
				// 	}					
				// }
				var end = Math.max(...distance_array)
			}	
			console.log('dist_array after: ' + distance_array)
				
			console.log("FINAL POSITION: " + end)
			if (target.position != end){
				moveTo(target, target.position, end, false);	
			}
		}

		else if (a_name == "Push"){
			hero_list = p1_heroes_alive.concat(p2_heroes_alive);
			enemy_position_list = [];
			console.log(target.team)
			
			if (target.team == 1){
				for (const enemy in p2_heroes_alive){
					console.log(enemy)
					enemy_position_list.push(enemy.position);
				}
			}
			else{
				for (const enemy in p1_heroes_alive){
					console.log(enemy)
					enemy_position_list.push(enemy.position);
				}
			}
			if (curr_hero.position < target.position){ // target to right
				distance_array = array_range(target.position, target.position + a_mag + 1, 1)
				console.log('dist_array before: ' + distance_array)
				distance_array = drop_invalid_moves(distance_array, target)
				var end = Math.max(...distance_array)
				console.log(...distance_array)
			} 

			else { //target to left
				console.log('target to left')
				distance_array = array_range(target.position - a_mag, target.position + 1, 1)
				distance_array = drop_invalid_moves(distance_array, target)
				console.log('dist_array before: ' + distance_array)
				var end = Math.min(...distance_array)
				console.log(end)
			}	
			console.log('dist_array after: ' + distance_array)
				
			console.log("FINAL POSITION: " + end)
			if (target.position != end){
				console.log(target)
				moveTo(target, target.position, end, false);	
			}
		}

		else if (a_name == 'Remove Debuffs'){
			target.effects = target.effects.filter(obj => {
  			return obj.isBuff == true;
			})
		}

		else if (a_name == 'Remove Buffs'){
			console.log("remove buffs")
			target.effects = target.effects.filter(obj => {
  			return obj.isBuff == false;
			})
		}

		else if (a_name == 'Increase Debuffs'){
		try{
			for (i_buffs = 0; i_buffs < target.effects.length; i_buffs++){
				if (target.effects[i_buffs].isBuff == false && target.effects[i_buffs].name != 'Stun'){
					target.effects[i_buffs].duration += a_mag;
				}
			}	
			}	
		catch{
			console.log(':(')
		}
		}

		else if (a_name == 'Decrease Debuffs'){
			console.log('decrease debuffs');
			try{
				for (i_buffs = 0; i_buffs < target.effects.length; i_buffs++){
					if (target.effects[i_buffs].isBuff == false){
						target.effects[i_buffs].duration -= a_mag;
					}

					if (target.effects[i_buffs].duration <= 0){
						curr_hero.effects.splice(i_buffs, 1)
					}
			}
			}
			catch {
				console.log(":(");
			}		
		}

		else if (a_name == 'Increase Buffs'){
			for (i = 0; i < target.effects.length; i++){
				if (target.effects[i].isBuff == true){
					target.effects[i].duration += a_mag;
				}
			}		
		}

		else if (a_name == 'Decrease Buffs'){
			for (i = 0; i < target.effects.length; i++){
				if (target.effects[i].isBuff == true){
					target.effects[i].duration -= a_mag;
				} 

				if (target.effects[i].duration <= 0){
					curr_hero.effects.splice(i, 1)
				}
			}		
		}

		//
		else if (a_name == 'Gain Armor and Ward From Buffs'){
			var amt = (target.effects.filter(obj => {
  								return obj.isBuff == true;
							})).length * a_mag;

			console.log('Reap and Sow Amt: ' + amt)
			target.armor += amt;
			target.ward += amt;

		}

		else if (a_name == 'Heal Self For All Enemies Within 2 Rows'){
			if (curr_hero.team == 1){
				enemy_hero_list = p2_heroes_alive;
			}
			
			else{
				enemy_hero_list = p1_heroes_alive;
			}
			
			targets = (enemy_hero_list.filter(obj => {
				return (Math.abs(obj.position - curr_hero.position) <= 2);
			  }))

			heal_amt = targets.length * a_mag
			console.log("Heal Amt = " + heal_amt);
			if (pred == false){
				curr_hero.curr_health = Math.min(curr_hero.health, curr_hero.curr_health + heal_amt)
			}
		}

		else if (a_name.includes('Self Damage Reduction For All Enemies Within 2 Rows')){
			console.log("fortify!")
			if (curr_hero.team == 1){
				enemy_hero_list = p2_heroes_alive;
			}
			
			else{
				enemy_hero_list = p1_heroes_alive;
			}
			
			targets = (enemy_hero_list.filter(obj => {
				return (Math.abs(obj.position - curr_hero.position) <= 2);
			  }))

			fortify_amt = Math.max(0, (targets.length - 1) * a_mag[0])

			duration = a_mag[1] + 1

			curr_hero.effects.push(new Effect("Fortify", fortify_amt, duration, null, true, false))

			console.log("Fortify Amt = " + heal_amt);
		}

		else if (a_name == 'Heroic Armor'){
			target_missing_hp_percent = 1 - (target.curr_health/target.health);
			armor_ward_amt = Math.round(a_mag[0] * (1 + a_mag[1] * 100 * target_missing_hp_percent));
			console.log(armor_ward_amt);
			target.effects.push(new Effect("Change Armor", armor_ward_amt, a_mag[2], "Heroic Armor", true, true))
			target.effects.push(new Effect("Change Ward", armor_ward_amt, a_mag[2], "Heroic Armor", true, true))
		}

		else if (a_name == "Cancel Blizzard" && curr_hero.name == 'Cassia'){
			curr_hero.abilities[3] = blizzard;
			current_field_effects = current_field_effects.filter( el => el.name !== "Blizzard")
		}

		else if (a_name == "Double Frostbite Slow"){
			
			frostbite_check = target.effects.filter( el => el.name == "Frostbite")
			if(frostbite_check.length > 0){
				mag = frostbite_check[0].magnitude;
				target.effects.push(new Effect("Change Speed", -1 * mag, 1, "Glacial Chains", false, false));
			}

		}

		else if (a_name == 'Increase Speed of Allies in Row'){
			//find allies in row:
			for (hero of p1_heroes_alive.concat(p2_heroes_alive)) {
				if ( (hero.position == curr_hero.position) & (hero.name != curr_hero.name)){
					hero.effects.push(new Effect("Change Speed", a_mag[0], a_mag[1], null, true, false));
				}
			}
		} 
		//Dain's Vengeance

		else if (a_name == "Dain's Vengeance"){
			curr_hero.effects.push(new Effect("Increase Damage", a_mag[0], a_mag[2], "Dain's Vengeance", true, false));
			curr_hero.effects.push(new Effect("Give Attacks Anti-Heal", a_mag[1], a_mag[2], "Dain's Vengeance", true, false));
		} 

		else if (a_name == 'Leap to First Ally'){
			//get positions of all allies on team
			console.log(curr_hero);
			hero_list = p1_heroes_alive.concat(p2_heroes_alive);
			index = curr_hero.position//hero_list.findIndex(hero => hero == curr_hero)
			allied_position_list = [];
			if (curr_hero.team == 1){
				for (let num = 0; num < p1_heroes_alive.length; num++){
					allied_position_list.push(p1_heroes_alive[num].position);
				}
				console.log(allied_position_list);
				console.log(Math.max(...allied_position_list))
				//make assumption (12/26/21) that team 1 heroes are going to be on the left attacking right. We'll see if this holds up lol
				//so, largest move Octavius to the largest (number) position.
				moveTo(curr_hero, curr_hero.position, Math.max(...allied_position_list), ability);

			}
			else{
				for (let num = 0; num < p2_heroes_alive.length; num++){
					//console.log(p1_heroes_alive[num])
					allied_position_list.push(p2_heroes_alive[num].position);
				}
				moveTo(curr_hero, curr_hero.position, Math.min(...allied_position_list), ability);
			}
		}
		
		else if (a_name == 'Force Move Self'){
			console.log(curr_hero.name);
			//change to get enemy positions as list, then do stuff from that list
			hero_list = p1_heroes_alive.concat(p2_heroes_alive);
			index = curr_hero.position//hero_list.findIndex(hero => hero == curr_hero)
			enemy_position_list = [];
			if (curr_hero.team == 1){
				for (let num = 0; num < p2_heroes_alive.length; num++){
					//console.log(p2_heroes_alive[num])
					enemy_position_list.push(p2_heroes_alive[num].position);
				}
			}
			else{
				for (let num = 0; num < p1_heroes_alive.length; num++){
					console.log(p1_heroes_alive[num])
					enemy_position_list.push(p1_heroes_alive[num].position);
				}
			}

			console.log(enemy_position_list);

		    if (curr_hero.position < target.position){ // target to right
				console.log('target to right')
				var end = curr_hero.position + a_mag
				//console.log('Curr hero team for enemy position: ' + curr_hero.team)
				//console.log(enemy_position_list)

				distance_array = array_range(Math.min(index, end), 1 + Math.max(index, end))
				
				//console.log('dist_array before: ' + distance_array)
				for (let i_dist = 0; i_dist < distance_array.length; i_dist++) {
					if (enemy_position_list.includes(distance_array[i_dist])){
						distance_array.splice(i_dist, 1)
						i_dist--;
					}					
				}
				//secondary check - if the j+1th element does not exist, then remove all elements to the right
				for (let j = 0; j < distance_array.length; j++) {
					if ((distance_array[j] + 1) != distance_array[j + 1]){
						distance_array.length = j + 1
					}					
				}

				//console.log('dist_array after: ' + distance_array)
				end = Math.max(...distance_array)
				//console.log(end)

				moveTo(curr_hero, curr_hero.position, end, ability);
			} 

			else { //target to left
				console.log('target to left')
				console.log('curr hero pos: ' + curr_hero.position);
				//var end = curr_hero.position - a_mag

				distance_array = array_range(Math.min(index, a_mag) - 1, Math.max(index, a_mag))
				//console.log('dist_array before: ' + distance_array)
				//console.log(enemy_position_list)
				for (let i_dist = 0; i_dist < distance_array.length; i_dist++) {
					//console.log(distance_array[i])
					if (enemy_position_list.includes(distance_array[i_dist])){
						distance_array.splice(i_dist, 1)
						i_dist--;
					}					
				}

				//secondary check - if the i+1th element does not exist, then remove all elements to the right
				distance_array.reverse()
				for (let j1 = 0; j1 < distance_array.length; j1++) {
					if ((distance_array[j1] - 1) != distance_array[j1 + 1]){
						distance_array.length = j1 + 1
					}					
				}

				console.log('dist_array after: ' + distance_array)
				var end = Math.min(...distance_array)
				console.log(end)

				moveTo(curr_hero, curr_hero.position, end, ability);
			}				
		}

		//Cassia Freeze (4 stacks)
		target.effects.forEach(function(curr_effect){
			if (curr_effect.name == "Frostbite" && curr_effect.magnitude >= 4){
				target.effects = target.effects.filter( el => el.name !== "Frostbite" ); 
				target.effects.push(new Effect("Stun", 1, 1, "Frozen", false, false))
				target.effects.push(new Effect("Fortify", .3, 1, "Frozen", false, false))
			}
			//console.log(curr_effect)
		})

		

		

	}


}
}

function apply_ability(ability, target){
	all_tiles = document.getElementsByClassName("hero");
	for (let i = 0; i < all_tiles.length; i++){
		all_tiles[i].style.outline = '0';
		all_tiles[i].onclick = '';
		all_tiles[i].onmouseover = function() {display_stats(i)};
	}

	if(ability == 'a1' || ability == curr_hero.abilities[1]){
		ability = curr_hero.abilities[1];
		curr_hero.cd_a1 = ability.cooldown;
		checkIfCantrip = (ability.effects.filter(obj => {
			return obj.name.includes('Cantrip');
			}))
		if(checkIfCantrip.length == 0){
			curr_hero.cd_basic = Math.max(0, curr_hero.cd_basic - 1)
			curr_hero.cd_a2 = Math.max(0, curr_hero.cd_a2 - 1)
			curr_hero.cd_a3 = Math.max(0, curr_hero.cd_a3 - 1)
		}
		
	} else if(ability == 'a2' || ability == curr_hero.abilities[2]){
		ability = curr_hero.abilities[2];
		curr_hero.cd_a2 = ability.cooldown;
		checkIfCantrip = (ability.effects.filter(obj => {
			return obj.name.includes('Cantrip');
			}))
		if(checkIfCantrip.length == 0){
			curr_hero.cd_basic = Math.max(0, curr_hero.cd_basic - 1)
			curr_hero.cd_a1 = Math.max(0, curr_hero.cd_a1 - 1)
			curr_hero.cd_a3 = Math.max(0, curr_hero.cd_a3 - 1)
		}

	} else if(ability == 'a3' || ability == curr_hero.abilities[3]){
		console.log('a3')
		ability = curr_hero.abilities[3];
		curr_hero.cd_a3 = ability.cooldown;
		checkIfCantrip = (ability.effects.filter(obj => {
			return obj.name.includes('Cantrip');
			}))
		if(checkIfCantrip.length == 0){
			curr_hero.cd_basic = Math.max(0, curr_hero.cd_basic - 1)
			curr_hero.cd_a1 = Math.max(0, curr_hero.cd_a1 - 1)
			curr_hero.cd_a2 = Math.max(0, curr_hero.cd_a2 - 1)
		}

	} else if(ability == 'basic_attack' || ability == curr_hero.abilities[0]){
		ability = curr_hero.abilities[0];
		curr_hero.cd_basic = ability.cooldown;
		checkIfCantrip = (ability.effects.filter(obj => {
			return obj.name.includes('Cantrip');
			}))
		if(checkIfCantrip.length == 0){
		curr_hero.cd_a1 = Math.max(0, curr_hero.cd_a1 - 1)
		curr_hero.cd_a2 = Math.max(0, curr_hero.cd_a2 - 1)
		curr_hero.cd_a3 = Math.max(0, curr_hero.cd_a3 - 1)
		}
	} 

	if (curr_hero.name == 'Kess' && ability.name == 'Double Daggers'){
		target.kess_knives += 1;
		curr_hero.knives_ammo -= 1;
	}
	mana_cost = ability.mana_cost;

	checkIfDecreaseManaCosts = (curr_hero.effects.filter(obj => {
		return obj.name.includes('Decrease Mana Costs');
	  }))
	isDecreaseManaCosts = (checkIfDecreaseManaCosts.length != 0);

	if (isDecreaseManaCosts){
		console.log(checkIfDecreaseManaCosts[0].magnitude)
		console.log("Old Mana Cost: " + mana_cost)
		mana_cost = Math.round(mana_cost * checkIfDecreaseManaCosts[0].magnitude)
		console.log("New Mana Cost: " + mana_cost)
	}
	if (ability.type.includes("Channeled")){
		console.log('no mana for channel');
	}
	else{
		curr_hero.curr_mana -= mana_cost;
	}
	
	var AoE = ability.AoE;

	if (Number.isInteger(target)){
		endTurn = true;
		a = ability;
		console.log(a.type)
		var upkeep = 0;
		if (a.type.includes("Channeled Field Effect")){
			duration = 'inf'
			trigger = 'end enemy turn'
			upkeep = a.mana_cost;
		}
		// 3 Turn Physical Field Effect
		else if (a.type.includes("Turn")){
			
			duration = parseInt(a.type) + 1;
			console.log(duration)
			trigger = 'end enemy turn'

			if (a.name == 'Bombard'){
				trigger = 'end caster turn';
				duration = parseInt(a.type);
			}
		}

		else{
			console.log("I cri")
		}

		if (a.type.includes("Movement Trap")){
			trigger = 'move through row'
		}

		if (a.type.includes("Magic")){
			type = "Magic"
		}

		else{
			type = "Physical";
		}
		new_field_effect = new Field_Effect(a.name, a.damage, type, duration, a.effects, trigger, curr_hero, upkeep, target, createDescr(this.name, this.magnitude, []))
		current_field_effects.push(new_field_effect);
		console.log(current_field_effects)

		//change blizzard ability to cancel Blizzard
		if (a.name == "Blizzard" && curr_hero.name == 'Cassia'){
			curr_hero.abilities[3] = cancel_blizzard;
		}
		
	}

	else{
	console.log('target:')
	console.log(target)
	var targets = [target];
	var final_targets = [];

	//AoE: mouse over indivdual heroes, but all are highlighted.
	if (AoE == 'all_enemies'){
		targets = [];
		for (hero of p1_heroes_alive.concat(p2_heroes_alive)){
			if (hero.team == target.team){
				targets.push(hero)
			}
	
		}	
	}

	else if (AoE == 'All Allies'){
		targets = [];
		for (hero of p1_heroes_alive.concat(p2_heroes_alive)){
			if (hero.team == target.team){
				targets.push(hero)
			}
	
		}	
		console.log(targets);
	}

	else {
		if (AoE == 'row'){
			for (hero of p1_heroes_alive.concat(p2_heroes_alive)){
				if (hero.position == target.position && hero != target){
					targets.push(hero)
				}
		
			}
		}

		if (AoE == 'Enemies Within 2 Rows'){
			if (curr_hero.team == 1){
				enemy_hero_list = p2_heroes_alive;
			}
			
			else{
				enemy_hero_list = p1_heroes_alive;
			}

			for (hero of enemy_hero_list){
				if (Math.abs((hero.position - target.position) <= 2) && hero != target){
					targets.push(hero)
				}
		
			}
		}
	}

	var apply_buffs = true;
	for (var i = 0; i < targets.length; i++) {
		if (targets[i].curr_health != null){
			final_targets.push(targets[i]);
			//if multistrike
			multistrikeInfo = (ability.effects.filter(obj => {
  					return obj.name == 'Multistrike';
				}))

			if (multistrikeInfo.length > 0){
				for (var j = 0; j < multistrikeInfo[0].magnitude; j++) {
					if (targets[i] != 0){
						console.log('targets[i] ' + targets[i].name)
						resolve_damage(ability, targets[i], targets[i]);
					}
				}
			}
			if (targets[i] != 0){
				resolve_damage(ability, targets[i], targets[i]);	
				apply_effects(ability, targets[i], apply_buffs);
				
			}
			apply_buffs = false;
		}
	}

	//Add Darkness if Kythra: + 10 Darkness for all abilities except a3:
	if (curr_hero.name == "Kythra"){
		if (ability.name != 'Angelic Ascent'){
			curr_hero.darkness = Math.min(10 + curr_hero.darkness, 100);
			console.log("Adding 10 Darkness!")
			console.log(curr_hero.darkness)
		}
		else if (ability.name == 'Angelic Ascent'){
			curr_hero.darkness = Math.max(curr_hero.darkness - 15, 0);
		}
	} 

	//console.log(curr_hero.name)
	if (curr_hero.name == 'Athena'){
		console.log("Athena healing")
		var lowest_health = 999;
		var most_injured_ally = 0;
		hero_list = p1_heroes_alive.concat(p2_heroes_alive);
		console.log(hero_list)
		for (let index = 0; index < hero_list.length; index++) {
			if ((hero_list[index].team == curr_hero.team) && (hero_list[index].curr_health < hero_list[index].health) && (hero_list[index].curr_health < lowest_health)){
				most_injured_ally = hero_list[index]
			}
		}
		console.log(most_injured_ally)
		if (most_injured_ally != 0){
			most_injured_ally.curr_health = Math.min(most_injured_ally.health, most_injured_ally.curr_health + 5)
			console.log('Healed ' + most_injured_ally.name + ' for 5 health!')
		}
	}
		
	//console.log(final_targets);

	// resolve_damage(ability, target, position);

	// //resolve immediate effects:
	// apply_effects(ability, target);
	}
	console.log('update_curr_her_called')
	update_current_hero(false);
	console.log('generating utility')
	if (ai_called == false){
		//console.log('NOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO')
		//ai_generate_utility();
		update_field();
	}
	

	//display_stats(position);

}

function ability_targeting(ability, clicked){
	const isCurrHero = (element) => element == curr_hero;
	curr_action = p1_heroes_alive.concat(p2_heroes_alive).findIndex(isCurrHero);
	var curr_ability;
	console.log(ability);
	if(ability == 'basic_attack'){
		if(clicked){
			document.getElementById("basic_attack").onmouseout = ''
		}
		document.getElementById("a1").onmouseout = change_ability_text;
		document.getElementById("a2").onmouseout = change_ability_text;
		document.getElementById("a3").onmouseout = change_ability_text;

		curr_ability = curr_hero.abilities[0]
		var range = curr_hero.abilities[0].range;
		var AoE = curr_hero.abilities[0].AoE;
		var ability_type = curr_hero.abilities[0].type
		var movementCheck = (curr_hero.abilities[0].effects.filter(obj => {
  							return obj.name == 'Move Self';
						 }))
		var isMovement = (movementCheck.length != 0);

		var valid_targets = get_valid_targets(curr_hero, range, curr_action, curr_ability);
	} else if(ability == 'a1'){
		if(clicked){
			document.getElementById("a1").onmouseout = ''
		}
		document.getElementById("basic_attack").onmouseout = change_ability_text
		document.getElementById("a2").onmouseout = change_ability_text
		document.getElementById("a3").onmouseout = change_ability_text

		curr_ability = curr_hero.abilities[1]
		var range = curr_hero.abilities[1].range;
		var AoE = curr_hero.abilities[1].AoE;
		var ability_type = curr_hero.abilities[1].type
		var movementCheck = (curr_hero.abilities[0].effects.filter(obj => {
  							return obj.name == 'Move Self';
						 }))
		var isMovement = (movementCheck.length != 0);

		var valid_targets = get_valid_targets(curr_hero, range, curr_action, curr_ability);

	} else if(ability == 'a2'){
		if(clicked){
			document.getElementById("a2").onmouseout = ''
		}
		document.getElementById("basic_attack").onmouseout = change_ability_text
		document.getElementById("a1").onmouseout = change_ability_text
		document.getElementById("a3").onmouseout = change_ability_text

		curr_ability = curr_hero.abilities[2];
		var range = curr_hero.abilities[2].range;
		var AoE = curr_hero.abilities[2].AoE;
		var ability_type = curr_hero.abilities[2].type

		var movementCheck = (curr_hero.abilities[2].effects.filter(obj => {
  							return obj.name == 'Move Self';
						 }))
		var isMovement = (movementCheck.length != 0)

		var valid_targets = get_valid_targets(curr_hero, range, curr_action, curr_ability);

	}  else if(ability == 'a3'){
		if(clicked){
			document.getElementById("a3").onmouseout = ''
		}
		document.getElementById("basic_attack").onmouseout = change_ability_text
		document.getElementById("a1").onmouseout = change_ability_text
		document.getElementById("a2").onmouseout = change_ability_text
		curr_ability = curr_hero.abilities[3];
		var range = curr_hero.abilities[3].range;
		var AoE = curr_hero.abilities[3].AoE;
		var ability_type = curr_hero.abilities[3].type
		var movementCheck = (curr_hero.abilities[3].effects.filter(obj => {
  							return obj.name == 'Move Self';
						 }))
		var isMovement = (movementCheck.length != 0)

		var valid_targets = get_valid_targets(curr_hero, range, curr_action, curr_ability);
	} else {
		valid_targets = []
	}
	if (valid_targets == []){
		return;
	}


	if (isMovement){
			console.log('is movement!')
			move_current_hero(movementCheck[0].magnitude, curr_ability)
		}

	else{
		console.log(valid_targets);
		outline_valid_targets(curr_ability, valid_targets, AoE);
	}
	
}

function update_field() {
	for (hero of p1_heroes_alive.concat(p2_heroes_alive)){
		document.getElementById('space' + hero.id).innerHTML = "<h1>" + hero.name + "</h1>";
	}

	all_tiles = document.getElementsByClassName("field");
	//console.log(all_tiles)
	for (i = 0; i < all_tiles.length; i++){
		all_tiles[i].style.outline = '0';

	var fp = document.getElementById('field_position' + i);
	fp.style.color = 'black';
	fp.style.outline = '0';

	var hero_pos_list = [];

	for (hero of p1_heroes_alive.concat(p2_heroes_alive)){
		if (p1_heroes_alive.includes(hero)){
			document.getElementById('space' + hero.id).style.color = '#d1979c';
		}
		else{
			document.getElementById('space' + hero.id).style.color = '#427d7d';
		}
		hero_pos_list.push(hero.position)
		if(hero.id == curr_hero.id){
			if (p1_heroes_alive.includes(hero)){
				document.getElementById('space' + hero.id).style.color = '#d00';
			}
			else{
				document.getElementById('space' + hero.id).style.color = '#08e6e7';
			}
			
		}
	}

	if((document.getElementById('field_position' + i).children.length >= 0) && (hero_pos_list.includes(i)) && (fp.innerHTML == "<h1>__</h1>")){
		fp.innerText = '';
		//fp.onmouseover = function() {display_field_effect_info(i)};
	} 
	
	for(let field_num = 0; field_num < 8; field_num++){
		//console.log('field_num: ' + field_num);
		if(document.getElementById('field_position' + field_num).children.length == 0){
			document.getElementById('field_position' + field_num).innerHTML = "<div class = 'hero'><h1>__</h1></div>";
		} 
	}


	// for (i = 0; i < 8; i++){
	// 	document.getElementById('space' + i).style.color = 'black';
	// 	if(i == curr_hero.id){
	// 		console.log('red time!')
	// 		document.getElementById('space' + i).style.color = '#d00'
	// 	}
	// }
	}
	update_speed();
};


function generate_cd_text(cd){
	if (cd > 0){
		cd_text = ' (CD: ' + cd + ')';
	} else {
		cd_text = '';
	}

	return cd_text;
}

function update_ability_text(){
	isStunned = (curr_hero.effects.filter(obj => {
  					return obj.name == 'Stun';
				}).length != 0)
	//console.log('isStunned: ' + isStunned)

	isRooted = (curr_hero.effects.filter(obj => {
  					return obj.name == 'Root';
				}).length != 0)
	//console.log('isRooted: ' + isRooted)

	basic_cd_text = generate_cd_text(curr_hero.cd_basic)
	a1_cd_text = generate_cd_text(curr_hero.cd_a1)
	a2_cd_text = generate_cd_text(curr_hero.cd_a2)
	a3_cd_text = generate_cd_text(curr_hero.cd_a3)

	document.getElementById('basic_attack').innerHTML = curr_hero.abilities[0].name + basic_cd_text;
	if (curr_hero.name == 'Kess'){
		document.getElementById('basic_attack').innerHTML = curr_hero.abilities[0].name + ' (' + curr_hero.knives_ammo + '/2)';
	}
	document.getElementById('a1').innerHTML = curr_hero.abilities[1].name + a1_cd_text;
	document.getElementById('a2').innerHTML = curr_hero.abilities[2].name + a2_cd_text;
	document.getElementById('a3').innerHTML = curr_hero.abilities[3].name + a3_cd_text;

	const isCurrHero = (element) => element == curr_hero;
	var curr_action = p1_heroes_alive.concat(p2_heroes_alive).findIndex(isCurrHero);
	

	if ((curr_hero.name == 'Jakob' && curr_hero.wrath >= 5) || curr_hero.name != 'Jakob'){
		var final_stand_enough_wrath = true
	}
	else{
	 	final_stand_enough_wrath = false;
	}


	//console.log("Current knives ammo: " + curr_hero.knives_ammo)
	if (curr_hero.name == 'Kess' && curr_hero.knives_ammo == 0){
		var double_daggers_not_enough_ammo = true
	}
	else{
		double_daggers_not_enough_ammo = false;
	}
	//console.log('current ammo status:' + !double_daggers_not_enough_ammo)



	basic_isMovement = ((curr_hero.abilities[0].effects.filter(obj => {
  			return obj.name.includes('Move Self');
		})).length > 0)

	a1_isMovement = ((curr_hero.abilities[1].effects.filter(obj => {
  			return obj.name.includes('Move Self');
		})).length > 0)

	a2_isMovement = ((curr_hero.abilities[2].effects.filter(obj => {
  			return obj.name.includes('Move Self');
		})).length > 0)

	a3_isMovement = ((curr_hero.abilities[3].effects.filter(obj => {
  			return obj.name.includes('Move Self');
		})).length > 0)

	a3_usableIfEnemyIsLowLife = ((curr_hero.abilities[3].effects.filter(obj => {
			return obj.name == 'Only Usable If Enemy Is Low Life';
	  })).length > 0)

	isTranquil = ((curr_hero.effects.filter(obj => {
		return obj.name == 'Tranquil';
    })).length > 0)



	
	basic_isTranquil = (isTranquil && ((curr_hero.abilities[0].type == 'Physical') || curr_hero.abilities[0].type == 'Magic' || curr_hero.abilities[0].type == 'Debuff'))
	a1_isTranquil = (isTranquil && ((curr_hero.abilities[1].type == 'Physical') || curr_hero.abilities[1].type == 'Magic' || curr_hero.abilities[1].type == 'Debuff'))
	a2_isTranquil = (isTranquil && ((curr_hero.abilities[2].type == 'Physical') || curr_hero.abilities[2].type == 'Magic' || curr_hero.abilities[2].type == 'Debuff'))
	a3_isTranquil = (isTranquil && ((curr_hero.abilities[3].type == 'Physical') || curr_hero.abilities[3].type == 'Magic' || curr_hero.abilities[3].type == 'Debuff'))

	var enemyIsLowLife = false;
	if (curr_hero.team == 1){
		for (enemy_hero of p2_heroes_alive){
			if (enemy_hero.curr_health <= .5 * enemy_hero.health){
				enemyIsLowLife = true;
			}
		}
	}
	else{
		for (enemy_hero of p1_heroes_alive){
			if (enemy_hero.curr_health <= .5 * enemy_hero.health){
				enemyIsLowLife = true;
			}
		}
	}

		
	//console.log("Basic CD: " + curr_hero.cd_basic)
	//console.log("A1 CD: " + curr_hero.cd_a1)
	//console.log("A2 CD: " + curr_hero.cd_a2)
	//console.log("A3 CD: " + curr_hero.cd_a3)

	if (curr_hero.cd_a1 > 0 || (get_valid_targets(curr_hero, curr_hero.abilities[1].range, curr_action, curr_hero.abilities[1]).length == 0) || curr_hero.abilities[1].mana_cost > curr_hero.curr_mana || isStunned || a1_isTranquil || (a1_isMovement && isRooted)){
		document.getElementById('a1').disabled = true;
		//curr_hero.cd_a1 = Math.max(0, curr_hero.cd_a1 - 1)
	} else {
		document.getElementById('a1').disabled = false;
	}

	if (curr_hero.cd_a2 > 0 || (get_valid_targets(curr_hero, curr_hero.abilities[2].range, curr_action, curr_hero.abilities[2]).length == 0) || curr_hero.abilities[2].mana_cost > curr_hero.curr_mana || isStunned || a2_isTranquil || (a2_isMovement && isRooted)){
		document.getElementById('a2').disabled = true;
		//curr_hero.cd_a2 = Math.max(0, curr_hero.cd_a2 - 1)
	} else {
		document.getElementById('a2').disabled = false;
	}

	if (curr_hero.cd_a3 > 0 || (get_valid_targets(curr_hero, curr_hero.abilities[3].range, curr_action, curr_hero.abilities[3]).length == 0) || curr_hero.abilities[3].mana_cost > curr_hero.curr_mana || isStunned || a3_isTranquil || !(final_stand_enough_wrath) || (a3_isMovement && isRooted) || (a3_usableIfEnemyIsLowLife && !enemyIsLowLife) || (curr_hero.name == "Azura" && curr_hero.ally_died_last_turn == false)){
		document.getElementById('a3').disabled = true;
		//curr_hero.cd_a3 = Math.max(0, curr_hero.cd_a3 - 1)
	} else {
		document.getElementById('a3').disabled = false;
	}

	if (curr_hero.cd_basic > 0 || (get_valid_targets(curr_hero, curr_hero.abilities[0].range, curr_action, curr_hero.abilities[0]).length == 0) || curr_hero.abilities[0].mana_cost > curr_hero.curr_mana || isStunned || basic_isTranquil || (basic_isMovement && isRooted) || (double_daggers_not_enough_ammo)){
		document.getElementById('basic_attack').disabled = true;
		//curr_hero.cd_basic = Math.max(0, curr_hero.cd_basic - 1)
	} else {
		document.getElementById('basic_attack').disabled = false;
	}

	if (isRooted || isStunned){
		document.getElementById('move').disabled = true;
	} else {
		document.getElementById('move').disabled = false;
	}
}

function update_Kythra(darkness){
	//change moves
	if (darkness >= 25 && curr_hero.abilities[0] != shadowflame){
		curr_hero.abilities[0] = shadowflame;
		curr_hero.cd_basic = 0;
		console.log('stage 1')
	}

	if (darkness >= 50 && curr_hero.abilities[1] != lash_of_torment){
		curr_hero.abilities[1] = lash_of_torment;
		curr_hero.health += 10;
		curr_hero.curr_health += 10;
		curr_hero.cd_a1 = 0;
		console.log('stage 2')
	}

	if (darkness >= 75 && curr_hero.abilities[2] != unholy_purge){
		curr_hero.abilities[2] = unholy_purge;
		curr_hero.cd_a2 = 0;
		console.log('stage 3')
	}

	if (darkness >= 100 && curr_hero.abilities[3] != demonic_ascent){
		curr_hero.abilities[3] = demonic_ascent;
		curr_hero.abilities[0] = evolved_shadowflame;
		curr_hero.health += 10;
		curr_hero.curr_health += 10;
		curr_hero.cd_a3 = 0;
		console.log('GG noobs')
	}
}

function toggle_ability_info() {
	var x = document.getElementById("curr_hero_all_ability_info");
	if (x.style.display == "none") {
	  x.style.display = "block";
	  document.getElementById('toggle_ability_info').innerText = "Hide Ability Info";
	} else {
	  x.style.display = "none";
	  document.getElementById('toggle_ability_info').innerText = "Show Ability Info";
	}
  }

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
	else if (AoE == 'all_allies'){
		text = "All Allies";
	}
	return text;
}

function update_current_hero(passed){
	console.log('updating curr hero!!!')
	all_heroes = p1_heroes_alive.concat(p2_heroes_alive)
	for (var i = 0; i < all_heroes.length; i++) {
		//speed_list[i].curr_armor = 
		//console.log(all_heroes[i].effects);
		//console.log(all_heroes[i].effects)
		//console.log(all_heroes[i].effects)
		armor_modifiers = (all_heroes[i].effects.filter(obj => {
							  return (obj.name.includes('Change Armor')); 
					  }));
		all_heroes[i].curr_armor = all_heroes[i].base_armor;
		if (armor_modifiers.length > 0){
			for (var j = 0; j < armor_modifiers.length; j++) {
				all_heroes[i].curr_armor += armor_modifiers[j].magnitude;
			}			
		}
		//console.log(armor_modifiers);

		//ward modifiers
		ward_modifiers = (all_heroes[i].effects.filter(obj => {
			return (obj.name.includes('Change Ward')); 
	}));
			all_heroes[i].curr_ward = all_heroes[i].base_ward;
			if (ward_modifiers.length > 0){
			for (var j = 0; j < ward_modifiers.length; j++) {
			all_heroes[i].curr_ward += ward_modifiers[j].magnitude;
			}			
			}
		//console.log(ward_modifiers);


		for (var k = 0; k < all_heroes[i].effects.length; k++){
			all_heroes[i].effects[k].descr = createDescr(all_heroes[i].effects[k].name, all_heroes[i].effects[k].magnitude, []);
			//console.log(all_heroes[i].effects[k].descr)
		}
	}

	all_tiles = document.getElementsByClassName("hero");
	for (let i = 0; i < all_tiles.length; i++){
		all_tiles[i].style.outline = '0';
		all_tiles[i].onclick = '';
		all_tiles[i].onmouseover = function() {display_stats(i)};
	}

	all_field_tiles = document.getElementsByClassName("field");
	for (i = 0; i < all_field_tiles.length; i++){
		all_field_tiles[i].onclick = '';
	}


	var speed_list = update_speed();
	if(curr_hero == null){
		curr_hero = speed_list[0];
		speed_list.shift();
	}
	//console.log(speed_list)

	for (let index = 0; index < speed_list.length; index++) {
		if(!speed_list[index].hasOwnProperty('moves')){
			//get_initial_utility(); None
		}
	}
	//gen utility here
	if(ai_called == false){
		//ai_generate_utility();
		console.log("Generating utility outside of loop.")
	}

	console.log('passed: ' + passed)
	if (passed == true){
		if (curr_hero.name == 'Kalia'){
			curr_hero.damage_decrease = Math.max(curr_hero.damage_decrease -.25, 0)
		}
		endTurn = true;
		// curr_hero.cd_basic = Math.max(0, curr_hero.cd_basic - 1)
		// curr_hero.cd_a1 = Math.max(0, curr_hero.cd_a1 - 1)
		// curr_hero.cd_a2 = Math.max(0, curr_hero.cd_a2 - 1)
		// curr_hero.cd_a3 = Math.max(0, curr_hero.cd_a3 - 1)
	}
	console.log('endturn: ' + endTurn);
	if (endTurn == true){
		console.log('turn ended')
		console.log('NEXT TURN - - - - - - - - - - - - - - NEXT TURN')
		curr_hero.effects = resolve_effects(curr_hero);
		if (curr_hero.name == 'Azura'){
			console.log(curr_hero.ally_died_last_turn)
			curr_hero.ally_died_last_turn = false;
		};
		curr_hero = speed_list[0];	
		console.log(curr_hero.name + "'s turn.")
		console.log(curr_hero)

		//Mod Dara Mana:
		if (curr_hero.name == "Dara"){ //change dara's base mana regen to 10.
			additional_mana_regen = 0;
			if (curr_hero.team == 1){
				for (let index = 0; index < p1_heroes_alive.length; index++) {
					if(p1_heroes_alive[index].name != "Dara"){
						additional_mana_regen += Math.round(p1_heroes_alive[index].mana_regen * .3);
					}	
				}
			}
			else{
				for (let index = 0; index < p2_heroes_alive.length; index++) {
					if(p2_heroes_alive[index].name != "Dara"){
						additional_mana_regen += Math.round(p2_heroes_alive[index].mana_regen * .3);
					}	
				}
			}
			curr_hero.mana_regen = 10 + additional_mana_regen;
		}
		console.log(current_field_effects);
		//console.log('Curr Hero Pos: ' + curr_hero.position);	
		speed_list = speed_list.shift()
		endTurn = false;
	}

	p1_heroes_alive.concat(p2_heroes_alive).forEach(function(hero){
		document.getElementById("space" + hero.id).onclick = '';
		document.getElementById("space" + hero.id).onmouseover = function() {display_stats(hero.id)}
	})
	
	document.getElementById('ability_text').innerHTML = ''
	//console.log(curr_hero);

	if (curr_hero.name == 'Kythra'){
		console.log('Current Darkness: ' + curr_hero.darkness)
		update_Kythra(curr_hero.darkness)
	}

	if (curr_hero.name == 'Azrael'){
		azrael_mark_applied_this_turn_already = false;
	}

	if (curr_hero.name == 'Zeth'){
		console.log('Current Health Lost: ' + curr_hero.health_lost)
		if (curr_hero.health_lost >= 100){
			curr_hero.abilities = [empowered_tainted_reconstruction, empowered_twisted_vitality, empowered_ritual_dagger, empowered_crimson_hex];
			curr_hero.health_lost = 0;
		}
		else{
			curr_hero.abilities = [tainted_reconstruction, twisted_vitality, ritual_dagger, crimson_hex]
		}
		
	}

	if (curr_hero.name == 'Jakob'){
		console.log('Current Wrath: ' + curr_hero.wrath)
	}


	curr_hero.curr_mana = Math.min(curr_hero.mana, curr_hero.curr_mana + curr_hero.mana_regen)

	//speed_list = speed_list.shift()
	
	
	document.getElementById('basic_attack').innerHTML = curr_hero.abilities[0].name;

	if (curr_hero.name == 'Kess'){
		document.getElementById('basic_attack').innerHTML = curr_hero.abilities[0].name + ' (' + curr_hero.knives_ammo + '/2)';
	}
	if (curr_hero.curr_health <= 0){
		curr_hero = speed_list[0];
	}
	// curr_hero.cd_a1 = Math.max(0, curr_hero.cd_a1 - 1);
	// curr_hero.cd_a2 = Math.max(0, curr_hero.cd_a2 - 1);
	// curr_hero.cd_a3 = Math.max(0, curr_hero.cd_a3 - 1);
	update_ability_text();
	
	if (ai_called == false){
		//curr_hero_info
		
		curr_info = curr_hero.name + ' | HP: ' + curr_hero.curr_health + '/' + curr_hero.health + ' | Mana: ' + 
		curr_hero.curr_mana + '/' + curr_hero.mana + ' (+' + curr_hero.mana_regen + ')' + 
		' | Armor: ' + curr_hero.curr_armor + ' | Ward: ' + curr_hero.curr_ward + 
		' | Physical Shield: ' + curr_hero.physical_shield + ' | Magic Shield: ' + curr_hero.magic_shield + " | Speed: " + curr_hero.speed + "<br>" 
		'Effects: ' + "<br>";
		curr_hero.effects.forEach(function(e){
		//console.log(e)
		//console.log(e.parentName)
		if(e.parentName != null && !curr_info.includes(e.parentName)){
		curr_info += e.parentName + ': ' + createDescr(e.parentName, e.duration, curr_hero.effects) + "<br>"// for ' + e.duration + ' turn(s).' + "<br>"
		}
		else if (e.parentName == null){
		curr_info += e.name + ': ' + e.descr + ' for ' + e.duration + ' turn(s).' + "<br>"
		}
		})

		document.getElementById('curr_hero_info').innerHTML = curr_info;
		var extra_passive_info = '';

		if (curr_hero.name == "Azrael" && curr_hero.id_azrael_most_recently_attacked != false){
			for (h of p1_heroes_alive.concat(p2_heroes_alive)){
				if (h.id == curr_hero.id_azrael_most_recently_attacked){
					extra_passive_info = "Most recently attacked enemy - " + h.name + '.';
				}
			}
		}

		if (curr_hero.name == "Zeth"){
			extra_passive_info = "Health Lost by Heroes - " + curr_hero.health_lost + '.';
		}

		if (curr_hero.name == "Jakob"){
			extra_passive_info = "Current Wrath - " + curr_hero.wrath + '.';
		}


		if (curr_hero.name == "Vulshok"){
			var pct_health = Math.round(curr_hero.curr_health/curr_hero.health * 100);
			console.log(pct_health);
			var vulshok_inc_passive_damage = Math.round((100 - pct_health)/2);
			extra_passive_info = "(" + vulshok_inc_passive_damage + '% more damage).';
		}

		if (curr_hero.name == "Kalia"){
			extra_passive_info = "(Current damage decrease - " + curr_hero.damage_decrease * 100 + '%).';
		}

		if (curr_hero.name == "Dara"){
			if (curr_hero.team == 1){
				for (let index = 0; index < p1_heroes_alive.length; index++) {
					if(p1_heroes_alive[index].name != "Dara"){
						additional_mana_regen += Math.round(p1_heroes_alive[index].mana_regen * .3);
					}	
				}
			}
			else{
				for (let index = 0; index < p2_heroes_alive.length; index++) {
					if(p2_heroes_alive[index].name != "Dara"){
						additional_mana_regen += Math.round(p2_heroes_alive[index].mana_regen * .3);
					}	
				}
			}

			extra_passive_info = "(Additional Mana Regen - " + additional_mana_regen + ').';
		}

		if (curr_hero.name == "Kythra"){
			extra_passive_info = "Current Darkness - " + curr_hero.darkness + '.'
		}

		if (curr_hero.name == "Azura"){
			extra_passive_info = "Slain allies - " + curr_hero.azura_slain_allies + '.'
		}

		document.getElementById('curr_hero_passive_info').innerHTML = "Passive - " + curr_hero.passive + ': ' + curr_hero.passive_descr + ' ' + extra_passive_info;
		
		curr_hero_abilities_HTML_text = "";
		for (let index = 0; index < curr_hero.abilities.length; index++){
			full_ability = curr_hero.abilities[index];
			if (full_ability.type.includes("Buff") || full_ability.type == "Debuff" || full_ability.type == "All"){
				curr_hero_abilities_HTML_text += full_ability.name.bold() + " - " + full_ability.type + " (" + convert_AoE_to_text(full_ability.AoE) + ') | ' + full_ability.range + " Range - CD: " + full_ability.cooldown + ".<br />";
			}
			else{
				curr_hero_abilities_HTML_text += full_ability.name.bold() + " - " + full_ability.damage + ' ' + full_ability.type + ' damage (' + convert_AoE_to_text(full_ability.AoE) + ') | ' + full_ability.range + " Range - CD: " + full_ability.cooldown + ".<br />";
			}

			full_ability.effects.forEach(function(e) {
				temp_descr = createDescr(e.name, e.magnitude, curr_hero.effects);
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

		document.getElementById('curr_hero_all_ability_info').innerHTML = curr_hero_abilities_HTML_text;
		
		update_field()
	}
	
	return speed_list
}

function change_ability_text(ability){
	//console.log('changing ability text')
	ability_targeting(ability, false)
	let effects_text = '';
	if((ability == 'a1')){
		full_ability = curr_hero.abilities[1]
		if (full_ability.type.includes("Buff") || full_ability.type == "Debuff"){
			ability_text = full_ability.name.bold() + ": " + full_ability.type + '. <br>';
		}
		else{
			ability_text = full_ability.name.bold() + ": " + full_ability.damage + ' ' + full_ability.type + ' damage. <br>';
		}
		
		effects_text = '<br/>';
		full_ability.effects.forEach(function(e) {
			temp_descr = createDescr(e.name, e.magnitude, curr_hero.effects)
			//console.log("DESCR: " + temp_descr)
			if (e.duration == 0){
				ability_text += "\u2022 " + e.name + ': ' + temp_descr + ".<br>"
			}
			else if (e.duration == 1){
				ability_text += "\u2022 " + e.name + ': ' + temp_descr + ' for ' + e.duration + ' turn.' + "<br>"
			}

			else{
				ability_text += "\u2022 " + e.name + ': ' + temp_descr + ' for ' + e.duration + ' turns.' + "<br>"
			}
		});
	} else if(ability == 'a2'){
		full_ability = curr_hero.abilities[2]
		if (full_ability.type.includes("Buff") || full_ability.type == "Debuff"){
			ability_text = full_ability.name.bold() + ": " + full_ability.type + '. <br>';
		}
		else{
			ability_text = full_ability.name.bold() + ": " + full_ability.damage + ' ' + full_ability.type + ' damage. <br>';
		}
		effects_text = '<br/>';
		full_ability.effects.forEach(function(e) {
			//console.log(e.magnitude)
			temp_descr = createDescr(e.name, e.magnitude, curr_hero.effects)
			//console.log("DESCR: " + temp_descr)
			if (e.duration == 0){
				ability_text += "\u2022 " + e.name + ': ' + temp_descr + ".<br>"
			}
			else if (e.duration == 1){
				ability_text += "\u2022 " + e.name + ': ' + temp_descr + ' for ' + e.duration + ' turn.' + "<br>"
			}

			else{
				ability_text += "\u2022 " + e.name + ': ' + temp_descr + ' for ' + e.duration + ' turns.' + "<br>"
			}
		});
	} else if(ability == 'a3'){
		full_ability = curr_hero.abilities[3]
		if (full_ability.type.includes("Buff") || full_ability.type == "Debuff"){
			ability_text = full_ability.name.bold() + ": " + full_ability.type + '. <br>';
		}
		else{
			ability_text = full_ability.name.bold() + ":" + full_ability.damage + ' ' + full_ability.type + ' damage. <br>';
		}
		effects_text = '<br />';
		full_ability.effects.forEach(function(e) {
			temp_descr = createDescr(e.name, e.magnitude, curr_hero.effects)
			if (e.duration == 0){
				ability_text += "\u2022 " + e.name + ': ' + temp_descr + ".<br>"
			}
			else if (e.duration == 1){
				ability_text += "\u2022 " + e.name + ': ' + temp_descr + ' for ' + e.duration + ' turn.' + "<br>"
			}

			else{
				ability_text += "\u2022 " + e.name + ': ' + temp_descr + ' for ' + e.duration + ' turns.' + "<br>"
			}
		});
	} else if(ability == 'basic_attack'){
		full_ability = curr_hero.abilities[0]
		if (full_ability.type.includes("Buff") || full_ability.type == "Debuff"){
			ability_text = full_ability.name.bold() + ": " + full_ability.type + '. <br>';
		}
		else{
			ability_text = full_ability.name.bold() + ": " + full_ability.damage + ' ' + full_ability.type + ' damage. <br>';
		}
		effects_text = '<br />';
		full_ability.effects.forEach(function(e) {
			temp_descr = createDescr(e.name, e.magnitude, curr_hero.effects)
			if (e.duration == 0){
				ability_text += "\u2022 " + e.name + ': ' + temp_descr + ".<br>"
			}
			else if (e.duration == 1){
				ability_text += "\u2022 " + e.name + ': ' + temp_descr + ' for ' + e.duration + ' turn.' + "<br>"
			}

			else{
				ability_text += "\u2022 " + e.name + ': ' + temp_descr + ' for ' + e.duration + ' turns.' + "<br>"
			}
		});
		//ability.effects.forEach(e => e.name + ' (' + e.duration + ')' + ': ' + e.descr + "<br>")
	} else {
		ability_text = '';
		//ability_targeting('other', false);
	}
	
	document.getElementById('ability_text').innerHTML = ability_text  + effects_text;
}

function display_field_effect_info(field_pos){
//none
}

function display_stats(space){
	var display = true;
	
	try{
		if (space.id != null){
			space = space.id;
		}
	}
	catch{
		display = false;
	}
	
	var hovered_hero;
	if (display == true){
		//console.log('display = true')
		field_effects_in_field_pos = '';
		for (hero of p1_heroes_alive.concat(p2_heroes_alive)){
			if (hero.id == space){
				hovered_hero = hero;

				current_field_effects.forEach(function(field_effect){
					if (field_effect.location == hovered_hero.position){
						if (!(field_effects_in_field_pos.includes("Active Field Effects in Row: "))){
							field_effects_in_field_pos += "Active Field Effects in Row: ";
						}
						var fe = field_effect;
						var turn_or_turns = ' turns'
						if (fe.duration == 1){
							turn_or_turns = ' turn'
						}
			
						var trigger_descr = '';
			
						var duration_descr = "Duration: " + fe.duration + " " + turn_or_turns;
			
						if (fe.duration == 'inf'){
							duration_descr = "Channeled by " + fe.owner.name;
						}
						
						if (fe.when_triggers == 'end caster turn'){
							trigger_descr = "Triggers at end of " + fe.owner.name + "'s turn.";
						}
						else if (fe.when_triggers == "end enemy turn"){
							trigger_descr = "Triggers when a hero ends their turn in this row."
						}
						
						field_effects_in_field_pos += fe.name + ": " + fe.damage + " " + fe.type + " Damage. " + duration_descr + ". " + trigger_descr + " | ";
					}
				});
				document.getElementById("hovered_hero_curr_field_effects").innerText = field_effects_in_field_pos;
			}
		};

		document.getElementById('hovered_hero_info').innerHTML = ''
		for (hero of p1_heroes_alive.concat(p2_heroes_alive)){
			if (hero.id == space){
				//console.log('position: '+ hero.position);
				var hh_info = hero.name + ' | HP: ' + hero.curr_health + '/' + hero.health +
				' | Mana: ' + hero.curr_mana + '/' + hero.mana +
				' | Armor: ' + hero.curr_armor + ' | Ward: ' + hero.curr_ward + 
				' | Physical Shield: ' + hero.physical_shield + ' | Magic Shield: ' + hero.magic_shield + " | Speed: " + hero.speed +
				"<br>" + "Current Effects: "+ "<br>";
				//curr_hero.effects.forEach(e => curr_info += e.name + ': ' + e.descr + ' for ' + e.duration + ' turn(s).' + "<br>")
				hero.effects.forEach(function(e){
					//console.log(e.parentName)
					if(e.parentName != null && !hh_info.includes(e.parentName)){
						hh_info += e.parentName + ': ' + createDescr(e.parentName, e.duration, hero.effects) + "<br>"// for ' + e.duration + ' turn(s).' + "<br>"
					}
					else if (e.parentName == null){
						hh_info += e.name + ': ' + e.descr + ' for ' + e.duration + ' turn(s).' + "<br>"
					}
				})
				document.getElementById('hovered_hero_info').innerHTML = hh_info;
			}
		}
	}
}
update_current_hero(false);
update_field();


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
window.onload = update_field();

