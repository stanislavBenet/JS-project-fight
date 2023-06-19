import createElement from '../helpers/domHelper';
import { createFightersSelector } from './fighterSelector';
import { createImage } from './fightersView';

export function createFighterPreview(fighter, position) {
    const selectFighter = createFightersSelector();
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName} fighter-preview___description`
    });
    const imagePreview = createImage(fighter);
    const onClick = event => selectFighter(event, fighter._id);

    const { name, health, attack, defense } = fighter;

    const content = document.createTextNode(
        `Name: ${name} \n Health: ${health} \n Attack: ${attack} \n Defense: ${defense}`
    );

    fighterElement.append(content, imagePreview);
    fighterElement.addEventListener('click', onClick, false);
    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
