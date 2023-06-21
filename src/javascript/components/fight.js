import controls from '../../constants/controls';
import _ from 'lodash';
import { showWinnerModal } from './modal/winner';

export async function fight(firstFighterHealth, secondFighterHealth, event, firstFighter, secondFighter) {
    return new Promise(resolve => {
        const healthBarfirstFighter = document.getElementById('left-fighter-indicator');
        const healthBarsecondFighter = document.getElementById('right-fighter-indicator');
        const pressed = new Set();

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

        const onPushFirstCriticalButton = e => {
            pressed.add(e.code);
            for (let code of controls.PlayerOneCriticalHitCombination) {
                if (!pressed.has(code)) {
                    return;
                }
            }
            pressed.clear();

            let damage = firstFighter.attack * 2;
            if (damage <= 0) {
                damage = 0;
            }

            if (secondFighter.health - damage > 0) {
                secondFighter.health -= damage;
                healthBarsecondFighter.style.width = `${(secondFighter.health * 100) / secondFighterHealth}%`;
                console.log(damage, secondFighter.health);
            } else {
                secondFighter.health = 0;
                healthBarsecondFighter.style.width = `0%`;
                resolve(showWinnerModal(firstFighter));
            }
        };

        const onPushSecondCriticalButton = e => {
            pressed.add(e.code);
            for (let code of controls.PlayerTwoCriticalHitCombination) {
                if (!pressed.has(code)) {
                    return;
                }
            }
            pressed.clear();

            let damage = secondFighter.attack * 2;
            if (damage <= 0) {
                damage = 0;
            }
            if (firstFighter.health - damage > 0) {
                firstFighter.health -= damage;
                healthBarfirstFighter.style.width = `${(firstFighter.health * 100) / firstFighterHealth}%`;
                console.log(damage, firstFighter.health);
            } else {
                firstFighter.health = 0;
                healthBarfirstFighter.style.width = `0%`;
                resolve(showWinnerModal(secondFighter));
            }
        };

        const onLetOff = () => {
            pressed.clear();
        };
        document.body.addEventListener('keydown', onPushFirstCriticalButton, false);
        document.body.addEventListener('keydown', onPushSecondCriticalButton, false);
        document.body.addEventListener('keyup', onLetOff, false);

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
            if (secondFighter.health - damage > 0) {
                secondFighter.health -= damage;
                healthBarsecondFighter.style.width = `${(secondFighter.health * 100) / secondFighterHealth}%`;
            } else {
                secondFighter.health = 0;
                healthBarsecondFighter.style.width = `0%`;
                resolve(showWinnerModal(firstFighter));
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
            if (firstFighter.health - damage > 0) {
                firstFighter.health -= damage;
                healthBarfirstFighter.style.width = `${(firstFighter.health * 100) / firstFighterHealth}%`;
            } else {
                firstFighter.health = 0;
                healthBarfirstFighter.style.width = `0%`;
                resolve(showWinnerModal(secondFighter));
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

function criticalDamage(healthBarDefender, defenderHealth, attacker, defender) {}
