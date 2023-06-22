import controls from '../../constants/controls';

function random() {
    return Math.floor(Math.random() * 2);
}

export function getHitPower(fighter) {
    return fighter.attack * random();
}

export function getBlockPower(fighter) {
    return fighter.defense * random();
}

export function getDamage(attacker, defender) {
    return getHitPower(attacker) - getBlockPower(defender);
}

export async function fight(firstFighterHealth, secondFighterHealth, firstFighter, secondFighter) {
    return new Promise(resolve => {
        const healthBarfirstFighter = document.getElementById('left-fighter-indicator');
        const healthBarsecondFighter = document.getElementById('right-fighter-indicator');
        const allDownKeys = new Set();
        let checkTenSecFirst = true;
        let checkTenSecSecond = true;

        const onCriticalFirstAttack = event => {
            allDownKeys.add(event.code);
            for (let code of controls.PlayerOneCriticalHitCombination) {
                if (!allDownKeys.has(code)) return;
            }
            if (checkTenSecFirst) {
                checkTenSecFirst = !checkTenSecFirst;
                setTimeout(() => (checkTenSecFirst = true), 10000);
                let damage = firstFighter.attack * 2;
                if (damage <= 0) {
                    damage = 0;
                }
                if (secondFighter.health - damage > 0) {
                    secondFighter.health -= damage;
                    healthBarsecondFighter.style.width = `${(secondFighter.health * 100) / secondFighterHealth}%`;
                } else {
                    secondFighter.health = secondFighter.health.set(0);
                    healthBarsecondFighter.style.width = `0%`;
                    resolve(firstFighter);
                }
                allDownKeys.clear();
            } else {
                return;
            }
            allDownKeys.clear();
        };

        const onCriticalSecondAttack = event => {
            allDownKeys.add(event.code);
            for (let code of controls.PlayerTwoCriticalHitCombination) {
                if (!allDownKeys.has(code)) return;
            }
            if (checkTenSecSecond) {
                checkTenSecSecond = !checkTenSecSecond;
                setTimeout(() => (checkTenSecSecond = true), 10000);
                let damage = secondFighter.attack * 2;
                if (damage <= 0) {
                    damage = 0;
                }
                if (firstFighter.health - damage > 0) {
                    firstFighter.health -= damage;
                    healthBarfirstFighter.style.width = `${(firstFighter.health * 100) / firstFighterHealth}%`;
                } else {
                    firstFighter.health = 0;
                    healthBarfirstFighter.style.width = `0%`;
                    resolve(secondFighter);
                }
                allDownKeys.clear();
            } else {
                return;
            }
            allDownKeys.clear();
        };

        const onAttack = event => {
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
                if (secondFighter.health - damage > 0) {
                    secondFighter.health -= damage;
                    healthBarsecondFighter.style.width = `${(secondFighter.health * 100) / secondFighterHealth}%`;
                } else {
                    secondFighter.health = 0;
                    healthBarsecondFighter.style.width = `0%`;
                    resolve(firstFighter);
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
                    resolve(secondFighter);
                }
            }
        };
        document.body.addEventListener('keydown', onAttack, false);
        document.body.addEventListener('keydown', onCriticalFirstAttack, false);
        document.body.addEventListener('keydown', onCriticalSecondAttack, false);
        document.body.addEventListener('keyup', event => allDownKeys.delete(event.code));
    });
}
