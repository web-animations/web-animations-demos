Polymer('stick-person', {
    ready: function() {
        var anim = new ParGroup([
            new Animation(this.$.bruce, [
                {transform: 'translateY(15px)'},
                {transform: 'translateY(0px)'}
            ], {direction: 'alternate', duration: 0.75, iterations: 4}),

            /* Arms */
            this.limbAnimation(this.$.leftArm, -40, 53),
            this.limbAnimation(this.$.leftForearm, -30, 0),
            this.limbAnimation(this.$.rightArm, 53, -40),
            this.limbAnimation(this.$.rightForearm, 0, -30),

            /* Legs */
            this.limbAnimation(this.$.leftLeg, 35, -30),
            this.limbAnimation(this.$.leftShin, 0, 20),
            this.limbAnimation(this.$.leftFoot, -110, -90),
            this.limbAnimation(this.$.rightLeg, -30, 35),
            this.limbAnimation(this.$.rightShin, 20, 0),
            this.limbAnimation(this.$.rightFoot, -90, -110)
        ], {iterations: Infinity});

        document.timeline.play(anim);
    },

    limbAnimation: function(limb, startDeg, endDeg) {
        return new Animation(limb, [
            {transform: 'rotate(' + startDeg + 'deg)'},
            {transform: 'rotate(' + endDeg + 'deg)'}
        ], {direction: 'alternate', duration: 1.5, iterations: 2});
    }
});