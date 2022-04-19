## Design Document

Arena is a Darkest Dungeon-inspired turn based PVP game started during winter break 2021. Players draft teams of 3 heroes each from a pool of 20 heroes - every hero has its own unique passive and set of 4 abilities. The goal is to defeat the enemy team by reducing the health of their heroes to 0. 

** Also included Arena Ideas.xlsx, which is a spreadsheet containing potential ideas of 70 other heroes. **

### Combat System:
Every hero has X base attributes:
1. Passive ability / 4 active abilities.
2. Health
3. Mana & Mana Regen
4. Armor
5. Ward
6. Speed

Abilities can deal damage, move heroes, and apply buffs/debuffs. 
- 3 types of damage: Physical, Magic, and Health (True) damage. 
- When dealing damage to an enemy hero, enemy Armor reduces the amount of Physical Damage taken, while Ward reduces Magic damage.
- Damage reduction formula is similar to League of Legends: 
- Example for Physical Damage: Damage_After_Armor = Physical_Damage / (Armor/100 + 1)
- 100 Armor is equivalent to 50% physical damage reduction, 200 Armor is equivalent to 66% physical damage reduction, etc...
- Every 1 point of Armor increases a hero's effective Health vs. Physical attacks by 1%.
- Some abiities have Piercing (Pierce_%), where that ability ignores Pierce_% of target's Armor/Ward.
- If target has Physical or Magic Shield, Physical/Magic Damage after Armor/Ward damage reduction is dealt to Physical/Magic Shield before Health.
- Health damage is not affected by Armor/Ward.
- Each ability also has Range. If a hero is out of the ability's range, the hero cannot be targeted.

- Buffs and Debuffs resolve at the end of the affected hero's turn.

- Most abilities have Mana costs. If a hero does not have enough Mana to pay the Mana cost, they cannot use that ability.

Speed:

- Speed determines the order of combat. Heroes' base speed is between 1-10. Heroes with higher speed take their turn before heroes with lower speed, but heroes take their turn again once all alive heroes have taken their turn. Speed directly affects the number of spaces a hero can Move. 
- 1-3 Speed: Max Move = 1 row.
- 4-6 Speed: Max Move = 2 rows.
- 7-9 Speed: Max Move = 3 rows.
- 10-12 Speed: Max Move = 4 rows.
- 13+ Speed: Max Move = 5 rows.

Heroes can move into the same row, represented by them positioned on top of each other. Some abiities can target all heroes in 1 row.

### Balancing Gameplay:
There are several archetypes for heroes:
1. Tanks - high Defense, high Crowd Control, low Damage.
2. Fighters - high Physical Damage, low Range, medium Defense.
3. Archers - medium Physical Damage, high Range, low Defense.
4. Mages - medium Magic Damage, medium Range, strong debuffs.
5. Assassins - high Damage, low Range, high Mobility, self-buffs like Stealth.
6. Enchanters - low Damage, medium Range, strong team buffs (increase damage, increase Armor/Ward, heal allies)

Hero Defenses:
- Fighters typically deal ~25 damage with a 2 Range attack. 
- 1 Range attacks deal more damage: ~30 damage.

Based off this damage:
1. Tanks have the highest effective health - they need to take 150 damage before they die (~6 attacks)
2. Fighters have the second highest effective health - take 110-120 damage (~4-5 attacks)
3. Archers, Mages, and Enchanters have the lowest effective health - take 80 damage (~3 attacks)
4. Ranged (3+ Range) attacks deal ~20% less damage than 2 Range attacks. Fighters typically die in 4 attacks, and fighters would have to take 1 turn to move before being in range to attack an Ranged enemy, meaning Ranged fighters get 5 attacks to deal the same damage that Fighters have 4 turns to do.


### Future Potential Ideas:
1. Implementing an AI for a true single-player mode using a utility system. 
2. Increase the number of heroes to 4 per team. Change drafting to include a "ban" phase before picking heroes.
3. Make UI less text based and adding some sprites.
4. Make combat more strategic by adding "flanking" spaces in addition to the 8 field tiles present. Heroes can move to a side "flanking" space to then move behind or next to the enemy team's backline.
5. Add equipment - each hero has a slot for a weapon, slot for armor, and slot for accessory. Equipment provides additional effects, passives, as well as actives.
6. Add additional heroes.
