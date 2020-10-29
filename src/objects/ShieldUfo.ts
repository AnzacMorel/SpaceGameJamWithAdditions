import { GameScene } from "../scenes/Game";

export class ShieldUfo extends Phaser.Physics.Arcade.Sprite {

    private _landY: number;
    private _shieldActive: boolean;
    private _ufoType: string;

    constructor (scene, x, y) {
        super(scene, x, y, 'shieldUfo');
        this._landY = GameScene.height * 0.795;
        this._shieldActive = true;
        this._ufoType = 'shieldUfo';

        this.setActive(false);
        this.setVisible(false);

        setTimeout(() => {
            this.postConstructor();
        }, 1);
    }

    private postConstructor() {
        this.body.enable = false;
    }

    public startLanding(x, y, speed) {
        this.setFrame(0);
        this.body.enable = true;
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityY(speed);
        this.play("shield_enabled");
    }

    public preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.y >= this._landY) {

            this.scene.sound.stopAll();
            GameScene.GameRunning = false;

            console.log("INVASION BEGINS! GAME OVER");
            this.scene.sound.play('sfx/game_over', { volume: 2, loop: false });

            this.setActive(false);
            this.setVelocityY(0);
            this.body.enable = false;
        }
    }

    /**
     * Sets the velocity of the rocket to 0 plays the explosion sound effect and disables the body and deactivates.
     * Finally sets shield to be active again so that when it is reinitialized it won't get one shot.
     */
    public kill() {
        this.setVelocityY(0);

        this.scene.sound.play(`sfx/explode_${Math.floor(Math.random() * 5)}`, { volume: 2 });

        this.setActive(false);
        this.setVisible(false);
        this.body.enable = false;

        this.setShieldActive(true);
    }

    /**
     * Sets shield active to false and plays animation for disabling the shield as well as the explosion sound effect.
     * Also resets the speed of the ufo as otherwise it will just get blown back up the screen.
     * @param speed
     */
    public destroyShield(speed) {
        this._shieldActive = false;
        this.setVelocityY(speed);
        this.scene.sound.play(`sfx/explode_${Math.floor(Math.random() * 5)}`, { volume: 2 });
        this.play("shield_disabled");
    }

    public getShieldActive() {
        return this._shieldActive;
    }

    public setShieldActive(shieldValue) {
        this._shieldActive = shieldValue;
    }
}