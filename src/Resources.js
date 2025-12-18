// Cleaned up commented-out code and added comments for clarity.
export default class Resources {
  constructor(toLoadImage, toLoadSound) {
    this.toLoadImage = toLoadImage;
    this.toLoadSound = toLoadSound;
    this.images = {};
    this.sounds = {};

    // Load images
    Object.keys(this.toLoadImage).forEach((key) => {
      const img = new Image();
      img.src = this.toLoadImage[key];
      this.images[key] = {
        image: img,
        isLoaded: false,
      };

      img.onload = () => {
        this.images[key].isLoaded = true;
      };
    });

    // Load sounds
    Object.keys(this.toLoadSound).forEach((key) => {
      const sound = new Audio();
      sound.src = this.toLoadSound[key];
      sound.preload = "auto";
      this.sounds[key] = {
        sound: sound,
      };
    });
  }
}
