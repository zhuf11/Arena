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

class Effect{
	//add parentName: include parent name - don't display if they have parent name
	constructor(name, magnitude, duration, parentName, isBuff, isUnique, descr){//isUNique now has 3 options (1/23/22) - lol (true, false, or "stack");
		this.name = name;
		this.magnitude = magnitude;
		this.duration = duration;
		this.parentName = parentName;
		this.isBuff = isBuff;
		this.isUnique = isUnique;
		this.descr = createDescr(this.name, this.magnitude)
	}

}
const list_of_parent_effects = ["Dauntless Vanguard", "Fury Buff", "Frozen", "Glacial Chains", "Storm Surge", "Nature's Blessing"];

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
Azrael.passive_descr = "Attacking the same enemy on consecutive turns makes the second attack deal an additional 12 Magic Damage."
Kalia.passive_descr = "Kalia's attacks cause her damage to permanently decrease. This decrease cannot be cleansed from abilities. When Kalia passes her turn, her damage decrease is lowered by 25%."
Arcturus.passive_descr = "When Arcturus is attacked, gain a stack of Fury that lasts 3 turns. Each stack is separate. For each stack of Fury, gain +10 Armor/Ward. At max stacks, gain +3 Speed."
Dara.passive_descr = "Dara has no cap on her maximum Mana. Dara gains Mana Regen equal to 30% of her allies' Mana Regen."
Kythra.passive_descr = "Kythra battles with the Darkness within herself. Using Kythra's abilities (10 Darkness/ability, Angelic Ascent decreases Darkness by 15) and receiving damage increases her Darkness meter (50% of health damage taken converted to darkness). Maximum Darkness: 100. At 50 and 100 Darkness, gain 10 Max HP. At 25, 50, 75, and 100 Darkness, 1 of Kythra's abilities is upgraded." 
Cassia.passive_descr = "All of Cassia's damaging abilities add a stack of Frostbite that persists for 2 turns and is refreshed by each new stack: (1 Stack: -1 Speed, 2 Stacks: -2 Speed, 3 Stacks: -3 Speed, 4 Stacks: consume all stacks and Freeze 1). If target is frozen, cannot gain Frostbite stacks."

const list_of_all_heroes = [Leif, Forsyth, Kane, Rivelle, Zeth, Athena, Mae, Nox, Vulshok, Jakob, Kess, Azrael, Octavius, Arcturus, Esme, Dara, Kythra, Draug, Scion, Cassia, Azura];

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
