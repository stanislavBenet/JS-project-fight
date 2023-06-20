import controls from '../../constants/controls';
import _ from 'lodash';

export async function fight(firstFighterHealth, secondFighterHealth, event, firstFighter, secondFighter) {
    return new Promise((resolve, reject) => {
        const healthBarfirstFighter = document.getElementById('left-fighter-indicator');
        const healthBarsecondFighter = document.getElementById('right-fighter-indicator');

        if (event.code === controls.PlayerTwoBlock) {
            secondFighter.block = true;
        }
        if (event.code === controls.PlayerOneBlock) {
            firstFighter.block = true;
        }

        const onClick = e => {
            if (e.code === controls.PlayerTwoBlock) {
                secondFighter.block = false;
            }
            if (e.code === controls.PlayerOneBlock) {
                firstFighter.block = false;
            }
        };

        document.body.addEventListener('keyup', onClick, false);

        if (
            event.code === controls.PlayerOneAttack &&
            !secondFighter.block &&
            !firstFighter.block &&
            firstFighter.health > 0
        ) {
            let damage = getDamage(firstFighter, secondFighter);
            if (damage <= 0) {
                damage = 0;
            }
            if (secondFighter.health - damage >= 0) {
                secondFighter.health -= damage;
                healthBarsecondFighter.style.width = `${(secondFighter.health * 100) / secondFighterHealth}%`;
            } else {
                secondFighter.health = 0;
                healthBarsecondFighter.style.width = `0%`;
            }
        }

        if (
            event.code === controls.PlayerTwoAttack &&
            !firstFighter.block &&
            !secondFighter.block &&
            secondFighter.health > 0
        ) {
            let damage = getDamage(secondFighter, firstFighter);
            if (damage <= 0) {
                damage = 0;
            }
            if (firstFighter.health - damage >= 0) {
                firstFighter.health -= damage;
                healthBarfirstFighter.style.width = `${(firstFighter.health * 100) / firstFighterHealth}%`;
            } else {
                firstFighter.health = 0;
                healthBarfirstFighter.style.width = `0%`;
            }
        }
    });
}

export function getDamage(attacker, defender) {
    return getHitPower(attacker) - getBlockPower(defender);
}

export function getHitPower(fighter) {
    return fighter.attack * _.random(1, 2);
}

export function getBlockPower(fighter) {
    return fighter.defense * _.random(1, 2);
}
