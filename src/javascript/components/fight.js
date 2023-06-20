import controls from '../../constants/controls';
import _ from 'lodash';

export async function fight(firstFighter, secondFighter) {
    return new Promise((resolve, reject) => {
        if (firstFighter.health <= 0) {
            resolve('ok');
        }
        if (secondFighter.health <= 0) {
            resolve('huypk');
        }
    });
}

export function getDamage(attackerHealth, defenderHealth, event, attacker, defender) {
    const healthBarAttacker = document.getElementById('left-fighter-indicator');
    const healthBarDefender = document.getElementById('right-fighter-indicator');

    if (event.code === controls.PlayerTwoBlock) {
        defender.block = true;
    }
    if (event.code === controls.PlayerOneBlock) {
        attacker.block = true;
    }

    const onClick = e => {
        if (e.code === controls.PlayerTwoBlock) {
            defender.block = false;
        }
        if (e.code === controls.PlayerOneBlock) {
            attacker.block = false;
        }
    };

    document.body.addEventListener('keyup', onClick, false);

    if (event.code === controls.PlayerOneAttack && !defender.block && !attacker.block) {
        let damage = getHitPower(attacker) - getBlockPower(defender);
        if (damage <= 0) {
            damage = 0;
        }
        if (defender.health - damage >= 0) {
            defender.health -= damage;
            healthBarDefender.style.width = `${(defender.health * 100) / defenderHealth}%`;
        } else {
            defender.health = 0;
            healthBarDefender.style.width = `0%`;
        }
        console.log(`${(defender.health * 100) / defenderHealth}%`, defenderHealth, defender.health);
    }

    if (event.code === controls.PlayerTwoAttack && !attacker.block && !defender.block) {
        let damage = getHitPower(defender) - getBlockPower(attacker);
        if (damage <= 0) {
            damage = 0;
        }
        if (attacker.health - damage >= 0) {
            attacker.health -= damage;
            healthBarAttacker.style.width = `${(attacker.health * 100) / attackerHealth}%`;
        } else {
            attacker.health = 0;
            healthBarAttacker.style.width = `0%`;
        }
        console.log(healthBarAttacker.style.width);
    }
}

export function getHitPower(fighter) {
    return fighter.attack * _.random(1, 2);
}

export function getBlockPower(fighter) {
    return fighter.defense * _.random(1, 2);
}
