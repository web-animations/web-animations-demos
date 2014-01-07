var timingLimbs = {direction: 'alternate', duration: 1.5, iterations: 2};
var anim = new ParGroup([
    new Animation(document.getElementById('bruce'), [{transform: 'translateY(15px)'}, {transform: 'translateY(0px)'}], {direction: 'alternate', duration: 0.75, iterations: 4}),

    /* Arms */
    new Animation(document.getElementById('leftArm'), [{transform: 'rotate(-40deg)'}, {transform: 'rotate(53deg)'}], timingLimbs),
    new Animation(document.getElementById('leftForearm'), [{transform: 'rotate(-30deg)'}, {transform: 'rotate(0deg)'}], timingLimbs),
    new Animation(document.getElementById('rightArm'), [{transform: 'rotate(53deg)'}, {transform: 'rotate(-40deg)'}], timingLimbs),
    new Animation(document.getElementById('rightForearm'), [{transform: 'rotate(0deg)'}, {transform: 'rotate(-30deg)'}], timingLimbs),

    /* Legs */
    new Animation(document.getElementById('leftLeg'), [{transform: 'rotate(35deg)'}, {transform: 'rotate(-30deg)'}], timingLimbs),
    new Animation(document.getElementById('leftShin'), [{transform: 'rotate(0deg)'}, {transform: 'rotate(20deg)'}], timingLimbs),
    new Animation(document.getElementById('leftFoot'), [{transform: 'rotate(-110deg)'}, {transform: 'rotate(-90deg)'}], timingLimbs),
    new Animation(document.getElementById('rightLeg'), [{transform: 'rotate(-30deg)'}, {transform: 'rotate(35deg)'}], timingLimbs),
    new Animation(document.getElementById('rightShin'), [{transform: 'rotate(20deg)'}, {transform: 'rotate(0deg)'}], timingLimbs),
    new Animation(document.getElementById('rightFoot'), [{transform: 'rotate(-90deg)'}, {transform: 'rotate(-110deg)'}], timingLimbs)
], {iterations: Infinity});

document.timeline.play(anim);